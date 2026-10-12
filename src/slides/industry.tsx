import { AnimatePresence, motion, usePresenceData } from 'motion/react'
import { Bike, Check, Clock, MapPin, Monitor, Package, Search, ShoppingCart, Store, Truck, Users, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BrandLogo, BrandReveal, type BrandId } from '../components/brands'
import { AnimatedCounter, AnimatedHeadline, FlowDots, Highlight, Illustrative, Img, Reveal, cx } from '../components/motion'
import { useSlide } from '../presentation/deck'
import { EASE, type TransitionCustom } from '../presentation/transitions'
import { Capabilities, ChapterOpener } from './shared'

/* ------------------------------------------------------------------ 04 · opener */

const MODELS: { name: string; Icon: LucideIcon; q: string }[] = [
  { name: 'E-commerce', Icon: Monitor, q: 'Which product should this customer see?' },
  { name: 'Physical retail', Icon: Store, q: 'Will the product be available on the shelf?' },
  { name: 'Quick commerce', Icon: Bike, q: 'Every minute changes the decision.' },
]

function OneLineThreeModels() {
  const { step } = useSlide()
  const ys = [130, 300, 470]
  return (
    <div className="relative mt-[3rem] h-[37.5rem] w-full">
      <svg viewBox="0 0 632 600" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <motion.path d="M-40 300 L120 300" fill="none" className="stroke-fg-2" strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.4 }} />
        {ys.map((y, i) => {
          const d = `M120 300 C200 300 220 ${y} 300 ${y}`
          return (
            <g key={y}>
              <motion.path d={d} fill="none" className="stroke-fg-2" strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.1 + i * 0.12, ease: EASE }} />
              <FlowDots path={`M-40 300 L120 300 ${d.slice(9)}`} count={2} dur={2.2} begin={2 + i * 0.4} r={5} className={i === 2 ? 'fill-signal' : 'fill-accent'} />
            </g>
          )
        })}
        <motion.circle cx={120} cy={300} r={9} className="fill-fg" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, duration: 0.4 }} />
        <motion.text x={120} y={340} textAnchor="middle" fontSize={15} className="fill-fg-3 font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          same data
        </motion.text>
      </svg>
      {MODELS.map(({ name, Icon, q }, i) => (
        <motion.div
          key={name}
          className="absolute left-[18.75rem] flex w-[20.5rem] -translate-y-1/2 items-start gap-[1rem]"
          style={{ top: `${ys[i] / 16}rem` }}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6 + i * 0.15, duration: 0.6, ease: EASE }}
        >
          <span className="grid h-[3.5rem] w-[3.5rem] shrink-0 place-items-center rounded-full border border-line-2 bg-surface">
            <Icon className="h-[1.5rem] w-[1.5rem] text-fg" />
          </span>
          <div className="pt-[0.2rem]">
            <div className="text-[1.5rem] font-[600] tracking-[-0.02em] text-fg">{name}</div>
            <motion.div className="text-[1.0625rem] leading-[1.35] text-fg-2" initial={false} animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 6 }} transition={{ delay: step >= 1 ? 0.4 + i * 0.15 : 0, duration: 0.5 }}>
              {q}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function IndustryIntro() {
  const { step } = useSlide()
  return (
    <ChapterOpener
      number="04"
      label="Industry"
      title="Same Data. Completely Different Problems."
      titleSize={4.25}
      first={<>Retail analytics doesn't look the same everywhere.</>}
      second={
        <>
          A supermarket, an e-commerce company and a 10-minute delivery company may all use AI, but <Highlight on={step >= 1} delay={0.5}>they are solving completely different problems</Highlight>.
        </>
      }
      visual={<OneLineThreeModels />}
    />
  )
}

/* ------------------------------------------------------------------ shared: brand row + headline */

function BrandHead({ brands, title, chip, heights }: { brands: BrandId[]; title: string[]; chip?: boolean; heights?: number[] }) {
  return (
    <div className="absolute left-[5.5rem] top-[7.5rem]">
      <div className="flex items-center gap-[2rem]">
        {brands.map((b, i) => (
          <BrandReveal key={b} id={b} height={heights?.[i] ?? 2.4} delay={0.15 + i * 0.15} chip={chip} />
        ))}
      </div>
      <AnimatedHeadline as="h2" text={title} delay={0.45} className="t-display-sm mt-[1.6rem] text-fg" />
    </div>
  )
}

/* ------------------------------------------------------------------ e-commerce */

const ECOM_PRODUCTS = [
  { id: 'red', name: 'Racer', price: '₹6,299', img: 'shoe-red' },
  { id: 'phones', name: 'Headphones', price: '₹3,499', img: 'headphones' },
  { id: 'air', name: 'Road runner', price: '₹5,499', img: 'shoe-airmax' },
  { id: 'neon', name: 'Court trainer', price: '₹4,299', img: 'shoe-neon' },
  { id: 'trail', name: 'Trail runner', price: '₹4,999', img: 'shoe-runner' },
  { id: 'socks', name: 'Running socks', price: '₹299', img: 'socks' },
]
const RANKED = ['trail', 'air', 'socks', 'red', 'neon', 'phones']
const FULFIL = ['Order placed', 'Picked at fulfilment centre', 'Packed and labelled', 'Out for delivery', 'Delivered']

function FulfilmentTrack() {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    const ids = FULFIL.map((_, i) => window.setTimeout(() => setStage(i), 500 + i * 900))
    return () => ids.forEach(window.clearTimeout)
  }, [])
  return (
    <div className="panel overflow-hidden">
      <div className="relative h-[10.5rem]">
        <Img src="/images/fulfilment.webp" alt="Fulfilment centre with shelving and storage bins" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-[0.8rem] left-[1rem] text-[1.0625rem] font-[560] text-white">Fulfilment centre</div>
      </div>
      <div className="relative px-[1.25rem] py-[1rem]">
        <div className="absolute bottom-[1.6rem] left-[2rem] top-[1.6rem] w-[2px] bg-line" />
        <motion.div className="absolute left-[2rem] top-[1.6rem] w-[2px] origin-top bg-accent" initial={{ height: 0 }} animate={{ height: `${(stage / (FULFIL.length - 1)) * 10.4}rem` }} transition={{ duration: 0.7, ease: EASE }} />
        {FULFIL.map((f, i) => (
          <div key={f} className="relative flex h-[2.6rem] items-center gap-[1rem]">
            <span className={cx('z-10 ml-[0.25rem] grid h-[1.5rem] w-[1.5rem] place-items-center rounded-full border-2 transition-colors duration-300', i <= stage ? 'border-accent bg-accent text-white' : 'border-line-2 bg-surface')}>
              {i <= stage && <Check className="h-[0.8rem] w-[0.8rem]" strokeWidth={3} />}
            </span>
            <span className={cx('text-[1.0625rem] transition-colors', i <= stage ? 'text-fg' : 'text-fg-3')}>{f}</span>
            {i === stage && i < FULFIL.length - 1 && <Package className="ml-auto h-[1.2rem] w-[1.2rem] text-signal" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export function IndustryEcom() {
  const { step } = useSlide()
  const order = step >= 1 ? RANKED : ECOM_PRODUCTS.map((p) => p.id)
  const lit = step === 0 ? ['Search'] : step === 1 ? ['Search', 'Recommendations'] : ['Demand Forecasting', 'Inventory', 'Logistics']
  return (
    <div className="stage">
      <BrandHead brands={['amazon', 'flipkart']} title={['Which product should', 'this customer see?']} heights={[2.3, 2.5]} />

      <motion.div className="panel absolute left-[5.5rem] top-[20.5rem] w-[54rem] p-[1.1rem]" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7, ease: EASE }}>
        <div className="mb-[0.9rem] flex h-[2.6rem] items-center gap-[0.6rem] rounded-full bg-bg-2 px-[1rem] text-[1.0625rem] text-fg">
          <Search className="h-[1.05rem] w-[1.05rem] text-fg-3" /> running shoes
          <span className="ml-auto font-mono text-[0.875rem] text-fg-3">{step >= 1 ? 'sorted for you' : '1,284 results'}</span>
        </div>
        <div className="grid grid-cols-3 gap-[0.8rem]">
          {order.map((id, i) => {
            const p = ECOM_PRODUCTS.find((x) => x.id === id)!
            const top = step >= 1 && i === 0
            return (
              <motion.div key={id} layout transition={{ layout: { duration: 0.9, ease: EASE } }} className={cx('relative overflow-hidden rounded-[0.9rem] border bg-surface', top ? 'border-accent ring-2 ring-accent/30' : 'border-line')}>
                <div className="h-[6.25rem] overflow-hidden bg-[#efefed]">
                  <Img src={`/images/${p.img}.webp`} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between px-[0.8rem] py-[0.5rem]">
                  <span className="text-[0.9375rem] font-[560] text-fg">{p.name}</span>
                  <span className="text-[0.875rem] text-fg-3">{p.price}</span>
                </div>
                <AnimatePresence>
                  {top && (
                    <motion.span className="absolute left-[0.6rem] top-[0.6rem] rounded-full bg-accent px-[0.65rem] py-[0.2rem] text-[0.8125rem] font-[560] text-white" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.8 }}>
                      Recommended for you
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <div className="absolute left-[62.5rem] right-[5.5rem] top-[7.75rem]">
        <AnimatePresence mode="wait" initial={false}>
          {step < 2 ? (
            <motion.div key="why" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
              <div className="t-label mb-[0.75rem]">What the ranking can use</div>
              {[
                ['Searched “running shoes” twice this week', 'Search'],
                ['Opened two trail-running listings', 'Behaviour'],
                ['Buys mid-range, size UK 9', 'History'],
                ['Shoes like these are in stock nearby', 'Inventory'],
              ].map(([t, k], i) => (
                <motion.div key={t} className="flex items-center justify-between gap-[1rem] border-t border-line py-[0.8rem]" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }}>
                  <span className="text-[1.0625rem] text-fg">{t}</span>
                  <span className="font-mono text-[0.8125rem] text-fg-3">{k}</span>
                </motion.div>
              ))}
              <motion.p className="mt-[1rem] text-[1.125rem] leading-[1.45] text-fg-2" initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ delay: step >= 1 ? 0.8 : 0 }}>
                The best match moves to the first slot, before the customer scrolls.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="fulfil" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <div className="t-label mb-[0.75rem]">Then the order has to arrive</div>
              <FulfilmentTrack />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Capabilities items={['Search', 'Recommendations', 'Demand Forecasting', 'Inventory', 'Logistics']} on={lit} className="absolute bottom-[6.6rem] left-[5.5rem]" />
    </div>
  )
}

/* ------------------------------------------------------------------ physical retail */

const SHELF_COLORS = ['#c9a86a', '#b5573b', '#6d8a5f', '#d8c9a3', '#7b8fa3', '#a35d6a', '#e0b44c', '#8c7b6b']

function Shelf({ step }: { step: number }) {
  // the middle row holds "Atta 5 kg": it sells down, runs out, then gets refilled
  const [left, setLeft] = useState(5)
  useEffect(() => {
    if (step === 0) {
      setLeft(5)
      const ids = [1, 2, 3].map((k) => window.setTimeout(() => setLeft(5 - k), 900 + k * 700))
      return () => ids.forEach(window.clearTimeout)
    }
    if (step === 1) {
      setLeft(1)
      const id = window.setTimeout(() => setLeft(0), 500)
      return () => window.clearTimeout(id)
    }
    setLeft(0)
    const ids = [1, 2, 3, 4, 5].map((k) => window.setTimeout(() => setLeft(k), 700 + k * 160))
    return () => ids.forEach(window.clearTimeout)
  }, [step])
  const rows = [0, 1]
  const W = 820
  const rowY = (r: number) => 30 + r * 150
  return (
    <svg viewBox={`0 0 ${W} 330`} className="w-full overflow-visible" aria-label={`Supermarket shelf; atta packs on the middle shelf: ${left} of 5 left`}>
      <rect x={0} y={0} width={W} height={330} rx={16} className="fill-bg-2" />
      {rows.map((r) => (
        <g key={r}>
          {Array.from({ length: 11 }, (_, k) => {
            const isTarget = r === 1 && k >= 3 && k < 8
            const slot = k - 3
            const present = !isTarget || slot < left
            const x = 22 + k * 72
            return (
              <g key={k}>
                {isTarget && <rect x={x} y={rowY(r) + 8} width={60} height={92} rx={6} fill="none" className={left === 0 ? 'stroke-neg' : 'stroke-line-2'} strokeWidth={1.5} strokeDasharray="5 5" />}
                <motion.g initial={false} animate={{ opacity: present ? 1 : 0, y: present ? 0 : -24 }} transition={{ duration: 0.45, ease: EASE }}>
                  <rect x={x} y={rowY(r) + 8} width={60} height={92} rx={6} fill={isTarget ? '#d9b26a' : SHELF_COLORS[(k + r * 3) % SHELF_COLORS.length]} />
                  <rect x={x + 8} y={rowY(r) + 34} width={44} height={22} rx={3} fill="#fbfaf7" opacity={0.85} />
                  {isTarget && (
                    <text x={x + 30} y={rowY(r) + 50} textAnchor="middle" fontSize={11} fill="#4b3a1a" fontWeight={600}>
                      ATTA
                    </text>
                  )}
                </motion.g>
              </g>
            )
          })}
          <rect x={10} y={rowY(r) + 102} width={W - 20} height={14} rx={3} className="fill-line-2" />
          <rect x={60} y={rowY(r) + 118} width={64} height={22} rx={3} fill="#fbfaf7" />
          <text x={92} y={rowY(r) + 134} textAnchor="middle" fontSize={12} fill="#171a17" className="font-mono">
            ₹{[89, 249][r]}
          </text>
        </g>
      ))}
      {/* shelf-edge label for the target product */}
      <motion.g initial={false} animate={{ y: 0 }}>
        <rect x={330} y={rowY(1) + 116} width={170} height={28} rx={4} className={cx('transition-colors duration-500', left === 0 ? 'fill-neg' : 'fill-[#fbfaf7]')} />
        <text x={415} y={rowY(1) + 135} textAnchor="middle" fontSize={13} className={cx('font-mono transition-colors duration-500', left === 0 ? 'fill-white' : 'fill-[#171a17]')}>
          {left === 0 ? 'OUT OF STOCK' : `ATTA 5 KG · ₹249`}
        </text>
      </motion.g>
    </svg>
  )
}

export function IndustryStore() {
  const { step } = useSlide()
  const availability = [98, 91, 99][step]
  const lost = [0, 37, 37][step]
  const lit = step === 0 ? ['Product Assortment', 'Pricing'] : step === 1 ? ['Inventory', 'Store Performance'] : ['Supply Chain', 'Inventory']
  return (
    <div className="stage">
      <BrandHead brands={['dmart', 'walmart']} title={['Will the product be', 'available on the shelf?']} heights={[2.5, 2.3]} />

      <motion.div className="absolute left-[5.5rem] top-[21.25rem] w-[51.25rem]" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7, ease: EASE }}>
        <Shelf step={step} />
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              className="absolute left-[23rem] top-[3.5rem] flex items-center gap-[0.75rem] rounded-[1rem] bg-fg px-[1rem] py-[0.75rem] text-bg shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]"
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.9, duration: 0.45 }}
            >
              <Users className="h-[1.3rem] w-[1.3rem] text-signal" />
              <span className="text-[1rem] leading-[1.35]">
                A shopper can't find it,
                <br />
                buys elsewhere or leaves.
              </span>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              className="absolute right-[1rem] top-[-1.25rem] flex max-w-[24rem] items-center gap-[0.75rem] rounded-[1rem] bg-accent px-[1rem] py-[0.75rem] text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Truck className="h-[1.3rem] w-[1.3rem]" />
              <span className="text-[1rem] leading-[1.35]">Refilled from the backroom; the next delivery is already planned.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="absolute left-[60rem] right-[5.5rem] top-[7.75rem]">
        <motion.div className="relative h-[12.5rem] overflow-hidden rounded-[1.1rem]" initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0 round 1.1rem)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0 round 1.1rem)' }} transition={{ delay: 0.3, duration: 0.9, ease: EASE }}>
          <Img src="/images/store-aisle.webp" alt="Supermarket aisle with stocked shelves" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute bottom-[0.8rem] left-[1rem] text-[1.0625rem] font-[560] text-white">Store 214 · evening rush</div>
        </motion.div>
        <div className="mt-[1.5rem] space-y-[1.1rem]">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="t-label">On-shelf availability</span>
              <span className={cx('text-[2rem] font-[620] tracking-[-0.03em] tnum', availability < 95 ? 'text-neg' : 'text-fg')}>
                <AnimatedCounter value={availability} from={98} />%
              </span>
            </div>
            <div className="mt-[0.4rem] h-[0.6rem] overflow-hidden rounded-full bg-line">
              <motion.div className={cx('h-full rounded-full', availability < 95 ? 'bg-neg' : 'bg-accent')} initial={{ width: '0%' }} animate={{ width: `${availability}%` }} transition={{ duration: 0.9, ease: EASE }} />
            </div>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-[0.9rem]">
            <span className="t-label">Sales lost to the gap today</span>
            <span className="text-[2rem] font-[620] tracking-[-0.03em] text-fg tnum">
              <AnimatedCounter value={lost} /> packs
            </span>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-[0.9rem]">
            <span className="t-label">Backroom stock</span>
            <span className="text-[1.25rem] text-fg">{step === 2 ? 'Refilled · 115 packs left' : '120 packs waiting'}</span>
          </div>
          <Illustrative>Illustrative store figures</Illustrative>
        </div>
      </div>

      <Capabilities items={['Inventory', 'Product Assortment', 'Pricing', 'Store Performance', 'Supply Chain']} on={lit} className="absolute bottom-[6.6rem] left-[5.5rem]" />
    </div>
  )
}

