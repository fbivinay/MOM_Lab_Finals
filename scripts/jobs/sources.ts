/** Source-specific extraction: one fetcher per job platform, each returning RawJob[].
 *  Every feed here is public and unauthenticated, offered by the platform for this purpose:
 *  the Greenhouse Job Board API, the Lever Postings API, the SmartRecruiters Posting API, and employer
 *  career sites (Workday, Phenom) that name a sitemap in robots.txt and embed schema.org JobPosting data.
 *  Classification, status and merging live in pipeline.ts. */

export type Platform = 'greenhouse' | 'lever' | 'smartrecruiters' | 'workday' | 'phenom'

/** `retail`: a retailer or retail-data firm, where a plain data analyst title counts as a retail data analyst role. */
export type Employer = { company: string; platform: Platform; board: string; logo?: string; retail?: boolean }

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
  /** Pre-filter on title and location (null when the listing does not show it), so per-job requests
   *  are only made for relevant roles. */
  wanted: (title: string, location: string | null) => boolean
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
  for (const p of list.filter((p) => wanted(p.name, p.location?.fullLocation ?? null))) {
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

/* ---------------------------------------------------------------- career sites: sitemap + JobPosting data */

type Place = { address?: { addressLocality?: string; addressCountry?: string | { name?: string } } }
type JobPostingLd = {
  '@type'?: string
  identifier?: { value?: string }
  title: string
  description?: string
  datePosted?: string
  validThrough?: string
  employmentType?: string | string[]
  jobLocation?: Place | Place[]
  baseSalary?: { currency?: string; value?: { value?: number; minValue?: number; maxValue?: number; unitText?: string } }
}

const EMPLOYMENT_TYPES: Record<string, string> = { FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACTOR: 'Contract', TEMPORARY: 'Temporary', INTERN: 'Internship' }

/** The schema.org JobPosting embedded in a job page, or null when the page no longer carries one. */
function jobPosting(html: string): JobPostingLd | null {
  for (const [, body] of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    let data: unknown
    try {
      data = JSON.parse(body)
    } catch {
      continue
    }
    const graph = (data as { '@graph'?: unknown[] })['@graph']
    const items = (Array.isArray(data) ? data : Array.isArray(graph) ? graph : [data]) as JobPostingLd[]
    const posting = items.find((x) => x?.['@type'] === 'JobPosting')
    if (posting) return posting
  }
  return null
}

/* robots.txt rules for all crawlers (User-agent: *), fetched once per site. */
const robotsCache = new Map<string, Promise<[allow: boolean, rule: string][]>>()

async function robotsRules(origin: string): Promise<[boolean, string][]> {
  const res = await fetch(`${origin}/robots.txt`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) }).catch(() => null)
  if (!res || res.status >= 500) return [[false, '/']] // unreachable: assume nothing may be crawled
  if (!res.ok) return [] // no robots.txt: no rules (RFC 9309)
  const rules: [boolean, string][] = []
  let applies = false
  let inAgents = false
  for (const line of (await res.text()).split(/\r?\n/)) {
    const m = line.replace(/#.*/, '').match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/)
    if (!m) continue
    const key = m[1].toLowerCase()
    if (key === 'user-agent') {
      applies = (inAgents && applies) || m[2] === '*'
      inAgents = true
      continue
    }
    inAgents = false
    if (applies && (key === 'allow' || key === 'disallow') && m[2]) rules.push([key === 'allow', m[2]])
  }
  return rules
}

/** RFC 9309 matching: the longest matching rule wins and Allow wins a tie; `*` matches anything, a final `$` anchors. */
export function robotsVerdict(rules: [boolean, string][], path: string): boolean {
  let allowed = true
  let longest = -1
  for (const [allow, rule] of rules) {
    const anchored = rule.endsWith('$')
    const body = (anchored ? rule.slice(0, -1) : rule).replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
    if (new RegExp(`^${body}${anchored ? '$' : ''}`).test(path) && (rule.length > longest || (rule.length === longest && allow))) {
      allowed = allow
      longest = rule.length
    }
  }
  return allowed
}

async function allowedByRobots(url: string): Promise<boolean> {
  const { origin, pathname, search } = new URL(url)
  if (!robotsCache.has(origin)) robotsCache.set(origin, robotsRules(origin))
  return robotsVerdict(await robotsCache.get(origin)!, pathname + search)
}

/** Job URLs listed in a sitemap, following a sitemap index down to its sitemaps. */
async function sitemapUrls(sitemap: string): Promise<string[]> {
  if (!(await allowedByRobots(sitemap))) return []
  const xml = await (await get(sitemap)).text()
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => decode(m[1]))
  if (!xml.includes('<sitemapindex')) return locs.filter((u) => u.includes('/job/'))
  const urls: string[] = []
  for (const child of locs) {
    await pause()
    urls.push(...(await sitemapUrls(child)))
  }
  return urls
}

type Slug = (url: string) => { title: string; location: string | null }

/** Career sites that embed schema.org JobPosting data in each job page. `slug` reads the title (and the
 *  location, when the URL carries one) so only relevant pages are fetched. Jobs collected earlier are
 *  re-checked on their own pages, because a sitemap or search may list only the newest postings. */
