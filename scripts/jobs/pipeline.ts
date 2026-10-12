/** Common job processing, independent of any source: keep India roles in five retail analyst families,
 *  read the experience they ask for, then merge with the previous run to decide each listing's status. */
import type { FresherFit, Job, JobCategory } from '../../src/jobs/types.ts'
import type { Employer, RawJob } from './sources.ts'

const INDIA = /\bindia\b|bengaluru|bangalore|mumbai|gurgaon|gurugram|delhi|noida|hyderabad|pune|chennai|kolkata|ahmedabad|jaipur|kochi|coimbatore|chandigarh|indore/i
const ANALYST = /analyst|analytics|planner|forecaster|\bintern(ship)?\b|trainee/i
const NOT_ANALYST = /manager|director|\bhead\b|\bvp\b|vice president|chief|engineer|developer|scientist|architect|consultant|payable|receivable|accountant|accounting|\btax\b|audit|payroll|recruit|risk|fraud|credit|lending/i
const DATA = /\bdata\b|analytics|\bbi\b|business intelligence|insights?|reporting|\bmis\b/i
const SENIOR = /\b(senior|sr|lead|principal|staff|ii|iii|iv)\b/i
const SENIOR_LEVEL = /mid-senior|director|executive/i
const FRESHER = /\bfreshers?\b|\bintern(ship)?\b|\btrainee\b|apprentice|entry[- ]level|graduate (trainee|program)|new grads?\b|campus/i
const FRESHER_TEXT = /\bfreshers?\b|entry[- ]level|recent graduates?|new grads?\b/i
// ponytail: "N years" within 80 characters of "experience", first match wins; a posting that states
// several requirements ("5+ overall, 2 in retail") is read by its first one.
const YEARS = /(?<![\d.])(\d{1,2})(?:\.\d)?\s*(?:\+|plus)?\s*(?:(?:-|–|—|to)\s*(\d{1,2})\s*\+?\s*)?(?:years?|yrs?)\b/gi
const ROLE_START = /about (the|this) (role|career|job)|role overview|job description|responsibilities|what you('ll| will) do|key result areas/i

/** First match wins: the supply-side families before the retail ones. Rows marked `true` count only at a
 *  retailer, where "pricing", "category" or a plain data analyst title means retail work. */
const FAMILIES: [JobCategory, RegExp, boolean][] = [
  ['Demand Forecasting Analyst', /forecast|demand.?plan|demand analy|demand sensing/i, false],
  ['Inventory Analyst', /inventory|replenish/i, false],
  ['Supply Chain Analyst', /supply.?chain|supply plan|logistic|procurement|sourcing|fulfil|warehouse|distribution|transport/i, false],
  ['Retail Data Analyst', /retail.*\b(data|analytics|bi|insights?|reporting)\b|\b(data|analytics|bi|insights?|reporting)\b.*retail/i, false],
  ['Retail Analyst', /retail/i, false],
  ['Retail Analyst', /merchandis|\bmerch\b|category|assortment|pricing|\bstores?\b|planogram|e-?commerce/i, true],
  ['Retail Data Analyst', DATA, true],
]

/** The family an analyst title belongs to, or null. */
export function family(title: string, retailer: boolean): JobCategory | null {
  if (!ANALYST.test(title) || NOT_ANALYST.test(title)) return null
  return FAMILIES.find(([, re, retailOnly]) => (retailer || !retailOnly) && re.test(title))?.[0] ?? null
}

/** Pre-filter handed to the fetchers: a title in one of the five families, in India when the listing shows
 *  a location. A job without one is checked against its page's location in `toJob`. */
export const relevantFor = (retailer: boolean) => (title: string, location: string | null) => (location === null || INDIA.test(location)) && family(title, retailer) !== null

export function statedYears(desc: string | null): { min: number; text: string } | null {
  for (const m of desc?.matchAll(YEARS) ?? []) {
    const around = desc!.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80)
    if (/experience|\bexp\b/i.test(around)) return { min: Number(m[1]), text: m[0].replace(/\s*(?:-|–|—|to)\s*/, '–').replace(/\s+/g, ' ').trim() }
  }
  return null
}

