import { AnimatePresence, motion, usePresenceData } from 'motion/react'
import {
  Boxes,
  CreditCard,
  Database,
  Laptop,
  Monitor,
  PackageCheck,
  ScanBarcode,
  ShoppingCart,
  Smartphone,
  Store,
  TrendingDown,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { FlowDots, Highlight, Illustrative, Reveal, cx, usePhases } from '../components/motion'
import { useSlide } from '../presentation/deck'
import { EASE, type TransitionCustom } from '../presentation/transitions'
import { ChapterOpener, SceneHead } from './shared'

export const ROLES = [
  { id: 'roles-engineer', name: 'Data Engineer', verb: 'gets the data', blurb: 'Builds the pipelines that collect, process and store data.' },
  { id: 'roles-analyst', name: 'Retail Analyst', verb: 'understands it', blurb: 'Explains what happened and why.' },
  { id: 'roles-scientist', name: 'Data Scientist', verb: 'builds the models', blurb: 'Turns data into predictions.' },
  { id: 'roles-mle', name: 'ML Engineer', verb: 'makes models work', blurb: 'Runs models reliably in production.' },
  { id: 'roles-ba', name: 'Business Analyst', verb: 'turns insight into action', blurb: 'Connects results to business decisions.' },
]

/* ------------------------------------------------------------------ 01 · opener */

/** The opener's single "Retail Analyst" — the idea the next scene breaks into a chain of five roles. */
function OneAnalyst() {
  return (
    <svg viewBox="0 0 632 684" className="h-full w-full overflow-visible" aria-label="A single circle labelled: one Retail Analyst?">
      <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.5, ease: EASE }}>
        <circle cx={316} cy={300} r={92} className="fill-bg-2 stroke-line-2" strokeWidth={2} />
        <text x={316} y={292} textAnchor="middle" fontSize={24} className="fill-fg">
          One “Retail
        </text>
        <text x={316} y={324} textAnchor="middle" fontSize={24} className="fill-fg">
          Analyst”?
        </text>
      </motion.g>
    </svg>
  )
}

export function RolesIntro() {
  return (
    <ChapterOpener
      number="01"
      label="Roles"
      title="From Data to Decision"
      together
      first={<>When we think about Retail Analytics, we may think there is one person called a Retail Analyst.</>}
      second={
        <>
          But in reality, <Highlight delay={1.8}>a retail analytics system works like a chain</Highlight>. Different people take the data through different stages
          until it becomes a business decision.
        </>
      }
      visual={<OneAnalyst />}
    />
  )
}

/* ------------------------------------------------------------------ 01 · scene 1: the metro line */

const SOURCES = ['POS', 'Website', 'App', 'Payments', 'Inventory']
const STATION_X = [420, 625, 830, 1035, 1240]
const LINE_Y = 560
const TERMINAL_X = 1440

