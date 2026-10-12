import { AnimatePresence, motion } from 'motion/react'
import { Check, Handshake, LayoutDashboard, Search, Sparkles, Store, Tag, type LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { BrandReveal } from '../components/brands'
import { AnimatedHeadline, FlowDots, Illustrative, Img, Reveal, cx, usePhases } from '../components/motion'
import { useSlide } from '../presentation/deck'
import { EASE } from '../presentation/transitions'
import { SceneHead } from './shared'

/* ------------------------------------------------------------------ Target case study */

const TARGET_RED = '#CC0000'
const STORY = ['The business', 'The challenge', 'Data in action', 'What analysts learn']
const CHANNELS = ['Shoppers in the aisle', 'Order Pickup', 'Drive Up', 'Same-day delivery (Shipt)']
const chY = (i: number) => 38 + i * 88

/** Store-as-hub diagram: distribution centres feed the store, the store serves every channel, and (from "Data in action") a ledger closes the loop. */
function TargetHub({ step }: { step: number }) {
  const data = step >= 2
  const problem = step === 1
  return (
    <svg viewBox="0 0 648 344" className="h-full w-full overflow-visible" aria-label="Distribution centres feed the store; the store serves shoppers, Order Pickup, Drive Up and same-day delivery">
      {/* distribution centres → store */}
      <motion.g initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
        <rect x={0} y={148} width={150} height={48} rx={12} className="fill-surface stroke-line-2" />
        <text x={75} y={177} textAnchor="middle" fontSize={15} className="fill-fg">
          Distribution centres
        </text>
      </motion.g>
      <path d="M150 172 L268 172" className="stroke-line-2" strokeWidth={2.5} />
      <FlowDots path="M150 172 L268 172" count={2} dur={1.6} begin={1.4} r={4.5} className="fill-fg-3" />

      {/* store → channels */}
      {CHANNELS.map((c, i) => {
        const d = `M364 172 C410 172 420 ${chY(i)} 466 ${chY(i)}`
        return (
          <g key={c}>
            <motion.path d={d} fill="none" className="stroke-line-2" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 + i * 0.08, duration: 0.6 }} />
            {!problem && <FlowDots path={d} count={2} dur={1.8} begin={1.6 + i * 0.2} r={4} className={data ? 'fill-accent' : 'fill-signal'} />}
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: problem ? 0.45 : 1, x: 0 }} transition={{ delay: problem ? 0 : 1.1 + i * 0.08, duration: 0.4 }}>
              <rect x={466} y={chY(i) - 21} width={182} height={42} rx={21} className="fill-surface stroke-line-2" />
              <text x={557} y={chY(i) + 5} textAnchor="middle" fontSize={14} className="fill-fg">
                {c}
              </text>
            </motion.g>
          </g>
        )
      })}

      {/* the store: Target's bullseye */}
      <motion.g initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7, duration: 0.6, ease: EASE }}>
        <circle cx={316} cy={172} r={46} fill={TARGET_RED} />
        <circle cx={316} cy={172} r={31} className="fill-surface" />
        <circle cx={316} cy={172} r={16} fill={TARGET_RED} />
        <text x={316} y={242} textAnchor="middle" fontSize={15} className="fill-fg font-semibold">
          Store
        </text>
      </motion.g>

      {/* the challenge: the system and the shelf disagree */}
      <motion.g initial={false} animate={{ opacity: problem ? 1 : 0, y: problem ? 0 : 8 }} transition={{ duration: 0.45, delay: problem ? 0.3 : 0 }}>
        <rect x={216} y={22} width={200} height={72} rx={12} className="fill-signal-wash stroke-signal" strokeWidth={1.5} />
        <text x={316} y={42} textAnchor="middle" fontSize={11} className="fill-signal-ink font-mono" opacity={0.75}>
          illustrative
        </text>
        <text x={316} y={63} textAnchor="middle" fontSize={14} className="fill-signal-ink font-mono">
          system: 6 on hand
        </text>
        <text x={316} y={82} textAnchor="middle" fontSize={14} className="fill-signal-ink font-mono">
          shelf: 0
        </text>
        <circle cx={316} cy={172} r={52} fill="none" className="stroke-signal" strokeWidth={2} strokeDasharray="5 5" />
      </motion.g>

      {/* data in action: the ledger closes the loop back to replenishment */}
      <motion.g initial={false} animate={{ opacity: data ? 1 : 0 }} transition={{ duration: 0.5, delay: data ? 0.3 : 0 }}>
        <path d="M316 252 L316 286" className="stroke-accent" strokeWidth={2} strokeDasharray="5 5" />
        <rect x={232} y={286} width={168} height={42} rx={21} className="fill-accent-wash stroke-accent" strokeWidth={1.5} />
        <text x={316} y={312} textAnchor="middle" fontSize={14} className="fill-accent-ink font-semibold">
          Inventory Ledger + ML
        </text>
        <path d="M232 307 C140 307 75 280 75 200" fill="none" className="stroke-accent" strokeWidth={2} />
        <path d="M68 210 L75 198 L82 210" fill="none" className="stroke-accent" strokeWidth={2} strokeLinejoin="round" />
        <text x={150} y={334} textAnchor="middle" fontSize={13} className="fill-accent-ink font-mono">
          replenish
        </text>
        {data && <FlowDots path="M232 307 C140 307 75 280 75 200" count={2} dur={1.8} begin={0.6} r={4} />}
      </motion.g>
    </svg>
  )
}

