import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Reveal, cx } from '../components/motion'
import { spread } from '../jobs/order'
import { CATEGORIES, type Job, type JobCategory, type JobsFile } from '../jobs/types'
import { EASE } from '../presentation/transitions'
import { SceneHead } from './shared'

/* ------------------------------------------------------------------ data */

/** scripts/jobs/collect.ts refreshes this file every morning from GitHub Actions. Reading it from the repo keeps
 *  the board current without a redeploy; the copy bundled at deploy time covers a venue without internet. */
const LIVE_JOBS = 'https://raw.githubusercontent.com/fbivinay/MOM_Lab_Finals/main/public/data/jobs.json'

const getJobs = (url: string) =>
  fetch(url, { cache: 'no-store' }).then((r) => (r.ok ? (r.json() as Promise<JobsFile>) : Promise.reject(new Error(`HTTP ${r.status} for ${url}`))))

let request: Promise<JobsFile> | null = null
function loadJobs(): Promise<JobsFile> {
  if (!request) {
    request = getJobs(LIVE_JOBS).catch(() => getJobs('/data/jobs.json'))
    request.catch(() => {
      request = null // try again on the next visit
    })
  }
  return request
}

function useJobs() {
  const [state, setState] = useState<{ data?: JobsFile; failed?: boolean }>({})
  useEffect(() => {
    let mounted = true
    loadJobs().then(
      (data) => mounted && setState({ data }),
      () => mounted && setState({ failed: true }),
    )
    return () => {
      mounted = false
    }
  }, [])
  return state
}

/* ------------------------------------------------------------------ formatting (dates in IST) */