export function RolesJourney() {
  const { goTo } = useSlide()
  const [hover, setHover] = useState<number | null>(null)
  const mainPath = `M300 ${LINE_Y} L${TERMINAL_X} ${LINE_Y}`
  return (
    <div className="stage">
      <SceneHead title={['From data', 'to decision']} className="absolute left-[5.5rem] top-[8.25rem]" size="display">
        <Reveal delay={0.7} className="t-lead mt-[1.5rem] !text-[2rem] !text-fg-2">
          Five roles. One connected journey.
        </Reveal>
      </SceneHead>
      <Reveal delay={1} className="absolute right-[5.5rem] top-[9rem] max-w-[26rem] text-right t-small !text-fg-3">
        Select a stop to open that role.
      </Reveal>

      <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {SOURCES.map((s, i) => {
          const y = 470 + i * 46
          const d = `M196 ${y} C250 ${y} 250 ${LINE_Y} 300 ${LINE_Y}`
          return (
            <g key={s}>
              <motion.path
                d={d}
                fill="none"
                className="stroke-line-2"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: EASE }}
              />
              <FlowDots path={`${d} L${TERMINAL_X} ${LINE_Y}`} count={2} dur={7} begin={1.4 + i * 0.55} r={6} className="fill-signal stroke-bg [stroke-width:2.5]" />
            </g>
          )
        })}
        <motion.path
          d={mainPath}
          fill="none"
          className="stroke-fg"
          strokeWidth={5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.7, ease: EASE }}
        />
      </svg>

      {SOURCES.map((s, i) => (
        <motion.span
          key={s}
          className="absolute left-[5.5rem] font-mono text-[0.9375rem] text-fg-3"
          style={{ top: `${(470 + i * 46 - 11) / 16}rem` }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.45 + i * 0.06 }}
        >
          {s}
        </motion.span>
      ))}

      {ROLES.map((r, i) => {
        const on = hover === i
        return (
          <motion.button
            key={r.id}
            type="button"
            onClick={() => goTo(r.id)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className="absolute grid h-[3rem] w-[3rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            style={{ left: `${STATION_X[i] / 16}rem`, top: `${LINE_Y / 16}rem` }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 + i * 0.16, ease: EASE }}
            aria-label={`${r.name}: ${r.blurb} Open this role.`}
          >
            <span className={cx('absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 whitespace-nowrap text-[1.25rem] font-[580] tracking-[-0.015em] transition-colors', on ? 'text-accent-ink' : 'text-fg')}>
              {r.name}
            </span>
            <motion.span
              className="block h-[1.75rem] w-[1.75rem] rounded-full border-[3px] border-fg bg-bg"
              animate={{ scale: on ? 1.3 : 1, backgroundColor: on ? 'var(--accent)' : 'var(--bg)' }}
              transition={{ duration: 0.3 }}
            />
            <span className="absolute left-1/2 top-[calc(100%+0.5rem)] -translate-x-1/2 whitespace-nowrap font-mono text-[0.9375rem] text-fg-3">{r.verb}</span>
            <AnimatePresence>
              {on && (
                <motion.span
                  className="absolute left-1/2 top-[calc(100%+2.6rem)] w-[14rem] -translate-x-1/2 rounded-[0.75rem] bg-fg px-[0.9rem] py-[0.6rem] text-[0.9375rem] leading-[1.35] text-bg"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {r.blurb}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}

      <motion.div
        className="absolute grid h-[3.75rem] w-[3.75rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-bg"
        style={{ left: `${TERMINAL_X / 16}rem`, top: `${LINE_Y / 16}rem` }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 2, ease: EASE }}
      >
        <svg viewBox="0 0 24 24" className="h-[1.6rem] w-[1.6rem]" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        <span className="absolute left-1/2 top-[calc(100%+0.6rem)] -translate-x-1/2 text-[1.375rem] font-[620] tracking-[-0.02em] text-accent-ink">Decision</span>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ role scenes share a track */

function RoleTrack({ index }: { index: number }) {
  const { dir } = useSlide()
  const from = Math.max(0, Math.min(ROLES.length - 1, index - dir))
  const frac = (i: number) => i / ROLES.length
  return (
    <div className="absolute left-[5.5rem] right-[5.5rem] top-[6.4rem] h-[3rem]" aria-label={`Role ${index + 1} of 5: ${ROLES[index].name}`}>
      <div className="absolute left-0 right-0 top-[0.6rem] h-[2px] bg-line" />
      <motion.div
        className="absolute left-0 right-0 top-[0.6rem] h-[2px] origin-left bg-accent"
        initial={{ scaleX: frac(from) }}
        animate={{ scaleX: frac(index) }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      />
      {[...ROLES.map((r) => r.name), 'Decision'].map((name, i, all) => {
        const active = i === index
        const done = i < index
        const align = i === 0 ? 'items-start' : i === all.length - 1 ? 'items-end' : 'items-center'
        const shift = i === 0 ? '-translate-x-[0.6rem]' : i === all.length - 1 ? '-translate-x-[calc(100%-0.6rem)]' : '-translate-x-1/2'
        return (
          <div key={name} className={cx('absolute top-0 flex flex-col', align, shift)} style={{ left: `${(i / ROLES.length) * 89}rem` }}>
            <motion.span
              className={cx('block h-[1.2rem] w-[1.2rem] rounded-full border-2', active ? 'border-accent bg-accent' : done ? 'border-fg-3 bg-fg-3' : 'border-line-2 bg-bg')}
              initial={active ? { scale: 0.6 } : false}
              animate={{ scale: active ? 1 : 0.75 }}
              transition={{ duration: 0.5, delay: active ? 0.6 : 0, ease: EASE }}
            />
            <span className={cx('mt-[0.45rem] whitespace-nowrap text-[0.9375rem]', active ? 'font-[580] text-fg' : 'text-fg-3')}>{name}</span>
          </div>
        )
      })}
    </div>
  )
}

function RoleScene({
  index,
  title,
  description,
  aside,
  visual,
}: {
  index: number
  title: string[]
  description: ReactNode
  aside?: ReactNode
  visual: ReactNode
}) {
  return (
    <div className="stage">
      <RoleTrack index={index} />
      <div className="absolute left-[5.5rem] top-[12.75rem] w-[34rem]">
        <SceneHead eyebrow={ROLES[index].name} title={title} size="display" fontSize={4.5} />
        <Reveal delay={0.55} className="t-lead mt-[1.75rem] !text-[1.5rem]">
          {description}
        </Reveal>
        {aside && (
          <Reveal delay={0.8} className="mt-[2rem]">
            {aside}
          </Reveal>
        )}
      </div>
      <div className="absolute bottom-[6.5rem] left-[41rem] right-[5.5rem] top-[11.5rem]">{visual}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ Data Engineer */

const PIPE_SOURCES: { label: string; Icon: LucideIcon }[] = [
  { label: 'POS systems', Icon: ScanBarcode },
  { label: 'Website', Icon: Monitor },
  { label: 'Mobile app', Icon: Smartphone },
  { label: 'Payments', Icon: CreditCard },
  { label: 'Inventory systems', Icon: Boxes },
]

function Pipeline() {
  const pipeY = 268
  const raw = ['fill-signal', 'fill-fg-3', 'fill-mute', 'fill-signal', 'fill-fg-2']
  return (
    <svg viewBox="0 0 856 540" className="h-full w-full overflow-visible" aria-label="Five data sources feed a pipeline that collects, processes and stores data in a warehouse">
      {PIPE_SOURCES.map(({ label, Icon }, i) => {
        const y = 22 + i * 104
        const yc = y + 38
        const d = `M232 ${yc} C300 ${yc} 300 ${pipeY} 360 ${pipeY}`
        return (
          <g key={label}>
            <motion.g initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: EASE }}>
              <rect x={0} y={y} width={232} height={76} rx={16} className="fill-surface stroke-line" />
              <Icon x={20} y={y + 24} width={28} height={28} className="text-fg-2" strokeWidth={1.75} />
              <text x={62} y={yc + 7} fontSize={19} className="fill-fg">
                {label}
              </text>
            </motion.g>
            <motion.path d={d} fill="none" className="stroke-line-2" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.9 + i * 0.07 }} />
            <FlowDots path={`${d} L540 ${pipeY}`} count={2} dur={2.6} begin={1.6 + i * 0.37} r={i % 2 ? 4 : 5.5} className={raw[i]} />
          </g>
        )
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.1 }}>
        <rect x={360} y={pipeY - 30} width={360} height={60} rx={30} className="fill-bg-2 stroke-line-2" />
        <line x1={480} x2={480} y1={pipeY - 30} y2={pipeY + 30} className="stroke-line-2" />
        <line x1={600} x2={600} y1={pipeY - 30} y2={pipeY + 30} className="stroke-line-2" />
        {['Collect', 'Process', 'Store'].map((s, i) => (
          <text key={s} x={420 + i * 120} y={pipeY - 48} textAnchor="middle" fontSize={18} className="fill-fg-2 font-mono">
            {s}
          </text>
        ))}
      </motion.g>
      <FlowDots path={`M540 ${pipeY} L742 ${pipeY}`} count={5} dur={1.6} begin={2} r={5} className="fill-accent" />
      <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 1.4, ease: EASE }}>
        <path d={`M742 ${pipeY - 64} v128 a56 18 0 0 0 112 0 v-128`} className="fill-surface stroke-fg-2" strokeWidth={2} />
        <ellipse cx={798} cy={pipeY - 64} rx={56} ry={18} className="fill-bg-2 stroke-fg-2" strokeWidth={2} />
        <path d={`M742 ${pipeY - 20} a56 18 0 0 0 112 0 M742 ${pipeY + 24} a56 18 0 0 0 112 0`} fill="none" className="stroke-line-2" strokeWidth={2} />
        <Database x={786} y={pipeY - 4} width={24} height={24} className="text-accent" />
        <text x={798} y={pipeY + 120} textAnchor="middle" fontSize={18} className="fill-fg">
          Data warehouse
        </text>
      </motion.g>
      <motion.text x={540} y={pipeY + 70} textAnchor="middle" fontSize={15} className="fill-fg-3 font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
        messy in · clean out
      </motion.text>
    </svg>
  )
}

export function RoleEngineer() {
  return (
    <RoleScene
      index={0}
      title={['Get the', 'data']}
      description="Data Engineers build the infrastructure and pipelines that collect, process and store data."
      visual={<Pipeline />}
    />
  )
}

/* ------------------------------------------------------------------ Retail Analyst */

const salesSeries = [62, 66, 64, 70, 72, 74, 50, 52, 71, 73]
const stockSeries = [80, 72, 61, 49, 36, 18, 0, 0, 64, 58]

function MiniLine({ data, max, hot, tone = 'fg', marker }: { data: number[]; max: number; hot?: number; tone?: 'fg' | 'neg'; marker?: string }) {
  const W = 236
  const H = 74
  const pts = data.map((v, i) => [8 + (i * (W - 16)) / (data.length - 1), H - 6 - (v / max) * (H - 14)] as const)
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full overflow-visible">
      <line x1={8} x2={W - 8} y1={H - 6} y2={H - 6} className="stroke-line" />
      <motion.path d={d} fill="none" className="stroke-fg-2" strokeWidth={2.25} strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: 0.9, ease: EASE }} />
      {hot != null && (
        <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6, duration: 0.4 }}>
          <circle cx={pts[hot][0]} cy={pts[hot][1]} r={6} className={tone === 'neg' ? 'fill-neg stroke-surface' : 'fill-signal stroke-surface'} strokeWidth={2.5} />
          {marker && (
            <text x={pts[hot][0]} y={pts[hot][1] + 26} textAnchor="middle" fontSize={14} className="fill-fg-2 font-mono">
              {marker}
            </text>
          )}
        </motion.g>
      )}
    </svg>
  )
}

