// Kiểm tra end-to-end các lớp bảo vệ trên bản production (npm run build && npm start).
// Cách dùng: node reports/scripts/e2e-auth.mjs [baseUrl]   — cần puppeteer-core trong ../measure-tools (xem README).
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const tools = process.env.MEASURE_TOOLS ?? path.resolve(here, '../../../measure-tools')
const puppeteer = createRequire(path.join(tools, 'package.json'))('puppeteer-core')
const BASE = process.argv[2] ?? 'http://localhost:3000'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const results = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })

async function newSession() {
  const ctx = await browser.createBrowserContext()
  return ctx.newPage()
}

async function login(page, email, password, callbackUrl) {
  await page.goto(`${BASE}/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, { waitUntil: 'networkidle0' })
  await page.$eval('input[name=email]', (el) => { el.value = '' })
  await page.type('input[name=email]', email)
  await page.type('input[name=password]', password)
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => null),
    page.click('form button[type=submit]:not([disabled])'),
  ])
}

async function submitAndRead(page, formSelector) {
  await page.click(`${formSelector} button[type=submit]`)
  await page.waitForSelector(`${formSelector} [role=status]`, { timeout: 15000 })
  return page.$eval(`${formSelector} [role=status]`, (el) => el.textContent ?? '')
}

const status = async (url) => (await fetch(url, { redirect: 'manual' })).status

// 1. Khách
{
  const page = await newSession()
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle0' })
  const u = new URL(page.url())
  check('Khách vào /admin → /login?callbackUrl=/admin', u.pathname === '/login' && u.searchParams.get('callbackUrl') === '/admin', page.url())
}

// 2. user
{
  const page = await newSession()
  await login(page, 'user@shop.vn', 'User@123', '/dashboard')
  check('user đăng nhập bằng form → /dashboard', new URL(page.url()).pathname === '/dashboard', page.url())
  const header = await page.$eval('header', (el) => el.textContent ?? '')
  check('Header (Server Component) có tên + vai trò', header.includes('Bình Khách Hàng') && header.includes('user'))
  const msg = await submitAndRead(page, 'section[aria-labelledby=rbac-test] form')
  check('user gọi Server Action xoá → bị từ chối 403', msg.includes('403'), msg.trim())
  check('Sau khi bị từ chối, /products/88 vẫn còn', (await status(`${BASE}/products/88`)) === 200)
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle0' })
  check('user vào /admin → /403 (proxy)', new URL(page.url()).pathname === '/403', page.url())
}

// 3. admin: gỡ rồi khôi phục sản phẩm 141, kiểm tra ISR được làm mới
{
  const page = await newSession()
  await login(page, 'admin@shop.vn', 'Admin@123', '/admin')
  check('admin đăng nhập → /admin', new URL(page.url()).pathname === '/admin', page.url())
  const rowFor = async (id) => {
    const rows = await page.$$('tbody tr')
    for (const r of rows) if ((await r.$eval('td', (td) => td.textContent)) === id) return r
    return null
  }
  let r = await rowFor('141')
  await (await r.$('button[type=submit]')).click()
  await page.waitForFunction(() => document.body.textContent.includes('Đã gỡ “Basketball Rim”'), { timeout: 15000 })
  check('admin gỡ #141 bằng Server Action', true)
  check('ISR theo yêu cầu: /products/141 → 404 ngay', (await status(`${BASE}/products/141`)) === 404)
  const list = await (await fetch(`${BASE}/products`)).text()
  check('ISR theo yêu cầu: /products không còn "Basketball Rim"', !list.includes('Basketball Rim'))
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text()
  check('sitemap.xml bỏ /products/141', !sitemap.includes('/products/141<'))

  await page.reload({ waitUntil: 'networkidle0' })
  r = await rowFor('141')
  await (await r.$('button[type=submit]')).click()
  await page.waitForFunction(() => document.body.textContent.includes('Đã khôi phục “Basketball Rim”'), { timeout: 15000 })
  check('admin khôi phục #141', (await status(`${BASE}/products/141`)) === 200)
}

// 4. Chống dò mật khẩu: 5 lần sai → lần đúng thứ 6 vẫn bị khoá (dùng tài khoản admin để không ảnh hưởng các bước trên)
{
  const page = await newSession()
  const attempt = async (password) => {
    await page.goto(`${BASE}/login?callbackUrl=/admin`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('form button[type=submit]:not([disabled])')
    await page.$eval('input[name=email]', (el) => { el.value = '' })
    await page.type('input[name=email]', 'admin@shop.vn')
    await page.type('input[name=password]', password)
    await page.click('form:has(input[name=password]) button[type=submit]')
    await page.waitForSelector('form [role=alert]', { timeout: 15000 })
    return page.$eval('form [role=alert]', (el) => el.textContent ?? '')
  }
  let first = ''
  for (let i = 0; i < 5; i += 1) {
    const msg = await attempt(`sai-${i}-mat-khau`)
    if (i === 0) first = msg
  }
  check('Sai mật khẩu → "Email hoặc mật khẩu không đúng."', first.includes('không đúng'), first.trim())
  const locked = await attempt('Admin@123')
  check('Sai 5 lần → đúng mật khẩu vẫn bị khoá 10 phút', locked.includes('quá nhiều lần'), locked.trim())
}

await browser.close()
const failed = results.filter((r) => !r.ok).length
console.log(`\n${results.length - failed}/${results.length} PASS`)
process.exit(failed ? 1 : 0)
