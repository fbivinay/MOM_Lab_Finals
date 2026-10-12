import type { Job } from './types'

/** Deals listings out one company at a time, keeping each company's own order (fresher roles first,
 *  then newest) and keeping active listings ahead of the rest, so one employer cannot fill a page. */
export function spread(jobs: Job[]): Job[] {
  const groups = new Map<string, Map<string, Job[]>>()
  for (const j of jobs) {
    const companies = groups.get(j.status) ?? new Map<string, Job[]>()
    groups.set(j.status, companies.set(j.company, [...(companies.get(j.company) ?? []), j]))
  }
  const out: Job[] = []
  for (const companies of groups.values()) {
    while (companies.size) {
      for (const [company, queue] of companies) {
        out.push(queue.shift()!)
        if (!queue.length) companies.delete(company)
      }
    }
  }
  return out
}
