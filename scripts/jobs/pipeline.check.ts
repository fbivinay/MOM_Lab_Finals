/** Self-check for the common pipeline: node scripts/jobs/pipeline.check.ts */
import assert from 'node:assert/strict'
import type { Job } from '../../src/jobs/types.ts'
import { merge, relevant, statedYears, toJob } from './pipeline.ts'
import { text, type Employer, type RawJob } from './sources.ts'

// experience statements
assert.deepEqual(statedYears('You bring 0-2 years of experience with SQL.'), { min: 0, text: '0–2 years' })
assert.deepEqual(statedYears('Experience: 3+ yrs in analytics'), { min: 3, text: '3+ yrs' })
assert.equal(statedYears('Serving shoppers for over 25 years.'), null)
assert.equal(statedYears('Our 2026 years plan; experience preferred')?.min, undefined)

// titles and locations
const blr = 'Bengaluru, Karnataka, India'
assert.ok(relevant('Business Analyst', blr))
assert.ok(relevant('Category Associate - Grocery', 'GURUGRAM INDIA'))
assert.ok(relevant('Data Analyst', 'Hyderabad TS 500081'))
assert.ok(!relevant('Data Analyst', 'Indianapolis IN 46250'))
assert.ok(!relevant('Senior Business Analyst', blr))
assert.ok(!relevant('Assistant Manager - Category', blr))
assert.ok(!relevant('Data Engineer', blr))
assert.ok(!relevant('Analyst II', blr))

// filtering and classification
const employer: Employer = { company: 'Acme Retail', platform: 'greenhouse', board: 'acme' }
const raw = (over: Partial<RawJob>): RawJob => ({
  sourceId: '1', title: 'Data Analyst', location: 'Bengaluru, Karnataka, India', description: null, experience: null, minYears: null,
  employmentType: null, salary: null, postedAt: null, deadline: null, url: 'https://example.com/1', ...over,
})
const job = (over: Partial<RawJob>) => toJob(raw(over), employer, 'greenhouse:acme', 'Greenhouse', '2026-10-13T00:00:00.000Z')

const fresher = job({ description: 'Requires 0-1 years of experience in Excel.' })!
assert.equal(fresher.fresher, true)
assert.equal(fresher.experience, '0–1 years')
assert.equal(fresher.category, 'Data & BI')
assert.equal(fresher.id, 'greenhouse:acme:1')

const unstated = job({ title: 'Pricing Analyst' })!
assert.equal(unstated.experience, null, 'a missing requirement stays null')
assert.equal(unstated.fresher, false)
assert.equal(unstated.category, 'Pricing & merch')

assert.equal(job({ description: '3-5 years of relevant experience' }), null)
assert.equal(job({ minYears: 5, experience: '5–8 years' }), null)
assert.equal(job({ location: 'Indianapolis, IN' }), null)
assert.equal(job({ location: null }), null)
assert.equal(job({ experience: 'Mid-Senior Level' }), null)
assert.equal(job({ experience: 'Entry Level' })!.fresher, true)
assert.equal(job({ title: 'Analytics Intern' })!.fresher, true)

// merge and status
const now = new Date('2026-10-20T00:00:00.000Z')
const day = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()
const prev = (id: string, over: Partial<Job> = {}): Job => ({ ...fresher, id: `greenhouse:acme:${id}`, title: `Job ${id}`, ...over })

const seenAgain = { ...prev('1'), collectedAt: now.toISOString(), checkedAt: now.toISOString() }
const out = merge(
  [prev('1', { collectedAt: day(5) }), prev('2'), prev('3', { checkedAt: day(20), status: 'expired' })],
  [{ key: 'greenhouse:acme', ok: true, jobs: [seenAgain] }],
  now,
)
assert.equal(out.find((j) => j.id.endsWith(':1'))?.collectedAt, day(5), 'first-seen time is kept')
assert.equal(out.find((j) => j.id.endsWith(':2'))?.status, 'expired', 'gone from a board that loaded')
assert.equal(out.find((j) => j.id.endsWith(':3')), undefined, 'expired for 14+ days is dropped')

const failed = merge([prev('4', { checkedAt: day(1) }), prev('5', { checkedAt: day(4) })], [{ key: 'greenhouse:acme', ok: false, jobs: [] }], now)
assert.equal(failed.find((j) => j.id.endsWith(':4'))?.status, 'active', 'kept while the board is briefly down')
assert.equal(failed.find((j) => j.id.endsWith(':5'))?.status, 'unverified', 'unverified after 3 days')

const lapsed = merge([], [{ key: 'greenhouse:acme', ok: true, jobs: [{ ...seenAgain, deadline: '2026-10-19' }] }], now)
assert.equal(lapsed[0].status, 'expired', 'past its deadline')

assert.equal(merge([prev('6')], [], now).length, 0, 'employer removed from employers.json')

// html to text
assert.equal(text('<p>Use&nbsp;SQL &amp; Excel</p><ul><li>0&#8211;1 years</li></ul>'), 'Use SQL & Excel\n0–1 years')

console.log('pipeline check passed')
