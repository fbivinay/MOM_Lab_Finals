import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { Reveal, cx } from '../components/motion'
import { CATEGORIES, type Job, type JobCategory, type JobsFile, type JobStatus } from '../jobs/types'
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

const DAY = { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' } as const
const dayFormat = new Intl.DateTimeFormat('en-IN', DAY)
const timeFormat = new Intl.DateTimeFormat('en-IN', { ...DAY, hour: 'numeric', minute: '2-digit' })

function when(iso: string | null, withTime = false): string | null {
  const d = iso ? new Date(iso) : null
  if (!d || Number.isNaN(d.getTime())) return iso
  return withTime ? `${timeFormat.format(d)} IST` : dayFormat.format(d)
}

const STATUS: Record<JobStatus, { label: string; tone: string }> = {
  active: { label: 'Active', tone: 'bg-accent-wash text-accent-ink' },
  unverified: { label: 'Unverified', tone: 'bg-signal-wash text-signal-ink' },
  expired: { label: 'Expired', tone: 'bg-bg-2 text-fg-3' },
}

const pill = 'shrink-0 rounded-full px-[0.7rem] py-[0.2rem] text-[0.875rem] font-[560]'

function CompanyMark({ company, logo, size }: { company: string; logo: string | null; size: number }) {
  const box = { width: `${size}rem`, height: `${size}rem` }
  return logo ? (
    <img src={logo} alt="" style={box} className="shrink-0 object-contain p-[0.3rem]" />
  ) : (
    <span aria-hidden style={{ ...box, fontSize: `${size * 0.42}rem` }} className="grid shrink-0 place-items-center rounded-[0.7rem] bg-bg-2 font-[640] text-fg-2">
      {company[0]}
    </span>
  )
}

function ExperienceTag({ job }: { job: Job }) {
  if (job.fresher) return <span className={cx(pill, 'bg-accent-wash text-accent-ink')}>Fresher</span>
  if (job.experience) return <span className={cx(pill, 'bg-bg-2 text-fg-2')}>{job.experience}</span>
  return <span className={cx(pill, 'bg-signal-wash text-signal-ink')}>Check experience</span>
}

/* ------------------------------------------------------------------ board */

const PAGE = 6

export function JobsBoard() {
  const { data, failed } = useJobs()
  const [category, setCategory] = useState<JobCategory | null>(null)
  const [fresherOnly, setFresherOnly] = useState(false)
  const [page, setPage] = useState(0)
  const [pickedId, setPickedId] = useState<string | null>(null)

  const open = data?.jobs.filter((j) => j.status !== 'expired') ?? []
  const shown = open.filter((j) => (!category || j.category === category) && (!fresherOnly || j.fresher))
  const pages = Math.max(1, Math.ceil(shown.length / PAGE))
  const rows = shown.slice(page * PAGE, (page + 1) * PAGE)
  const picked = rows.find((j) => j.id === pickedId) ?? rows[0] ?? null

  const refilter = (c: JobCategory | null, fresher: boolean) => {
    setCategory(c)
    setFresherOnly(fresher)
    setPage(0)
  }

  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7rem] w-[57rem]">
        <SceneHead eyebrow="Collected every morning from employer career sites" title="Fresher analyst jobs in India" size="title" />
        <Reveal delay={0.35} y={8} className="mt-[0.9rem] text-[1.0625rem] leading-[1.45] text-fg-3">
          {data
            ? `Checked ${when(data.generatedAt, true)} across ${data.sources.length} employer career ${data.sources.length === 1 ? 'site' : 'sites'}. Roles asking for two or more years are left out.`
            : failed
              ? 'The job list could not be loaded.'
              : 'Loading listings…'}
        </Reveal>
      </div>

      <Reveal delay={0.45} y={8} className="absolute left-[5.5rem] top-[17.25rem] flex w-[57rem] flex-wrap gap-[0.5rem]">
        {[null, ...CATEGORIES].map((c) => (
          <button key={c ?? 'all'} type="button" className="chip h-[2.25rem] px-[0.85rem] text-[0.9375rem]" data-on={category === c} aria-pressed={category === c} onClick={() => refilter(c, fresherOnly)}>
            {c ?? 'All roles'}
          </button>
        ))}
      </Reveal>

      <Reveal delay={0.5} y={8} className="absolute left-[5.5rem] top-[20.5rem] flex h-[3rem] w-[57rem] items-center justify-between border-b border-line-2">
        <span className="text-[1rem] text-fg-2">
          <span className="tnum">{shown.length}</span> open {shown.length === 1 ? 'role' : 'roles'}
        </span>
        <div className="flex items-center gap-[1.25rem]">
          <button type="button" className="chip h-[2rem] px-[0.8rem] text-[0.9375rem]" data-on={fresherOnly} aria-pressed={fresherOnly} onClick={() => refilter(category, !fresherOnly)}>
            Says fresher
          </button>
          <div className="flex items-center gap-[0.4rem] text-[0.9375rem] text-fg-3">
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                aria-label={d < 0 ? 'Previous page' : 'Next page'}
                disabled={d < 0 ? page === 0 : page >= pages - 1}
                onClick={() => setPage(page + d)}
                className={cx('grid h-[2rem] w-[2rem] place-items-center rounded-full border border-line-2 text-fg-2 transition-colors hover:border-fg disabled:pointer-events-none disabled:opacity-35', d > 0 && 'order-last')}
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

      {rows.length > 0 ? (
        <ul key={`${category}-${fresherOnly}-${page}`} className="absolute left-[5.5rem] top-[23.5rem] w-[57rem]">
          {rows.map((j, i) => (
            <motion.li key={j.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.05, duration: 0.4, ease: EASE }}>
              <button
                type="button"
                onClick={() => setPickedId(j.id)}
                aria-pressed={picked?.id === j.id}
                className={cx(
                  'flex h-[4.1rem] w-full items-center gap-[1rem] border-b border-line px-[0.75rem] text-left transition-colors',
                  picked?.id === j.id ? 'bg-surface shadow-[inset_3px_0_0_var(--accent)]' : 'hover:bg-bg-2/70',
                )}
              >
                <CompanyMark company={j.company} logo={j.logo} size={2.4} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[1.1875rem] font-[560] tracking-[-0.015em] text-fg">{j.title}</span>
                  <span className="mt-[0.1rem] block truncate text-[0.9375rem] text-fg-3">
                    <span className="text-fg-2">{j.company}</span>
                    {j.location && `, ${j.location}`}
                  </span>
                </span>
                <ExperienceTag job={j} />
              </button>
            </motion.li>
          ))}
        </ul>
      ) : (
        <Reveal delay={0.55} y={8} className="absolute left-[5.5rem] top-[25.5rem] w-[50rem]">
          {failed ? (
            <EmptyNote title="Couldn’t load the job list">Check the internet connection, then come back to this slide.</EmptyNote>
          ) : !data ? (
            <EmptyNote title="Loading listings…" />
          ) : open.length > 0 ? (
            <EmptyNote title="No roles match these filters">
              <button type="button" className="chip mt-[1rem] h-[2.25rem] px-[0.85rem] text-[0.9375rem]" onClick={() => refilter(null, false)}>
                Show all roles
              </button>
            </EmptyNote>
          ) : (
            <EmptyNote title="No fresher openings at these employers today">
              The board only lists roles open to freshers or 0–1 years of experience, and it checks again every morning. Until something opens, the next slide links to 16 job sites with fresher searches ready.
            </EmptyNote>
          )}
        </Reveal>
      )}

      <motion.aside
        className="panel absolute bottom-[7rem] left-[65rem] right-[5.5rem] top-[7rem] flex flex-col p-[1.75rem]"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.7, ease: EASE }}
        aria-live="polite"
      >
        {picked ? <JobDetail job={picked} /> : <CareerSites data={data} />}
      </motion.aside>
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

