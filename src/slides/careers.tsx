import { AnimatePresence, motion } from 'motion/react'
import { BarChart3, Clock, Cloud, Database, Layers, Radio, Workflow } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { AnimatedCounter, AnimatedHeadline, FlowDots, Highlight, Illustrative, Reveal, cx } from '../components/motion'
import { useSlide } from '../presentation/deck'
import { EASE } from '../presentation/transitions'
import { ChapterOpener, SceneHead } from './shared'

/* ------------------------------------------------------------------ 05 · opener */

const LADDER = ['Fundamentals', 'Analytics', 'Prediction', 'Scale', 'Business']

function Staircase() {
  const { step } = useSlide()
  const stepX = (i: number) => 30 + i * 118
  const stepY = (i: number) => 470 - i * 84
  const path = LADDER.map((_, i) => `${i ? 'L' : 'M'}${stepX(i) + 10} ${stepY(i)} L${stepX(i) + 108} ${stepY(i)}`).join(' ')
  return (
    <div className="relative mt-[3rem] h-[37rem] w-full">
      <svg viewBox="0 0 632 592" className="h-full w-full overflow-visible" aria-label="A staircase of five learning steps from fundamentals to business understanding">
        {LADDER.map((name, i) => (
          <motion.g key={name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.12, duration: 0.6, ease: EASE }}>
            <rect x={stepX(i)} y={stepY(i)} width={118} height={560 - stepY(i)} className={cx('transition-colors duration-500', step >= 1 ? (i === 4 ? 'fill-accent/40' : 'fill-bg-2') : 'fill-bg-2')} />
            <line x1={stepX(i)} x2={stepX(i) + 118} y1={stepY(i)} y2={stepY(i)} className="stroke-fg-2" strokeWidth={3} />
            <text x={stepX(i) + 6} y={stepY(i) - 16} fontSize={16} className={cx('transition-colors', step >= 1 ? 'fill-fg' : 'fill-fg-2')}>
              {name}
            </text>
            <text x={stepX(i) + 10} y={stepY(i) + 34} fontSize={14} className="fill-fg-3 font-mono">
              0{i + 1}
            </text>
          </motion.g>
        ))}
        <circle r={9} className="fill-signal stroke-bg" strokeWidth={3}>
          <animateMotion dur="5s" repeatCount="indefinite" path={path} begin="1.4s" />
        </circle>
      </svg>
    </div>
  )
}

export function CareersIntro() {
  const { step } = useSlide()
  return (
    <ChapterOpener
      number="05"
      label="Careers"
      title="What Should We Actually Learn?"
      first={<>We've seen what retailers do with data.</>}
      second={
        <>
          Now the question for us as MSc Big Data Analytics students is simple: <Highlight on={step >= 1} delay={0.5}>what do we actually need to learn</Highlight> if we want to work in this field?
        </>
      }
      visual={<Staircase />}
    />
  )
}

/* ------------------------------------------------------------------ foundation */

function SqlDemo() {
  const lines = ['SELECT store, SUM(sales) AS revenue', 'FROM orders', "WHERE month = '2026-09'", 'GROUP BY store', 'ORDER BY revenue DESC;']
  const rows = [
    ['Store 214', '₹18.2 L'],
    ['Store 108', '₹15.6 L'],
    ['Store 331', '₹12.9 L'],
  ]
  return (
    <div className="space-y-[0.9rem]">
      <div className="rounded-[0.8rem] border border-line-2 bg-bg-2 p-[0.9rem] font-mono text-[0.875rem] leading-[1.6] text-fg">
        {lines.map((l, i) => (
          <motion.div key={l} initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }} transition={{ delay: 0.9 + i * 0.28, duration: 0.35, ease: 'linear' }}>
            {l}
          </motion.div>
        ))}
      </div>
      <div className="text-[0.9375rem]">
        {rows.map(([a, b], i) => (
          <motion.div key={a} className="flex justify-between border-b border-line py-[0.35rem]" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 + i * 0.12 }}>
            <span className="text-fg-2">{a}</span>
            <span className="font-mono text-fg">{b}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function StatsDemo() {
  const pts = [52, 55, 49, 53, 57, 50, 54, 51, 56, 53, 50, 71, 54, 52]
  const mean = 53
  const y = (v: number) => 120 - (v - 40) * 3.2
  return (
    <div>
      <svg viewBox="0 0 300 140" className="w-full overflow-visible" aria-label="Daily sales inside a normal band, with one day far above it">
        <rect x={0} y={y(mean + 6)} width={300} height={y(mean - 6) - y(mean + 6)} className="fill-accent/12" />
        <line x1={0} x2={300} y1={y(mean)} y2={y(mean)} className="stroke-accent" strokeDasharray="5 5" />
        {pts.map((v, i) => (
          <motion.circle key={i} cx={12 + i * 21} cy={y(v)} r={i === 11 ? 7 : 5} className={i === 11 ? 'fill-signal' : 'fill-fg-2'} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.07 }} />
        ))}
        <motion.text x={230} y={y(71) + 5} textAnchor="end" fontSize={13} className="fill-signal-ink font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
          real change?
        </motion.text>
      </svg>
      <div className="mt-[0.5rem] text-[0.9375rem] leading-[1.4] text-fg-3">The shaded band is normal day-to-day noise. Only the orange day stands out.</div>
    </div>
  )
}