function AnalystPanel({ title, Icon, children, className }: { title: string; Icon: LucideIcon; children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={cx('panel absolute w-[17rem] p-[1rem] pb-[0.6rem]', className)}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1, borderColor: 'var(--fg-3)' }}
      transition={{ duration: 0.6, delay: PANELS_AT, ease: EASE }}
    >
      <div className="mb-[0.4rem] flex items-center gap-[0.5rem] text-[1rem] font-[560] text-fg">
        <Icon className="h-[1.05rem] w-[1.05rem] text-fg-3" /> {title}
      </div>
      {children}
    </motion.div>
  )
}

/* One coordinated reveal on arrival: all four panels light up together, then the cause is drawn. */
const PANELS_AT = 0.6
const CAUSE_AT = 1.3

function AnalystDesk() {
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 856 612" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {[
          [272, 140],
          [272, 472],
          [584, 140],
          [584, 472],
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={428} y2={306} className="stroke-line-2" strokeWidth={1.5} />
            <FlowDots path={`M${x} ${y} L428 306`} count={2} dur={2.2} begin={1.5 + i * 0.3} r={3.5} className="fill-fg-3" />
          </g>
        ))}
        <motion.path
          d="M26 452 L26 160"
          fill="none"
          className="stroke-signal"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: CAUSE_AT, ease: EASE }}
        />
        <motion.path
          d="M16 172 L26 158 L36 172"
          fill="none"
          className="stroke-signal"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: CAUSE_AT + 0.7 }}
        />
      </svg>

      <motion.div
        className="absolute left-1/2 top-1/2 grid h-[15.5rem] w-[15.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg text-center text-bg"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
      >
        <div className="px-[1.4rem]">
          <div className="mb-[0.5rem] font-mono text-[0.8125rem] opacity-60">Retail Analyst asks</div>
          <div className="text-[1.625rem] font-[600] leading-[1.08] tracking-[-0.03em]">What happened?</div>
          <div className="mt-[0.45rem] text-[1.625rem] font-[600] leading-[1.08] tracking-[-0.03em]">Why did it happen?</div>
        </div>
      </motion.div>

      <AnalystPanel title="Sales" Icon={TrendingDown} className="left-0 top-0">
        <MiniLine data={salesSeries} max={80} hot={6} marker="−30% · wk 7" />
      </AnalystPanel>
      <AnalystPanel title="Inventory · running shoes" Icon={Boxes} className="bottom-0 left-0">
        <MiniLine data={stockSeries} max={80} hot={6} tone="neg" marker="stockout" />
      </AnalystPanel>
      <AnalystPanel title="Products" Icon={ShoppingCart} className="right-0 top-0">
        <div className="space-y-[0.35rem] pt-[0.2rem]">
          {[
            ['Running shoes', 92],
            ['Socks', 64],
            ['Sportswear', 51],
            ['Bottles', 33],
          ].map(([n, v], i) => (
            <div key={n} className="flex items-center gap-[0.6rem] text-[0.875rem] text-fg-2">
              <span className="w-[6.5rem] shrink-0">{n}</span>
              <motion.span
                className={cx('h-[0.55rem] rounded-r-[3px]', i === 0 ? 'bg-fg-2' : 'bg-mute')}
                initial={{ width: 0 }}
                animate={{ width: `${(Number(v) / 92) * 8}rem` }}
                transition={{ duration: 0.8, delay: 1 + i * 0.08, ease: EASE }}
              />
            </div>
          ))}
        </div>
      </AnalystPanel>
      <AnalystPanel title="Customers · searches" Icon={Users} className="bottom-0 right-0">
        <MiniLine data={[60, 61, 63, 62, 64, 66, 67, 66, 65, 66]} max={80} hot={6} marker="still searching" />
      </AnalystPanel>

      <motion.div
        className="absolute left-[3rem] top-[13.25rem] w-[13rem] text-[1.0625rem] leading-[1.35] text-signal-ink"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: CAUSE_AT + 0.3 }}
      >
        Cause: in week 7 the top product ran out while customers were still searching for it.
      </motion.div>
      <Illustrative className="absolute -bottom-[2.25rem] left-0">Illustrative weekly data</Illustrative>
    </div>
  )
}