function JobDetail({ job }: { job: Job }) {
  const facts: [string, string | null, string][] = [
    ['Experience', job.experience, 'Not stated, check the posting'],
    ['Employment type', job.employmentType, 'Not stated'],
    ['Salary or stipend', job.salary, 'Not disclosed'],
    ['Posted', when(job.postedAt), 'Date not published'],
    ['Apply by', when(job.deadline), 'No deadline listed'],
    ['Location', job.location, 'Not stated'],
    ['Source', job.source, ''],
    ['Collected', when(job.collectedAt, true), ''],
    ['Last checked', when(job.checkedAt, true), ''],
  ]
  return (
    <motion.div key={job.id} className="flex min-h-0 flex-1 flex-col" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: EASE }}>
      <div className="flex items-center gap-[0.8rem]">
        <CompanyMark company={job.company} logo={job.logo} size={2.75} />
        <span className="min-w-0 flex-1 truncate text-[1.125rem] font-[580] text-fg">{job.company}</span>
        <span className={cx(pill, STATUS[job.status].tone)}>{STATUS[job.status].label}</span>
      </div>
      <h3 className="mt-[1rem] line-clamp-2 text-[1.625rem] font-[620] leading-[1.15] tracking-[-0.025em] text-fg">{job.title}</h3>
      <dl className="mt-[1rem] grid grid-cols-[9rem_1fr] gap-x-[1rem] gap-y-[0.4rem] border-t border-line pt-[0.9rem] text-[0.9375rem] leading-[1.35]">
        {facts.map(([label, value, missing]) => (
          <Fragment key={label}>
            <dt className="text-fg-3">{label}</dt>
            <dd className={value ? 'text-fg' : 'text-fg-3'}>{value ?? missing}</dd>
          </Fragment>
        ))}
      </dl>
      <div className="mt-[0.9rem] min-h-0 flex-1 overflow-y-auto whitespace-pre-line border-t [scrollbar-width:thin] border-line pt-[0.8rem] text-[0.9375rem] leading-[1.5] text-fg-2">
        {job.description ?? 'The source did not include a description. Open the original posting for the details.'}
      </div>
      <a
        href={job.url}
        target="_blank"
        rel="noreferrer"
        className="mt-[1rem] inline-flex h-[2.75rem] shrink-0 items-center justify-center gap-[0.5rem] rounded-full bg-fg px-[1.25rem] text-[1rem] font-[560] text-bg transition-colors hover:bg-accent-ink"
      >
        Open original posting
        <ArrowUpRight className="h-[1.1rem] w-[1.1rem]" aria-hidden />
      </a>
    </motion.div>
  )
}

