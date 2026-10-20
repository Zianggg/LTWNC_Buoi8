// Chạy Lighthouse (mobile mặc định) N lần cho mỗi trang × mỗi bản, xen kẽ trước/sau.
// Cách dùng: node reports/scripts/lh-run.mjs [outDir] [số-lần]
// Cần: npm run build && npm start (3000)  +  npm run build:before && npm run start:before (3001)
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const tools = process.env.MEASURE_TOOLS ?? path.resolve(here, '../../../measure-tools')
const cli = path.join(tools, 'node_modules', 'lighthouse', 'cli', 'index.js')
const outDir = path.resolve(process.argv[2] ?? path.join(here, '../lighthouse'))
const runs = Number(process.argv[3] ?? 3)
fs.mkdirSync(outDir, { recursive: true })

const pages = [
  ['home', '/'],
  ['product', '/products/88'],
]
const variants = [
  ['before', 'http://localhost:3001'],
  ['after', 'http://localhost:3000'],
]

for (let run = 1; run <= runs; run += 1) {
  for (const [page, pathname] of pages) {
    for (const [variant, base] of variants) {
      const name = `${page}-${variant}-${run}`
      const started = Date.now()
      execFileSync(
        process.execPath,
        [
          cli,
          base + pathname,
          '--only-categories=performance,accessibility,best-practices,seo',
          '--output=json',
          '--output=html',
          `--output-path=${path.join(outDir, name)}`,
          '--chrome-flags=--headless=new --no-first-run --no-default-browser-check',
          '--quiet',
        ],
        {
          stdio: 'inherit',
          env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' },
        },
      )
      console.log(`${name}: ${Math.round((Date.now() - started) / 1000)} s`)
    }
  }
}