async function careerSite({ wanted, known }: FetchArgs, listed: string[], slug: Slug): Promise<RawJob[]> {
  const urls = [...new Set([...listed.filter((u) => wanted(slug(u).title, slug(u).location)), ...known])]
  const out: RawJob[] = []
  for (const url of urls) {
    if (!(await allowedByRobots(url))) continue
    await pause()
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) })
    if (res.status === 404 || res.status === 410) continue
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
    const p = jobPosting(await res.text())
    if (!p) continue // the page no longer carries a posting: the job has closed
    const a = [p.jobLocation].flat()[0]?.address
    const country = typeof a?.addressCountry === 'object' ? a.addressCountry.name : a?.addressCountry
    // Office codes such as "INZIU06 - Airoli" are internal; keep the place name.
    const parts = [a?.addressLocality, country].join(',').split(',').map((x) => x.trim().replace(/^[A-Z]{2,}\d+\s*-\s*/, ''))
    const type = [p.employmentType].flat()[0]
    const pay = p.baseSalary?.value
    out.push({
      sourceId: p.identifier?.value ?? url,
      title: p.title.trim(),
      location: [...new Set(parts.filter(Boolean))].join(', ') || null,
      description: text(p.description),
      experience: null,
      minYears: null,
      employmentType: type ? (EMPLOYMENT_TYPES[type] ?? type) : null,
      salary: pay ? money(pay.minValue ?? pay.value, pay.maxValue, p.baseSalary?.currency, pay.unitText) : null,
      postedAt: p.datePosted ?? null,
      deadline: p.validThrough ?? null,
      url,
    })
  }
  return out
}

type WorkdayFacet = { facetParameter?: string; descriptor?: string; id?: string; values?: WorkdayFacet[] }
type WorkdaySearch = { facets?: WorkdayFacet[]; jobPostings?: { externalPath?: string }[] }

/** Role keywords for the career-site search; the pipeline still decides which family each title is in. */
const SEARCH_TERMS = ['retail analyst', 'merchandise', 'pricing', 'category', 'demand planning', 'forecasting', 'inventory', 'replenishment', 'supply chain analyst', 'supply planning', 'planner', 'insights analyst', 'data analyst']

/** The India value of a site's location filter; filters nest, and a nested value may name its own parameter. */
function indiaFilter(facets: WorkdayFacet[] = []): Record<string, string[]> {
  const stack = facets.flatMap((f) => (f.values ?? []).map((v) => ({ param: v.facetParameter ?? f.facetParameter, v })))
  while (stack.length) {
    const { param, v } = stack.pop()!
    if (v.descriptor === 'India' && v.id && param) return { [param]: [v.id] }
    stack.push(...(v.values ?? []).map((x) => ({ param: x.facetParameter ?? param, v: x })))
  }
  return {}
}

/** Workday sites answer the same keyword search as their public job page. Searching each role keyword,
 *  filtered to India where the site offers that filter, finds postings older than the sitemap's newest. */
async function workdaySearch(board: string): Promise<string[]> {
  const { origin, hostname, pathname } = new URL(board)
  const site = pathname.split('/').filter(Boolean).at(-1)
  const api = `${origin}/wday/cxs/${hostname.split('.')[0]}/${site}/jobs`
  if (!(await allowedByRobots(`${board}/`)) || !(await allowedByRobots(api))) return []
  const search = async (searchText: string, appliedFacets: Record<string, string[]> = {}) => {
    await pause()
    const res = await fetch(api, {
      method: 'POST',
      headers: { 'User-Agent': UA, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ appliedFacets, limit: 20, offset: 0, searchText }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${api}`)
    return (await res.json()) as WorkdaySearch
  }
  const india = indiaFilter((await search('')).facets)
  const urls: string[] = []
  for (const term of SEARCH_TERMS) for (const p of (await search(term, india)).jobPostings ?? []) if (p.externalPath) urls.push(board + p.externalPath)
  return urls
}

const words = (segment = '') => segment.replace(/_[A-Z]+-?\d+.*$/, '').replace(/-+/g, ' ')

/** Workday job URLs read .../job/{location}/{Title-Words}_{requisition}; the board is the career-site URL. */
async function workday(args: FetchArgs): Promise<RawJob[]> {
  const searched = await workdaySearch(args.board).catch((err: Error) => {
    console.warn(`  search unavailable on ${args.board}: ${err.message}; using the sitemap only`)
    return []
  })
  const listed = [...(await sitemapUrls(`${args.board}/siteMap.xml`)), ...searched]
  return careerSite(args, listed, (u) => ({ title: words(u.split('/').at(-1)), location: words(u.split('/').at(-2)) }))
}

/** Phenom job URLs read .../job/{requisition}/{Title-Words}; the board is the sitemap robots.txt names. */
async function phenom(args: FetchArgs): Promise<RawJob[]> {
  return careerSite(args, await sitemapUrls(args.board), (u) => ({ title: words(u.split('/').at(-1)), location: null }))
}

/* ---------------------------------------------------------------- registry */

export const SOURCES: Record<Platform, { name: string; careers: (board: string) => string; fetch: (args: FetchArgs) => Promise<RawJob[]> }> = {
  greenhouse: { name: 'Greenhouse', careers: (b) => `https://job-boards.greenhouse.io/${b}`, fetch: greenhouse },
  lever: { name: 'Lever', careers: (b) => `https://jobs.lever.co/${b}`, fetch: lever },
  smartrecruiters: { name: 'SmartRecruiters', careers: (b) => `https://careers.smartrecruiters.com/${b}`, fetch: smartrecruiters },
  workday: { name: 'Workday', careers: (b) => b, fetch: workday },
  phenom: { name: 'Phenom', careers: (b) => b.replace(/\/sitemap[^/]*\.xml$/, ''), fetch: phenom },
}