function CareerSites({ data }: { data?: JobsFile }) {
  return (
    <>
      <div className="text-[1.25rem] font-[600] tracking-[-0.015em] text-fg">Career sites checked</div>
      <p className="mt-[0.4rem] text-[0.9375rem] leading-[1.4] text-fg-3">Read from each employer’s public job feed, with no logins or keys.</p>
      <ul className="mt-[0.9rem] min-h-0 flex-1 overflow-y-auto border-t border-line [scrollbar-width:thin]">
        {data?.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer" className="group flex items-baseline justify-between gap-[1rem] border-b border-line py-[0.55rem]">
              <span className="min-w-0 truncate">
                <span className="text-[1.0625rem] font-[560] text-fg group-hover:text-accent-ink">{s.company}</span>
                <span className="ml-[0.6rem] text-[0.875rem] text-fg-3">{s.platform}</span>
              </span>
              <span className={cx('shrink-0 text-[0.875rem]', s.ok ? 'text-fg-2' : 'text-signal-ink')}>
                {s.ok ? `${s.jobs} ${s.jobs === 1 ? 'match' : 'matches'}` : 'Not reached'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

/* ------------------------------------------------------------------ where else to look */

/** Pre-filtered searches on sites that offer no public jobs API we can use; linked, never collected. */
const SITE_GROUPS: { label: string; sites: { name: string; search: string; href: string }[] }[] = [
  {
    label: 'Job boards',
    sites: [
      { name: 'LinkedIn', search: 'Retail data analyst, India, internship and entry level', href: 'https://www.linkedin.com/jobs/search/?keywords=retail%20data%20analyst&location=India&f_E=1%2C2' },
      { name: 'Indeed India', search: 'Data analyst fresher, India', href: 'https://in.indeed.com/jobs?q=data+analyst+fresher&l=India' },
      { name: 'Naukri', search: 'Data analyst, 0 years of experience', href: 'https://www.naukri.com/data-analyst-jobs?experience=0' },
      { name: 'Foundit', search: 'Data analyst, 0–1 years of experience', href: 'https://www.foundit.in/search/data-analyst-jobs?experienceRanges=0~1' },
      { name: 'Glassdoor', search: 'Data analyst, India', href: 'https://www.glassdoor.co.in/Job/india-data-analyst-jobs-SRCH_IL.0,5_IN115_KO6,18.htm' },
      { name: 'TimesJobs', search: 'Data analyst, India, 0 years of experience', href: 'https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&txtKeywords=data+analyst&txtLocation=India&cboWorkExp1=0' },
      { name: 'Shine', search: 'Data analyst jobs for freshers', href: 'https://www.shine.com/job-search/data-analyst-jobs-for-freshers' },
    ],
  },
  {
    label: 'Fresher and internship platforms',
    sites: [
      { name: 'Internshala', search: 'Data analytics internships', href: 'https://internshala.com/internships/data-analytics-internship/' },
      { name: 'Internshala', search: 'Fresher data analyst jobs', href: 'https://internshala.com/fresher-jobs/data-analyst-jobs/' },
      { name: 'Freshersworld', search: 'Data analyst jobs for engineering graduates', href: 'https://www.freshersworld.com/jobs/jobsearch/data-analyst-jobs-for-be-btech' },
      { name: 'apna', search: 'Data analyst jobs', href: 'https://apna.co/jobs/data-analyst-jobs' },
      { name: 'Unstop', search: 'Open data analyst jobs', href: 'https://unstop.com/job?oppstatus=open&searchTerm=data%20analyst' },
    ],
  },
  {
    label: 'Startup and tech boards',
    sites: [
      { name: 'Wellfound', search: 'Startup data analyst roles, India', href: 'https://wellfound.com/role/l/data-analyst/india' },
      { name: 'Instahyre', search: 'Data analyst jobs', href: 'https://www.instahyre.com/data-analyst-jobs/' },
      { name: 'Hirist', search: 'Data analyst jobs', href: 'https://www.hirist.tech/k/data-analyst-jobs' },
      { name: 'Jobaaj', search: 'Data analyst jobs', href: 'https://www.jobaaj.com/jobs/data-analyst-jobs' },
    ],
  },
]

export function JobsSites() {
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7rem] w-[62rem]">
        <SceneHead eyebrow="Job sites" title="Where else to look" size="title" />
        <Reveal delay={0.35} y={8} className="mt-[0.9rem] text-[1.125rem] leading-[1.45] text-fg-2">
          Each link opens a ready-made search for data analyst roles in India; the filter it applies is listed under the name. None of these sites offers a public jobs API we can use, so we link to them instead of copying their listings.
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
