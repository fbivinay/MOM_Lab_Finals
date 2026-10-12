/** Source-specific extraction: one fetcher per job platform, each returning RawJob[].
 *  Every feed here is public and unauthenticated, offered by the platform for this purpose:
 *  the Greenhouse Job Board API, the Lever Postings API, the SmartRecruiters Posting API, and a
 *  Workday career site's robots.txt-listed sitemap plus the schema.org JobPosting data on each job page.
 *  Classification, status and merging live in pipeline.ts. */

export type Platform = 'greenhouse' | 'lever' | 'smartrecruiters' | 'workday'

export type Employer = { company: string; platform: Platform; board: string; logo?: string }

export type RawJob = {
  sourceId: string
  title: string
  location: string | null
  description: string | null
  /** Experience as the source's own structured field states it, e.g. "0–2 years" or "Entry Level". */
  experience: string | null
  /** Minimum years from that structured field, when it is numeric. */
  minYears: number | null
  employmentType: string | null
  salary: string | null
  postedAt: string | null
  deadline: string | null
  url: string
}

export type FetchArgs = {
  board: string
  /** Pre-filter on title and location, so per-job requests are only made for relevant roles. */
  wanted: (title: string, location: string) => boolean
  /** Original URLs already collected from this board; re-checked where the listing feed is partial. */
  known: string[]
}

const UA = 'RetailAnalyticsDeck-Jobs/1.0 (+https://github.com/fbivinay/MOM_Lab_Finals)'

async function get(url: string): Promise<Response> {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res
}
const getJson = async <T>(url: string): Promise<T> => (await get(url)).json() as Promise<T>
/** One request at a time with a short gap, so no source sees more than a light, steady load. */
const pause = () => new Promise((r) => setTimeout(r, 400))

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
export function decode(s: string): string {
  return s.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (m, e: string) =>
    e[0] !== '#' ? (ENTITIES[e.toLowerCase()] ?? m) : String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1))),
  )
}

/** HTML to plain text: block ends become line breaks, entities are decoded, whitespace collapses. */
export function text(html: string | null | undefined): string | null {
  if (!html) return null
  const t = decode(html.replace(/<\/(p|li|h\d|div)>|<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' '))
    .replace(/[ \t ]+/g, ' ')
    .replace(/ *\n[\s]*/g, '\n')
    .trim()
  return t || null
}

function money(min: number | undefined, max: number | undefined, currency: string | undefined, per: string | undefined): string | null {
  const n = (v: number) => v.toLocaleString('en-IN')
  const amount = min && max && min !== max ? `${n(min)}–${n(max)}` : min || max ? n((min || max)!) : null
  return amount && [currency, amount, per && `per ${per.toLowerCase()}`].filter(Boolean).join(' ')
}

/* ---------------------------------------------------------------- Greenhouse */

type GreenhouseJob = {
  id: number
  title: string
  location?: { name?: string }
  content?: string
  metadata?: { name: string; value: unknown }[] | null
  first_published?: string | null
  application_deadline?: string | null
  absolute_url: string
}