function ExcelDemo() {
  const cols = ['A', 'B', 'C']
  const data = [
    ['Category', 'Units', 'Revenue'],
    ['Shoes', '420', '₹21.0 L'],
    ['Socks', '980', '₹2.9 L'],
    ['Shoes', '310', '₹15.5 L'],
  ]
  return (
    <div className="overflow-hidden rounded-[0.8rem] border border-line-2 bg-surface font-mono text-[0.8125rem]">
      <div className="flex items-center gap-[0.5rem] border-b border-line-2 px-[0.6rem] py-[0.4rem] text-fg-2">
        <span className="italic text-fg-3">fx</span> =SUMIFS(C:C, A:A, "Shoes")
      </div>
      <div className="grid grid-cols-[2rem_1fr_1fr_1fr]">
        <span className="border-b border-r border-line bg-bg-2" />
        {cols.map((c) => (
          <span key={c} className="border-b border-r border-line bg-bg-2 px-[0.4rem] py-[0.2rem] text-center text-fg-3">
            {c}
          </span>
        ))}
        {data.map((r, i) => (
          <div key={i} className="contents">
            <span className="border-b border-r border-line bg-bg-2 py-[0.2rem] text-center text-fg-3">{i + 1}</span>
            {r.map((c, k) => (
              <motion.span key={k} className={cx('border-b border-r border-line px-[0.4rem] py-[0.2rem]', i === 0 ? 'text-fg-3' : 'text-fg')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.12 + k * 0.04 }}>
                {c}
              </motion.span>
            ))}
          </div>
        ))}
        <span className="bg-bg-2 py-[0.25rem] text-center text-fg-3">5</span>
        <span className="col-span-2 px-[0.4rem] py-[0.25rem] text-fg-3">Shoes revenue</span>
        <motion.span className="bg-accent-wash px-[0.4rem] py-[0.25rem] font-semibold text-accent-ink" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          ₹<AnimatedCounter value={36.5} delay={2} format={(v) => `${v.toFixed(1)} L`} />
        </motion.span>
      </div>
    </div>
  )
}

const FOUNDATION: { name: string; line: string; demo: ReactNode }[] = [
  { name: 'SQL', line: 'Retrieve and analyse business data.', demo: <SqlDemo /> },
  { name: 'Statistics', line: 'Distinguish real patterns from random variation.', demo: <StatsDemo /> },
  { name: 'Excel', line: 'Support operational and business analysis.', demo: <ExcelDemo /> },
]

