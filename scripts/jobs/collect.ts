/** Collect fresher analyst jobs in India from the employer boards in employers.json
 *  and write public/data/jobs.json. Run: npm run jobs:collect (needs Node 24+, no credentials). */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import type { JobsFile, SourceRun } from '../../src/jobs/types.ts'
import { merge, relevant, toJob, type Run } from './pipeline.ts'
import { SOURCES, type Employer } from './sources.ts'

const OUT = new URL('../../public/data/jobs.json', import.meta.url)
const employers: Employer[] = JSON.parse(await readFile(new URL('./employers.json', import.meta.url), 'utf8'))
const prev: JobsFile | null = await readFile(OUT, 'utf8').then(JSON.parse, () => null)
const now = new Date()

const runs: Run[] = []
const sources: SourceRun[] = []
for (const e of employers) {
  const src = SOURCES[e.platform]
  const key = `${e.platform}:${e.board}`
  const known = (prev?.jobs ?? []).filter((j) => j.id.startsWith(`${key}:`) && j.status !== 'expired').map((j) => j.url)
  try {
    const raw = await src.fetch({ board: e.board, wanted: relevant, known })
    const jobs = raw.flatMap((r) => toJob(r, e, key, src.name, now.toISOString()) ?? [])
    runs.push({ key, ok: true, jobs })
    console.log(`${e.company} (${src.name}): ${raw.length} fetched, ${jobs.length} kept`)
  } catch (err) {
    runs.push({ key, ok: false, jobs: [] })
    console.error(`${e.company} (${src.name}) failed: ${(err as Error).message}`)
  }
  const run = runs.at(-1)!
  sources.push({ company: e.company, platform: src.name, url: src.careers(e.board), ok: run.ok, jobs: run.jobs.length })
}

if (!runs.some((r) => r.ok)) throw new Error('Every source failed; jobs.json left unchanged')
const jobs = merge(prev?.jobs ?? [], runs, now)
const file: JobsFile = { generatedAt: now.toISOString(), sources, jobs }
await mkdir(new URL('.', OUT), { recursive: true })
await writeFile(OUT, `${JSON.stringify(file, null, 2)}\n`)
console.log(`Wrote ${jobs.length} jobs: ${jobs.filter((j) => j.status === 'active').length} active, ${jobs.filter((j) => j.fresher).length} stated fresher`)