function StatRow({ big, text, delay }: { big: string; text: string; delay: number }) {
  return (
    <motion.div className="flex items-baseline gap-[1.5rem] border-t border-line py-[0.9rem]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: EASE }}>
      <span className="w-[8.5rem] shrink-0 text-[2.75rem] font-[640] leading-none tracking-[-0.045em] text-fg">{big}</span>
      <span className="text-[1.25rem] leading-[1.35] text-fg-2">{text}</span>
    </motion.div>
  )
}

function TargetStory({ step }: { step: number }) {
  if (step === 0)
    return (
      <div>
        <StatRow big="~2,000" text="stores across the US, where nearly all of its revenue is earned" delay={0.15} />
        <StatRow big="96%+" text="of sales fulfilled by stores, including most online orders" delay={0.3} />
        <StatRow big="≈ ⅓" text="of sales from owned and exclusive brands such as Good & Gather and Cat & Jack" delay={0.45} />
      </div>
    )
  if (step === 1)
    return (
      <div className="grid grid-cols-2 gap-[1.25rem]">
        {[
          ['One shelf, many channels', 'The same store stock serves shoppers in the aisle, Order Pickup, Drive Up and same-day delivery.'],
          ['Records drift from reality', 'Physical audits found half of out-of-stocks were unknown to Target’s systems: shrink and receiving errors left on-hand counts wrong, so replenishment never triggered.'],
        ].map(([t, d], i) => (
          <motion.div key={t} className="rounded-[1rem] border border-line bg-surface p-[1.2rem]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.15, duration: 0.5, ease: EASE }}>
            <div className="text-[1.375rem] font-[600] tracking-[-0.02em] text-fg">{t}</div>
            <p className="mt-[0.5rem] text-[1.0625rem] leading-[1.45] text-fg-2">{d}</p>
          </motion.div>
        ))}
      </div>
    )
  if (step === 2)
    return (
      <div>
        {[
          ['Demand forecasting', 'Blends traditional data science with neural networks.'],
          ['Inventory management', 'Inventory Ledger records every stock change, for every item, at every location.'],
          ['Out-of-stock detection', 'Category-specific ML models flag hidden out-of-stocks; the count is corrected so replenishment restocks.'],
          ['Fulfilment & supply chain', 'Distribution centres feed stores; stores fulfil same-day orders.'],
          ['Customer behaviour', 'Target Circle loyalty links offers and rewards to guests; Roundel sells advertising to brands.'],
        ].map(([t, d], i) => (
          <motion.div key={t} className="grid grid-cols-[13rem_1fr] gap-[1rem] border-t border-line py-[0.6rem]" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.09, duration: 0.45, ease: EASE }}>
            <span className="text-[1.125rem] font-[580] text-fg">{t}</span>
            <span className="text-[1.0625rem] leading-[1.4] text-fg-2">{d}</span>
          </motion.div>
        ))}
      </div>
    )
  return (
    <div className="space-y-[0.9rem]">
      {[
        'Audit the data before trusting the dashboard: a key availability metric was off by half.',
        'Tie each prediction to an action: here, a corrected count that triggers replenishment.',
        'Fit the analytics to the business model: stores that double as hubs change what you forecast.',
        'Check with people first, automate once the model has earned trust.',
      ].map((t, i) => (
        <motion.div key={t} className="flex items-start gap-[1rem]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: EASE }}>
          <span className="mt-[0.35rem] grid h-[1.75rem] w-[1.75rem] shrink-0 place-items-center rounded-full bg-accent text-white">
            <Check className="h-[1rem] w-[1rem]" strokeWidth={3} />
          </span>
          <span className="text-[1.375rem] leading-[1.38] tracking-[-0.01em] text-fg">{t}</span>
        </motion.div>
      ))}
    </div>
  )
}