const IST = 'Asia/Kolkata'
const stampFormat = new Intl.DateTimeFormat('en-IN', { timeZone: IST, day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
const dayFormat = new Intl.DateTimeFormat('en-IN', { timeZone: IST, day: 'numeric', month: 'short' })
const dayYearFormat = new Intl.DateTimeFormat('en-IN', { timeZone: IST, day: 'numeric', month: 'short', year: 'numeric' })
const isoDay = new Intl.DateTimeFormat('en-CA', { timeZone: IST }) // YYYY-MM-DD

function parse(iso: string | null): Date | null {
  const d = iso ? new Date(iso) : null
  return d && !Number.isNaN(d.getTime()) ? d : null
}

function calendarDay(iso: string | null): string | null {
  const d = parse(iso)
  if (!d) return null
  return (isoDay.format(d).slice(0, 4) === isoDay.format(new Date()).slice(0, 4) ? dayFormat : dayYearFormat).format(d)
}

/** "Today", "Yesterday", "3 days ago", then the date. */
function postedLabel(iso: string | null): string | null {
  const d = parse(iso)
  if (!d) return null
  const days = Math.round((Date.parse(isoDay.format(new Date())) - Date.parse(isoDay.format(d))) / 86_400_000)
  return days <= 0 ? 'Today' : days === 1 ? 'Yesterday' : days < 7 ? `${days} days ago` : calendarDay(iso)
}

/** "Bengaluru, Karnataka, India" reads as "Bengaluru, India" on a card. */
function placeLabel(location: string | null): string | null {
  const parts = location?.split(',').map((p) => p.trim()).filter(Boolean) ?? []
  return parts.length ? (parts.length > 2 ? `${parts[0]}, ${parts.at(-1)}` : parts.join(', ')) : null
}

/* ------------------------------------------------------------------ cards */

const TONE = { neutral: 'bg-bg-2 text-fg-2', good: 'bg-accent-wash text-accent-ink', warn: 'bg-signal-wash text-signal-ink' }

/** A filled chip for a published value; a quiet one for a value the source left out. */
function Chip({ children, missing = false, tone = 'neutral' }: { children: ReactNode; missing?: boolean; tone?: keyof typeof TONE }) {
  return (
    <span className={cx('inline-flex h-[1.9rem] items-center whitespace-nowrap rounded-[0.5rem] px-[0.6rem] text-[0.875rem]', missing ? 'bg-bg-2 font-[450] text-fg-3' : `font-[600] ${TONE[tone]}`)}>
      {children}
    </span>
  )
}

function Logo({ company, logo }: { company: string; logo: string | null }) {
  return (
    <span className="grid h-[2.75rem] w-[2.75rem] shrink-0 place-items-center overflow-hidden rounded-[0.7rem] border border-line bg-white">
      {logo ? <img src={logo} alt="" className="h-full w-full object-contain p-[0.3rem]" /> : <span className="text-[1.125rem] font-[680] text-fg-2">{company[0]}</span>}
    </span>
  )
}

function JobCard({ job, index }: { job: Job; index: number }) {
  const intern = /intern/i.test(`${job.employmentType ?? ''} ${job.title}`)
  const posted = postedLabel(job.postedAt)
  const deadline = calendarDay(job.deadline)
  const place = placeLabel(job.location)
  const fresher = job.forFreshers === 'yes'
  return (
    <motion.a
      href={job.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-[1rem] border border-line bg-surface p-[1.25rem] transition-colors hover:border-fg-3"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.06, duration: 0.5, ease: EASE }}
    >
      <span className="flex items-center gap-[0.8rem]">
        <Logo company={job.company} logo={job.logo} />
        <span className="min-w-0 flex-1 truncate text-[1.0625rem] font-[600] text-fg-2">{job.company}</span>
        <span className="flex shrink-0 items-center gap-[0.25rem] text-[0.8125rem] text-fg-3">
          via {job.source}
          <ArrowUpRight className="h-[0.9rem] w-[0.9rem] transition-colors group-hover:text-accent-ink" aria-hidden />
        </span>
      </span>
      <span className="mt-[0.85rem] line-clamp-2 min-h-[3.1rem] text-[1.3125rem] font-[680] leading-[1.18] tracking-[-0.02em] text-fg transition-colors group-hover:text-accent-ink">
        {job.title.replace(/_/g, ' ')}
      </span>
      <span className="mt-[0.85rem] flex flex-wrap gap-[0.4rem]">
        <Chip missing={!job.salary}>{job.salary ?? (intern ? 'Stipend not disclosed' : 'Salary not disclosed')}</Chip>
        <Chip missing={!job.experience && !fresher} tone={fresher ? 'good' : 'neutral'}>
          {job.experience ?? (fresher ? 'Fresher' : 'Exp not listed')}
        </Chip>
        <Chip missing={!posted}>{posted ?? 'Post date not listed'}</Chip>
        <Chip missing={!place}>{place ?? 'Location not listed'}</Chip>
        <Chip missing={!deadline}>{deadline ? `Apply by ${deadline}` : 'No deadline listed'}</Chip>
        {job.status === 'unverified' && <Chip tone="warn">Unverified</Chip>}
      </span>
    </motion.a>
  )
}

/* ------------------------------------------------------------------ board */

const PAGE = 6

export function JobsBoard() {
  const { data, failed } = useJobs()
  const [category, setCategory] = useState<JobCategory | null>(null)
  const [fresherOnly, setFresherOnly] = useState(false)
  const [page, setPage] = useState(0)

  // Listings arrive sorted with roles open to freshers first; companies then take turns on each page.
  const open = data?.jobs.filter((j) => j.status !== 'expired') ?? []
  const inCategory = open.filter((j) => !category || j.category === category)
  const fresherFit = inCategory.filter((j) => j.forFreshers !== 'no')
  const shown = spread(fresherOnly ? fresherFit : inCategory)
  const hidden = inCategory.length - shown.length
  const pages = Math.max(1, Math.ceil(shown.length / PAGE))
  const cards = shown.slice(page * PAGE, (page + 1) * PAGE)

  const pick = (c: JobCategory | null) => {
    setCategory(c)
    setPage(0)
  }
  const showFreshersOnly = (on: boolean) => {
    setFresherOnly(on)
    setPage(0)
  }

  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] right-[5.5rem] top-[7rem] flex items-end justify-between gap-[3rem]">
        <SceneHead eyebrow="Collected every morning from employer career sites" title="Retail analyst jobs in India" size="title" />
        <Reveal delay={0.35} y={8} className="shrink-0 pb-[0.35rem] text-right text-[1rem] leading-[1.45] text-fg-3">
          {data ? (
            <>
              Checked {stampFormat.format(new Date(data.generatedAt))} IST
              <br />
              across {data.sources.length} employer career {data.sources.length === 1 ? 'site' : 'sites'}
            </>
          ) : failed ? (
            'The job list could not be loaded.'
          ) : (
            'Loading listings…'
          )}
        </Reveal>
      </div>

      <Reveal delay={0.45} y={8} className="absolute left-[5.5rem] right-[5.5rem] top-[14.25rem] flex items-center justify-between gap-[1rem]">
        <div className="flex flex-wrap gap-[0.4rem]">
          {[null, ...CATEGORIES].map((c) => (
            <button key={c ?? 'all'} type="button" className="chip h-[2.25rem] px-[0.8rem] text-[0.875rem]" data-on={category === c} aria-pressed={category === c} onClick={() => pick(c)}>
              {c ?? 'All roles'}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-[1rem]">
          <span className="tnum text-[0.9375rem] text-fg-3">
            {shown.length} {shown.length === 1 ? 'role' : 'roles'}
          </span>
          <button type="button" className="chip h-[2.25rem] px-[0.8rem] text-[0.875rem]" data-on={fresherOnly} aria-pressed={fresherOnly} onClick={() => showFreshersOnly(!fresherOnly)}>
            Freshers only (0–1 yrs)
          </button>
          <div className="flex items-center gap-[0.4rem] text-[0.9375rem] text-fg-3">
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                aria-label={d < 0 ? 'Previous page' : 'Next page'}
                disabled={d < 0 ? page === 0 : page >= pages - 1}
                onClick={() => setPage(page + d)}
                className={cx('grid h-[2.25rem] w-[2.25rem] place-items-center rounded-full border border-line-2 text-fg-2 transition-colors hover:border-fg disabled:pointer-events-none disabled:opacity-35', d > 0 && 'order-last')}
              >
                {d < 0 ? <ChevronLeft className="h-[1rem] w-[1rem]" /> : <ChevronRight className="h-[1rem] w-[1rem]" />}
              </button>
            ))}
            <span className="tnum min-w-[3.25rem] text-center">
              {page + 1} / {pages}
            </span>
          </div>
        </div>
      </Reveal>

      {cards.length > 0 ? (
        <div key={`${category}-${fresherOnly}-${page}`} className="absolute left-[5.5rem] right-[5.5rem] top-[17.75rem] grid grid-cols-3 gap-[1.25rem]">
          {cards.map((j, i) => (
            <JobCard key={j.id} job={j} index={i} />
          ))}
        </div>
      ) : (
        <Reveal delay={0.55} y={8} className="absolute left-[5.5rem] top-[19.5rem] w-[60rem]">
          {failed ? (
            <EmptyNote title="Couldn’t load the job list">Check the internet connection, then come back to this slide.</EmptyNote>
          ) : !data ? (
            <EmptyNote title="Loading listings…" />
          ) : hidden > 0 ? (
            <EmptyNote title={`No fresher-level ${category ?? 'retail analyst'} openings today`}>
              {hidden} {hidden === 1 ? 'opening asks' : 'openings ask'} for two or more years of experience.
              <ActionChip onClick={() => showFreshersOnly(false)}>Show {hidden === 1 ? 'it' : 'them'}</ActionChip>
            </EmptyNote>
          ) : open.length > 0 ? (
            <EmptyNote title={`No ${category} openings today`}>
              <ActionChip onClick={() => pick(null)}>Show all roles</ActionChip>
            </EmptyNote>
          ) : (
            <EmptyNote title="No openings in these roles at the tracked employers today">
              The board lists Retail, Retail Data, Demand Forecasting, Supply Chain and Inventory Analyst roles in India, and checks again every morning. Until
              something opens, the next slide links to 15 job sites with ready-made searches.
              <span className="mt-[1.5rem] block text-[0.9375rem] text-fg-3">Career sites checked</span>
              <span className="mt-[0.6rem] flex flex-wrap gap-[0.4rem]">
                {data.sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="chip h-[2rem] px-[0.75rem] text-[0.875rem] hover:border-fg-3">
                    {s.company}
                  </a>
                ))}
              </span>
            </EmptyNote>
          )}
        </Reveal>
      )}
    </div>
  )
}