/* ------------------------------------------------------------------ quick commerce */

const QC_STEPS = [
  { t: 'Heavy rain', d: 'A downpour starts across the city.' },
  { t: 'Changing customer behaviour', d: 'People stay in and order umbrellas, tea, snacks and hot food.' },
  { t: 'Demand increase', d: 'Orders per minute almost double.' },
  { t: 'Inventory decline', d: 'Umbrellas and snacks run low in the dark store.' },
  { t: 'Operational response', d: 'Restock, add riders, adjust delivery promises.' },
]
const HOMES = [
  [150, 140], [260, 90], [640, 120], [720, 210], [770, 380], [690, 540], [520, 600], [330, 590], [170, 520], [110, 330], [250, 260], [600, 300], [360, 170], [560, 470],
] as const
const ORDERS_PER_MIN = [42, 44, 58, 81, 84, 76]
const STOCK = [
  [80, 72, 76],
  [80, 72, 76],
  [64, 58, 74],
  [44, 40, 71],
  [12, 18, 66],
  [86, 78, 72],
]
const SKUS = ['Umbrellas', 'Tea & snacks', 'Milk']

function CityMap({ step }: { step: number }) {
  const store = [436, 336] as const
  const raining = step >= 1
  const busy = step >= 2
  const routes = HOMES.map(([x, y]) => `M${store[0]} ${store[1]} L${x} ${store[1]} L${x} ${y}`)
  const riders = busy ? (step >= 5 ? 9 : 6) : 3
  return (
    <svg viewBox="0 0 872 672" className="h-full w-full" aria-label="Simulated city map with a dark store, delivery routes and incoming orders">
      <rect width={872} height={672} className="fill-bg-2" />
      <path d="M-20 470 C160 420 260 560 420 520 S700 400 900 460" fill="none" stroke="#1f2b28" strokeWidth={46} />
      <rect x={560} y={60} width={130} height={90} rx={10} fill="#18261d" />
      <rect x={80} y={380} width={110} height={80} rx={10} fill="#18261d" />
      {Array.from({ length: 10 }, (_, i) => (
        <line key={`v${i}`} x1={40 + i * 88} x2={40 + i * 88} y1={0} y2={672} className="stroke-line" strokeWidth={i % 3 === 0 ? 5 : 2} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`h${i}`} x1={0} x2={872} y1={30 + i * 88} y2={30 + i * 88} className="stroke-line" strokeWidth={i % 3 === 1 ? 5 : 2} />
      ))}
      <circle cx={store[0]} cy={store[1]} r={250} fill="none" className="stroke-accent/50" strokeWidth={1.5} strokeDasharray="6 8" />
      <text x={store[0] + 180} y={store[1] - 190} fontSize={14} className="fill-accent-ink font-mono">
        ~10 min zone
      </text>
      {routes.slice(0, riders).map((d, i) => (
        <g key={`r${i}-${step}`}>
          <path d={d} fill="none" className="stroke-accent/35" strokeWidth={2.5} />
          <circle r={7} className="fill-accent stroke-bg" strokeWidth={2.5}>
            <animateMotion dur={`${2.6 + (i % 3) * 0.5}s`} repeatCount="indefinite" path={d} begin={`${(i * 0.37) % 1.5}s`} />
          </circle>
        </g>
      ))}
      {HOMES.map(([x, y], i) => {
        const active = i < (busy ? (step >= 3 ? 14 : 10) : 5)
        return (
          <g key={i}>
            <rect x={x - 6} y={y - 6} width={12} height={12} rx={2} className="fill-fg-3" />
            {active && <circle cx={x} cy={y} r={10} className="anim-ping fill-signal/60" style={{ animationDelay: `${(i * 0.29) % 2}s`, animationDuration: busy ? '1.4s' : '2.6s' }} />}
          </g>
        )
      })}
      <g>
        <rect x={store[0] - 26} y={store[1] - 26} width={52} height={52} rx={10} className="fill-fg" />
        <path d={`M${store[0] - 12} ${store[1] - 4} h24 v16 h-24 z M${store[0] - 14} ${store[1] - 4} l14 -10 l14 10`} fill="none" className="stroke-bg" strokeWidth={2.5} strokeLinejoin="round" />
        <text x={store[0]} y={store[1] + 48} textAnchor="middle" fontSize={15} className="fill-fg font-semibold">
          Dark store
        </text>
      </g>
      {raining &&
        Array.from({ length: 70 }, (_, i) => {
          const x = (i * 53) % 900
          return (
            <line key={i} x1={x} x2={x - 14} y1={0} y2={26} className="stroke-[#9fc3d9]/50" strokeWidth={1.6} strokeLinecap="round">
              <animateTransform attributeName="transform" type="translate" values={`0 ${-40 - (i % 7) * 60}; -60 700`} dur={`${0.9 + (i % 5) * 0.12}s`} repeatCount="indefinite" begin={`${(i % 11) * 0.08}s`} />
            </line>
          )
        })}
    </svg>
  )
}

