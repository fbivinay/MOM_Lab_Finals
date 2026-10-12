/** Self-check for the common pipeline: node scripts/jobs/pipeline.check.ts */
import assert from 'node:assert/strict'
import type { Job } from '../../src/jobs/types.ts'
import { family, fresherFit, merge, relevantFor, statedYears, toJob } from './pipeline.ts'
import { text, type Employer, type RawJob } from './sources.ts'

// experience statements
assert.deepEqual(statedYears('You bring 0-2 years of experience with SQL.'), { min: 0, text: '0–2 years' })
assert.deepEqual(statedYears('Experience: 3+ yrs in analytics'), { min: 3, text: '3+ yrs' })
assert.equal(statedYears('Serving shoppers for over 25 years.'), null)
assert.equal(statedYears('Our 2026 years plan; experience preferred')?.min, undefined)

// the five role families
assert.equal(family('Demand Planning Analyst', false), 'Demand Forecasting Analyst')
assert.equal(family('Forecasting Analyst - Fresh Foods', false), 'Demand Forecasting Analyst')
assert.equal(family('Inventory Analyst', false), 'Inventory Analyst')
assert.equal(family('Analyst, Replenishment', false), 'Inventory Analyst')
assert.equal(family('Supply Chain Analyst', false), 'Supply Chain Analyst')
assert.equal(family('Supply Planner', false), 'Supply Chain Analyst')
assert.equal(family('Retail Data Analyst', false), 'Retail Data Analyst')
assert.equal(family('Data Analyst', true), 'Retail Data Analyst', 'plain data analyst at a retailer')
assert.equal(family('Data Analyst', false), null, 'plain data analyst elsewhere')
assert.equal(family('Merchandise Planning Analyst', true), 'Retail Analyst')
assert.equal(family('Pricing Analyst', true), 'Retail Analyst')
assert.equal(family('Pricing and Solutions Analyst', false), null, 'freight pricing at a shipping line is not retail')
assert.equal(family('Retail Analyst', false), 'Retail Analyst')
assert.equal(family('Senior Manager - Demand Planning', true), null, 'managers are not analyst roles')
assert.equal(family('Analyst Merch Payable', true), null, 'accounting roles are out')
assert.equal(family('Demand Generation Executive', true), null)
assert.equal(family('Business Analyst', true), null)
assert.equal(family('AM/M - Risk Analytics - User Lending', true), null, 'lending risk is not retail analytics')
assert.ok(relevantFor(false)('Inventory Analyst', 'Hyderabad TS 500081'))
assert.ok(relevantFor(true)('IND Demand Planner', null), 'no location in the listing: decided on the job page')
assert.ok(!relevantFor(false)('Inventory Analyst', 'Indianapolis IN 46250'))

// fresher fit, from what the posting states
assert.equal(fresherFit('Inventory Analyst', null, null, 0, null), 'yes')
assert.equal(fresherFit('Inventory Analyst', null, null, 1, null), 'yes')
assert.equal(fresherFit('Inventory Analyst', null, null, 2, null), 'no')
assert.equal(fresherFit('Senior Inventory Analyst', null, null, null, null), 'no')
assert.equal(fresherFit('Inventory Analyst', 'Mid-Senior Level', null, null, null), 'no')
assert.equal(fresherFit('Inventory Analyst', 'Entry Level', null, null, null), 'yes')
assert.equal(fresherFit('Supply Chain Analytics Intern', null, null, null, null), 'yes')
assert.equal(fresherFit('Inventory Analyst', null, null, null, 'Freshers can apply.'), 'yes')
assert.equal(fresherFit('Inventory Analyst', null, null, null, null), 'unknown', 'a missing requirement is flagged, not excluded')

// building a job
const employer: Employer = { company: 'Acme Retail', platform: 'greenhouse', board: 'acme', retail: true }
const raw = (over: Partial<RawJob>): RawJob => ({
  sourceId: '1', title: 'Inventory Analyst', location: 'Bengaluru, Karnataka, India', description: null, experience: null, minYears: null,
  employmentType: null, salary: null, postedAt: null, deadline: null, url: 'https://example.com/1', ...over,
})
const job = (over: Partial<RawJob>) => toJob(raw(over), employer, 'greenhouse:acme', 'Greenhouse', '2026-10-13T00:00:00.000Z')

const fresher = job({ description: 'Requires 0-1 years of experience in Excel.' })!
assert.equal(fresher.forFreshers, 'yes')
assert.equal(fresher.experience, '0–1 years')
assert.equal(fresher.category, 'Inventory Analyst')
assert.equal(fresher.id, 'greenhouse:acme:1')
assert.equal(fresher.salary, null, 'nothing is filled in')

assert.equal(job({ description: '3-5 years of relevant experience' })!.forFreshers, 'no', 'kept, and marked for the 2+ years view')
assert.equal(job({ minYears: 5, experience: '5–8 years' })!.experience, '5–8 years')
assert.equal(job({ location: 'Indianapolis, IN' }), null)
assert.equal(job({ location: null }), null)
assert.equal(job({ title: 'Data Engineer' }), null)

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

const order = merge([], [{ key: 'greenhouse:acme', ok: true, jobs: [prev('6', { forFreshers: 'no' }), prev('7', { forFreshers: 'unknown' }), prev('8')] }], now)
assert.deepEqual(order.map((j) => j.forFreshers), ['yes', 'unknown', 'no'], 'fresher roles first')

assert.equal(merge([prev('9')], [], now).length, 0, 'employer removed from employers.json')

// html to text
assert.equal(text('<p>Use&nbsp;SQL &amp; Excel</p><ul><li>0&#8211;1 years</li></ul>'), 'Use SQL & Excel\n0–1 years')

console.log('pipeline check passed')
