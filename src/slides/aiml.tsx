import { AnimatePresence, motion, usePresenceData } from 'motion/react'
import { CalendarDays, CloudRain, History, Percent, Tag, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AnimatedCounter, AnimatedHeadline, FlowDots, Highlight, Illustrative, Img, Reveal, cx } from '../components/motion'
import { useSlide } from '../presentation/deck'
import { EASE, type TransitionCustom } from '../presentation/transitions'
import { ChapterOpener } from './shared'

const fmt = (v: number) => Math.round(v).toLocaleString('en-IN')

/* ------------------------------------------------------------------ 03 · opener */

const YEAR = [7400, 7900, 8600, 9300, 8800, 8200, 7900, 8300, 8900, 9600, 9200, 10000]

function LastMonthNextMonth() {
  const { step } = useSlide()
  const ask = step >= 1
  const W = 632
  const base = 470
  const bw = 26
  const slot = 37
  const h = (v: number) => (v / 12000) * 330
  const lastX = 20 + 11 * slot
  const nextX = lastX + 120
  return (
    <div className="relative mt-[3rem] h-[36rem] w-full">
      <svg viewBox={`0 0 ${W} 576`} className="h-full w-full overflow-visible" aria-label="Twelve months of sales ending at 10,000 units last month, and an unknown next month">
        <line x1={0} x2={W} y1={base + 0.5} y2={base + 0.5} className="stroke-line-2" />
        {YEAR.map((v, i) => {
          const last = i === YEAR.length - 1
          return (
            <motion.rect
              key={i}
              x={20 + i * slot}
              width={bw}
              rx={4}
              className={last ? 'fill-fg' : 'fill-mute'}
              initial={{ y: base, height: 0 }}
              animate={{ y: base - h(v), height: h(v) }}
              transition={{ duration: 0.8, delay: 0.7 + i * 0.05, ease: EASE }}
            />
          )
        })}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
          <text x={lastX + bw / 2} y={base - h(10000) - 52} textAnchor="end" fontSize={15} className="fill-fg-3 font-mono">
            last month
          </text>
          <text x={lastX + bw / 2} y={base - h(10000) - 20} textAnchor="end" fontSize={30} className="fill-fg font-semibold">
            10,000 sold
          </text>
        </motion.g>
        <motion.rect
          x={nextX}
          y={base - 330}
          width={bw + 10}
          height={330}
          rx={6}
          fill="none"
          className="stroke-fg-3"
          strokeWidth={2}
          strokeDasharray="6 7"
          initial={{ opacity: 0 }}
          animate={{ opacity: ask ? 0.25 : 1 }}
          transition={{ delay: ask ? 0 : 2, duration: 0.5 }}
        />
        <motion.text x={nextX + (bw + 10) / 2} y={base - 150} textAnchor="middle" fontSize={64} className="fill-signal font-semibold" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: ask ? 0 : 1, scale: 1 }} transition={{ delay: ask ? 0 : 2.2, duration: 0.5 }}>
          ?
        </motion.text>
        {/* the question turns into a range of likely outcomes */}
        <motion.path
          d={`M${lastX + bw / 2} ${base - h(10000)} L${nextX + 20} ${base - h(11800)} L${nextX + 20} ${base - h(9100)} Z`}
          className="fill-accent/20"
          initial={false}
          animate={{ opacity: ask ? 1 : 0 }}
          transition={{ duration: 0.6, delay: ask ? 0.5 : 0 }}
        />
        <motion.path
          d={`M${lastX + bw / 2} ${base - h(10000)} L${nextX + 20} ${base - h(10500)}`}
          className="stroke-accent"
          strokeWidth={2.5}
          strokeDasharray="7 6"
          fill="none"
          initial={false}
          animate={{ opacity: ask ? 1 : 0 }}
          transition={{ duration: 0.6, delay: ask ? 0.7 : 0 }}
        />
        <motion.g initial={false} animate={{ opacity: ask ? 1 : 0 }} transition={{ delay: ask ? 0.9 : 0 }}>
          <circle cx={nextX + 20} cy={base - h(10500)} r={6} className="fill-accent stroke-bg" strokeWidth={3} />
          <text x={W} y={base + 32} textAnchor="end" fontSize={15} className="fill-accent-ink font-mono">
            next month: likely range
          </text>
        </motion.g>
        <text x={20} y={base + 32} fontSize={15} className="fill-fg-3 font-mono">
          a year ago
        </text>
      </svg>
    </div>
  )
}