export function IndustryTarget() {
  const { step, setStep } = useSlide()
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7.25rem] flex items-center gap-[1.25rem]">
        <BrandReveal id="target" height={2.75} delay={0.15} />
        <Reveal delay={0.3} x={-10} y={0}>
          <div className="t-label">Industry case study</div>
          <div className="text-[1.375rem] font-[600] tracking-[-0.02em] text-fg">Target Corporation</div>
        </Reveal>
      </div>
      <AnimatedHeadline as="h2" text={['Every store is also', 'a fulfilment hub.']} delay={0.35} className="t-display-sm absolute left-[5.5rem] top-[13.5rem] !text-[3.5rem] text-fg" />

      <div className="absolute left-[5.5rem] top-[21.6rem] flex gap-[0.5rem]" role="tablist" aria-label="Case study chapters">
        {STORY.map((s, i) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={step === i}
            onClick={() => setStep(i)}
            className={cx('rounded-full border px-[1rem] py-[0.45rem] text-[1rem] transition-colors', step === i ? 'border-fg bg-fg text-bg' : 'border-line-2 text-fg-2 hover:border-fg-3')}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="absolute left-[5.5rem] top-[26rem] w-[47rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}>
            <TargetStory step={step} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="t-label absolute bottom-[6.6rem] left-[5.5rem] !text-[0.8125rem]">
        Sources: Target 10-K, fiscal 2023 · Target Tech blog, Oct 2023 · Retail Dive, Dec 2019
      </div>

      <motion.div
        className="absolute left-[55rem] right-[5.5rem] top-[7.25rem] h-[19.5rem] overflow-hidden rounded-[1.25rem]"
        initial={{ clipPath: 'inset(0% 0% 100% 0% round 1.25rem)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 1.25rem)' }}
        transition={{ duration: 1, delay: 0.25, ease: EASE }}
      >
        <motion.div className="h-full w-full" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: EASE }}>
          <Img src="/images/target-store.webp" alt="Target store exterior with the bullseye sign at dusk" className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-[1.1rem] pb-[0.9rem] pt-[3rem] text-[1rem] text-white">
          One building: a store, a pickup point and a delivery hub
        </div>
      </motion.div>
      <div className="absolute bottom-[6.5rem] left-[55rem] right-[5.5rem] top-[28.25rem]">
        <TargetHub step={step} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ interview slides
 * Every word on these four slides comes from the interview notes. The visuals are
 * schematic: no numbers, vendors, results or extra methods are shown.
 */

