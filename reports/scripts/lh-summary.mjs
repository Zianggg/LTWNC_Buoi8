// Tóm tắt report Lighthouse: điểm 4 nhóm + FCP/LCP/TBT/CLS, trung vị 3 lần, audit SEO bị trượt.
// Cách dùng: node reports/scripts/lh-summary.mjs [thư-mục]  → ghi summary.json
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const dir = path.resolve(process.argv[2] ?? path.join(here, '../lighthouse'))
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2
}

const groups = {}
for (const file of fs.readdirSync(dir).filter((f) => /^[a-z]+-(before|after)-\d+\.report\.json$/.test(f))) {
  const [page, variant, run] = file.replace('.report.json', '').split('-')
  const lhr = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
  const a = lhr.audits
  const row = {
    run: Number(run),
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
    fcpMs: Math.round(a['first-contentful-paint'].numericValue),
    lcpMs: Math.round(a['largest-contentful-paint'].numericValue),
    tbtMs: Math.round(a['total-blocking-time'].numericValue),
    cls: Number(a['cumulative-layout-shift'].numericValue.toFixed(3)),
    transferKiB: Math.round(a['total-byte-weight'].numericValue / 1024),
    seoFailed: lhr.categories.seo.auditRefs
      .filter((r) => r.weight > 0 && a[r.id].score !== null && a[r.id].score < 1)
      .map((r) => r.id),
  }
  ;(groups[`${page}-${variant}`] ??= []).push(row)
}

const summary = {}
for (const [key, rows] of Object.entries(groups).sort()) {
  rows.sort((x, y) => x.run - y.run)
  const med = {}
  for (const k of ['performance', 'accessibility', 'bestPractices', 'seo', 'fcpMs', 'lcpMs', 'tbtMs', 'cls', 'transferKiB']) {
    med[k] = median(rows.map((r) => r[k]))
  }
  summary[key] = { runs: rows, median: med, seoFailed: [...new Set(rows.flatMap((r) => r.seoFailed))] }
  console.log(key.padEnd(16), JSON.stringify(med), summary[key].seoFailed.join(',') || '-')
}
fs.writeFileSync(path.join(dir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n')