export function AimlIntro() {
  const { step } = useSlide()
  return (
    <ChapterOpener
      number="03"
      label="AI/ML"
      title="From What Happened? to What Happens Next?"
      titleSize={4.25}
      first={<>A traditional report can tell a retailer that 10,000 products were sold last month.</>}
      second={
        <>
          Machine learning asks a much more valuable question: <Highlight on={step >= 1} delay={0.5}>how many are we likely to sell next month?</Highlight>
        </>
      }
      visual={<LastMonthNextMonth />}
    >
      <motion.div className="pointer-events-none absolute left-0 right-0 top-[47.5rem] h-px origin-left bg-accent/50" initial={{ scaleX: 0 }} animate={{ scaleX: 1, opacity: [1, 1, 0] }} transition={{ duration: 1.6, ease: EASE }} />
    </ChapterOpener>
  )
}

/* ------------------------------------------------------------------ reporting vs prediction */

const HIST = [7400, 7900, 8600, 9300, 10100, 9500, 8700, 8200, 7900, 8300, 8900, 9600, 10400, 11200, 10500, 9700, 9400, 10000]
const FORE = [10500, 11300, 12000, 11400, 10700, 10300]
const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']

export function AimlReportVsPredict() {
  const { step } = useSlide()
  const next = step >= 1
  const [hover, setHover] = useState<number | null>(null)
  const X0 = 88
  const slot = 40
  const base = 720
  const top = 380
  const y = (v: number) => base - ((v - 5000) / 8000) * (base - top)
  const cx_ = (i: number) => X0 + 20 + i * slot
  const todayX = cx_(HIST.length - 1) + 30
  const fx = (k: number) => todayX + 50 + k * 120
  const band = (k: number) => 350 + k * 170
  const line = HIST.map((v, i) => `${i ? 'L' : 'M'}${cx_(i)} ${y(v)}`).join(' ')
  const fline = `M${cx_(HIST.length - 1)} ${y(HIST[HIST.length - 1])} ` + FORE.map((v, k) => `L${fx(k)} ${y(v)}`).join(' ')
  const area =
    `M${cx_(HIST.length - 1)} ${y(HIST[HIST.length - 1])} ` +
    FORE.map((v, k) => `L${fx(k)} ${y(v + band(k))}`).join(' ') +
    ' ' +
    [...FORE.keys()].reverse().map((k) => `L${fx(k)} ${y(FORE[k] - band(k))}`).join(' ') +
    ' Z'
  const tip =
    hover == null
      ? null
      : hover < HIST.length
        ? { x: cx_(hover), y: y(HIST[hover]), t: `${MONTHS[hover]} · actual`, v: `${fmt(HIST[hover])} units` }
        : { x: fx(hover - HIST.length), y: y(FORE[hover - HIST.length]), t: `${MONTHS[hover]} · forecast`, v: `${fmt(FORE[hover - HIST.length])} (${fmt(FORE[hover - HIST.length] - band(hover - HIST.length))}–${fmt(FORE[hover - HIST.length] + band(hover - HIST.length))})` }
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7.5rem] w-[40rem]">
        <AnimatedHeadline as="h2" text="What happened?" className="t-display-sm text-fg" />
        <Reveal delay={0.5} className="t-lead mt-[0.9rem] !text-[1.375rem]">
          Reporting summarises the past: what sold, where and when.
        </Reveal>
      </div>
      <motion.div className="absolute left-[54rem] top-[7.5rem] w-[40.5rem]" initial={false} animate={{ opacity: next ? 1 : 0.22 }} transition={{ duration: 0.6 }}>
        <div className="t-display-sm text-accent">What happens next?</div>
        <div className="t-lead mt-[0.9rem] !text-[1.375rem]">Prediction estimates the future, with an honest range of uncertainty.</div>
      </motion.div>

      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" aria-label="Eighteen months of monthly sales, then a six-month forecast with a widening uncertainty band">
        {[6000, 8000, 10000, 12000].map((g) => (
          <g key={g}>
            <line x1={X0} x2={1512} y1={y(g)} y2={y(g)} className="stroke-line" />
            <text x={1512} y={y(g) - 6} textAnchor="end" fontSize={14} className="fill-fg-3 font-mono tnum">
              {g / 1000}k
            </text>
          </g>
        ))}
        <line x1={X0} x2={1512} y1={base} y2={base} className="stroke-line-2" />
        {HIST.map((v, i) => (
          <motion.rect
            key={i}
            x={cx_(i) - 11}
            width={22}
            rx={4}
            className={cx('transition-[fill] duration-500', next ? 'fill-line-2' : hover === i ? 'fill-fg' : 'fill-fg-3')}
            initial={{ y: base, height: 0 }}
            animate={{ y: y(v), height: base - y(v) }}
            transition={{ duration: 0.8, delay: 0.4 + i * 0.04, ease: EASE }}
          />
        ))}
        <motion.line x1={todayX} x2={todayX} y1={top - 20} y2={base} className="stroke-fg" strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 0.6 }} />
        <text x={todayX} y={top - 30} textAnchor="middle" fontSize={15} className="fill-fg font-mono">
          today
        </text>
        {[0, 6, 12, 17].map((i) => (
          <text key={i} x={cx_(i)} y={base + 34} textAnchor="middle" fontSize={14} className="fill-fg-3 font-mono">
            {MONTHS[i]}
          </text>
        ))}
        <motion.path d={line} fill="none" className="stroke-fg" strokeWidth={2.5} strokeLinejoin="round" initial={false} animate={{ pathLength: next ? 1 : 0, opacity: next ? 1 : 0 }} transition={{ duration: 1.1, ease: EASE }} />
        {HIST.map((v, i) => (
          <motion.circle key={i} cx={cx_(i)} cy={y(v)} r={4.5} className="fill-fg stroke-bg" strokeWidth={2} initial={false} animate={{ opacity: next ? 1 : 0 }} transition={{ delay: next ? 0.02 * i : 0 }} />
        ))}
        <defs>
          <clipPath id="future-reveal">
            <motion.rect x={todayX - 40} y={0} height={900} initial={false} animate={{ width: next ? 760 : 0 }} transition={{ duration: 1.3, delay: next ? 1 : 0, ease: EASE }} />
          </clipPath>
        </defs>
        <g clipPath="url(#future-reveal)">
          <path d={area} className="fill-accent/15" />
          <path d={fline} fill="none" className="stroke-accent" strokeWidth={3} strokeDasharray="9 7" strokeLinejoin="round" />
          {FORE.map((v, k) => (
            <circle key={k} cx={fx(k)} cy={y(v)} r={5} className="fill-accent stroke-bg" strokeWidth={2} />
          ))}
        </g>
        {/* hit targets */}
        {[...HIST.map((_, i) => cx_(i)), ...FORE.map((_, k) => fx(k))].map((x, i) => (
          <rect
            key={i}
            x={x - (i < HIST.length ? slot / 2 : 60)}
            y={top - 40}
            width={i < HIST.length ? slot : 120}
            height={base - top + 40}
            fill="transparent"
            onMouseEnter={() => (i < HIST.length || next) && setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
        {tip && (
          <g pointerEvents="none">
            <line x1={tip.x} x2={tip.x} y1={top - 30} y2={base} className="stroke-fg-3" strokeWidth={1} />
            <rect x={Math.min(tip.x + 12, 1300)} y={tip.y - 66} width={210} height={56} rx={10} className="fill-fg" />
            <text x={Math.min(tip.x + 26, 1314)} y={tip.y - 42} fontSize={18} className="fill-bg font-semibold">
              {tip.v}
            </text>
            <text x={Math.min(tip.x + 26, 1314)} y={tip.y - 20} fontSize={13} className="fill-bg font-mono" opacity={0.7}>
              {tip.t}
            </text>
          </g>
        )}
      </svg>
      <div className="absolute bottom-[6.6rem] left-[5.5rem] flex items-center gap-[2rem]">
        <span className="flex items-center gap-[0.5rem] text-[0.9375rem] text-fg-2">
          <span className="h-[0.75rem] w-[0.75rem] rounded-[3px] bg-fg-3" /> actual monthly sales
        </span>
        <span className="flex items-center gap-[0.5rem] text-[0.9375rem] text-fg-2">
          <span className="h-[3px] w-[1.25rem] rounded bg-accent" /> forecast, with likely range
        </span>
        <Illustrative>Illustrative data</Illustrative>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ demand forecasting */

const WEEKS = [14200, 14800, 15100, 14600, 15500, 16100, 15800, 16400, 16900, 16300, 17000, 17600, 17200, 17900, 18100, 17700]
const FORECAST = 18400
const LOW = 17200
const HIGH = 19600
const OPTIONS = [14000, 18400, 24000]

const INPUTS = [
  { label: 'Historical sales', Icon: History, d: 'M0 22 L10 18 L20 20 L30 12 L40 14 L50 6' },
  { label: 'Price', Icon: Tag, d: 'M0 8 H18 V18 H34 V10 H50' },
  { label: 'Promotions', Icon: Percent, d: 'M0 20 H12 V6 H20 V20 H36 V6 H44 V20 H50' },
  { label: 'Seasonality', Icon: CalendarDays, d: 'M0 14 C8 2 17 2 25 14 S42 26 50 14' },
  { label: 'Weather', Icon: CloudRain, d: 'M0 18 L10 16 L20 19 L30 6 L40 9 L50 17' },
]

export function AimlForecast() {
  const [stock, setStock] = useState(18400)
  const X0 = 650
  const X1 = 1440
  const base = 640
  const top = 300
  const y = (v: number) => base - ((v - 12000) / 14000) * (base - top)
  const n = WEEKS.length
  const x = (i: number) => X0 + 20 + (i * (X1 - X0 - 140)) / (n - 1)
  const fX = x(n - 1) + 90
  const line = WEEKS.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ')
  const short = Math.max(0, FORECAST - stock)
  const excess = Math.max(0, stock - FORECAST)
  const verdict =
    short > 0
      ? { tone: 'neg', title: 'Too little stock', body: `Lost sales: about ${fmt(short)} units of demand nobody can buy.` }
      : excess > 0
        ? { tone: 'signal', title: 'Too much stock', body: `Excess inventory: about ${fmt(excess)} units tying up cash and space.` }
        : { tone: 'accent', title: 'Stock matches the forecast', body: 'Fewer lost sales and less waste, as long as the forecast holds.' }
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7.25rem] w-[60rem]">
        <AnimatedHeadline as="h2" text="Forecast demand before it arrives." className="t-title text-fg" />
      </div>

      {/* inputs */}
      <div className="absolute left-[5.5rem] top-[17.5rem] w-[27rem]">
        {INPUTS.map(({ label, Icon, d }, i) => (
          <motion.div key={label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.12, duration: 0.5, ease: EASE }}>
            {i > 0 && <div className="py-[0.15rem] pl-[1.1rem] font-mono text-[1rem] text-fg-3">+</div>}
            <div className="flex items-center gap-[0.9rem] rounded-[0.9rem] border border-line bg-surface px-[1rem] py-[0.7rem]">
              <Icon className="h-[1.25rem] w-[1.25rem] text-fg-3" />
              <span className="flex-1 text-[1.125rem] text-fg">{label}</span>
              <svg viewBox="0 0 50 28" className="h-[1.6rem] w-[3rem]" aria-hidden>
                <path d={d} fill="none" className="stroke-fg-2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>

      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" aria-label="Sixteen weeks of demand and next week's forecast of 18,400 units with a range from 17,200 to 19,600">
        {[14000, 18000, 22000, 26000].map((g) => (
          <g key={g}>
            <line x1={X0} x2={X1} y1={y(g)} y2={y(g)} className="stroke-line" />
            <text x={X0 - 10} y={y(g) + 5} textAnchor="end" fontSize={14} className="fill-fg-3 font-mono">
              {g / 1000}k
            </text>
          </g>
        ))}
        <motion.path d="M500 288 H516 V630 H500" fill="none" className="stroke-line-2" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 0.6 }} />
        <path d="M516 459 C570 459 590 500 640 500" fill="none" className="stroke-line-2" strokeWidth={2} />
        <FlowDots path="M516 459 C570 459 590 500 640 500" count={3} dur={1.6} begin={1.4} r={4.5} />
        <motion.path d={line} fill="none" className="stroke-fg" strokeWidth={2.5} strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 0.8, ease: EASE }} />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
          <line x1={x(n - 1) + 45} x2={x(n - 1) + 45} y1={top - 10} y2={base} className="stroke-fg-3" />
          <text x={x(n - 1) + 45} y={top - 18} textAnchor="middle" fontSize={14} className="fill-fg-3 font-mono">
            today
          </text>
          <path d={`M${x(n - 1)} ${y(WEEKS[n - 1])} L${fX} ${y(FORECAST)}`} className="stroke-accent" strokeWidth={2.5} strokeDasharray="7 6" />
          <line x1={fX} x2={fX} y1={y(HIGH)} y2={y(LOW)} className="stroke-accent" strokeWidth={10} strokeLinecap="round" opacity={0.25} />
          <circle cx={fX} cy={y(FORECAST)} r={8} className="fill-accent stroke-bg" strokeWidth={3} />
        </motion.g>
        {/* the stock decision */}
        <motion.line
          x1={fX - 40}
          x2={fX + 40}
          initial={false}
          animate={{ y1: y(stock), y2: y(stock) }}
          transition={{ duration: 0.6, ease: EASE }}
          className={short ? 'stroke-neg' : excess ? 'stroke-signal' : 'stroke-fg'}
          strokeWidth={3}
        />
        <motion.rect
          x={fX - 40}
          width={80}
          initial={false}
          animate={{ y: Math.min(y(stock), y(FORECAST)), height: Math.abs(y(stock) - y(FORECAST)) }}
          transition={{ duration: 0.6, ease: EASE }}
          className={short ? 'fill-neg/20' : 'fill-signal/20'}
        />
        <motion.text x={fX + 50} textAnchor="start" initial={false} animate={{ y: y(stock) + 5 }} transition={{ duration: 0.6, ease: EASE }} fontSize={15} className="fill-fg-2 font-mono">
          order {fmt(stock)}
        </motion.text>
        <text x={X0} y={base + 30} fontSize={14} className="fill-fg-3 font-mono">
          16 weeks ago
        </text>
      </svg>

      <motion.div className="absolute right-[5.5rem] top-[7.25rem] text-right" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}>
        <div className="t-label">Expected demand next week</div>
        <div className="mt-[0.2rem] text-[3.75rem] font-[640] leading-none tracking-[-0.045em] text-accent">
          <AnimatedCounter value={FORECAST} delay={2.2} duration={1.4} /> <span className="text-[1.75rem] tracking-[-0.02em] text-fg-2">units</span>
        </div>
        <div className="mt-[0.35rem] text-[0.9375rem] text-fg-3">Example only: likely range {fmt(LOW)}–{fmt(HIGH)}</div>
      </motion.div>

      <div className="absolute bottom-[6.5rem] left-[40.6rem] right-[5.5rem] flex items-end justify-between gap-[2rem]">
        <div>
          <div className="t-label mb-[0.5rem]">How much should we order?</div>
          <div className="flex rounded-full border border-line-2 bg-surface p-[0.25rem]" role="radiogroup" aria-label="Order quantity">
            {OPTIONS.map((o) => (
              <button
                key={o}
                type="button"
                role="radio"
                aria-checked={stock === o}
                onClick={() => setStock(o)}
                className={cx('rounded-full px-[1.1rem] py-[0.4rem] font-mono text-[1rem] transition-colors', stock === o ? 'bg-fg text-bg' : 'text-fg-2 hover:text-fg')}
              >
                {fmt(o)}
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={verdict.title} className="max-w-[28rem]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            <div className={cx('text-[1.375rem] font-[600] tracking-[-0.02em]', verdict.tone === 'neg' ? 'text-neg' : verdict.tone === 'signal' ? 'text-signal-ink' : 'text-accent-ink')}>{verdict.title}</div>
            <div className="mt-[0.2rem] text-[1.0625rem] leading-[1.4] text-fg-2">{verdict.body}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ recommendations */

const CUSTOMERS = [
  [720, 330],
  [770, 405],
  [795, 485],
  [795, 565],
  [770, 645],
  [720, 720],
] as const
const ATTRS = [
  ['running', 905, 400],
  ['breathable', 925, 520],
  ['lightweight', 905, 640],
] as const
const RECS = [
  { name: 'Running socks', img: 'socks', y: 385, collab: '5 of 6 similar runners bought these', content: 'Shares: running, breathable', hybrid: 'Both signals agree strongly' },
  { name: 'Sportswear', img: 'tee', y: 525, collab: '3 of 6 similar runners bought this', content: 'Shares: running, breathable', hybrid: 'Both signals agree' },
  { name: 'Fitness accessories', img: 'watch', y: 665, collab: '3 of 6 similar runners bought this', content: 'Shares: running, lightweight', hybrid: 'Both signals agree' },
]
const BOUGHT: number[][] = [[0, 1], [0, 2], [0, 1], [0], [1, 2], [0, 2]]
const ATTR_LINKS: number[][] = [[0, 1, 2], [0, 1], [0, 2]]
const METHODS = [
  { name: 'Collaborative filtering', def: 'People who behave like you bought these.' },
  { name: 'Content-based filtering', def: 'These items share features with what you chose.' },
  { name: 'Hybrid models', def: 'Combine both, so each method covers the other’s blind spots.' },
]

export function AimlRecommend() {
  const { step, setStep } = useSlide()
  const collab = step === 0 || step === 2
  const content = step >= 1
  const SRC = [430, 520] as const
  const itemX = 1088
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7.25rem] w-[70rem]">
        <AnimatedHeadline as="h2" text="Recommendations learn from many customers, not just one." className="t-title !text-[2.875rem] text-fg" />
      </div>

      {/* the customer's choice */}
      <motion.div className="panel absolute left-[5.5rem] top-[20rem] w-[21rem] overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: EASE }}>
        <div className="relative h-[13rem] overflow-hidden bg-white">
          <Img src="/images/shoe-runner.webp" alt="Trail running shoe" className="absolute inset-0 h-full w-full object-cover" />
          <motion.span className="absolute h-[3rem] w-[3rem] rounded-full border-2 border-accent" style={{ left: '55%', top: '45%' }} initial={{ scale: 0.4, opacity: 1 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ delay: 1, duration: 0.9 }} />
        </div>
        <div className="flex items-center justify-between px-[1.1rem] py-[0.9rem]">
          <div>
            <div className="text-[1.25rem] font-[580] text-fg">Trail runner</div>
            <div className="text-[0.9375rem] text-fg-3">₹4,999</div>
          </div>
          <span className="flex items-center gap-[0.4rem] rounded-full bg-accent-wash px-[0.75rem] py-[0.25rem] text-[0.9375rem] text-accent-ink">
            <User className="h-[0.9rem] w-[0.9rem]" /> You chose this
          </span>
        </div>
      </motion.div>

      <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {CUSTOMERS.map(([cx0, cy0], i) => (
          <g key={i}>
            <motion.path d={`M${SRC[0]} ${SRC[1]} C560 ${SRC[1]} 600 ${cy0} ${cx0} ${cy0}`} fill="none" className="stroke-fg-3" strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1, opacity: collab ? 0.8 : 0.12 }} transition={{ pathLength: { duration: 0.8, delay: 1.2 + i * 0.06 }, opacity: { duration: 0.5 } }} />
            {BOUGHT[i].map((r) => (
              <motion.path
                key={r}
                d={`M${cx0} ${cy0} C${(cx0 + itemX) / 2} ${cy0} ${(cx0 + itemX) / 2} ${RECS[r].y} ${itemX} ${RECS[r].y}`}
                fill="none"
                className="stroke-accent"
                strokeWidth={1.75}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, opacity: collab ? 0.75 : 0.08 }}
                transition={{ pathLength: { duration: 0.8, delay: 1.8 + i * 0.07 }, opacity: { duration: 0.5 } }}
              />
            ))}
          </g>
        ))}
        {ATTRS.map(([, ax, ay], a) => (
          <g key={a}>
            <motion.path d={`M${SRC[0]} ${SRC[1]} C620 ${SRC[1]} 760 ${ay} ${ax} ${ay}`} fill="none" className="stroke-signal" strokeWidth={1.75} initial={false} animate={{ pathLength: content ? 1 : 0, opacity: content ? 0.8 : 0 }} transition={{ duration: 0.7, delay: content ? 0.2 + a * 0.08 : 0 }} />
            {ATTR_LINKS[a].map((r) => (
              <motion.path
                key={r}
                d={`M${ax} ${ay} C1000 ${ay} 1000 ${RECS[r].y} ${itemX} ${RECS[r].y}`}
                fill="none"
                className="stroke-signal"
                strokeWidth={1.75}
                initial={false}
                animate={{ pathLength: content ? 1 : 0, opacity: content ? 0.8 : 0 }}
                transition={{ duration: 0.7, delay: content ? 0.5 + a * 0.08 : 0 }}
              />
            ))}
          </g>
        ))}
        {CUSTOMERS.map(([cx0, cy0], i) => (
          <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: collab ? 1 : 0.25, scale: 1 }} transition={{ delay: step === 0 ? 1.4 + i * 0.07 : 0, duration: 0.4 }}>
            <circle cx={cx0} cy={cy0} r={15} className="fill-surface stroke-fg-2" strokeWidth={2} />
            <circle cx={cx0} cy={cy0 - 4} r={4} className="fill-fg-2" />
            <path d={`M${cx0 - 7} ${cy0 + 8} a7 6 0 0 1 14 0`} className="fill-fg-2" />
          </motion.g>
        ))}
        <motion.text x={760} y={292} textAnchor="middle" fontSize={15} className="fill-fg-3 font-mono" initial={{ opacity: 0 }} animate={{ opacity: collab ? 1 : 0.3 }} transition={{ delay: 1.6 }}>
          similar customers
        </motion.text>
        {ATTRS.map(([name, ax, ay], a) => (
          <motion.g key={name} initial={false} animate={{ opacity: content ? 1 : 0 }} transition={{ delay: content ? 0.3 + a * 0.08 : 0 }}>
            <rect x={ax - 58} y={ay - 17} width={116} height={34} rx={17} className="fill-signal-wash stroke-signal" strokeWidth={1.5} />
            <text x={ax} y={ay + 5} textAnchor="middle" fontSize={15} className="fill-signal-ink font-mono">
              {name}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* recommendations */}
      {RECS.map((r, i) => (
        <motion.div
          key={r.name}
          className="panel absolute left-[68rem] right-[5.5rem] flex h-[7.5rem] items-center gap-[1rem] overflow-hidden pr-[1rem]"
          style={{ top: `${(r.y - 60) / 16}rem` }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.2 + i * 0.15, duration: 0.6, ease: EASE }}
        >
          <div className="h-full w-[7.5rem] shrink-0 bg-white">
            <Img src={`/images/${r.img}.webp`} alt={r.name} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="text-[1.1875rem] font-[580] text-fg">{r.name}</div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={step} className="mt-[0.2rem] text-[0.9375rem] leading-[1.35] text-fg-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                {step === 0 ? r.collab : step === 1 ? r.content : r.hybrid}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
      <motion.div className="t-label absolute left-[68rem] top-[17.25rem]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
        Recommended next
      </motion.div>

      {/* methods */}
      <div className="absolute bottom-[6.5rem] left-[5.5rem] right-[5.5rem] flex items-end justify-between">
        <div className="flex gap-[0.5rem]" role="tablist" aria-label="Recommendation method">
          {METHODS.map((m, i) => (
            <button
              key={m.name}
              type="button"
              role="tab"
              aria-selected={step === i}
              onClick={() => setStep(i)}
              className={cx('rounded-full border px-[1.1rem] py-[0.55rem] text-[1.0625rem] transition-colors', step === i ? 'border-fg bg-fg text-bg' : 'border-line-2 text-fg-2 hover:border-fg-3')}
            >
              {m.name}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} className="max-w-[30rem] text-right text-[1.125rem] text-fg-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            {METHODS[step].def}
          </motion.div>
        </AnimatePresence>
      </div>
      <Illustrative className="absolute left-[5.5rem] top-[38.25rem]">Illustrative: no real customer records</Illustrative>
    </div>
  )
}

/* ------------------------------------------------------------------ market basket analysis */

const BASKETS = [
  ['bread', 'butter', 'milk'],
  ['bread', 'butter', 'eggs'],
  ['bread', 'milk'],
  ['phone', 'screen protector', 'case'],
  ['printer', 'ink', 'paper'],
  ['bread', 'butter', 'coffee'],
  ['phone', 'screen protector'],
  ['milk', 'eggs', 'coffee'],
  ['printer', 'ink'],
  ['bread', 'butter', 'eggs', 'milk'],
  ['phone', 'case'],
  ['printer', 'ink', 'paper'],
]
const RULES = [
  { a: 'bread', b: 'butter', why: 'Place butter near the bread, or bundle them as a breakfast offer.' },
  { a: 'phone', b: 'screen protector', why: 'Offer the screen protector at checkout whenever a phone is in the cart.' },
  { a: 'printer', b: 'ink', why: 'Recommend the matching ink cartridge with every printer.' },
]

function measures(a: string, b: string) {
  const n = BASKETS.length
  const withA = BASKETS.filter((x) => x.includes(a)).length
  const withB = BASKETS.filter((x) => x.includes(b)).length
  const both = BASKETS.filter((x) => x.includes(a) && x.includes(b)).length
  const support = both / n
  const confidence = both / withA
  const lift = confidence / (withB / n)
  return { n, withA, withB, both, support, confidence, lift }
}

export function AimlBasket() {
  const { step } = useSlide()
  const [rule, setRule] = useState(0)
  const R = RULES[rule]
  const m = useMemo(() => measures(R.a, R.b), [R.a, R.b])
  const pct = (v: number) => `${Math.round(v * 100)}%`
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7.25rem]">
        <AnimatedHeadline as="h2" text="Which products are bought together?" className="t-title text-fg" />
        <Reveal delay={0.5} className="t-lead mt-[0.7rem] !text-[1.375rem]">
          Twelve shopping baskets. Pick a rule to see the evidence behind it.
        </Reveal>
      </div>

      <div className="absolute left-[5.5rem] top-[17.75rem] grid w-[50rem] grid-cols-4 gap-[0.75rem]">
        {BASKETS.map((items, i) => {
          const hasA = items.includes(R.a)
          const hasBoth = hasA && items.includes(R.b)
          return (
            <motion.div
              key={i}
              className={cx('h-[7.4rem] rounded-[0.9rem] border p-[0.7rem] transition-colors duration-300', hasBoth ? 'border-accent bg-accent-wash' : hasA ? 'border-fg-3 bg-surface' : 'border-line bg-surface')}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: hasA ? 1 : 0.55, y: 0 }}
              transition={{ opacity: { duration: 0.3 }, y: { delay: 0.4 + i * 0.05, duration: 0.5, ease: EASE } }}
            >
              <div className="mb-[0.35rem] font-mono text-[0.75rem] text-fg-3">basket {String(i + 1).padStart(2, '0')}</div>
              <div className="flex flex-wrap gap-[0.3rem]">
                {items.map((it, k) => (
                  <motion.span
                    key={it}
                    className={cx(
                      'rounded-full px-[0.5rem] py-[0.05rem] text-[0.875rem] transition-colors duration-300',
                      it === R.a ? 'bg-fg text-bg' : it === R.b && hasA ? 'bg-accent text-white' : 'bg-bg-2 text-fg-2',
                    )}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.05 + k * 0.06, duration: 0.35 }}
                  >
                    {it}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="absolute left-[58.5rem] right-[5.5rem] top-[17.75rem]">
        <div className="space-y-[0.5rem]" role="radiogroup" aria-label="Association rule">
          {RULES.map((r, i) => (
            <button
              key={r.a}
              type="button"
              role="radio"
              aria-checked={rule === i}
              onClick={() => setRule(i)}
              className={cx('flex w-full items-center justify-between rounded-[0.9rem] border px-[1.1rem] py-[0.65rem] text-left transition-colors', rule === i ? 'border-fg bg-fg text-bg' : 'border-line bg-surface text-fg hover:border-fg-3')}
            >
              <span className="text-[1.25rem] font-[560] tracking-[-0.015em]">
                {r.a} <span className="opacity-60">→</span> {r.b}
              </span>
              <span className="font-mono text-[0.875rem] opacity-70">lift {measures(r.a, r.b).lift.toFixed(1)}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={rule} className="mt-[1.25rem] grid grid-cols-3 gap-[0.9rem]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            {[
              ['Support', pct(m.support), `${m.both} of ${m.n} baskets have both`],
              ['Confidence', pct(m.confidence), `${m.both} of ${m.withA} ${R.a} baskets add ${R.b}`],
              ['Lift', `${m.lift.toFixed(1)}×`, `vs. ${R.b} in any basket; above 1 is a real link`],
            ].map(([k, v, d]) => (
              <div key={k} className="border-t border-line pt-[0.6rem]">
                <div className="t-label !text-[0.8125rem]">{k}</div>
                <div className="text-[2rem] font-[620] tracking-[-0.03em] text-fg">{v}</div>
                <div className="text-[0.875rem] leading-[1.35] text-fg-3">{d}</div>
              </div>
            ))}
            <div className="col-span-3 mt-[0.3rem] rounded-[0.9rem] bg-accent-wash px-[1rem] py-[0.75rem] text-[1.0625rem] leading-[1.4] text-accent-ink">{R.why}</div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-[1rem] flex items-center gap-[0.6rem] text-[0.9375rem] text-fg-3">
          Rules like these are mined with
          {[
            ['Apriori', 'Grows frequent item sets level by level and prunes the rare ones.'],
            ['FP-Growth', 'Compresses baskets into a tree and mines it without generating candidates.'],
          ].map(([n, d]) => (
            <span key={n} tabIndex={0} className="group relative rounded-full border border-line-2 px-[0.7rem] py-[0.15rem] font-mono text-[0.875rem] text-fg-2 outline-none">
              {n}
              <span className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 w-[17rem] -translate-x-1/2 rounded-[0.6rem] bg-fg px-[0.8rem] py-[0.5rem] font-sans text-[0.875rem] leading-[1.35] text-bg opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                {d}
              </span>
            </span>
          ))}
        </div>
      </div>

      <motion.div className="absolute bottom-[6.5rem] left-[5.5rem] right-[5.5rem] flex items-center gap-[1rem]" initial={false} animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 12 }} transition={{ duration: 0.6, ease: EASE }}>
        <span className="t-label">Used for</span>
        {['Product placement', 'Bundling', 'Cross-selling', 'Recommendations'].map((t, i) => (
          <motion.span key={t} className="chip !h-[2.75rem] !text-[1.125rem]" data-on="true" initial={false} animate={{ scale: step >= 1 ? 1 : 0.9 }} transition={{ delay: step >= 1 ? i * 0.08 : 0 }}>
            {t}
          </motion.span>
        ))}
      </motion.div>
      <Illustrative className="absolute bottom-[10.25rem] left-[5.5rem]">Toy data: numbers are computed from these 12 baskets</Illustrative>
    </div>
  )
}

/* ------------------------------------------------------------------ closing */

function FutureBand() {
  const presence = usePresenceData() as TransitionCustom | undefined
  const forward = (presence?.dir ?? 1) > 0
  const pts = [690, 676, 682, 664, 668, 650, 655, 640, 648, 630, 622]
  const past = pts.map((v, i) => `${i ? 'L' : 'M'}${88 + i * 70} ${v}`).join(' ')
  return (
    <motion.svg
      viewBox="0 0 1600 900"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
      exit={forward ? { x: '18%', opacity: 0, transition: { duration: 0.8, ease: [0.5, 0, 0.75, 0] } } : { opacity: 0 }}
    >
      <motion.path d={past} fill="none" className="stroke-fg-3" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 1.5 }} />
      <motion.path d="M788 622 L1500 560 L1500 680 Z" className="fill-accent/15" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, duration: 0.8 }} />
      <motion.path d="M788 622 L1500 600" fill="none" className="stroke-accent" strokeWidth={3} strokeDasharray="9 7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 2.4 }} />
      <motion.line x1={788} x2={788} y1={560} y2={720} className="stroke-fg-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} />
      <motion.text x={798} y={716} fontSize={15} className="fill-fg-3 font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
        today
      </motion.text>
    </motion.svg>
  )
}

export function AimlClosing() {
  return (
    <div className="stage">
      <FutureBand />
      <div className="absolute left-[5.5rem] right-[5.5rem] top-[8.5rem]">
        <AnimatedHeadline as="h2" text={["AI doesn't just explain the past.", 'It helps prepare for the future.']} delay={0.3} stagger={0.07} className="text-[5rem] font-[640] uppercase leading-[0.92] tracking-[-0.05em] text-fg" />
        <Reveal delay={1.3} className="mt-[2.25rem] max-w-[58rem] text-[1.5rem] leading-[1.45] text-fg-2">
          “So AI in retail isn't just about chatbots. It can help decide what to stock, what to recommend, which customers to target and how demand may change.”
        </Reveal>
      </div>
    </div>
  )
}