function GroupHead({ children, delay = 0.35 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      className="mb-[1.1rem] flex items-center gap-[0.75rem] text-[1.375rem] font-[600] tracking-[-0.015em] text-fg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: EASE }}
    >
      <motion.span
        className="h-[2px] w-[1.75rem] origin-left bg-accent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.15, duration: 0.5, ease: EASE }}
      />
      {children}
    </motion.div>
  )
}

const headline = (text: string) => <SceneHead title={text} size="display-sm" fontSize={3.5} className="absolute left-[5.5rem] top-[7.5rem]" />

/* ------------------------------------------------------------------ business problems and metrics */

const PROBLEMS = [
  'Are we discounting the right products?',
  'Are we placing products on the right shelf?',
  'Are we buying the right products?',
  'How are sales doing online vs offline?',
  'How does demographic change affect the business?',
  'How are competitors doing in terms of sales?',
]
const METRICS = ['Net Revenue', 'Sales Margin', 'In-stock and Out-of-stock Rate', 'Walk-in Purchase Rate']

export function IndustryProblems() {
  return (
    <div className="stage">
      {headline('Business problems and metrics')}

      <div className="absolute left-[5.5rem] top-[14.75rem] w-[56rem]">
        <GroupHead>Common business problems</GroupHead>
        <div className="grid grid-cols-2 gap-[0.9rem]">
          {PROBLEMS.map((q, i) => (
            <motion.div
              key={q}
              className="flex min-h-[7rem] items-start gap-[1rem] rounded-[1rem] border border-line bg-surface p-[1.2rem] transition-colors duration-300 hover:border-fg-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.55, ease: EASE }}
            >
              <span className="grid h-[2.25rem] w-[2.25rem] shrink-0 place-items-center rounded-full bg-bg-2 text-[1.125rem] font-[650] text-fg-2" aria-hidden>
                ?
              </span>
              <span className="text-[1.375rem] leading-[1.32] tracking-[-0.01em] text-fg">{q}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute left-[65rem] right-[5.5rem] top-[14.75rem]">
        <GroupHead delay={0.85}>Important business metrics</GroupHead>
        <div className="space-y-[0.9rem]">
          {METRICS.map((m, i) => (
            <motion.div
              key={m}
              className="relative overflow-hidden rounded-[1rem] bg-accent-wash py-[1.2rem] pl-[1.6rem] pr-[1.2rem]"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.55, ease: EASE }}
            >
              <motion.span
                className="absolute inset-y-0 left-0 w-[4px] origin-top bg-accent"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.5, ease: EASE }}
              />
              <span className="text-[1.625rem] font-[620] leading-[1.18] tracking-[-0.02em] text-accent-ink">{m}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ Essential Beauty: analytics project */

type Region = 'vendors' | 'dashboard' | 'ai' | 'tariffs'
const REQUIREMENTS: { text: string; Icon: LucideIcon; region: Region }[] = [
  { text: 'Understand why vendors are not performing well.', Icon: Search, region: 'vendors' },
  { text: 'Create a dashboard overview of vendor performance in the marketplace.', Icon: LayoutDashboard, region: 'dashboard' },
  { text: 'Provide an AI summary.', Icon: Sparkles, region: 'ai' },
  { text: 'Understand how tariffs and price changes could affect the business.', Icon: Tag, region: 'tariffs' },
]
/** Each requirement appears with the part of the dashboard it asks for; the highlight then settles. */
const REQ_AT = [0.7, 1.3, 1.9, 2.5]

function Skeleton({ width, delay, show }: { width: string; delay: number; show: boolean }) {
  return (
    <motion.span
      className="block h-[0.6rem] rounded-full bg-line-2"
      initial={{ width: '0%' }}
      animate={{ width: show ? width : '0%' }}
      transition={{ delay, duration: 0.6, ease: EASE }}
    />
  )
}

export function IndustryProject() {
  const phase = usePhases([...REQ_AT, REQ_AT[REQ_AT.length - 1] + 1])
  const [hover, setHover] = useState<Region | null>(null)
  const auto = phase >= 1 && phase <= REQUIREMENTS.length ? REQUIREMENTS[phase - 1].region : null
  const active = hover ?? auto
  const shown = (r: Region) => phase > REQUIREMENTS.findIndex((x) => x.region === r)
  const lit = (r: Region) => (active === r ? 'bg-accent-wash/70 ring-2 ring-inset ring-accent' : '')

  return (
    <div className="stage">
      {headline('Essential Beauty: analytics project')}

      <div className="absolute left-[5.5rem] top-[14.75rem] w-[38rem]">
        <GroupHead>Stakeholder's requirement</GroupHead>
        {REQUIREMENTS.map(({ text, Icon, region }, i) => (
          <motion.div
            key={text}
            className={cx('flex items-start gap-[1rem] rounded-[0.9rem] border-t border-line px-[0.6rem] py-[1.05rem] transition-colors duration-300', active === region && 'bg-accent-wash/60')}
            onMouseEnter={() => setHover(region)}
            onMouseLeave={() => setHover(null)}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: REQ_AT[i], duration: 0.5, ease: EASE }}
          >
            <span className={cx('grid h-[2.6rem] w-[2.6rem] shrink-0 place-items-center rounded-full border transition-colors duration-300', active === region ? 'border-accent bg-accent text-white' : 'border-line-2 text-fg-2')}>
              <Icon className="h-[1.15rem] w-[1.15rem]" />
            </span>
            <span className="pt-[0.2rem] text-[1.375rem] leading-[1.35] tracking-[-0.01em] text-fg">{text}</span>
          </motion.div>
        ))}
      </div>

      {/* schematic dashboard: structure only, no data */}
      <motion.div
        className={cx('absolute bottom-[9rem] left-[47.5rem] right-[5.5rem] top-[14.75rem] flex flex-col overflow-hidden rounded-[1.25rem] border bg-surface transition-colors duration-300', active === 'dashboard' ? 'border-accent' : 'border-line-2')}
        initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0% round 1.25rem)' }}
        animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 1.25rem)' }}
        transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
        aria-label="Schematic of the requested vendor performance dashboard"
      >
        <div className={cx('flex items-center gap-[0.9rem] border-b border-line px-[1.4rem] py-[1rem] transition-colors duration-300', lit('dashboard'))}>
          <LayoutDashboard className="h-[1.5rem] w-[1.5rem] text-accent" />
          <div>
            <div className="text-[1.25rem] font-[600] tracking-[-0.015em] text-fg">Dashboard overview</div>
            <div className="text-[1rem] text-fg-3">Vendor performance in the marketplace</div>
          </div>
        </div>

        <div className={cx('relative flex flex-1 flex-col px-[1.4rem] py-[1rem] transition-colors duration-300', lit('vendors'))}>
          <div className="t-label mb-[0.6rem]">Vendors</div>
          <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-[0.75rem]">
            {Array.from({ length: 6 }, (_, k) => (
              <motion.div
                key={k}
                className="flex items-center gap-[0.75rem] rounded-[0.8rem] border border-line bg-bg px-[0.85rem] py-[0.8rem]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: shown('vendors') ? 1 : 0, y: shown('vendors') ? 0 : 8 }}
                transition={{ delay: k * 0.05, duration: 0.4 }}
              >
                <Store className="h-[1.25rem] w-[1.25rem] shrink-0 text-fg-3" />
                <span className="flex-1 space-y-[0.4rem]">
                  <Skeleton width="85%" delay={0.2 + k * 0.05} show={shown('vendors')} />
                  <Skeleton width="55%" delay={0.3 + k * 0.05} show={shown('vendors')} />
                </span>
              </motion.div>
            ))}
          </div>
          {/* "why are vendors not performing well?" — a lens passes over the vendors */}
          <motion.span
            className="pointer-events-none absolute grid h-[2.75rem] w-[2.75rem] place-items-center rounded-full border border-line-2 bg-surface text-accent shadow-[0_6px_18px_-8px_rgba(0,0,0,0.35)]"
            initial={{ opacity: 0, left: '6%', top: '38%' }}
            animate={shown('vendors') ? { opacity: 1, left: ['6%', '40%', '74%', '74%', '40%', '6%', '86%'], top: ['38%', '38%', '38%', '70%', '70%', '70%', '8%'] } : { opacity: 0 }}
            transition={{ duration: 2.6, ease: 'easeInOut', delay: 0.3 }}
          >
            <Search className="h-[1.2rem] w-[1.2rem]" />
          </motion.span>
        </div>

        <div className="grid grid-cols-2 border-t border-line">
          <div className={cx('border-r border-line px-[1.4rem] py-[1rem] transition-colors duration-300', lit('ai'))}>
            <div className="mb-[0.7rem] flex items-center gap-[0.5rem] text-[1.0625rem] font-[580] text-fg">
              <Sparkles className="h-[1.1rem] w-[1.1rem] text-accent" /> AI summary
            </div>
            <div className="space-y-[0.55rem]">
              <Skeleton width="92%" delay={0} show={shown('ai')} />
              <Skeleton width="78%" delay={0.15} show={shown('ai')} />
              <Skeleton width="86%" delay={0.3} show={shown('ai')} />
            </div>
          </div>
          <div className={cx('px-[1.4rem] py-[1rem] transition-colors duration-300', lit('tariffs'))}>
            <svg viewBox="0 0 300 96" className="w-full overflow-visible" aria-label="Tariffs and price changes affecting the business">
              {[
                ['Tariffs', 6, 54],
                ['Price changes', 164, 130],
              ].map(([label, x, w], k) => (
                <motion.g key={label as string} initial={{ opacity: 0 }} animate={{ opacity: shown('tariffs') ? 1 : 0 }} transition={{ delay: k * 0.12, duration: 0.4 }}>
                  <rect x={x as number} y={0} width={w as number} height={30} rx={15} className="fill-bg stroke-line-2" />
                  <text x={(x as number) + (w as number) / 2} y={20} textAnchor="middle" fontSize={14} className="fill-fg">
                    {label}
                  </text>
                </motion.g>
              ))}
              {['M33 30 C33 52 150 46 150 64', 'M229 30 C229 52 150 46 150 64'].map((d, k) => (
                <motion.path key={d} d={d} fill="none" className="stroke-accent" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: shown('tariffs') ? 1 : 0 }} transition={{ delay: 0.3 + k * 0.1, duration: 0.6 }} />
              ))}
              {shown('tariffs') && <FlowDots path="M33 30 C33 52 150 46 150 64" count={1} dur={1.6} begin={1} r={3.5} />}
              {shown('tariffs') && <FlowDots path="M229 30 C229 52 150 46 150 64" count={1} dur={1.6} begin={1.4} r={3.5} />}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: shown('tariffs') ? 1 : 0, y: shown('tariffs') ? 0 : 6 }} transition={{ delay: 0.7, duration: 0.4 }}>
                <rect x={104} y={64} width={92} height={30} rx={15} className="fill-accent" />
                <text x={150} y={84} textAnchor="middle" fontSize={14} className="fill-white font-semibold">
                  Business
                </text>
              </motion.g>
            </svg>
          </div>
        </div>
      </motion.div>
      <Illustrative className="absolute bottom-[6.75rem] left-[47.5rem]">Schematic layout — no real vendor data</Illustrative>
    </div>
  )
}