export function IndustryQuick() {
  const { step, setStep } = useSlide()
  const lit = step === 0 ? [] : step <= 2 ? ['Real-Time Data'] : step === 3 ? ['Real-Time Data', 'Demand Forecasting'] : step === 4 ? ['Inventory Optimisation'] : ['Inventory Optimisation', 'Delivery Optimisation']
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7.25rem] w-[34rem]">
        <div className="flex items-center gap-[0.75rem]">
          {(['blinkit', 'zepto', 'instamart'] as BrandId[]).map((b, i) => (
            <BrandReveal key={b} id={b} height={b === 'blinkit' ? 1.5 : 1.8} chip delay={0.15 + i * 0.12} />
          ))}
        </div>
        <AnimatedHeadline as="h2" text={['Every minute', 'changes the decision.']} delay={0.45} className="t-display-sm mt-[1.4rem] !text-[3.25rem] text-fg" />
        <ol className="mt-[1.5rem] space-y-[0.15rem]">
          {QC_STEPS.map((s, i) => {
            const on = step === i + 1
            const done = step > i + 1
            return (
              <li key={s.t}>
                <button type="button" onClick={() => setStep(i + 1)} className="flex w-full items-start gap-[0.85rem] rounded-[0.8rem] px-[0.6rem] py-[0.5rem] text-left transition-colors hover:bg-bg-2">
                  <span className={cx('mt-[0.2rem] grid h-[1.6rem] w-[1.6rem] shrink-0 place-items-center rounded-full border font-mono text-[0.75rem] transition-colors', on ? 'border-signal bg-signal text-white' : done ? 'border-fg-3 bg-fg-3 text-bg' : 'border-line-2 text-fg-3')}>
                    {i + 1}
                  </span>
                  <span>
                    <span className={cx('block text-[1.125rem] font-[560] transition-colors', on ? 'text-fg' : done ? 'text-fg-2' : 'text-fg-3')}>{s.t}</span>
                    <motion.span className="block text-[0.9375rem] leading-[1.35] text-fg-2" initial={false} animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.35 }} style={{ overflow: 'hidden' }}>
                      {s.d}
                    </motion.span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <motion.div className="absolute bottom-[6.5rem] left-[41rem] right-[5.5rem] top-[7rem] overflow-hidden rounded-[1.25rem] border border-line" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}>
        <CityMap step={step} />
        <div className="absolute right-[1rem] top-[1rem] w-[14.5rem] rounded-[1rem] bg-bg/85 p-[1rem] backdrop-blur-[2px]">
          <div className="t-label !text-[0.8125rem]">Orders per minute</div>
          <div className="text-[2.75rem] font-[640] leading-none tracking-[-0.04em] text-fg">
            <AnimatedCounter value={ORDERS_PER_MIN[step]} from={40} />
          </div>
          <svg viewBox="0 0 200 40" className="mt-[0.4rem] w-full" aria-hidden>
            <motion.path
              d={[39, 41, 40, ...ORDERS_PER_MIN.slice(0, step + 1)].map((v, i) => `${i ? 'L' : 'M'}${(i / 8) * 200} ${40 - ((v - 35) / 55) * 38}`).join(' ')}
              fill="none"
              className="stroke-signal"
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="absolute bottom-[1rem] right-[1rem] w-[14.5rem] rounded-[1rem] bg-bg/85 p-[1rem] backdrop-blur-[2px]">
          <div className="t-label mb-[0.4rem] !text-[0.8125rem]">Dark store stock</div>
          {SKUS.map((k, i) => {
            const v = STOCK[step][i]
            return (
              <div key={k} className="mt-[0.35rem]">
                <div className="flex justify-between text-[0.875rem] text-fg-2">
                  <span>{k}</span>
                  <span className="font-mono">{v}%</span>
                </div>
                <div className="mt-[0.2rem] h-[0.4rem] overflow-hidden rounded-full bg-line">
                  <motion.div className={cx('h-full rounded-full', v < 25 ? 'bg-neg' : v < 50 ? 'bg-signal' : 'bg-accent')} initial={false} animate={{ width: `${v}%` }} transition={{ duration: 0.8, ease: EASE }} />
                </div>
              </div>
            )
          })}
        </div>
        <AnimatePresence>
          {step >= 5 && (
            <motion.div className="absolute left-[1rem] top-[1rem] space-y-[0.5rem]" initial="hide" animate="show" exit="hide" variants={{ show: { transition: { staggerChildren: 0.18 } } }}>
              {[
                [Truck, 'Restock on its way from the mother warehouse'],
                [Users, '+6 riders called in for the evening'],
                [Clock, 'Delivery promise shown as 15 min, not 10'],
              ].map(([Icon, t]) => {
                const I = Icon as LucideIcon
                return (
                  <motion.div key={t as string} variants={{ hide: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }} className="flex items-center gap-[0.6rem] rounded-full bg-fg px-[0.9rem] py-[0.45rem] text-[0.9375rem] text-bg">
                    <I className="h-[1rem] w-[1rem] text-accent" /> {t as string}
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute bottom-[1rem] left-[1rem]">
          <Illustrative className="rounded-full bg-bg/85 px-[0.7rem] py-[0.3rem]">Illustrative simulation, not actual company operations</Illustrative>
        </div>
      </motion.div>

      <Capabilities items={['Real-Time Data', 'Demand Forecasting', 'Inventory Optimisation', 'Delivery Optimisation']} on={lit} className="absolute bottom-[6.6rem] left-[5.5rem] w-[34rem]" />
    </div>
  )
}

/* ------------------------------------------------------------------ comparison */

const COMPARE: { name: string; brands: BrandId[]; goal: string; q: string; Icon: LucideIcon; tone: string }[] = [
  { name: 'E-commerce', brands: ['amazon', 'flipkart'], goal: 'Optimise discovery and fulfilment.', q: 'Which product should this customer see?', Icon: ShoppingCart, tone: 'bg-accent' },
  { name: 'Physical retail', brands: ['dmart', 'walmart'], goal: 'Optimise shelf availability and store operations.', q: 'Will the product be available on the shelf?', Icon: Store, tone: 'bg-fg-2' },
  { name: 'Quick commerce', brands: ['blinkit', 'zepto', 'instamart'], goal: 'Optimise immediate demand and delivery speed.', q: 'What happens in the next few minutes?', Icon: MapPin, tone: 'bg-signal' },
]

function MiniViz({ kind, delay }: { kind: number; delay: number }) {
  if (kind === 0)
    return (
      <svg viewBox="0 0 300 96" className="mt-[1.5rem] w-[19rem]" aria-hidden>
        {Array.from({ length: 6 }, (_, k) => (
          <motion.rect
            key={k}
            x={(k % 3) * 100}
            y={Math.floor(k / 3) * 50}
            width={90}
            height={42}
            rx={8}
            className={k === 0 ? 'fill-accent' : 'fill-line'}
            initial={{ opacity: 0, y: Math.floor(k / 3) * 50 + 10 }}
            animate={{ opacity: 1, y: Math.floor(k / 3) * 50 }}
            transition={{ delay: delay + k * 0.06, duration: 0.4 }}
          />
        ))}
      </svg>
    )
  if (kind === 1)
    return (
      <svg viewBox="0 0 300 96" className="mt-[1.5rem] w-[19rem]" aria-hidden>
        {Array.from({ length: 7 }, (_, k) => (
          <motion.rect key={k} x={k * 42} y={14} width={34} height={58} rx={5} className={k === 3 || k === 4 ? 'fill-none stroke-neg' : 'fill-line-2'} strokeDasharray={k === 3 || k === 4 ? '4 4' : undefined} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + k * 0.05 }} />
        ))}
        <rect x={0} y={76} width={290} height={8} rx={3} className="fill-fg-3" />
      </svg>
    )
  return (
    <svg viewBox="0 0 300 96" className="mt-[1.5rem] w-[19rem] overflow-visible" aria-hidden>
      <circle cx={48} cy={48} r={14} className="fill-signal" />
      <circle cx={48} cy={48} r={14} className="anim-ping fill-signal/60" />
      <path d="M62 48 H150 V20 H230" fill="none" className="stroke-line-2" strokeWidth={3} strokeDasharray="6 6" />
      <circle r={6} className="fill-accent">
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M62 48 H150 V20 H230" />
      </circle>
      <text x={240} y={26} fontSize={17} className="fill-fg-2 font-mono">
        10 min
      </text>
    </svg>
  )
}

export function IndustryCompare() {
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7.25rem]">
        <AnimatedHeadline as="h2" text="Three models, three optimisation problems." className="t-title text-fg" />
      </div>
      <div className="absolute bottom-[7rem] left-[5.5rem] right-[5.5rem] top-[15.5rem] grid grid-cols-3 gap-[2rem]">
        {COMPARE.map((c, i) => (
          <motion.div
            key={c.name}
            className="group relative flex flex-col border-t-2 border-fg pt-[1.5rem]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.3, duration: 0.8, ease: EASE }}
            whileHover={{ y: -6 }}
          >
            <motion.span className={cx('absolute -top-[2px] left-0 h-[2px]', c.tone)} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.9 + i * 0.3, duration: 0.8, ease: EASE }} />
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.9375rem] text-fg-3">0{i + 1}</span>
              <c.Icon className="h-[1.6rem] w-[1.6rem] text-fg-2" />
            </div>
            <div className="mt-[1rem] text-[2.5rem] font-[620] leading-[1] tracking-[-0.035em] text-fg">{c.name}</div>
            <div className="mt-[1.1rem] flex h-[2.6rem] items-center gap-[1.1rem]">
              {c.brands.map((b) => (
                <BrandLogo key={b} id={b} height={b === 'blinkit' ? 1.6 : 1.5} />
              ))}
            </div>
            <div className="mt-[1.75rem] text-[1.875rem] font-[560] leading-[1.15] tracking-[-0.025em] text-fg">{c.goal}</div>
            <MiniViz kind={i} delay={1.2 + i * 0.3} />
            <div className="mt-auto rounded-[1rem] bg-bg-2 p-[1.1rem] transition-colors group-hover:bg-accent-wash">
              <div className="t-label !text-[0.8125rem]">The question it lives with</div>
              <div className="mt-[0.35rem] text-[1.1875rem] leading-[1.35] text-fg">{c.q}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ closing */

function LivePulse() {
  const presence = usePresenceData() as TransitionCustom | undefined
  const forward = (presence?.dir ?? 1) > 0
  const seg = 'M0 60 L60 60 L75 52 L90 60 L130 60 L142 20 L156 96 L170 46 L182 60 L260 60 L272 50 L284 60 L340 60 L352 28 L366 88 L378 60 L440 60'
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-[38.5rem] h-[8rem] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={forward ? { x: '40%', opacity: 0, transition: { duration: 0.8, ease: [0.5, 0, 0.75, 0] } } : { opacity: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      aria-hidden
    >
      <div className="flex h-full w-[200%] animate-[drift_6s_linear_infinite]">
        {[0, 1].map((k) => (
          <svg key={k} viewBox="0 0 1760 120" preserveAspectRatio="none" className="h-full w-1/2">
            {[0, 1, 2, 3].map((r) => (
              <path key={r} d={seg} transform={`translate(${r * 440} 0)`} fill="none" className="stroke-signal" strokeWidth={2.5} strokeLinejoin="round" />
            ))}
          </svg>
        ))}
      </div>
    </motion.div>
  )
}

export function IndustryClosing() {
  return (
    <div className="stage">
      <LivePulse />
      <div className="absolute left-[5.5rem] right-[5.5rem] top-[8.5rem]">
        <AnimatedHeadline as="h2" text={['Quick commerce is a real-time', 'prediction and optimisation', 'problem.']} delay={0.3} stagger={0.07} className="text-[4.75rem] font-[640] uppercase leading-[0.92] tracking-[-0.05em] text-fg" />
        <Reveal delay={1.3} className="mt-[2rem] max-w-[58rem] text-[1.5rem] leading-[1.45] text-fg-2">
          “The retail model changes the analytics problem. But the objective remains the same: predict demand early enough to make a better decision.”
        </Reveal>
      </div>
    </div>
  )
}