export function RoleAnalyst() {
  return (
    <RoleScene
      index={1}
      title={['Understand', 'the data']}
      description="Retail Analysts look at sales, customers, products and inventory together to explain what happened, and why."
      aside={
        <div className="flex flex-wrap gap-[0.5rem]">
          {['SQL', 'Excel', 'Power BI', 'Statistics'].map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      }
      visual={<AnalystDesk />}
    />
  )
}

/* ------------------------------------------------------------------ Data Scientist */

const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}
const DOTS = 24
const COLS = ['price', 'promo', 'week', 'rain', 'store', 'sales']
const layer = (n: number, x: number) => Array.from({ length: n }, (_, i) => [x, 270 + (i - (n - 1) / 2) * 62] as const)
const NET = [...layer(6, 230), ...layer(8, 420), ...layer(6, 610), ...layer(1, 770)]
const actual = [52, 58, 55, 63, 70, 66, 74, 79, 72, 81, 86, 83]
const predicted = [54, 56, 57, 62, 68, 68, 72, 77, 75, 80, 84, 85]
const predY = (v: number) => 450 - (v - 40) * 7

function dotState(i: number, stage: number) {
  if (stage === 0) {
    return { cx: 60 + rand(i + 1) * 760, cy: 40 + rand(i + 51) * 440, r: 5 + rand(i + 99) * 7, cls: ['fill-signal', 'fill-fg-3', 'fill-mute', 'fill-fg-2'][i % 4] }
  }
  if (stage === 1) {
    const c = i % 6
    const r = Math.floor(i / 6)
    return { cx: 190 + c * 96, cy: 170 + r * 64, r: 8, cls: c === 5 ? 'fill-accent' : 'fill-fg-2' }
  }
  if (stage === 2) {
    const p = NET[i]
    return p ? { cx: p[0], cy: p[1], r: i === 20 ? 13 : 9, cls: i === 20 ? 'fill-accent' : 'fill-fg-2' } : { cx: 770, cy: 270, r: 0, cls: 'fill-accent' }
  }
  const k = i % 12
  const series = i < 12 ? actual : predicted
  return { cx: 300 + k * 44, cy: predY(series[k]), r: 6, cls: i < 12 ? 'fill-fg-3' : 'fill-accent' }
}