export function CareersFoundation() {
  const [focus, setFocus] = useState<number | null>(null)
  return (
    <div className="stage">
      <SceneHead title="Start with the fundamentals" size="display-sm" className="absolute left-[5.5rem] top-[7.5rem]" />
      <div className="absolute bottom-[7rem] left-[5.5rem] right-[5.5rem] top-[15.5rem] grid grid-cols-3 gap-[2rem]">
        {FOUNDATION.map((f, i) => (
          <motion.div
            key={f.name}
            tabIndex={0}
            onMouseEnter={() => setFocus(i)}
            onMouseLeave={() => setFocus(null)}
            onFocus={() => setFocus(i)}
            onBlur={() => setFocus(null)}
            className="flex flex-col border-t-2 border-fg pt-[1.25rem] outline-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: focus === null || focus === i ? 1 : 0.45, y: 0 }}
            transition={{ opacity: { duration: 0.3 }, y: { delay: 0.4 + i * 0.2, duration: 0.7, ease: EASE } }}
          >
            <div className="text-[4.5rem] font-[650] leading-[0.9] tracking-[-0.05em] text-fg">{f.name}</div>
            <div className="mt-[0.9rem] min-h-[3.75rem] text-[1.375rem] leading-[1.35] text-fg-2">{f.line}</div>
            <div className="mt-[1.25rem]">{f.demo}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ analytics: python + BI */

const PY: { label: string; code: string; viz: ReactNode }[] = [
  {
    label: 'Data cleaning',
    code: 'df.dropna().drop_duplicates()',
    viz: (
      <svg viewBox="0 0 120 40" className="h-[2.5rem] w-[7.5rem]" aria-hidden>
        {[0, 1, 2, 3, 4].map((k) => (
          <motion.rect key={k} x={k * 24} y={10} width={18} height={20} rx={3} className={k === 1 || k === 3 ? 'fill-neg/70' : 'fill-fg-3'} initial={{ opacity: 1 }} animate={{ opacity: k === 1 || k === 3 ? 0.15 : 1 }} transition={{ delay: 1.6, duration: 0.5 }} />
        ))}
      </svg>
    ),
  },
  {
    label: 'Exploratory analysis',
    code: 'df.groupby("region").sales.describe()',
    viz: (
      <svg viewBox="0 0 120 40" className="h-[2.5rem] w-[7.5rem]" aria-hidden>
        {[10, 22, 34, 28, 16, 8].map((h, k) => (
          <motion.rect key={k} x={k * 20} width={14} rx={2} className="fill-accent" initial={{ y: 40, height: 0 }} animate={{ y: 40 - h, height: h }} transition={{ delay: 1.9 + k * 0.06, duration: 0.4 }} />
        ))}
      </svg>
    ),
  },
  {
    label: 'Automation',
    code: 'schedule.every().monday.do(send_report)',
    viz: (
      <div className="flex items-center gap-[0.4rem] font-mono text-[0.8125rem] text-fg-2">
        <Clock className="h-[1.2rem] w-[1.2rem] text-accent" /> Mon 09:00
      </div>
    ),
  },
  {
    label: 'Machine learning',
    code: 'model.fit(X_train, y_train)',
    viz: (
      <svg viewBox="0 0 120 40" className="h-[2.5rem] w-[7.5rem]" aria-hidden>
        {[
          [8, 32], [22, 27], [36, 28], [50, 20], [64, 22], [78, 14], [92, 12], [106, 6],
        ].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r={2.8} className="fill-fg-3" />
        ))}
        <motion.path d="M4 34 L114 5" className="stroke-accent" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.4, duration: 0.7 }} />
      </svg>
    ),
  },
]

export function CareersAnalytics() {
  return (
    <div className="stage">
      <SceneHead title="Turn data into insight" size="display-sm" className="absolute left-[5.5rem] top-[7.5rem]" />

      <div className="absolute left-[5.5rem] top-[15.75rem] w-[42rem]">
        <div className="flex items-baseline justify-between">
          <span className="text-[2.25rem] font-[640] tracking-[-0.04em] text-fg">Python</span>
          <span className="t-label">from messy data to models</span>
        </div>
        <div className="mt-[0.75rem]">
          {PY.map((p, i) => (
            <motion.div key={p.label} className="grid grid-cols-[1fr_auto] items-center gap-[1rem] border-t border-line py-[0.9rem]" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.25, duration: 0.6, ease: EASE }}>
              <div className="min-w-0">
                <div className="text-[1.1875rem] font-[560] text-fg">{p.label}</div>
                <code className="mt-[0.2rem] block truncate font-mono text-[0.9375rem] text-accent-ink">{p.code}</code>
              </div>
              {p.viz}
            </motion.div>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <path d="M770 470 C820 470 830 470 880 470" fill="none" className="stroke-line-2" strokeWidth={2} />
        <FlowDots path="M770 470 L880 470" count={3} dur={1.2} begin={2.6} r={5} />
      </svg>

      <motion.div className="panel absolute left-[56rem] right-[5.5rem] top-[15.75rem] p-[1.25rem]" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8, ease: EASE }}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-[0.6rem] text-[1.125rem] font-[580] text-fg">
            <BarChart3 className="h-[1.2rem] w-[1.2rem] text-accent" /> Weekly sales review
          </span>
          <span className="t-label">Power BI / Tableau</span>
        </div>
        <div className="mt-[1rem] grid grid-cols-3 gap-[0.75rem]">
          {[
            ['Revenue', '₹4.2 Cr', '+6%'],
            ['Orders', '18.4k', '+3%'],
            ['Avg. basket', '₹2,280', '−1%'],
          ].map(([k, v, d], i) => (
            <motion.div key={k} className="rounded-[0.8rem] bg-bg-2 p-[0.8rem]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 + i * 0.1 }}>
              <div className="t-label !text-[0.75rem]">{k}</div>
              <div className="text-[1.5rem] font-[620] tracking-[-0.03em] text-fg">{v}</div>
              <div className={cx('font-mono text-[0.8125rem]', d.startsWith('−') ? 'text-neg' : 'text-accent-ink')}>{d} vs last week</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-[1rem] grid grid-cols-[1fr_1.3fr] gap-[1rem]">
          <div>
            <div className="t-label mb-[0.4rem] !text-[0.75rem]">Revenue by region</div>
            {[
              ['North', 82],
              ['West', 100],
              ['South', 71],
              ['East', 46],
            ].map(([r, v], i) => (
              <div key={r} className="mt-[0.35rem] flex items-center gap-[0.5rem] text-[0.8125rem] text-fg-2">
                <span className="w-[2.75rem]">{r}</span>
                <motion.span className="h-[0.6rem] rounded-r-[3px] bg-fg-2" initial={{ width: 0 }} animate={{ width: `${(Number(v) / 100) * 9}rem` }} transition={{ delay: 1.8 + i * 0.08, duration: 0.6, ease: EASE }} />
              </div>
            ))}
          </div>
          <div>
            <div className="t-label mb-[0.4rem] !text-[0.75rem]">Weekly trend</div>
            <svg viewBox="0 0 200 80" className="w-full" aria-hidden>
              <line x1={0} x2={200} y1={76} y2={76} className="stroke-line" />
              <motion.path d="M0 60 L25 56 L50 58 L75 46 L100 48 L125 38 L150 34 L175 26 L200 22" fill="none" className="stroke-accent" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2, duration: 1 }} />
            </svg>
          </div>
        </div>
      </motion.div>
      <Reveal delay={2.4} className="absolute left-[56rem] right-[5.5rem] top-[39.75rem] text-[1.25rem] leading-[1.4] text-fg-2">
        Power BI and Tableau communicate the analysis so business teams can understand it and act on it.
      </Reveal>
      <Illustrative className="absolute bottom-[6.6rem] right-[5.5rem]">Illustrative dashboard</Illustrative>
    </div>
  )
}

/* ------------------------------------------------------------------ advanced analytics */

function Forecasting({ run }: { run: number }) {
  return (
    <svg key={run} viewBox="0 0 240 120" className="w-full" aria-hidden>
      <line x1={0} x2={240} y1={110} y2={110} className="stroke-line" />
      <motion.path d="M0 90 L30 84 L60 88 L90 70 L120 66" fill="none" className="stroke-fg-2" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
      <motion.path d="M120 66 L240 30 L240 70 Z" className="fill-accent/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
      <motion.path d="M120 66 L240 48" fill="none" className="stroke-accent" strokeWidth={2.5} strokeDasharray="6 5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
    </svg>
  )
}
function Classification({ run }: { run: number }) {
  const a = [[30, 30], [50, 50], [40, 80], [70, 30], [80, 70], [60, 95]]
  const b = [[150, 40], [180, 60], [170, 90], [200, 30], [210, 80], [140, 85]]
  return (
    <svg key={run} viewBox="0 0 240 120" className="w-full" aria-hidden>
      <motion.path d="M118 0 C 110 40 130 80 112 120" fill="none" className="stroke-fg" strokeWidth={2} strokeDasharray="5 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.6 }} />
      {a.map(([x, y], k) => (
        <motion.circle key={`a${k}`} cx={x} cy={y} r={7} className="fill-accent" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: k * 0.05 }} />
      ))}
      {b.map(([x, y], k) => (
        <motion.rect key={`b${k}`} x={x - 6} y={y - 6} width={12} height={12} rx={2} className="fill-signal" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + k * 0.05 }} />
      ))}
    </svg>
  )
}
function Clustering({ run }: { run: number }) {
  const centers = [
    [50, 40],
    [180, 35],
    [120, 92],
  ]
  return (
    <svg key={run} viewBox="0 0 240 120" className="w-full" aria-hidden>
      {Array.from({ length: 18 }, (_, k) => {
        const c = centers[k % 3]
        const ang = k * 2.4
        const r = 10 + (k % 4) * 5
        return (
          <motion.circle
            key={k}
            r={5}
            className={['fill-accent', 'fill-signal', 'fill-fg-2'][k % 3]}
            initial={{ cx: 20 + ((k * 53) % 200), cy: 15 + ((k * 31) % 90) }}
            animate={{ cx: c[0] + Math.cos(ang) * r, cy: c[1] + Math.sin(ang) * r * 0.7 }}
            transition={{ delay: 0.4, duration: 1, ease: EASE }}
          />
        )
      })}
    </svg>
  )
}
function Recommending({ run }: { run: number }) {
  return (
    <svg key={run} viewBox="0 0 240 120" className="w-full" aria-hidden>
      {[25, 60, 95].map((y, k) => (
        <circle key={`l${k}`} cx={40} cy={y} r={11} className="fill-fg-3" />
      ))}
      {[25, 60, 95].map((y, k) => (
        <rect key={`r${k}`} x={190} y={y - 11} width={22} height={22} rx={5} className={k === 1 ? 'fill-accent' : 'fill-line-2'} />
      ))}
      {[
        [25, 25],
        [25, 60],
        [60, 60],
        [95, 95],
        [60, 25],
      ].map(([a, b], k) => (
        <motion.line key={k} x1={51} y1={a} x2={190} y2={b} className={b === 60 ? 'stroke-accent' : 'stroke-line-2'} strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 + k * 0.12, duration: 0.5 }} />
      ))}
    </svg>
  )
}

