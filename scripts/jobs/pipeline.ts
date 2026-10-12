/** Common job processing, independent of any source: filter (India, analyst role, 0–1 years),
 *  classify, then merge with the previous run to decide each listing's status. */
import type { Job, JobCategory } from '../../src/jobs/types.ts'
import type { Employer, RawJob } from './sources.ts'

const INDIA = /\bindia\b|bengaluru|bangalore|mumbai|gurgaon|gurugram|delhi|noida|hyderabad|pune|chennai|kolkata|ahmedabad|jaipur|kochi|coimbatore|chandigarh|indore/i
const ROLE = /analyst|analytics|insight|business intelligence|\bbi\b|forecast|demand plan|pricing|merchandis|\bmerch\b|category|inventory|supply chain|replenish|\bmis\b|reporting/i
const NOT_ANALYST = /engineer|developer|scientist|architect|designer/i
const SENIOR_TITLE = /\b(senior|sr|lead|principal|staff|manager|head|director|avp|vp|vice president|chief|ii|iii|iv)\b/i
const SENIOR_LEVEL = /mid-senior|director|executive/i
const FRESHER = /\bfreshers?\b|\bintern(ship)?\b|\btrainee\b|apprentice|entry[- ]level|graduate (trainee|program)|new grads?\b|campus/i
const FRESHER_TEXT = /\bfreshers?\b|entry[- ]level|recent graduates?|new grads?\b/i
// ponytail: "N years" within 80 characters of "experience", first match wins; a posting that states
// several requirements ("5+ overall, 2 in retail") is read by its first one.
const YEARS = /(?<![\d.])(\d{1,2})(?:\.\d)?\s*(?:\+|plus)?\s*(?:(?:-|–|—|to)\s*(\d{1,2})\s*\+?\s*)?(?:years?|yrs?)\b/gi
const ROLE_START = /about (the|this) (role|career|job)|role overview|job description|responsibilities|what you('ll| will) do|key result areas/i

const CATEGORY: [JobCategory, RegExp][] = [
  ['Demand & supply', /forecast|demand|supply chain|inventory|replenish|planning|logistic|procurement|fulfil/i],
  ['Pricing & merch', /pricing|merchandis|\bmerch\b|category|assortment|revenue management|promo/i],
  ['Customer insights', /insight|customer|consumer|crm|loyalty|market research|marketing/i],
  ['Business', /business|operations|strategy|commercial|program|product|finance|payable|account/i],
]

/** An analyst-type title without a senior grade, located in India. */
export function relevant(title: string, location: string): boolean {
  return INDIA.test(location) && ROLE.test(title) && !(NOT_ANALYST.test(title) && !/analyst/i.test(title)) && !SENIOR_TITLE.test(title)
}

export function statedYears(desc: string | null): { min: number; text: string } | null {
  for (const m of desc?.matchAll(YEARS) ?? []) {
    const around = desc!.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80)
    if (/experience|\bexp\b/i.test(around)) return { min: Number(m[1]), text: m[0].replace(/\s*(?:-|–|—|to)\s*/, '–').replace(/\s+/g, ' ').trim() }
  }
  return null
}

/** Start at the role itself when the posting opens with company boilerplate; cut at a word boundary. */
function excerpt(desc: string, max = 700): string {
  const i = desc.search(ROLE_START)
  const body = i > 0 ? desc.slice(i) : desc
  return body.length <= max ? body : `${body.slice(0, body.lastIndexOf(' ', max))}…`
}

/** A RawJob that is in India, an analyst role, and open to 0–1 years; null otherwise.
 *  A missing experience requirement never excludes a job; the board flags it for checking. */
export function toJob(raw: RawJob, employer: Employer, key: string, source: string, now: string): Job | null {
  if (!raw.location || !relevant(raw.title, raw.location)) return null
  const stated = raw.minYears != null ? { min: raw.minYears, text: raw.experience } : statedYears(raw.description)
  const min = stated?.min ?? null
  if (min != null && min >= 2) return null
  if (min == null && raw.experience && SENIOR_LEVEL.test(raw.experience)) return null
  return {
    id: `${key}:${raw.sourceId}`,
    company: employer.company,
    logo: employer.logo ?? null,
    title: raw.title,
    description: raw.description && excerpt(raw.description),
    experience: stated?.text ?? raw.experience,
    fresher: min === 0 || FRESHER.test(`${raw.title} ${raw.experience ?? ''} ${raw.employmentType ?? ''}`) || (min == null && FRESHER_TEXT.test(raw.description ?? '')),
    category: CATEGORY.find(([, re]) => re.test(raw.title))?.[0] ?? 'Data & BI',
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

  out.sort((a, b) => RANK[a.status] - RANK[b.status] || Number(b.fresher) - Number(a.fresher) || (b.postedAt ?? '').localeCompare(a.postedAt ?? ''))
  const seen = new Set<string>()
  return out.filter((j) => {
    const k = `${j.company}|${j.title}|${j.location}`.toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}