/** Whether a fresher can apply, judged only from what the posting states. */
export function fresherFit(title: string, level: string | null, type: string | null, minYears: number | null, desc: string | null): FresherFit {
  if ((minYears ?? 0) >= 2 || SENIOR.test(title) || (minYears == null && level && SENIOR_LEVEL.test(level))) return 'no'
  if (minYears != null || FRESHER.test(`${title} ${level ?? ''} ${type ?? ''}`) || FRESHER_TEXT.test(desc ?? '')) return 'yes'
  return 'unknown'
}

/** Start at the role itself when the posting opens with company boilerplate; cut at a word boundary. */
function excerpt(desc: string, max = 700): string {
  const i = desc.search(ROLE_START)
  const body = i > 0 ? desc.slice(i) : desc
  return body.length <= max ? body : `${body.slice(0, body.lastIndexOf(' ', max))}…`
}

/** A RawJob located in India whose title is in one of the five families; null otherwise.
 *  Every experience level is kept; `forFreshers` lets the board put 0–1 year roles first. */
export function toJob(raw: RawJob, employer: Employer, key: string, source: string, now: string): Job | null {
  const category = raw.location && INDIA.test(raw.location) ? family(raw.title, !!employer.retail) : null
  if (!category) return null
  const stated = raw.minYears != null ? { min: raw.minYears, text: raw.experience } : statedYears(raw.description)
  return {
    id: `${key}:${raw.sourceId}`,
    company: employer.company,
    logo: employer.logo ?? null,
    title: raw.title,
    category,
    description: raw.description && excerpt(raw.description),
    experience: stated?.text ?? raw.experience,
    forFreshers: fresherFit(raw.title, raw.experience, raw.employmentType, stated?.min ?? null, raw.description),
    employmentType: raw.employmentType,
    salary: raw.salary,
    postedAt: raw.postedAt,
    deadline: raw.deadline,
    location: raw.location,
    url: raw.url,
    source,
    collectedAt: now,
    checkedAt: now,
    status: 'active',
  }
}

/** One employer board's result this run; `key` prefixes the ids of every job it produced. */
export type Run = { key: string; ok: boolean; jobs: Job[] }

const DAY = 86_400_000
const RANK = { active: 0, unverified: 1, expired: 2 }
const FIT = { yes: 0, unknown: 1, no: 2 }

/** Combine this run with the previous file:
 *  seen now → active (expired once its deadline passes) · gone from a board that loaded → expired ·
 *  board failed to load → unchanged, then unverified after 3 days · expired for 14 days → dropped. */
export function merge(prev: Job[], runs: Run[], now: Date): Job[] {
  const today = now.toISOString().slice(0, 10)
  const past = (j: Job) => !!j.deadline && j.deadline.slice(0, 10) < today
  const before = new Map(prev.map((j) => [j.id, j]))
  const fresh = new Map(runs.flatMap((r) => r.jobs).map((j) => [j.id, j]))

  const out: Job[] = [...fresh.values()].map((j) => ({ ...j, collectedAt: before.get(j.id)?.collectedAt ?? j.collectedAt, status: past(j) ? 'expired' : 'active' }))
  for (const j of prev) {
    const run = runs.find((r) => j.id.startsWith(`${r.key}:`))
    if (fresh.has(j.id) || !run) continue // still listed, or its employer is no longer tracked
    const age = now.getTime() - Date.parse(j.checkedAt)
    const status = run.ok || past(j) ? 'expired' : j.status === 'active' && age > 3 * DAY ? 'unverified' : j.status
    if (status === 'expired' && age > 14 * DAY) continue
    out.push({ ...j, status })
  }

  out.sort((a, b) => RANK[a.status] - RANK[b.status] || FIT[a.forFreshers] - FIT[b.forFreshers] || (b.postedAt ?? '').localeCompare(a.postedAt ?? ''))
  const seen = new Set<string>()
  return out.filter((j) => {
    const k = `${j.company}|${j.title}|${j.location}`.toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}