async function greenhouse({ board }: FetchArgs): Promise<RawJob[]> {
  const { jobs } = await getJson<{ jobs: GreenhouseJob[] }>(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`)
  return jobs.map((j) => {
    // Only these three custom fields are read; others (e.g. hiring-manager names) are never stored.
    const meta = (name: RegExp) => [j.metadata?.find((m) => name.test(m.name))?.value].flat()[0] ?? null
    const min = meta(/min(imum)? work experience/i)
    const max = meta(/max(imum)? work experience/i)
    return {
      sourceId: String(j.id),
      title: j.title.trim(),
      location: j.location?.name?.trim() || null,
      description: text(decode(j.content ?? '')), // Greenhouse escapes the HTML once more
      experience: min == null ? null : max == null ? `${Number(min)}+ years` : `${Number(min)}–${Number(max)} years`,
      minYears: min == null ? null : Number(min),
      employmentType: (meta(/employment type/i) as string | null) ?? null,
      salary: null,
      postedAt: j.first_published ?? null,
      deadline: j.application_deadline ?? null,
      url: j.absolute_url,
    }
  })
}

/* ---------------------------------------------------------------- Lever */

type LeverJob = {
  id: string
  text: string
  categories?: { location?: string; commitment?: string }
  country?: string
  descriptionPlain?: string
  lists?: { text: string; content: string }[]
  additionalPlain?: string
  salaryRange?: { min?: number; max?: number; currency?: string; interval?: string }
  createdAt?: number
  hostedUrl: string
}

async function lever({ board }: FetchArgs): Promise<RawJob[]> {
  const jobs = await getJson<LeverJob[]>(`https://api.lever.co/v0/postings/${board}?mode=json`)
  return jobs.map((j) => {
    const loc = j.categories?.location?.trim()
    const s = j.salaryRange
    return {
      sourceId: j.id,
      title: j.text.trim(),
      location: [loc, j.country === 'IN' && !/india/i.test(loc ?? '') ? 'India' : null].filter(Boolean).join(', ') || null,
      description: [j.descriptionPlain, ...(j.lists ?? []).map((l) => `${l.text}\n${text(l.content) ?? ''}`), j.additionalPlain].filter(Boolean).join('\n').trim() || null,
      experience: null,
      minYears: null,
      employmentType: j.categories?.commitment ?? null,
      salary: s ? money(s.min, s.max, s.currency, s.interval?.match(/^per-(\w+)/)?.[1]) : null,
      postedAt: j.createdAt ? new Date(j.createdAt).toISOString() : null,
      deadline: null,
      url: j.hostedUrl,
    }
  })
}

/* ---------------------------------------------------------------- SmartRecruiters */

type SrPosting = {
  id: string
  name: string
  releasedDate?: string
  location?: { fullLocation?: string }
  typeOfEmployment?: { label?: string }
  experienceLevel?: { id: string; label: string }
}
type SrDetail = { postingUrl?: string; jobAd?: { sections?: Record<string, { text?: string } | undefined> } }

async function smartrecruiters({ board, wanted }: FetchArgs): Promise<RawJob[]> {
  const list: SrPosting[] = []
  for (let offset = 0; ; offset += 100) {
    const page = await getJson<{ totalFound: number; content: SrPosting[] }>(`https://api.smartrecruiters.com/v1/companies/${board}/postings?country=in&limit=100&offset=${offset}`)
    list.push(...page.content)
    if (!page.content.length || list.length >= page.totalFound) break
    await pause()
  }
  const out: RawJob[] = []
  for (const p of list.filter((p) => wanted(p.name, p.location?.fullLocation ?? ''))) {
    await pause()
    const d = await getJson<SrDetail>(`https://api.smartrecruiters.com/v1/companies/${board}/postings/${p.id}`)
    const s = d.jobAd?.sections ?? {}
    if (!d.postingUrl) continue
    out.push({
      sourceId: p.id,
      title: p.name.trim(),
      location: p.location?.fullLocation ?? null,
      description: text(['jobDescription', 'qualifications', 'additionalInformation'].map((k) => s[k]?.text ?? '').join('\n')),
      experience: p.experienceLevel && p.experienceLevel.id !== 'not_applicable' ? p.experienceLevel.label : null,
      minYears: null,
      employmentType: p.typeOfEmployment?.label ?? null,
      salary: null,
      postedAt: p.releasedDate ?? null,
      deadline: null,
      url: d.postingUrl,
    })
  }
  return out
}

/* ---------------------------------------------------------------- Workday career site */

type JobPostingLd = {
  identifier?: { value?: string }
  title: string
  description?: string
  datePosted?: string
  validThrough?: string
  employmentType?: string | string[]
  jobLocation?: { address?: { addressLocality?: string; addressCountry?: string } }
  baseSalary?: { currency?: string; value?: { value?: number; minValue?: number; maxValue?: number; unitText?: string } }
}

const WORKDAY_TYPES: Record<string, string> = { FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACTOR: 'Contract', TEMPORARY: 'Temporary', INTERN: 'Internship' }

/** The sitemap lists only the newest postings, so jobs collected earlier are re-checked on their own pages. */
async function workday({ board, wanted, known }: FetchArgs): Promise<RawJob[]> {
  const xml = await (await get(`${board}/siteMap.xml`)).text()
  const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]))
  // Job URLs read .../job/{location}/{Title-Words}_{requisition}
  const words = (seg = '') => seg.replace(/_[A-Z]+-?\d+.*$/, '').replace(/-+/g, ' ')
  const urls = [...new Set([...listed.filter((u) => wanted(words(u.split('/').pop()), words(u.split('/').at(-2)))), ...known])]
  const out: RawJob[] = []
  for (const url of urls) {
    await pause()
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) })
    if (res.status === 404 || res.status === 410) continue
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
    const ld = (await res.text()).match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/)
    if (!ld) continue // the page no longer carries a posting: the job has closed
    const p = JSON.parse(ld[1]) as JobPostingLd
    const a = p.jobLocation?.address
    const parts = [a?.addressLocality, a?.addressCountry].join(',').split(',').map((x) => x.trim())
    const type = [p.employmentType].flat()[0]
    const pay = p.baseSalary?.value
    out.push({
      sourceId: p.identifier?.value ?? url,
      title: p.title.trim(),
      location: [...new Set(parts.filter(Boolean))].join(', ') || null,
      description: text(p.description),
      experience: null,
      minYears: null,
      employmentType: type ? (WORKDAY_TYPES[type] ?? type) : null,
      salary: pay ? money(pay.minValue ?? pay.value, pay.maxValue, p.baseSalary?.currency, pay.unitText) : null,
      postedAt: p.datePosted ?? null,
      deadline: p.validThrough ?? null,
      url,
    })
  }
  return out
}

/* ---------------------------------------------------------------- registry */

export const SOURCES: Record<Platform, { name: string; careers: (board: string) => string; fetch: (args: FetchArgs) => Promise<RawJob[]> }> = {
  greenhouse: { name: 'Greenhouse', careers: (b) => `https://job-boards.greenhouse.io/${b}`, fetch: greenhouse },
  lever: { name: 'Lever', careers: (b) => `https://jobs.lever.co/${b}`, fetch: lever },
  smartrecruiters: { name: 'SmartRecruiters', careers: (b) => `https://careers.smartrecruiters.com/${b}`, fetch: smartrecruiters },
  workday: { name: 'Workday', careers: (b) => b, fetch: workday },
}
