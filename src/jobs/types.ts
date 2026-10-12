/** Shape of public/data/jobs.json, shared by the collector (scripts/jobs) and the Jobs slides.
 *  Anything a source does not publish is stored as null; nothing is estimated or filled in. */

export const CATEGORIES = ['Retail Analyst', 'Retail Data Analyst', 'Demand Forecasting Analyst', 'Supply Chain Analyst', 'Inventory Analyst'] as const
export type JobCategory = (typeof CATEGORIES)[number]

/** active: seen on the source at the last check · expired: gone from the source or past its deadline ·
 *  unverified: the source could not be reached for more than three days. */
export type JobStatus = 'active' | 'expired' | 'unverified'

/** yes: the posting says fresher, intern or entry level, or asks for at most one year ·
 *  unknown: it states no experience requirement (check the posting) · no: two or more years, or a senior grade. */
export type FresherFit = 'yes' | 'unknown' | 'no'

export type Job = {
  id: string
  company: string
  logo: string | null
  title: string
  category: JobCategory
  /** Plain-text excerpt of the posting; the full text stays on the original page. */
  description: string | null
  /** Experience as the source states it, e.g. "0–2 years" or "Entry Level". */
  experience: string | null
  forFreshers: FresherFit
  employmentType: string | null
  /** Salary, package or stipend exactly as the source publishes it. */
  salary: string | null
  postedAt: string | null
  deadline: string | null
  location: string | null
  url: string
  /** The platform the listing was collected from, e.g. "Greenhouse". */
  source: string
  /** First time the collector saw the listing (ISO date-time). */
  collectedAt: string
  /** Last time the listing was confirmed on its source (ISO date-time). */
  checkedAt: string
  status: JobStatus
}

export type SourceRun = { company: string; platform: string; url: string; ok: boolean; jobs: number }

export type JobsFile = { generatedAt: string; sources: SourceRun[]; jobs: Job[] }