/* ------------------------------------------------------------------ collaboration and tools */

const TOOLS = ['SQL', 'Python', 'Hadoop', 'GCP', 'Domo', 'Power BI', 'GitHub']
const FLOWS = [
  { from: 'Business problems', to: 'Business team', note: null },
  { from: 'Promotions or discounts', to: 'Promotion team', note: 'Analyse the impact on sales' },
]

export function IndustryCollab() {
  // diagram geometry in px of a 54rem × 21rem box (16px = 1rem)
  const rowY = [88, 248]
  const spine = 'M18 0 L18 248'
  return (
    <div className="stage">
      {headline('Collaboration and tools')}

      <div className="absolute left-[5.5rem] top-[14.75rem] w-[54rem]">
        <GroupHead>Cross-functional collaboration</GroupHead>
        <motion.div
          className="flex items-center gap-[0.75rem] rounded-[1rem] border border-line-2 bg-surface px-[1.2rem] py-[0.9rem] text-[1.25rem] leading-[1.35] text-fg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
        >
          <Handshake className="h-[1.5rem] w-[1.5rem] shrink-0 text-accent" />
          Collaboration depends on the business problem and the specific project.
        </motion.div>

        <div className="relative mt-[0.25rem] h-[21rem]">
          <svg viewBox="0 0 864 336" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <motion.path d={spine} fill="none" className="stroke-line-2" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.6 }} />
            {rowY.map((y, i) => (
              <g key={y}>
                <motion.path d={`M18 ${y} L48 ${y}`} fill="none" className="stroke-line-2" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 + i * 0.5, duration: 0.3 }} />
                <motion.path d={`M352 ${y} L520 ${y}`} fill="none" className="stroke-accent" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.25 + i * 0.5, duration: 0.5, ease: EASE }} />
                <motion.path d={`M510 ${y - 8} L522 ${y} L510 ${y + 8}`} fill="none" className="stroke-accent" strokeWidth={2.5} strokeLinejoin="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 + i * 0.5 }} />
                <motion.text x={436} y={y - 14} textAnchor="middle" fontSize={15} className="fill-fg-3 font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 + i * 0.5 }}>
                  collaborate with
                </motion.text>
                <FlowDots path={`M352 ${y} L520 ${y}`} count={2} dur={1.8} begin={2.4 + i * 0.4} r={4.5} />
              </g>
            ))}
          </svg>
          {FLOWS.map((f, i) => (
            <div key={f.from}>
              <motion.div
                className="absolute flex h-[4rem] w-[19rem] -translate-y-1/2 items-center rounded-[1rem] border border-line-2 bg-surface px-[1.2rem] text-[1.375rem] font-[560] tracking-[-0.01em] text-fg"
                style={{ left: '3rem', top: `${rowY[i] / 16}rem` }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.05 + i * 0.5, duration: 0.45, ease: EASE }}
              >
                {f.from}
              </motion.div>
              <motion.div
                className="absolute w-[21rem] -translate-y-[2rem]"
                style={{ left: '33rem', top: `${rowY[i] / 16}rem` }}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + i * 0.5, duration: 0.45, ease: EASE }}
              >
                <div className="flex h-[4rem] items-center rounded-[1rem] bg-accent px-[1.2rem] text-[1.375rem] font-[600] tracking-[-0.01em] text-white">{f.to}</div>
                {f.note && <div className="mt-[0.6rem] text-[1.125rem] leading-[1.35] text-fg-2">{f.note}</div>}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute left-[67rem] right-[5.5rem] top-[14.75rem]">
        <GroupHead delay={0.7}>Tools used</GroupHead>
        <div className="space-y-[0.6rem]">
          {TOOLS.map((t, i) => (
            <motion.div
              key={t}
              className="flex h-[3.6rem] items-center rounded-[0.9rem] border border-line bg-surface px-[1.2rem] text-[1.5rem] font-[600] tracking-[-0.02em] text-fg transition-colors duration-300 hover:border-accent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85 + i * 0.07, duration: 0.45, ease: EASE }}
            >
              {t}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ machine learning and challenges */

const CHALLENGES = ['Missing metrics', 'Satisfying stakeholders', 'Pull-in inventory', 'How to attract customers', 'How to retain customers']
const PAST = [214, 200, 208, 186, 192, 168, 176, 156, 162, 140]
const pastX = (i: number) => 52 + i * 40
const FUTURE = [
  [460, 132],
  [510, 140],
  [560, 120],
  [610, 126],
  [670, 108],
]

export function IndustryML() {
  const past = PAST.map((y, i) => `${i ? 'L' : 'M'}${pastX(i)} ${y}`).join(' ')
  const future = `M${pastX(PAST.length - 1)} ${PAST[PAST.length - 1]} ` + FUTURE.map(([x, y]) => `L${x} ${y}`).join(' ')
  return (
    <div className="stage">
      {headline('Machine learning and challenges')}

      <div className="absolute left-[5.5rem] top-[14.75rem] w-[45rem]">
        <GroupHead>Machine learning</GroupHead>
        <motion.p
          className="text-[2.25rem] font-[620] leading-[1.15] tracking-[-0.03em] text-fg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
        >
          ML is integrated for Demand Forecasting.
        </motion.p>
        <svg viewBox="0 0 720 270" className="mt-[1.75rem] w-full overflow-visible" aria-label="Schematic demand forecasting chart: past demand as a solid line, forecast as a dashed line">
          <line x1={40} x2={700} y1={250} y2={250} className="stroke-line-2" />
          <line x1={40} x2={40} y1={40} y2={250} className="stroke-line-2" />
          <text x={48} y={36} fontSize={14} className="fill-fg-3 font-mono">
            Demand
          </text>
          <motion.path d={past} fill="none" className="stroke-fg-2" strokeWidth={2.75} strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 1.1, ease: EASE }} />
          <defs>
            <clipPath id="ml-forecast-reveal">
              <motion.rect x={pastX(PAST.length - 1)} y={0} height={270} initial={{ width: 0 }} animate={{ width: 340 }} transition={{ delay: 2.1, duration: 1, ease: EASE }} />
            </clipPath>
          </defs>
          <line x1={pastX(PAST.length - 1) + 4} x2={pastX(PAST.length - 1) + 4} y1={60} y2={250} className="stroke-line" strokeDasharray="4 6" />
          <g clipPath="url(#ml-forecast-reveal)">
            <path d={future} fill="none" className="stroke-accent" strokeWidth={3} strokeDasharray="9 7" strokeLinejoin="round" />
            <circle cx={670} cy={108} r={6} className="fill-accent stroke-bg" strokeWidth={3} />
          </g>
          <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.45 }}>
            <rect x={530} y={8} width={64} height={36} rx={10} className="fill-accent" />
            <text x={562} y={32} textAnchor="middle" fontSize={17} className="fill-white font-semibold">
              ML
            </text>
            <path d="M562 44 L562 112" className="stroke-accent" strokeWidth={2} strokeDasharray="3 5" />
          </motion.g>
          <motion.text x={700} y={176} textAnchor="end" fontSize={16} className="fill-accent-ink font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}>
            Demand forecasting
          </motion.text>
        </svg>
      </div>

      <div className="absolute left-[56rem] right-[5.5rem] top-[14.75rem]">
        <GroupHead delay={0.6}>Challenges</GroupHead>
        {CHALLENGES.map((c, i) => (
          <motion.div
            key={c}
            className="flex items-center gap-[1.1rem] border-t border-line py-[1.1rem]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.5, ease: EASE }}
          >
            <motion.span
              className="h-[0.75rem] w-[0.75rem] shrink-0 rounded-[3px] bg-signal"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.1, type: 'spring', stiffness: 380, damping: 18 }}
            />
            <span className="text-[1.75rem] font-[560] tracking-[-0.02em] text-fg">{c}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