function EmptyNote({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <>
      <div className="text-[1.75rem] font-[600] leading-[1.15] tracking-[-0.025em] text-fg">{title}</div>
      {children && <div className="mt-[0.75rem] text-[1.125rem] leading-[1.5] text-fg-2">{children}</div>}
    </>
  )
}

function ActionChip({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="chip mt-[1rem] flex h-[2.25rem] px-[0.85rem] text-[0.9375rem]" onClick={onClick}>
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ where else to look */

/** Pre-filtered searches on sites that offer no public jobs API we can use; linked, never collected. */
const SITE_GROUPS: { label: string; sites: { name: string; search: string; href: string }[] }[] = [
  {
    label: 'Large job boards',
    sites: [
      { name: 'LinkedIn', search: 'Retail analyst, India, internship and entry level', href: 'https://www.linkedin.com/jobs/search/?keywords=retail%20analyst&location=India&f_E=1%2C2' },
      { name: 'Indeed India', search: 'Retail analyst fresher, India', href: 'https://in.indeed.com/jobs?q=retail+analyst+fresher&l=India' },
      { name: 'Naukri', search: 'Retail analyst, 0 years of experience', href: 'https://www.naukri.com/retail-analyst-jobs?experience=0' },
      { name: 'Foundit', search: 'Retail analyst, 0–1 years of experience', href: 'https://www.foundit.in/search/retail-analyst-jobs?experienceRanges=0~1' },
      { name: 'Glassdoor', search: 'Retail analyst, India, entry level', href: 'https://www.glassdoor.co.in/Job/india-retail-analyst-jobs-SRCH_IL.0,5_IN115_KO6,20.htm?seniorityType=entrylevel' },
      { name: 'Careerjet', search: 'Retail analyst fresher, India', href: 'https://www.careerjet.co.in/jobs?s=retail+analyst+fresher&l=India' },
    ],
  },
  {
    label: 'Fresher job sites',
    sites: [
      { name: 'Shine', search: 'Retail analyst jobs for freshers', href: 'https://www.shine.com/job-search/retail-analyst-jobs-for-freshers' },
      { name: 'TimesJobs', search: 'Retail analyst, India, freshers', href: 'https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&txtKeywords=retail+analyst&txtLocation=India&cboWorkExp1=0' },
      { name: 'Freshersworld', search: 'Retail analyst fresher jobs', href: 'https://www.freshersworld.com/jobs/jobsearch/retail-analyst-jobs' },
      { name: 'apna', search: 'Retail analyst fresher', href: 'https://apna.co/jobs?search=true&text=retail%20analyst%20fresher' },
      { name: 'Jobaaj', search: 'Retail analyst fresher jobs', href: 'https://www.jobaaj.com/jobs/retail-analyst-fresher-jobs' },
    ],
  },
  {
    label: 'Internships and specialist boards',
    sites: [
      { name: 'Internshala', search: 'Retail analyst fresher jobs', href: 'https://internshala.com/fresher-jobs/keywords-retail%20analyst/' },
      { name: 'Unstop', search: 'Open retail analyst jobs', href: 'https://unstop.com/job?oppstatus=open&searchTerm=retail%20analyst' },
      { name: 'Hirist', search: 'Retail analyst fresher jobs', href: 'https://www.hirist.tech/k/retail-analyst-fresher-jobs' },
      { name: 'Instahyre', search: 'Retail analyst; set experience to 0 on the site', href: 'https://www.instahyre.com/retail-analyst-jobs/' },
    ],
  },
]

export function JobsSites() {
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7rem] w-[62rem]">
        <SceneHead eyebrow="Job sites" title="Where else to look" size="title" />
        <Reveal delay={0.35} y={8} className="mt-[0.9rem] text-[1.125rem] leading-[1.45] text-fg-2">
          Each link opens a search for retail analyst roles in India open to freshers; the filter it applies is listed under the name. None of these sites offers a public jobs API we can use, so we link to them instead of copying their listings.
        </Reveal>
      </div>
      <div className="absolute left-[5.5rem] right-[5.5rem] top-[18rem] grid grid-cols-3 gap-x-[2.5rem]">
        {SITE_GROUPS.map((g, gi) => (
          <div key={g.label}>
            <Reveal delay={0.4 + gi * 0.08} y={8} className="t-label border-b border-line-2 pb-[0.6rem]">
              {g.label}
            </Reveal>
            <ul>
              {g.sites.map((s, i) => (
                <motion.li key={s.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + gi * 0.08 + i * 0.05, duration: 0.45, ease: EASE }}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-[0.75rem] border-b border-line py-[0.45rem]">
                    <span>
                      <span className="block text-[1.25rem] font-[580] tracking-[-0.015em] text-fg transition-colors group-hover:text-accent-ink">{s.name}</span>
                      <span className="mt-[0.1rem] block text-[0.9375rem] leading-[1.35] text-fg-3">{s.search}</span>
                    </span>
                    <ArrowUpRight className="mt-[0.3rem] h-[1.1rem] w-[1.1rem] shrink-0 text-fg-3 transition-colors group-hover:text-accent-ink" aria-hidden />
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