const toPath = (s: number[]) => s.map((v, k) => `${k ? 'L' : 'M'}${300 + k * 44} ${predY(v)}`).join(' ')

function ModelBuild() {
  const { step, setStep } = useSlide()
  const stages = ['Raw data', 'Features', 'Model', 'Prediction']
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 856 500" className="h-[31rem] w-full overflow-visible" aria-label={`Model building stage: ${stages[step]}`}>
        <motion.g initial={false} animate={{ opacity: step === 1 ? 1 : 0 }} transition={{ duration: 0.4, delay: step === 1 ? 0.5 : 0 }}>
          {COLS.map((c, k) => (
            <text key={c} x={190 + k * 96} y={128} textAnchor="middle" fontSize={16} className={k === 5 ? 'fill-accent-ink font-mono' : 'fill-fg-3 font-mono'}>
              {c}
            </text>
          ))}
          {[0, 1, 2, 3, 4].map((r) => (
            <line key={r} x1={140} x2={720} y1={138 + r * 64} y2={138 + r * 64} className="stroke-line" />
          ))}
          <text x={720} y={128} textAnchor="end" fontSize={14} className="fill-fg-3">
            target →
          </text>
        </motion.g>
        <motion.g initial={false} animate={{ opacity: step === 2 ? 1 : 0 }} transition={{ duration: 0.5, delay: step === 2 ? 0.6 : 0 }}>
          {NET.slice(0, 6).flatMap((a, i) => NET.slice(6, 14).map((b, j) => <line key={`a${i}${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="stroke-line-2" strokeWidth={1} />))}
          {NET.slice(6, 14).flatMap((a, i) => NET.slice(14, 20).map((b, j) => <line key={`b${i}${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="stroke-line-2" strokeWidth={1} />))}
          {NET.slice(14, 20).map((a, i) => (
            <line key={`c${i}`} x1={a[0]} y1={a[1]} x2={770} y2={270} className="stroke-line-2" strokeWidth={1} />
          ))}
          <text x={770} y={318} textAnchor="middle" fontSize={16} className="fill-fg-2 font-mono">
            forecast
          </text>
        </motion.g>
        <motion.g initial={false} animate={{ opacity: step === 3 ? 1 : 0 }} transition={{ duration: 0.5, delay: step === 3 ? 0.8 : 0 }}>
          <line x1={280} x2={800} y1={450} y2={450} className="stroke-line-2" />
          <path d={toPath(actual)} fill="none" className="stroke-fg-3" strokeWidth={2} />
          <path d={toPath(predicted)} fill="none" className="stroke-accent" strokeWidth={2.5} />
          <g fontSize={16}>
            <line x1={300} x2={324} y1={70} y2={70} className="stroke-fg-3" strokeWidth={2} />
            <text x={332} y={75} className="fill-fg-2">
              actual
            </text>
            <line x1={410} x2={434} y1={70} y2={70} className="stroke-accent" strokeWidth={2.5} />
            <text x={442} y={75} className="fill-fg-2">
              predicted on weeks the model never saw
            </text>
          </g>
        </motion.g>
        {Array.from({ length: DOTS }, (_, i) => {
          const s = dotState(i, step)
          return (
            <motion.circle
              key={i}
              className={s.cls}
              initial={false}
              animate={{ cx: s.cx, cy: s.cy, r: s.r }}
              transition={{ duration: 1, ease: EASE, delay: (i % 6) * 0.03 + Math.floor(i / 6) * 0.02 }}
            />
          )
        })}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-[0.75rem]">
        {stages.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(i)}
            className={cx('flex items-center gap-[0.75rem] text-[1.125rem] transition-colors', i === step ? 'text-fg' : i < step ? 'text-fg-2' : 'text-fg-3')}
          >
            <span className={cx('grid h-[1.9rem] w-[1.9rem] place-items-center rounded-full border font-mono text-[0.8125rem]', i === step ? 'border-accent bg-accent text-bg' : 'border-line-2')}>{i + 1}</span>
            {s}
            {i < stages.length - 1 && <span className="mx-[0.25rem] h-px w-[2.5rem] bg-line-2" />}
          </button>
        ))}
      </div>
    </div>
  )
}