const TECHNIQUES = [
  { name: 'Forecasting', what: 'Estimates future values from past patterns.', q: 'How many umbrellas will we sell next week?', Viz: Forecasting },
  { name: 'Classification', what: 'Sorts each case into a category.', q: 'Is this customer likely to leave?', Viz: Classification },
  { name: 'Clustering', what: 'Groups similar records without labels.', q: 'Which shoppers behave alike?', Viz: Clustering },
  { name: 'Recommendation systems', what: 'Suggests items from learned preferences.', q: 'What should we show this customer next?', Viz: Recommending },
]

export function CareersAdvanced() {
  const [runs, setRuns] = useState([0, 0, 0, 0])
  return (
    <div className="stage">
      <SceneHead title="Learn to predict" size="display-sm" className="absolute left-[5.5rem] top-[7.5rem]" />
      <Reveal delay={0.4} className="t-lead absolute left-[5.5rem] top-[12.5rem] !text-[1.375rem]">
        Four families of techniques cover most retail prediction problems. Point at one to replay it.
      </Reveal>
      <div className="absolute bottom-[7rem] left-[5.5rem] right-[5.5rem] top-[18rem] grid grid-cols-4 gap-[1.5rem]">
        {TECHNIQUES.map((t, i) => (
          <motion.div
            key={t.name}
            className="flex flex-col border-t-2 border-fg pt-[1.25rem]"
            onMouseEnter={() => setRuns((r) => r.map((v, k) => (k === i ? v + 1 : v)))}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.15, duration: 0.7, ease: EASE }}
          >
            <div className="text-[1.75rem] font-[620] leading-[1.05] tracking-[-0.03em] text-fg">{t.name}</div>
            <div className="mt-[0.6rem] min-h-[3.4rem] text-[1.125rem] leading-[1.4] text-fg-2">{t.what}</div>
            <div className="mt-[1rem] rounded-[1rem] bg-bg-2 p-[1rem]">
              <t.Viz run={runs[i]} />
            </div>
            <div className="mt-auto min-h-[6rem] rounded-[0.9rem] border border-line p-[0.9rem]">
              <div className="t-label !text-[0.75rem]">In retail</div>
              <div className="mt-[0.25rem] text-[1.0625rem] leading-[1.35] text-fg">{t.q}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ big data */

const PIPE = [
  { name: 'ETL', note: 'extract, clean, load', Icon: Workflow },
  { name: 'Data Warehouse', note: 'structured history', Icon: Database },
  { name: 'Spark', note: 'parallel processing', Icon: Layers },
  { name: 'Cloud', note: 'elastic compute & storage', Icon: Cloud },
  { name: 'Streaming', note: 'events as they happen', Icon: Radio },
]
const VS = [
  { name: 'Volume', scale: ['GB', 'TB', 'PB'] },
  { name: 'Velocity', scale: ['daily batch', 'hourly', 'real time'] },
  { name: 'Variety', scale: ['tables', 'clicks & logs', 'images & text'] },
]

export function CareersBigData() {
  const xs = [150, 450, 800, 1130, 1420]
  const Y = 470
  const lanes = [-36, -12, 12, 36]
  return (
    <div className="stage">
      <SceneHead title="Build for scale" size="display-sm" className="absolute left-[5.5rem] top-[7.5rem]" />
      <Reveal delay={0.4} className="t-lead absolute left-[5.5rem] top-[12.5rem] max-w-[60rem] !text-[1.375rem]">
        These tools help organisations handle larger volumes, higher velocity and more complex data workflows.
      </Reveal>
      <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <motion.path d={`M60 ${Y} L${xs[2] - 90} ${Y}`} className="stroke-line-2" strokeWidth={4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.8 }} />
        {lanes.map((dy, k) => (
          <g key={k}>
            <motion.path d={`M${xs[2] - 90} ${Y} C${xs[2] - 50} ${Y} ${xs[2] - 50} ${Y + dy} ${xs[2]} ${Y + dy} L${xs[2] + 60} ${Y + dy} C${xs[2] + 110} ${Y + dy} ${xs[2] + 110} ${Y} ${xs[2] + 150} ${Y}`} fill="none" className="stroke-line-2" strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2 + k * 0.08, duration: 0.8 }} />
            <FlowDots
              path={`M${xs[2] - 90} ${Y} C${xs[2] - 50} ${Y} ${xs[2] - 50} ${Y + dy} ${xs[2]} ${Y + dy} L${xs[2] + 60} ${Y + dy} C${xs[2] + 110} ${Y + dy} ${xs[2] + 110} ${Y} ${xs[2] + 150} ${Y}`}
              count={3}
              dur={1.6}
              begin={2 + k * 0.2}
              r={5}
              className="fill-accent"
            />
          </g>
        ))}
        <motion.path d={`M${xs[2] + 150} ${Y} L1540 ${Y}`} className="stroke-line-2" strokeWidth={4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.8, duration: 0.8 }} />
        <FlowDots path={`M60 ${Y} L${xs[2] - 90} ${Y}`} count={6} dur={2.4} begin={1.4} r={5} className="fill-signal" />
        <FlowDots path={`M${xs[2] + 150} ${Y} L1540 ${Y}`} count={10} dur={2} begin={2.4} r={5} className="fill-accent" />
      </svg>
      {PIPE.map(({ name, note, Icon }, i) => (
        <motion.div
          key={name}
          className="absolute flex w-[13rem] -translate-x-1/2 flex-col items-center text-center"
          style={{ left: `${xs[i] / 16}rem`, top: `${(Y - 34) / 16}rem` }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.18, duration: 0.6, ease: EASE }}
        >
          <span className={cx('grid h-[4.25rem] w-[4.25rem] place-items-center rounded-[1.1rem] border-2 bg-surface', i === 2 ? 'border-accent' : 'border-fg')}>
            <Icon className="h-[1.75rem] w-[1.75rem] text-fg" />
          </span>
          <span className="mt-[0.9rem] text-[1.375rem] font-[600] tracking-[-0.02em] text-fg">{name}</span>
          <span className="text-[0.9375rem] text-fg-3">{note}</span>
        </motion.div>
      ))}
      <div className="absolute bottom-[7rem] left-[5.5rem] right-[5.5rem] grid grid-cols-3 gap-[2rem]">
        {VS.map((v, i) => (
          <motion.div key={v.name} className="border-t border-line pt-[0.9rem]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 + i * 0.12 }}>
            <div className="text-[1.25rem] font-[600] text-fg">{v.name}</div>
            <div className="relative mt-[0.8rem] h-[0.4rem] rounded-full bg-line">
              <motion.span className="absolute top-1/2 h-[1.1rem] w-[1.1rem] -translate-y-1/2 rounded-full bg-accent ring-4 ring-bg" initial={{ left: '0%' }} animate={{ left: 'calc(100% - 1.1rem)' }} transition={{ delay: 2.4 + i * 0.12, duration: 1.6, ease: EASE }} />
            </div>
            <div className="mt-[0.5rem] flex justify-between font-mono text-[0.875rem] text-fg-3">
              {v.scale.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ understand the business */

const DOMAINS = ['Pricing', 'Inventory', 'Customer Behaviour', 'Sales', 'Supply Chain']
const QUESTIONS = [
  { q: 'Why are sales falling?', d: ['Sales', 'Pricing', 'Customer Behaviour'] },
  { q: 'How much inventory do we need?', d: ['Inventory', 'Supply Chain', 'Sales'] },
  { q: 'Which customers might leave?', d: ['Customer Behaviour'] },
  { q: 'What should we recommend?', d: ['Customer Behaviour', 'Sales'] },
]

export function CareersBusiness() {
  const { step } = useSlide()
  const current = step >= 1 ? QUESTIONS[step - 1] : null
  return (
    <div className="stage">
      <SceneHead eyebrow="The part people forget" title="Understand the business" size="display-sm" className="absolute left-[5.5rem] top-[7.25rem]" />
      <div className="absolute left-[5.5rem] right-[5.5rem] top-[17.25rem] flex flex-wrap gap-x-[2.25rem] gap-y-[0.5rem]">
        {DOMAINS.map((d, i) => {
          const on = current?.d.includes(d) ?? false
          return (
            <motion.span
              key={d}
              className={cx('relative text-[2.25rem] font-[580] tracking-[-0.03em] transition-colors duration-500', on ? 'text-accent' : step === 0 ? 'text-fg' : 'text-fg-3/60')}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: EASE }}
            >
              {d}
              <motion.span className="absolute -bottom-[0.3rem] left-0 h-[3px] w-full origin-left rounded-full bg-accent" initial={false} animate={{ scaleX: on ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }} />
            </motion.span>
          )
        })}
      </div>

      <div className="absolute left-[5.5rem] top-[25.5rem] w-[58rem]">
        <AnimatePresence mode="wait" initial={false}>
          {current ? (
            <motion.div key={current.q} initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: EASE }}>
              <div className="t-label">Question {step} of 4</div>
              <div className="mt-[0.6rem] text-[5rem] font-[640] leading-[0.98] tracking-[-0.05em] text-fg">“{current.q}”</div>
            </motion.div>
          ) : (
            <motion.div key="intro" className="max-w-[48rem] text-[1.75rem] leading-[1.4] text-fg-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: 1.1 }}>
              Tools answer questions. Knowing which question matters comes from understanding how a retailer makes money.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute right-[5.5rem] top-[25.75rem] w-[24rem]">
        <div className="t-label mb-[0.6rem]">{step > 1 ? 'Asked so far' : ''}</div>
        <AnimatePresence initial={false}>
          {QUESTIONS.slice(0, Math.max(0, step - 1)).map((q) => (
            <motion.div key={q.q} layout className="border-t border-line py-[0.7rem] text-[1.125rem] text-fg-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              {q.q}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ final closing */

const CHAIN = ['Business problem', 'Data', 'Analytical method', 'Decision']

export function CareersClosing() {
  const xs = [190, 590, 990, 1390]
  const Y = 680
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] right-[5.5rem] top-[8.5rem]">
        <AnimatedHeadline as="h2" text={['The best analyst connects', 'data to decisions.']} delay={0.3} stagger={0.08} className="text-[5.25rem] font-[640] uppercase leading-[0.92] tracking-[-0.05em] text-fg" />
        <Reveal delay={1.2} className="mt-[2rem] max-w-[62rem] text-[1.5rem] leading-[1.45] text-fg-2">
          “The strongest Retail Analytics candidate isn't the person who knows the most tools. It's the person who can connect a business problem to data, choose the right analytical method, and turn the result into a decision.”
        </Reveal>
      </div>
      <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <motion.path d={`M${xs[0]} ${Y} L${xs[3]} ${Y}`} className="stroke-fg-3" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2, duration: 2.2, ease: 'easeInOut' }} />
        <FlowDots path={`M${xs[0]} ${Y} L${xs[3]} ${Y}`} count={3} dur={3} begin={4.3} r={5} className="fill-signal" />
      </svg>
      {CHAIN.map((c, i) => {
        const last = i === CHAIN.length - 1
        return (
          <motion.div
            key={c}
            className="absolute flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${xs[i] / 16}rem`, top: `${(Y - 18) / 16}rem` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 + i * 0.7, duration: 0.5, ease: EASE }}
          >
            <span className={cx('block rounded-full', last ? 'h-[2.25rem] w-[2.25rem] bg-accent shadow-[0_0_0_10px_rgba(93,179,134,0.15)]' : 'h-[2.25rem] w-[2.25rem] border-[3px] border-fg bg-bg')} />
            <span className={cx('mt-[0.9rem] whitespace-nowrap text-[1.375rem] tracking-[-0.015em]', last ? 'font-[640] text-accent' : 'font-[560] text-fg')}>{c}</span>
          </motion.div>
        )
      })}
    </div>
  )
}