export function RoleScientist() {
  return (
    <RoleScene
      index={2}
      title={['Build the', 'models']}
      description="Data Scientists turn raw data into features, train a model, and test its predictions before anyone relies on them."
      aside={
        <div className="flex flex-wrap gap-[0.5rem]">
          {['Demand Forecasting', 'Customer Churn', 'Recommendation Systems', 'Customer Segmentation'].map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      }
      visual={<ModelBuild />}
    />
  )
}

/* ------------------------------------------------------------------ ML Engineer */

const LIFECYCLE = ['Deployment', 'APIs', 'Testing', 'Monitoring', 'Scaling', 'Retraining']
const SYSTEMS: { label: string; Icon: LucideIcon; out: string }[] = [
  { label: 'Store app', Icon: Smartphone, out: 'demand ↑' },
  { label: 'Website', Icon: Monitor, out: 'show: socks' },
  { label: 'Warehouse', Icon: PackageCheck, out: 'reorder 240' },
  { label: 'Point of sale', Icon: Store, out: 'price check' },
]

function Production() {
  const phase = usePhases([1.2, 2.2])
  const R = 130
  const C = [470, 300] as const
  const at = (k: number, r = R) => [C[0] + r * Math.cos(((k * 60 - 90) * Math.PI) / 180), C[1] + r * Math.sin(((k * 60 - 90) * Math.PI) / 180)] as const
  const arc = (2 * Math.PI * R) / 6 - 10
  return (
    <svg viewBox="0 0 900 600" className="h-full w-full overflow-visible" aria-label="A model moves from development into a production loop of deployment, APIs, testing, monitoring, scaling and retraining, then serves retail systems">
      <line x1={196} x2={196} y1={40} y2={560} className="stroke-line-2" />
      <text x={92} y={60} textAnchor="middle" fontSize={17} className="fill-fg-3 font-mono">
        development
      </text>
      <text x={470} y={60} textAnchor="middle" fontSize={17} className="fill-fg-3 font-mono">
        production
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={16} y={244} width={152} height={112} rx={14} className="fill-surface stroke-line" />
        <Laptop x={72} y={262} width={40} height={40} className="text-fg-3" strokeWidth={1.5} />
        <text x={92} y={334} textAnchor="middle" fontSize={15} className="fill-fg-3">
          notebook
        </text>
      </motion.g>
      <circle cx={C[0]} cy={C[1]} r={R} fill="none" className="stroke-line-2" strokeWidth={2} />
      {phase >= 2 && (
        <motion.circle
          cx={C[0]}
          cy={C[1]}
          r={R}
          fill="none"
          className="stroke-accent"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${2 * Math.PI * R - arc}`}
          initial={{ strokeDashoffset: (2 * Math.PI * R) / 4, opacity: 0 }}
          animate={{ strokeDashoffset: (2 * Math.PI * R) / 4 - 2 * Math.PI * R, opacity: 1 }}
          transition={{ strokeDashoffset: { duration: 7.2, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.4 } }}
        />
      )}
      {LIFECYCLE.map((s, k) => {
        const [x, y] = at(k)
        const [lx, ly] = at(k, R + 30)
        return (
          <motion.g key={s} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 + k * 0.1, duration: 0.5, ease: EASE }}>
            <circle cx={x} cy={y} r={9} className="fill-bg stroke-fg-2" strokeWidth={2.5} />
            <text x={lx} y={ly + 6} textAnchor={Math.abs(lx - C[0]) < 10 ? 'middle' : lx > C[0] ? 'start' : 'end'} fontSize={18} className="fill-fg">
              {s}
            </text>
          </motion.g>
        )
      })}
      {/* the model leaves the notebook and goes live */}
      <motion.g initial={{ x: 92, y: 300 }} animate={phase >= 1 ? { x: C[0], y: C[1] } : { x: 92, y: 300 }} transition={{ duration: 1.1, ease: EASE }}>
        <rect x={-46} y={-26} width={92} height={52} rx={12} className="fill-fg" />
        <text x={0} y={7} textAnchor="middle" fontSize={17} className="fill-bg font-mono">
          model
        </text>
      </motion.g>
      <motion.line x1={C[0] + R} x2={690} y1={C[1]} y2={C[1]} className="stroke-line-2" strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: phase >= 2 ? 1 : 0 }} transition={{ duration: 0.4 }} />
      {SYSTEMS.map(({ label, Icon, out }, i) => {
        const y = 150 + i * 100
        const d = `M${C[0] + R} ${C[1]} L690 ${C[1]} C726 ${C[1]} 718 ${y} 748 ${y}`
        return (
          <g key={label}>
            <motion.path d={d} fill="none" className="stroke-line-2" strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: phase >= 2 ? 1 : 0 }} transition={{ duration: 0.7, delay: i * 0.1 }} />
            {phase >= 2 && <FlowDots path={d} count={2} dur={2} begin={0.5 + i * 0.25} r={4.5} className="fill-accent" />}
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 10 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}>
              <Icon x={754} y={y - 14} width={28} height={28} className="text-fg-2" strokeWidth={1.75} />
              <text x={792} y={y - 2} fontSize={17} className="fill-fg">
                {label}
              </text>
              <text x={792} y={y + 20} fontSize={14} className="fill-accent-ink font-mono">
                {out}
              </text>
            </motion.g>
          </g>
        )
      })}
    </svg>
  )
}

export function RoleMLE() {
  return (
    <RoleScene
      index={3}
      title={['Make it work', 'in the real', 'world']}
      description="ML Engineers deploy models behind APIs, test them, watch them in production, scale them and retrain them when the world changes."
      aside={<Illustrative>Outputs shown are illustrative</Illustrative>}
      visual={<Production />}
    />
  )
}

/* ------------------------------------------------------------------ Business Analyst */

const SCENARIOS = [
  {
    signal: 'Predicted demand rises',
    Icon: TrendingUp,
    context: 'A festival week is coming',
    action: 'Increase inventory',
    detail: 'Raise orders for the affected stores before the demand arrives, not after the shelves are empty.',
    owner: 'Supply chain team',
    series: [40, 42, 41, 45, 47, 52, 60, 71],
  },
  {
    signal: 'Customer churn risk rises',
    Icon: Users,
    context: 'They are high-value, frequent buyers',
    action: 'Create a retention strategy',
    detail: 'Reach at-risk customers with a relevant offer or better service before they quietly stop buying.',
    owner: 'CRM & marketing',
    series: [20, 21, 24, 23, 28, 33, 39, 46],
  },
  {
    signal: 'Competitor price falls',
    Icon: TrendingDown,
    context: 'Margin matters as much as volume',
    action: 'Reconsider pricing',
    detail: 'Compare the margin lost by matching against the sales lost by not matching, then decide.',
    owner: 'Pricing team',
    series: [70, 70, 69, 70, 68, 62, 58, 57],
  },
]

function Spark({ data, active }: { data: number[]; active: boolean }) {
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${i * 14} ${44 - v * 0.55}`).join(' ')
  return (
    <svg viewBox="0 0 100 46" className="h-[2.4rem] w-[5.5rem] overflow-visible" aria-hidden>
      <path d={d} fill="none" className={active ? 'stroke-accent' : 'stroke-fg-3'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const BTN_TOP = 52
const BTN_GAP = 92
const btnCenter = (i: number) => BTN_TOP + 36 + i * BTN_GAP

function DecisionDesk() {
  const { step, setStep } = useSlide()
  const s = SCENARIOS[step]
  const d = `M328 ${btnCenter(step)} C400 ${btnCenter(step)} 404 236 476 236`
  return (
    <div className="relative h-full w-full">
      <div className="t-label absolute left-0 top-[0.5rem]">The model or report says</div>
      <div role="radiogroup" aria-label="Analytical signal">
        {SCENARIOS.map((sc, i) => (
          <motion.button
            key={sc.signal}
            type="button"
            role="radio"
            aria-checked={i === step}
            onClick={() => setStep(i)}
            className={cx(
              'absolute left-0 flex h-[4.5rem] w-[20rem] items-center justify-between gap-[1rem] rounded-[1rem] border px-[1.1rem] text-left transition-colors duration-300',
              i === step ? 'border-fg bg-fg text-bg' : 'border-line bg-surface text-fg hover:border-fg-3',
            )}
            style={{ top: `${(BTN_TOP + i * BTN_GAP) / 16}rem` }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: EASE }}
          >
            <span className="text-[1.125rem] font-[540] leading-[1.25] tracking-[-0.01em]">{sc.signal}</span>
            <Spark data={sc.series} active={i === step} />
          </motion.button>
        ))}
      </div>

      <svg viewBox="0 0 856 612" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <motion.path key={step} d={d} fill="none" className="stroke-accent" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE }} />
        <circle cx={476} cy={236} r={6} className="fill-accent" />
        <FlowDots key={`f${step}`} path={d} count={2} dur={1.6} begin={0.7} r={4.5} />
      </svg>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          className="absolute left-[31.5rem] right-0 top-[1.25rem]"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="t-label">+ business context</div>
          <div className="mt-[0.4rem] text-[1.125rem] text-fg-2">{s.context}</div>
          <div className="mt-[1.6rem] t-label">Decision</div>
          <div className="mt-[0.4rem] flex items-start gap-[0.75rem]">
            <s.Icon className="mt-[0.45rem] h-[1.9rem] w-[1.9rem] shrink-0 text-accent" />
            <div className="text-[2.75rem] font-[620] leading-[1] tracking-[-0.035em] text-fg">{s.action}</div>
          </div>
          <p className="mt-[1.1rem] text-[1.1875rem] leading-[1.45] text-fg-2">{s.detail}</p>
          <div className="mt-[1.25rem] inline-flex items-center gap-[0.5rem] rounded-full bg-accent-wash px-[0.9rem] py-[0.35rem] text-[0.9375rem] text-accent-ink">
            Acted on by: {s.owner}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function RoleBA() {
  return (
    <RoleScene
      index={4}
      title={['Turn insights', 'into decisions']}
      description="Business Analysts add business context to analytical output and turn it into an action someone owns."
      aside={<div className="t-label">Pick a signal, or press → to step through</div>}
      visual={<DecisionDesk />}
    />
  )
}

/* ------------------------------------------------------------------ closing equation */

const TERMS = [
  { t: 'Data', who: 'Data Engineer' },
  { t: 'Analysis', who: 'Retail Analyst' },
  { t: 'Models', who: 'Data Scientist · ML Engineer' },
  { t: 'Business context', who: 'Business Analyst' },
]

/** Signal dots that drift along the bottom and, going forward, stream off to become the next chapter's inputs. */
export function SignalStream({ y = 46, count = 16 }: { y?: number; count?: number }) {
  const presence = usePresenceData() as TransitionCustom | undefined
  const forward = (presence?.dir ?? 1) > 0
  return (
    <div className="pointer-events-none absolute inset-x-0" style={{ top: `${y}rem` }} aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const x = 6 + ((i * 37) % 88)
        const dy = ((i * 53) % 7) * 0.55
        return (
          <motion.span
            key={i}
            className={cx('absolute block rounded-full', i % 4 === 0 ? 'bg-signal' : 'bg-accent')}
            style={{ left: `${x}rem`, top: `${dy}rem`, width: i % 3 ? '0.55rem' : '0.8rem', height: i % 3 ? '0.55rem' : '0.8rem' }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 0.9, x: [0, 18, 0] }}
            exit={forward ? { x: '70rem', opacity: 0, transition: { duration: 0.9, ease: [0.5, 0, 0.75, 0], delay: (i % 5) * 0.03 } } : { opacity: 0 }}
            transition={{ opacity: { duration: 0.6, delay: 1.6 + i * 0.04 }, x: { duration: 6 + (i % 4), repeat: Infinity, ease: 'easeInOut' } }}
          />
        )
      })}
    </div>
  )
}

export function RolesClosing() {
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] right-[5.5rem] top-[8.5rem]">
        <div className="flex flex-wrap items-start gap-x-[1.6rem] gap-y-[1.8rem]">
          {TERMS.map((term, i) => (
            <div key={term.t} className="flex items-start gap-x-[1.6rem]">
              {i > 0 && (
                <motion.span className="text-[4.75rem] font-[300] leading-[0.95] text-fg-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.32 }}>
                  +
                </motion.span>
              )}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 + i * 0.32, ease: EASE }}>
                <div className="text-[4.75rem] font-[640] uppercase leading-[0.95] tracking-[-0.05em] text-fg">{term.t}</div>
                <div className="mt-[0.6rem] font-mono text-[0.9375rem] text-fg-3">{term.who}</div>
              </motion.div>
            </div>
          ))}
          <div className="flex items-start gap-x-[1.6rem]">
            <motion.span className="text-[4.75rem] font-[300] leading-[0.95] text-fg-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              =
            </motion.span>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 1.7, ease: EASE }} style={{ originX: 0 }}>
              <div className="text-[4.75rem] font-[640] uppercase leading-[0.95] tracking-[-0.05em] text-accent">Decision</div>
              <div className="mt-[0.6rem] font-mono text-[0.9375rem] text-fg-3">the business acts</div>
            </motion.div>
          </div>
        </div>
        <Reveal delay={2.3} className="mt-[3rem] max-w-[60rem] text-[1.625rem] leading-[1.45] tracking-[-0.01em] text-fg-2">
          “So the value of Retail Analytics isn't in one particular role. It's the complete journey from raw data to a decision that can actually change the
          business.”
        </Reveal>
      </div>
      <SignalStream />
    </div>
  )
}

