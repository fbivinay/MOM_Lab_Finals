import { AnimatePresence, motion, usePresenceData } from 'motion/react'
import {
  CalendarDays,
  Check,
  Clock,
  CloudRain,
  Eye,
  Heart,
  IndianRupee,
  Landmark,
  Lock,
  Mail,
  MapPin,
  MousePointer2,
  MousePointerClick,
  PartyPopper,
  RotateCcw,
  Search,
  ShoppingCart,
  Star,
  Truck,
  TrendingUp,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { AnimatedCounter, AnimatedHeadline, FlowDots, Highlight, Illustrative, Img, Reveal, cx, usePhases } from '../components/motion'
import { useSlide } from '../presentation/deck'
import { EASE, type TransitionCustom } from '../presentation/transitions'
import { IncomingSignals } from './roles'
import { ChapterOpener } from './shared'

const zigzag = (teeth = 16, depth = 0.55) =>
  `polygon(0 0, 100% 0, 100% calc(100% - ${depth}rem), ${Array.from({ length: teeth }, (_, i) => {
    const x1 = 100 - ((i + 0.5) * 100) / teeth
    const x2 = 100 - ((i + 1) * 100) / teeth
    return `${x1}% 100%, ${x2}% calc(100% - ${depth}rem)`
  }).join(', ')})`

/** Thermal receipt: always paper-coloured, whatever the slide theme. */
function Receipt({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx('bg-[#fbfaf7] px-[1.25rem] pb-[1.9rem] pt-[1.2rem] font-mono text-[0.875rem] leading-[1.55] text-[#1c1e1b] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)]', className)}
      style={{ clipPath: zigzag() }}
    >
      {children}
    </div>
  )
}

const Rule = () => <div className="my-[0.45rem] border-t border-dashed border-[#1c1e1b]/40" />

/* ------------------------------------------------------------------ 02 · opener */

const BEFORE = ['Searched “running shoes”', 'Viewed 6 products', 'Compared 2 pairs', 'Left the cart for 2 days']
const AFTER = ['Came back from an email', 'Applied a coupon', 'Rated the shoes 4 / 5', 'Tracked the delivery']

function ReceiptToJourney() {
  const { step } = useSlide()
  const open = step >= 1
  const rowY = (i: number) => 132 + i * 74
  return (
    <div className="relative mt-[5rem] h-[36rem] w-full">
      <svg viewBox="0 0 632 576" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <motion.line x1={186} x2={226} y1={rowY(i)} y2={rowY(i)} className="stroke-line-2" initial={false} animate={{ pathLength: open ? 1 : 0 }} transition={{ delay: open ? 0.35 + i * 0.12 : 0, duration: 0.4 }} />
            <motion.line x1={406} x2={446} y1={rowY(i)} y2={rowY(i)} className="stroke-line-2" initial={false} animate={{ pathLength: open ? 1 : 0 }} transition={{ delay: open ? 0.85 + i * 0.12 : 0, duration: 0.4 }} />
          </g>
        ))}
      </svg>
      <div className="absolute left-1/2 top-[3.3rem] h-[0.45rem] w-[13.5rem] -translate-x-1/2 rounded-full bg-fg/25" />
      <div className="absolute left-1/2 top-[3.55rem] w-[11.25rem] -translate-x-1/2 overflow-hidden pb-[1rem]">
        <motion.div initial={{ y: '-102%' }} animate={{ y: '0%' }} transition={{ duration: 1.8, delay: 0.9, ease: [0.25, 0.7, 0.3, 1] }}>
          <Receipt className="!px-[1rem] !text-[0.8125rem]">
            <div className="text-center font-semibold">STORE 214</div>
            <div className="text-center opacity-70">12 OCT · 18:42</div>
            <Rule />
            <div>1 × Running shoes</div>
            <div className="text-right">₹4,999</div>
            <Rule />
            <div className="flex justify-between font-semibold">
              <span>TOTAL</span>
              <span>₹4,999</span>
            </div>
            <div className="opacity-70">PAID · UPI</div>
            <div className="mt-[0.6rem] flex h-[2rem] items-end gap-[2px]" aria-hidden>
              {[2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 1].map((w, i) => (
                <span key={i} className="h-full bg-[#1c1e1b]" style={{ width: `${w * 1.5}px` }} />
              ))}
            </div>
          </Receipt>
        </motion.div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={open ? 'all' : 'one'}
          className="absolute left-0 right-0 top-[26.5rem] text-center font-mono text-[0.9375rem] text-fg-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: open ? 0.3 : 2.4 } }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
        >
          {open ? 'What the retailer can actually observe' : 'What we think the retailer knows'}
        </motion.div>
      </AnimatePresence>
      {[BEFORE, AFTER].map((list, side) => (
        <div key={side} className={cx('absolute top-0 w-[11.5rem]', side ? 'right-0 text-left' : 'left-0 text-right')}>
          <motion.div className="t-label mt-[4.4rem]" initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ delay: open ? 0.2 + side * 0.5 : 0 }}>
            {side ? 'during & after' : 'before the purchase'}
          </motion.div>
          {list.map((t, i) => (
            <motion.div
              key={t}
              className="absolute w-full text-[1rem] leading-[1.25] text-fg"
              style={{ top: `${(rowY(i) - 11) / 16}rem` }}
              initial={false}
              animate={{ opacity: open ? 1 : 0, x: open ? 0 : side ? -12 : 12 }}
              transition={{ duration: 0.5, delay: open ? 0.4 + side * 0.5 + i * 0.12 : 0, ease: EASE }}
            >
              <span className={cx('mx-[0.45rem] inline-block h-[0.5rem] w-[0.5rem] rounded-full align-middle', side ? 'bg-accent' : 'bg-signal')} />
              {t}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function DataIntro() {
  const { step } = useSlide()
  return (
    <ChapterOpener
      number="02"
      label="Data"
      title="The Data a Retailer Never Stops Collecting"
      titleSize={4.25}
      first={<>When we buy a product, we usually think the retailer knows only one thing: what we bought.</>}
      second={
        <>
          But a modern retailer can observe <Highlight on={step >= 1} delay={0.5}>an entire journey before, during and after</Highlight> that purchase.
        </>
      }
      visual={<ReceiptToJourney />}
    >
      <IncomingSignals />
    </ChapterOpener>
  )
}

/* ------------------------------------------------------------------ customer journey */

const STAGES = ['Search', 'View', 'Compare', 'Add to cart', 'Abandon', 'Return', 'Purchase', 'Review']
const EVENTS: [string, string, string][] = [
  ['Thu 18:02', 'search', '“running shoes”'],
  ['Thu 18:03', 'product_view', 'trail runner · 48 s'],
  ['Thu 18:05', 'compare', '2 shoes side by side'],
  ['Thu 18:06', 'add_to_cart', 'size UK 9'],
  ['Thu 18:07', 'cart_abandoned', 'left without paying'],
  ['Sat 10:15', 'return_visit', 'from a reminder email'],
  ['Sat 10:19', 'purchase', '₹4,999 · UPI'],
  ['Fri 20:30', 'review', '4 of 5 stars'],
]

function ShopCard({ step }: { step: number }) {
  const inCart = step >= 3
  const idle = step === 4
  return (
    <div className="panel relative h-full overflow-hidden">
      <div className="flex h-[3.75rem] items-center gap-[0.75rem] border-b border-line px-[1.25rem]">
        <div className="flex h-[2.4rem] flex-1 items-center gap-[0.6rem] rounded-full bg-bg-2 px-[1rem] text-[1.0625rem] text-fg">
          <Search className="h-[1.05rem] w-[1.05rem] text-fg-3" />
          <motion.span initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 0.9, delay: 0.8, ease: 'linear' }}>
            running shoes
          </motion.span>
          {step === 0 && <span className="anim-blink -ml-[0.4rem] h-[1.1rem] w-px bg-fg" />}
        </div>
        <div className="relative">
          <ShoppingCart className="h-[1.5rem] w-[1.5rem] text-fg-2" />
          <AnimatePresence>
            {inCart && (
              <motion.span
                className="absolute -right-[0.55rem] -top-[0.55rem] grid h-[1.25rem] w-[1.25rem] place-items-center rounded-full bg-signal font-mono text-[0.75rem] text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                1
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div className="grid h-[calc(100%-3.75rem)] grid-cols-[1.15fr_1fr]" animate={{ filter: idle ? 'grayscale(1)' : 'grayscale(0)', opacity: idle ? 0.55 : 1 }} transition={{ duration: 0.5 }}>
        <div className="relative grid place-items-center overflow-hidden">
          <motion.div initial={{ opacity: 0, scale: 0.92, rotate: -6 }} animate={{ opacity: step >= 1 ? 1 : 0.4, scale: 1, rotate: -4 }} transition={{ duration: 0.9, delay: 0.4, ease: EASE }} className="w-[112%]">
            <Img src="/images/shoe-runner.webp" alt="Dark running shoe" className="w-full mix-blend-multiply [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_72%)]" />
          </motion.div>
        </div>
        <div className="flex flex-col justify-center gap-[0.9rem] pr-[1.5rem]">
          <div>
            <div className="text-[1.75rem] font-[600] tracking-[-0.03em] text-fg">Trail runner</div>
            <div className="mt-[0.2rem] text-[1.375rem] text-fg-2 tnum">₹4,999</div>
          </div>
          <div className="flex gap-[0.2rem]" aria-label={step >= 7 ? 'Rated 4 of 5' : 'No rating yet'}>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span key={i} initial={false} animate={{ scale: step >= 7 && i < 4 ? [1, 1.35, 1] : 1 }} transition={{ delay: i * 0.12, duration: 0.4 }}>
                <Star className={cx('h-[1.3rem] w-[1.3rem]', step >= 7 && i < 4 ? 'fill-signal text-signal' : 'text-line-2')} />
              </motion.span>
            ))}
          </div>
          <div className="flex gap-[0.4rem]">
            {['7', '8', '9', '10'].map((s) => (
              <span key={s} className={cx('grid h-[2.2rem] w-[3.2rem] place-items-center rounded-[0.6rem] border text-[0.9375rem]', inCart && s === '9' ? 'border-fg bg-fg text-bg' : 'border-line-2 text-fg-2')}>
                UK {s}
              </span>
            ))}
          </div>
          <div className={cx('flex h-[2.9rem] items-center justify-center gap-[0.5rem] rounded-full text-[1.0625rem] font-[540] transition-colors duration-500', step >= 6 ? 'bg-accent text-white' : inCart ? 'bg-fg text-bg' : 'border border-fg text-fg')}>
            {step >= 6 ? (
              <>
                <Check className="h-[1.1rem] w-[1.1rem]" /> Ordered
              </>
            ) : inCart ? (
              'In your cart'
            ) : (
              'Add to cart'
            )}
          </div>
          <AnimatePresence>
            {step >= 7 && (
              <motion.p className="text-[1rem] italic leading-[1.4] text-fg-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.6 }}>
                “Light and comfortable on long runs.”
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {step === 2 && (
          <motion.div
            key="compare"
            className="panel absolute bottom-[1.25rem] left-[1.25rem] flex w-[17rem] items-center gap-[0.75rem] p-[0.6rem] shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)]"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="h-[4rem] w-[5rem] shrink-0 overflow-hidden rounded-[0.6rem] bg-[#e9e9e7]">
              <Img src="/images/shoe-airmax.webp" alt="Alternative running shoe" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="t-label !text-[0.75rem]">comparing with</div>
              <div className="text-[1rem] font-[560] text-fg">Road runner</div>
              <div className="text-[0.9375rem] text-fg-2">₹5,499</div>
            </div>
          </motion.div>
        )}
        {idle && (
          <motion.div
            key="idle"
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[0.6rem] rounded-full bg-fg px-[1.25rem] py-[0.75rem] text-[1.125rem] text-bg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Clock className="h-[1.2rem] w-[1.2rem] text-signal" /> Cart left for 2 days
          </motion.div>
        )}
        {step === 5 && (
          <motion.div
            key="toast"
            className="absolute right-[1rem] top-[4.5rem] flex w-[19rem] items-start gap-[0.7rem] rounded-[1rem] bg-fg p-[0.9rem] text-bg shadow-[0_18px_40px_-20px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Mail className="mt-[0.15rem] h-[1.15rem] w-[1.15rem] shrink-0 text-signal" />
            <div className="text-[0.9375rem] leading-[1.35]">
              <b className="font-[600]">Still thinking it over?</b>
              <br />
              Your size is still in stock.
            </div>
          </motion.div>
        )}
        {step === 6 && (
          <motion.div
            key="order"
            className="absolute left-[1.5rem] top-[5rem] flex items-center gap-[0.5rem] rounded-[0.6rem] border-2 border-accent px-[0.8rem] py-[0.35rem] font-mono text-[0.9375rem] text-accent-ink"
            initial={{ opacity: 0, scale: 1.4, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Check className="h-[1rem] w-[1rem]" /> Order #RA-20931
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EventLog({ step }: { step: number }) {
  return (
    <div className="panel flex h-full flex-col overflow-hidden">
      <div className="flex h-[3.75rem] items-center justify-between border-b border-line px-[1.25rem]">
        <span className="text-[1.125rem] font-[560] text-fg">Data the retailer records</span>
        <span className="t-label">{step + 1} events</span>
      </div>
      <div className="flex-1 px-[0.5rem] py-[0.4rem]">
        <AnimatePresence initial={false}>
          {EVENTS.slice(0, step + 1).map(([time, name, detail], i) => {
            const latest = i === step
            return (
              <motion.div
                key={name}
                layout
                className="grid grid-cols-[6rem_11.5rem_1fr] items-center rounded-[0.6rem] px-[0.75rem] py-[0.5rem] font-mono text-[0.9375rem]"
                initial={{ opacity: 0, y: 12, backgroundColor: 'var(--accent-wash)' }}
                animate={{ opacity: 1, y: 0, backgroundColor: latest ? 'var(--accent-wash)' : 'rgba(0,0,0,0)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <span className="text-fg-3">{time}</span>
                <span className={name === 'cart_abandoned' ? 'text-signal-ink' : 'text-fg'}>{name}</span>
                <span className="truncate text-fg-2">{detail}</span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function DataJourney() {
  const { step, setStep } = useSlide()
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7.25rem] w-[64rem]">
        <Reveal delay={0.1} y={8} className="mb-[0.6rem] text-[1.25rem] font-[560] text-accent-ink">
          Customer journey
        </Reveal>
        <Reveal delay={0.2} className="t-title !text-[2.75rem] text-fg">
          A customer who <Highlight on={step >= 4} tone="signal">doesn't buy</Highlight> can still generate valuable data.
        </Reveal>
      </div>
      <Reveal delay={0.35} y={20} className="absolute left-[5.5rem] top-[16.25rem] h-[27.5rem] w-[42rem]">
        <ShopCard step={step} />
      </Reveal>
      <Reveal delay={0.5} y={20} className="absolute left-[49rem] right-[5.5rem] top-[16.25rem] h-[27.5rem]">
        <EventLog step={step} />
      </Reveal>

      <div className="absolute left-[5.5rem] right-[5.5rem] top-[45.4rem] h-[4rem]" role="group" aria-label="Journey stages">
        <div className="absolute left-[0.75rem] right-[0.75rem] top-[0.75rem] h-[2px] bg-line" />
        <motion.div
          className="absolute left-[0.75rem] right-[0.75rem] top-[0.75rem] h-[2px] origin-left bg-accent"
          initial={false}
          animate={{ scaleX: step / (STAGES.length - 1) }}
          transition={{ duration: 0.6, ease: EASE }}
        />
        {STAGES.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(i)}
            className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-[0.4rem]"
            style={{ left: `calc(0.75rem + ${(i / (STAGES.length - 1)) * 87.5}rem)` }}
            aria-current={i === step ? 'step' : undefined}
          >
            <span
              className={cx(
                'block h-[1.5rem] w-[1.5rem] rounded-full border-2 transition-colors duration-300',
                i === step ? (i === 4 ? 'border-signal bg-signal' : 'border-accent bg-accent') : i < step ? 'border-fg-3 bg-fg-3' : 'border-line-2 bg-bg',
              )}
            />
            <span className={cx('whitespace-nowrap text-[1rem] transition-colors', i === step ? 'font-[580] text-fg' : 'text-fg-3')}>{s}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ transaction + customer */

const RECEIPT_FIELDS = [
  { label: 'Store', top: 1.18 },
  { label: 'Time', top: 2.63 },
  { label: 'Product', top: 5.04 },
  { label: 'Quantity · price', top: 6.5 },
  { label: 'Discount', top: 10.86 },
  { label: 'Payment', top: 14.72 },
]

function ProfileField({ label, children, delay }: { label: string; children: ReactNode; delay: number }) {
  return (
    <motion.div className="border-t border-line pt-[0.7rem]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: EASE }}>
      <div className="t-label !text-[0.8125rem]">{label}</div>
      <div className="mt-[0.3rem] text-[1.1875rem] text-fg">{children}</div>
    </motion.div>
  )
}

export function DataTransaction() {
  const phase = usePhases([2.6])
  const done = phase >= 1
  const history = [1800, 2400, 1200, 3100, 2200, 1500, 2900]
  return (
    <div className="stage">
      <AnimatedHeadline
        as="h2"
        text={['Transaction data tells you what sold.', 'Customer data tells you who bought it.']}
        className="t-title absolute left-[5.5rem] top-[7.25rem] !text-[2.75rem] text-fg"
        delay={0.15}
        stagger={0.035}
      />

      {/* receipt with its fields called out */}
      <div className="absolute left-[14rem] top-[17rem] w-[23rem]">
        <div className="overflow-hidden">
          <motion.div initial={{ y: '-100%' }} animate={{ y: '0%' }} transition={{ duration: 1.3, delay: 0.5, ease: [0.25, 0.7, 0.3, 1] }}>
            <Receipt className="!text-[0.9375rem]">
              <div>STORE 214 · ANDHERI W</div>
              <div className="opacity-70">12 OCT 2026 · 18:42</div>
              <Rule />
              <div>Trail runner shoes</div>
              <div className="flex justify-between">
                <span>1 × ₹4,999</span>
                <span>₹4,999</span>
              </div>
              <div>Running socks</div>
              <div className="flex justify-between">
                <span>2 × ₹299</span>
                <span>₹598</span>
              </div>
              <div className="flex justify-between">
                <span>Coupon RUN10</span>
                <span>−₹560</span>
              </div>
              <Rule />
              <div className="flex justify-between font-semibold">
                <span>TOTAL</span>
                <span>₹5,037</span>
              </div>
              <div>Paid by UPI</div>
              <motion.div
                className="-mx-[0.4rem] mt-[0.3rem] rounded-[0.3rem] px-[0.4rem]"
                animate={{ backgroundColor: done ? 'rgba(29,106,68,0.16)' : 'rgba(29,106,68,0)' }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                Loyalty ID  C-48213
              </motion.div>
            </Receipt>
          </motion.div>
        </div>
        {RECEIPT_FIELDS.map((f, i) => (
          <motion.div
            key={f.label}
            className="absolute right-[calc(100%+1rem)] flex items-center gap-[0.5rem] whitespace-nowrap text-[1rem] text-fg-2"
            style={{ top: `${f.top}rem` }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.12, duration: 0.45 }}
          >
            {f.label}
            <span className="h-px w-[1.5rem] bg-line-2" />
          </motion.div>
        ))}
      </div>

      {/* the link */}
      <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <motion.path
          d="M596 548 C730 548 740 330 870 330"
          fill="none"
          className="stroke-accent"
          strokeWidth={2.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, delay: 1.7, ease: EASE }}
        />
        <FlowDots path="M596 548 C730 548 740 330 870 330" count={2} dur={1.8} begin={2.3} r={5} />
        <motion.text x={606} y={584} fontSize={15} className="fill-accent-ink font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
          joined on loyalty ID
        </motion.text>
      </svg>

      {/* the customer */}
      <motion.div
        className="panel absolute left-[54.5rem] right-[5.5rem] top-[17rem] p-[1.5rem]"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[1.5rem] font-[600] tracking-[-0.02em] text-fg">Customer C-48213</div>
            <div className="mt-[0.2rem] flex items-center gap-[0.4rem] text-[0.9375rem] text-fg-3">
              <Lock className="h-[0.9rem] w-[0.9rem]" /> Pseudonymised ID: no name or phone number needed
            </div>
          </div>
        </div>
        <div className="mt-[1.1rem] grid grid-cols-2 gap-x-[1.5rem] gap-y-[0.9rem]">
          <ProfileField label="Purchase history" delay={1.2}>
            <div className="flex h-[2.4rem] items-end gap-[0.3rem]">
              {[...history, done ? 5037 : 0].map((v, i) => (
                <motion.span
                  key={i}
                  className={cx('w-[0.75rem] rounded-t-[3px]', i === history.length ? 'bg-accent' : 'bg-mute')}
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / 5037) * 2.4}rem` }}
                  transition={{ duration: 0.6, delay: i === history.length ? 0.2 : 1.3 + i * 0.05, ease: EASE }}
                />
              ))}
            </div>
          </ProfileField>
          <ProfileField label="Frequency" delay={1.3}>
            About every 3 weeks
          </ProfileField>
          <ProfileField label="Spending this year" delay={1.4}>
            ₹<AnimatedCounter value={done ? 20137 : 15100} from={15100} duration={1.2} />
          </ProfileField>
          <ProfileField label="Preferences" delay={1.5}>
            <span className="flex flex-wrap gap-[0.35rem]">
              {['Running', 'Outdoor', 'UK 9'].map((t) => (
                <span key={t} className="rounded-full bg-bg-2 px-[0.6rem] py-[0.1rem] text-[0.9375rem] text-fg-2">
                  {t}
                </span>
              ))}
            </span>
          </ProfileField>
          <ProfileField label="Loyalty" delay={1.6}>
            Gold · <AnimatedCounter value={done ? 2390 : 2340} from={2340} duration={1} /> points
          </ProfileField>
          <ProfileField label="Returns" delay={1.7}>
            1 return in 14 orders
          </ProfileField>
        </div>
      </motion.div>
      <Illustrative className="absolute left-[54.5rem] top-[41.5rem]">Illustrative records — not a real customer</Illustrative>
      <Reveal delay={2.8} className="t-lead absolute left-[5.5rem] top-[43.75rem] max-w-[46rem] !text-[1.375rem]">
        Linked together, they show who buys what, how often, and what they might want next.
      </Reveal>
    </div>
  )
}

/* ------------------------------------------------------------------ digital behaviour */

const PRODUCTS = [
  { name: 'Trail runner', price: '₹4,999', img: 'shoe-runner' },
  { name: 'Road runner', price: '₹5,499', img: 'shoe-airmax' },
  { name: 'Racer', price: '₹6,299', img: 'shoe-red' },
  { name: 'Running socks', price: '₹299', img: 'socks' },
  { name: 'Sports watch', price: '₹8,999', img: 'watch' },
  { name: 'Steel bottle', price: '₹899', img: 'bottle' },
]

type SignalKey = 'searches' | 'clicks' | 'views' | 'wishlists' | 'abandoned'
const SIGNALS: { key: SignalKey; label: string; Icon: LucideIcon; means: string }[] = [
  { key: 'searches', label: 'Searches', Icon: Search, means: 'what people want right now' },
  { key: 'clicks', label: 'Clicks', Icon: MousePointerClick, means: 'which listings earn attention' },
  { key: 'views', label: 'Product views', Icon: Eye, means: 'interest in a specific item' },
  { key: 'wishlists', label: 'Wishlists', Icon: Heart, means: 'intent to buy later' },
  { key: 'abandoned', label: 'Abandoned carts', Icon: ShoppingCart, means: 'hesitation on price or delivery' },
]

/* scripted visit: [seconds, cursor x%, cursor y%] within the shop window */
const CURSOR: [number, number, number][] = [
  [0, 80, 90],
  [0.6, 30, 9],
  [2.1, 18, 45],
  [3.1, 51, 31],
  [4.3, 22, 66],
  [5.6, 112, 60],
]

function useScript(run: number) {
  const [counts, setCounts] = useState<Record<SignalKey, number>>({ searches: 0, clicks: 0, views: 0, wishlists: 0, abandoned: 0 })
  const [state, setState] = useState({ typed: false, viewing: -1, wish: [] as number[], cart: 0, abandoned: false })
  useEffect(() => {
    setCounts({ searches: 0, clicks: 0, views: 0, wishlists: 0, abandoned: 0 })
    setState({ typed: false, viewing: -1, wish: [], cart: 0, abandoned: false })
    const bump = (k: SignalKey) => setCounts((c) => ({ ...c, [k]: c[k] + 1 }))
    const at = (t: number, fn: () => void) => window.setTimeout(fn, t * 1000)
    const ids = [
      at(1.2, () => {
        setState((s) => ({ ...s, typed: true }))
        bump('searches')
      }),
      at(2.5, () => {
        setState((s) => ({ ...s, viewing: 0 }))
        bump('clicks')
        bump('views')
      }),
      at(3.5, () => {
        setState((s) => ({ ...s, wish: [...s.wish, 1] }))
        bump('wishlists')
      }),
      at(4.7, () => {
        setState((s) => ({ ...s, cart: 1, viewing: -1 }))
        bump('clicks')
      }),
      at(6.6, () => {
        setState((s) => ({ ...s, abandoned: true }))
        bump('abandoned')
      }),
    ]
    return () => ids.forEach(window.clearTimeout)
  }, [run])
  return { counts, setCounts, state, setState }
}

export function DataDigital() {
  const [run, setRun] = useState(0)
  const { counts, setCounts, state, setState } = useScript(run)
  const bump = (k: SignalKey) => setCounts((c) => ({ ...c, [k]: c[k] + 1 }))
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7.25rem] w-[52rem]">
        <AnimatedHeadline as="h2" text="Every click leaves a signal." className="t-title text-fg" />
        <Reveal delay={0.5} className="t-lead mt-[0.9rem] !text-[1.375rem]">
          Searches, clicks, product views, wishlists and abandoned carts show intent long before anyone pays.
        </Reveal>
      </div>

      <Reveal delay={0.3} y={24} className="absolute left-[5.5rem] top-[17.5rem] h-[32rem] w-[52rem]">
        <div className="panel relative h-full overflow-hidden">
          <div className="flex h-[3.25rem] items-center gap-[0.9rem] border-b border-line bg-bg-2/60 px-[1.1rem]">
            <span className="flex gap-[0.35rem]" aria-hidden>
              <span className="h-[0.6rem] w-[0.6rem] rounded-full bg-line-2" />
              <span className="h-[0.6rem] w-[0.6rem] rounded-full bg-line-2" />
            </span>
            <span className="flex h-[2.1rem] flex-1 items-center gap-[0.5rem] rounded-full bg-surface px-[0.9rem] text-[0.9375rem] text-fg-2">
              <Search className="h-[0.95rem] w-[0.95rem] text-fg-3" />
              <span className="font-mono">
                shop.example/search?q=
                <motion.span initial={false} animate={{ opacity: state.typed ? 1 : 0 }} className="text-fg">
                  running
                </motion.span>
              </span>
            </span>
            <span className="relative">
              <ShoppingCart className="h-[1.3rem] w-[1.3rem] text-fg-2" />
              {state.cart > 0 && <span className="absolute -right-[0.5rem] -top-[0.5rem] grid h-[1.1rem] w-[1.1rem] place-items-center rounded-full bg-signal font-mono text-[0.7rem] text-white">{state.cart}</span>}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-[0.9rem] p-[1.1rem]">
            {PRODUCTS.map((p, i) => (
              <motion.button
                key={p.name}
                type="button"
                onClick={() => {
                  bump('clicks')
                  bump('views')
                  setState((s) => ({ ...s, viewing: i }))
                }}
                className={cx('group relative overflow-hidden rounded-[0.9rem] border bg-surface text-left transition-colors', state.viewing === i ? 'border-fg' : 'border-line hover:border-fg-3')}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.06, duration: 0.5 }}
              >
                <div className="h-[8.25rem] overflow-hidden bg-[#efefed]">
                  <Img src={`/images/${p.img}.webp`} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between px-[0.8rem] py-[0.55rem]">
                  <div>
                    <div className="text-[0.9375rem] font-[560] text-fg">{p.name}</div>
                    <div className="text-[0.875rem] text-fg-3">{p.price}</div>
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Save ${p.name} to wishlist`}
                    onClick={(e) => {
                      e.stopPropagation()
                      bump('wishlists')
                      setState((s) => ({ ...s, wish: [...s.wish, i] }))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.stopPropagation()
                        bump('wishlists')
                        setState((s) => ({ ...s, wish: [...s.wish, i] }))
                      }
                    }}
                  >
                    <Heart className={cx('h-[1.2rem] w-[1.2rem] transition-colors', state.wish.includes(i) ? 'fill-signal text-signal' : 'text-fg-3')} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {state.abandoned && (
              <motion.div
                className="absolute right-[1.1rem] top-[4.1rem] flex items-center gap-[0.6rem] rounded-full bg-fg px-[1.1rem] py-[0.6rem] text-[1rem] text-bg shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Clock className="h-[1.05rem] w-[1.05rem] text-signal" /> Visitor left with 1 item in the cart
              </motion.div>
            )}
          </AnimatePresence>
          {/* scripted cursor */}
          <motion.div
            key={run}
            className="pointer-events-none absolute left-0 top-0 z-10"
            initial={{ left: `${CURSOR[0][1]}%`, top: `${CURSOR[0][2]}%` }}
            animate={{ left: CURSOR.map((c) => `${c[1]}%`), top: CURSOR.map((c) => `${c[2]}%`) }}
            transition={{ duration: CURSOR[CURSOR.length - 1][0], times: CURSOR.map((c) => c[0] / CURSOR[CURSOR.length - 1][0]), ease: 'easeInOut', delay: 0.8 }}
          >
            <MousePointer2 className="h-[1.6rem] w-[1.6rem] fill-fg text-bg drop-shadow" />
          </motion.div>
        </div>
      </Reveal>

      <div className="absolute left-[60rem] right-[5.5rem] top-[17.5rem]">
        <div className="mb-[0.9rem] flex items-center justify-between">
          <span className="t-label">Signals captured</span>
          <button type="button" onClick={() => setRun((r) => r + 1)} className="flex items-center gap-[0.4rem] rounded-full border border-line-2 px-[0.8rem] py-[0.3rem] text-[0.875rem] text-fg-2 hover:border-fg-3">
            <RotateCcw className="h-[0.85rem] w-[0.85rem]" /> Replay
          </button>
        </div>
        {SIGNALS.map(({ key, label, Icon, means }, i) => (
          <motion.div
            key={key}
            className="flex items-center gap-[1rem] border-t border-line py-[0.85rem]"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
          >
            <Icon className="h-[1.35rem] w-[1.35rem] shrink-0 text-fg-3" />
            <div className="min-w-0 flex-1">
              <div className="text-[1.125rem] font-[540] text-fg">{label}</div>
              <div className="text-[0.9375rem] text-fg-3">{means}</div>
            </div>
            <motion.span
              key={counts[key]}
              className="font-mono text-[1.75rem] text-fg tnum"
              initial={{ scale: counts[key] ? 1.35 : 1, color: counts[key] ? 'var(--accent)' : 'var(--fg)' }}
              animate={{ scale: 1, color: 'var(--fg)' }}
              transition={{ duration: 0.6 }}
            >
              {counts[key]}
            </motion.span>
          </motion.div>
        ))}
        <p className="mt-[0.8rem] text-[0.9375rem] leading-[1.45] text-fg-3">Try it: click a product or a heart.</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ inventory & supply chain */

type Concept = 'Stock Levels' | 'Warehouses' | 'Reorders' | 'Stockouts' | 'Shipments' | 'Delivery Times'
const CONCEPTS: Concept[] = ['Stock Levels', 'Warehouses', 'Reorders', 'Stockouts', 'Shipments', 'Delivery Times']

function StockTag({
  x,
  y,
  title,
  units,
  status,
  tone,
  lit,
  delay,
}: {
  x: number
  y: number
  title: string
  units: string
  status: string
  tone: 'ok' | 'warn' | 'bad'
  lit: boolean
  delay: number
}) {
  const color = tone === 'ok' ? 'bg-accent' : tone === 'warn' ? 'bg-signal' : 'bg-neg'
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: lit ? 1.06 : 1 }}
      transition={{ delay, duration: 0.5, ease: EASE }}
    >
      <span className={cx('absolute -left-[0.4rem] -top-[0.4rem] block h-[0.8rem] w-[0.8rem] rounded-full ring-4 ring-white/70', color)}>
        {tone !== 'ok' && <span className={cx('anim-ping absolute inset-0 rounded-full', color)} />}
      </span>
      <div className={cx('ml-[0.9rem] mt-[0.4rem] w-[13.5rem] rounded-[0.8rem] bg-[#fbfaf7]/95 p-[0.7rem] text-[#171a17] shadow-[0_12px_30px_-14px_rgba(0,0,0,0.5)] transition-shadow', lit && 'ring-2 ring-[#171a17]')}>
        <div className="text-[0.9375rem] font-[560]">{title}</div>
        <div className="mt-[0.15rem] flex items-center justify-between text-[0.875rem]">
          <span className="font-mono">{units}</span>
          <span className={tone === 'ok' ? 'text-[#165536]' : tone === 'warn' ? 'text-[#b04f1d]' : 'text-[#b8432b]'}>{status}</span>
        </div>
      </div>
    </motion.div>
  )
}

export function DataInventory() {
  const [hover, setHover] = useState<Concept | null>(null)
  const phase = usePhases([2.8])
  const is = (c: Concept) => hover === c
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7.25rem] w-[46rem]">
        <AnimatedHeadline as="h2" text="Stock is data in motion." className="t-title text-fg" />
        <Reveal delay={0.5} className="t-lead mt-[0.9rem] !text-[1.375rem]">
          Inventory data shows what is where, what is running out, and what is already on its way.
        </Reveal>
      </div>

      <motion.div
        className="absolute left-[5.5rem] top-[17.5rem] h-[32rem] w-[50rem] overflow-hidden rounded-[1.25rem]"
        initial={{ clipPath: 'inset(0% 100% 0% 0% round 1.25rem)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 1.25rem)' }}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
      >
        <motion.div className="h-full w-full" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: EASE }}>
          <Img src="/images/fulfilment.webp" alt="Warehouse floor with shelving and yellow storage bins" className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        <motion.div
          className={cx('absolute left-[1.25rem] top-[1.25rem] flex items-center gap-[0.5rem] rounded-full bg-[#121512]/80 px-[0.9rem] py-[0.4rem] text-[0.9375rem] text-white', is('Warehouses') && 'ring-2 ring-white')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Warehouse className="h-[1rem] w-[1rem]" /> Regional warehouse B
        </motion.div>
        <StockTag x={6} y={46} title="Trail runner shoes" units="1,240 units" status="Healthy" tone="ok" lit={is('Stock Levels')} delay={1.3} />
        <StockTag x={52} y={20} title="Running socks" units="85 units" status={phase >= 1 ? 'Reorder placed' : 'Below reorder point'} tone="warn" lit={is('Reorders')} delay={1.6} />
        <StockTag x={48} y={64} title="Rain jackets" units="0 units" status="Stockout" tone="bad" lit={is('Stockouts')} delay={1.9} />
      </motion.div>

      {/* outbound route */}
      <div className="absolute left-[58rem] right-[5.5rem] top-[17.5rem] flex h-[32rem] flex-col">
        <div className="t-label">Outbound today</div>
        <svg viewBox="0 0 580 210" className="mt-[0.5rem] w-full overflow-visible" aria-label="Shipment route from warehouse to hub to store">
          <path d={ROUTE} fill="none" className={cx('transition-colors', is('Shipments') ? 'stroke-fg' : 'stroke-line-2')} strokeWidth={3} strokeLinecap="round" />
          <path d={ROUTE} fill="none" className="anim-march stroke-accent" strokeWidth={3} />
          {[
            [24, 100, 'Warehouse B', 'dispatched 09:40'],
            [290, 100, 'City hub', 'sorted 12:05'],
            [556, 100, 'Store 214', 'delivered 14:10'],
          ].map(([x, y, a, b], i) => (
            <motion.g key={a as string} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.2 }}>
              <circle cx={x as number} cy={y as number} r={9} className="fill-bg stroke-fg" strokeWidth={3} />
              <text x={x as number} y={(y as number) + 46} textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'} fontSize={18} className="fill-fg">
                {a}
              </text>
              <text x={x as number} y={(y as number) + 68} textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'} fontSize={15} className={cx('font-mono', is('Delivery Times') ? 'fill-accent-ink' : 'fill-fg-3')}>
                {b}
              </text>
            </motion.g>
          ))}
          <g>
            <animateMotion dur="5s" repeatCount="indefinite" path={ROUTE} />
            <circle r={21} className="fill-bg" />
            <Truck x={-15} y={-15} width={30} height={30} className="text-fg" />
          </g>
        </svg>
        <div className="mt-[1.25rem] grid grid-cols-3 gap-[1rem]">
          {[
            ['Shipments', '38', 'trucks out today'],
            ['Avg. delivery', '4 h 30 m', 'warehouse to store'],
            ['On time', '92%', 'of deliveries'],
          ].map(([k, v, sub], i) => (
            <motion.div key={k} className="border-t border-line pt-[0.7rem]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 + i * 0.1 }}>
              <div className="t-label !text-[0.8125rem]">{k}</div>
              <div className="mt-[0.2rem] text-[1.875rem] font-[600] tracking-[-0.03em] text-fg">{v}</div>
              <div className="text-[0.9375rem] text-fg-3">{sub}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-auto">
          <div className="flex flex-wrap gap-[0.5rem]">
            {CONCEPTS.map((c, i) => (
              <motion.button
                key={c}
                type="button"
                className="chip hover:border-fg-3"
                data-on={hover === c}
                onMouseEnter={() => setHover(c)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(c)}
                onBlur={() => setHover(null)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.06 }}
              >
                {c}
              </motion.button>
            ))}
          </div>
          <Illustrative className="mt-[0.9rem]">Illustrative figures</Illustrative>
        </div>
      </div>
    </div>
  )
}

const ROUTE = 'M24 100 C110 20 200 180 290 100 S470 20 556 100'

/* ------------------------------------------------------------------ pricing & external signals */

const EXTERNAL: { label: string; note: string; Icon: LucideIcon }[] = [
  { label: 'Weather', note: 'rain, heat, cold', Icon: CloudRain },
  { label: 'Festivals', note: 'gifting seasons', Icon: PartyPopper },
  { label: 'Holidays', note: 'long weekends', Icon: CalendarDays },
  { label: 'Search trends', note: 'what people look up', Icon: TrendingUp },
  { label: 'Location', note: 'city, neighbourhood', Icon: MapPin },
  { label: 'Economic data', note: 'prices, incomes', Icon: Landmark },
]

export function DataPricing() {
  const { step } = useSlide()
  const outside = step >= 1
  const hub = { x: 1185, y: 520 }
  const nodes = EXTERNAL.map((_, i) => {
    const a = ((-150 + i * 60) * Math.PI) / 180
    return { x: hub.x + Math.cos(a) * 250, y: hub.y + Math.sin(a) * 200 }
  })
  const history = [4999, 4999, 4499, 4999, 4999, 3999, 4999, 4499, 4499, 3999, 3999, 3999]
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[7.25rem]">
        <AnimatedHeadline as="h2" text="Price is a signal too." className="t-title text-fg" />
        <motion.div className="t-title mt-[0.2rem] text-fg-3" initial={false} animate={{ opacity: outside ? 1 : 0, y: outside ? 0 : 10 }} transition={{ duration: 0.6, ease: EASE }}>
          So is everything outside the store.
        </motion.div>
      </div>

      {/* price panel */}
      <Reveal delay={0.35} y={24} className="absolute left-[5.5rem] top-[17.75rem] w-[38rem]">
        <div className="panel p-[1.5rem]">
          <div className="flex items-start justify-between">
            <div>
              <div className="t-label">Shelf price · Trail runner</div>
              <div className="mt-[0.4rem] flex items-baseline gap-[0.9rem]">
                <span className="flex items-start text-[4.5rem] font-[640] leading-none tracking-[-0.05em] text-fg">
                  <IndianRupee className="mt-[0.6rem] h-[2.6rem] w-[2.6rem]" strokeWidth={2.5} />
                  3,999
                </span>
                <span className="text-[1.5rem] text-fg-3 line-through">₹4,999</span>
              </div>
            </div>
            <motion.span className="rounded-full bg-signal px-[0.8rem] py-[0.3rem] text-[1.0625rem] font-[600] text-white" initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: -6 }} transition={{ delay: 1, type: 'spring', stiffness: 300, damping: 14 }}>
              −20%
            </motion.span>
          </div>
          <div className="mt-[1rem] inline-flex items-center gap-[0.5rem] rounded-[0.6rem] border border-dashed border-fg-3 px-[0.8rem] py-[0.35rem] font-mono text-[0.9375rem] text-fg-2">
            Coupon RUN10 · extra 10% off
          </div>
          <div className="mt-[1.25rem] grid grid-cols-[1fr_15rem] gap-[1.5rem]">
            <div>
              <div className="t-label !text-[0.8125rem]">Price history · 12 weeks</div>
              <svg viewBox="0 0 240 80" className="mt-[0.4rem] w-full overflow-visible" aria-label="Weekly price history with three discount periods">
                <line x1={0} x2={240} y1={76} y2={76} className="stroke-line" />
                <motion.path
                  d={history.map((v, i) => `${i ? `H${i * 21.8} V` : 'M0 '}${76 - ((v - 3500) / 1600) * 64}`).join(' ') + ' H240'}
                  fill="none"
                  className="stroke-fg-2"
                  strokeWidth={2.25}
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.9 }}
                />
              </svg>
            </div>
            <div>
              <div className="t-label !text-[0.8125rem]">Competitor prices</div>
              {[
                ['Competitor A', 3899],
                ['Competitor B', 4199],
                ['Competitor C', 3999],
              ].map(([n, v], i) => (
                <div key={n} className="mt-[0.45rem] flex items-center gap-[0.6rem] text-[0.9375rem] text-fg-2">
                  <span className="w-[6.5rem]">{n}</span>
                  <motion.span className="h-[0.5rem] rounded-r-[3px] bg-mute" initial={{ width: 0 }} animate={{ width: `${((Number(v) - 3000) / 1300) * 4.2}rem` }} transition={{ delay: 1.1 + i * 0.1, duration: 0.6 }} />
                  <span className="ml-auto font-mono text-fg">₹{Number(v).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Illustrative className="mt-[0.75rem]">Illustrative prices</Illustrative>
      </Reveal>

      {/* inside the store: a real discount window */}
      <motion.div
        className="absolute left-[46.5rem] right-[5.5rem] top-[17.75rem] h-[30rem] overflow-hidden rounded-[1.25rem]"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: outside ? 0 : 1, x: outside ? -30 : 0, scale: outside ? 0.96 : 1 }}
        transition={{ duration: 0.7, delay: outside ? 0 : 0.6, ease: EASE }}
      >
        <Img src="/images/sale.webp" alt="Shop window with discount stickers on mannequins" className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-[1.25rem] pt-[4rem] text-[1.125rem] text-white">
          Every discount and coupon leaves a record: what changed, and how customers reacted.
        </div>
      </motion.div>

      {/* outside the store: signals converge */}
      <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {nodes.map((n, i) => (
          <g key={i}>
            <motion.line x1={n.x} y1={n.y} x2={hub.x} y2={hub.y} className="stroke-line-2" strokeWidth={1.5} initial={false} animate={{ pathLength: outside ? 1 : 0, opacity: outside ? 1 : 0 }} transition={{ delay: outside ? 0.5 + i * 0.08 : 0, duration: 0.6 }} />
            {outside && <FlowDots path={`M${n.x} ${n.y} L${hub.x} ${hub.y}`} count={2} dur={1.8} begin={1 + i * 0.2} r={4.5} className={i % 2 ? 'fill-accent' : 'fill-signal'} />}
          </g>
        ))}
        <motion.path d={`M712 470 C850 470 960 ${hub.y} ${hub.x - 80} ${hub.y}`} fill="none" className="stroke-fg-3" strokeWidth={2} initial={false} animate={{ pathLength: outside ? 1 : 0, opacity: outside ? 1 : 0 }} transition={{ delay: outside ? 1.2 : 0, duration: 0.8 }} />
      </svg>
      {EXTERNAL.map(({ label, note, Icon }, i) => (
        <motion.div
          key={label}
          className={cx('absolute flex -translate-x-1/2 items-center text-center', nodes[i].y < hub.y ? 'flex-col-reverse -translate-y-[calc(100%-1.625rem)]' : 'flex-col -translate-y-[1.625rem]')}
          style={{ left: `${nodes[i].x / 16}rem`, top: `${nodes[i].y / 16}rem` }}
          initial={false}
          animate={{ opacity: outside ? 1 : 0, scale: outside ? 1 : 0.6 }}
          transition={{ delay: outside ? 0.3 + i * 0.08 : 0, duration: 0.5, ease: EASE }}
        >
          <span className="grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full border border-line-2 bg-surface">
            <Icon className="h-[1.4rem] w-[1.4rem] text-fg" />
          </span>
          <span className={cx('whitespace-nowrap text-[1.0625rem] font-[560] text-fg', nodes[i].y < hub.y ? 'mb-[0.1rem]' : 'mt-[0.45rem]')}>{label}</span>
          <span className={cx('whitespace-nowrap text-[0.875rem] text-fg-3', nodes[i].y < hub.y && 'mb-[0.45rem]')}>{note}</span>
        </motion.div>
      ))}
      <motion.div
        className="absolute grid h-[9.5rem] w-[9.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg p-[1rem] text-center text-bg"
        style={{ left: `${hub.x / 16}rem`, top: `${hub.y / 16}rem` }}
        initial={false}
        animate={{ opacity: outside ? 1 : 0, scale: outside ? 1 : 0.5 }}
        transition={{ delay: outside ? 0.2 : 0, duration: 0.6, ease: EASE }}
      >
        <span className="text-[1.125rem] font-[600] leading-[1.15]">
          One retail
          <br />
          decision system
        </span>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ rain & umbrellas */

const LEVELS = {
  light: { rain: [2, 0, 3, 12, 10, 4, 0], search: 40, perDay: 560, label: 'Light' },
  moderate: { rain: [2, 0, 3, 35, 28, 9, 0], search: 110, perDay: 840, label: 'Moderate' },
  heavy: { rain: [2, 0, 3, 62, 48, 15, 0], search: 180, perDay: 1120, label: 'Heavy' },
} as const
type Level = keyof typeof LEVELS
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const NORMAL_PER_DAY = 400
const STORE_STOCK = 1600

function Skyline({ raining }: { raining: boolean }) {
  const blocks = [
    [0, 120], [70, 170], [130, 90], [190, 210], [270, 140], [330, 260], [410, 120], [470, 190], [540, 150], [610, 230], [690, 110], [740, 180], [810, 140],
    [880, 250], [960, 130], [1020, 200], [1100, 160], [1170, 220], [1250, 120], [1310, 180], [1380, 140], [1440, 210], [1520, 150],
  ]
  return (
    <svg viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden>
      {blocks.map(([x, h], i) => (
        <g key={i}>
          <rect x={x} y={300 - h} width={(blocks[i + 1]?.[0] ?? 1600) - x - 6} height={h} className="fill-bg-2" />
          {Array.from({ length: Math.floor(h / 34) }, (_, r) => (
            <rect key={r} x={x + 12} y={300 - h + 14 + r * 34} width={8} height={12} className={(i + r) % 3 ? 'fill-line' : 'fill-signal/40'} />
          ))}
        </g>
      ))}
      <motion.g initial={{ x: -520 }} animate={{ x: 0 }} transition={{ duration: 2.2, delay: 0.3, ease: EASE }}>
        <g className="fill-fg-3/80">
          <ellipse cx={560} cy={70} rx={150} ry={46} />
          <ellipse cx={680} cy={56} rx={120} ry={52} />
          <ellipse cx={800} cy={74} rx={140} ry={42} />
          <ellipse cx={470} cy={86} rx={90} ry={30} />
        </g>
        {raining &&
          Array.from({ length: 46 }, (_, i) => (
            <line key={i} x1={420 + ((i * 37) % 480)} x2={410 + ((i * 37) % 480)} y1={110} y2={136} className="stroke-accent/70" strokeWidth={2} strokeLinecap="round">
              <animate attributeName="y1" values="100;300" dur={`${0.7 + (i % 5) * 0.08}s`} begin={`${(i % 9) * 0.09}s`} repeatCount="indefinite" />
              <animate attributeName="y2" values="124;324" dur={`${0.7 + (i % 5) * 0.08}s`} begin={`${(i % 9) * 0.09}s`} repeatCount="indefinite" />
            </line>
          ))}
      </motion.g>
    </svg>
  )
}

function Card({ n, title, show, children }: { n: number; title: string; show: boolean; children: ReactNode }) {
  return (
    <motion.div
      className="panel relative flex h-full flex-col p-[1.25rem]"
      initial={false}
      animate={{ opacity: show ? 1 : 0.28, y: show ? 0 : 10, filter: show ? 'saturate(1)' : 'saturate(0)' }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="flex items-center gap-[0.6rem]">
        <span className="grid h-[1.75rem] w-[1.75rem] place-items-center rounded-full bg-fg font-mono text-[0.8125rem] text-bg">{n}</span>
        <span className="text-[1.25rem] font-[580] tracking-[-0.015em] text-fg">{title}</span>
      </div>
      {children}
    </motion.div>
  )
}

export function DataRain() {
  const { step } = useSlide()
  const [level, setLevel] = useState<Level>('heavy')
  const L = LEVELS[level]
  const peak = Math.max(...L.rain)
  const demand3 = L.perDay * 3
  const gap = Math.max(0, demand3 - STORE_STOCK)
  const searchSeries = [100, 102, 98, 104, 110 + L.search * 0.2, 100 + L.search * 0.6, 100 + L.search]
  const rainPhase = usePhases([1.9])
  return (
    <div className="stage">
      <div className="absolute right-0 top-[5.5rem] h-[13rem] w-[52rem] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_18%)]">
        <Skyline raining={rainPhase >= 1} />
      </div>
      <div className="absolute left-[5.5rem] top-[7.25rem]">
        <AnimatedHeadline as="h2" text="Heavy rain is coming." className="t-title text-fg" />
        <Reveal delay={0.5} className="mt-[0.5rem] t-lead !text-[1.375rem]">
          Follow one weather signal to a stock decision.
        </Reveal>
      </div>
      <div className="absolute left-[5.5rem] top-[15.4rem] flex items-center gap-[0.75rem]" role="radiogroup" aria-label="Rain intensity">
        <span className="t-label">Rain forecast</span>
        <div className="flex rounded-full border border-line-2 bg-surface p-[0.25rem]">
          {(Object.keys(LEVELS) as Level[]).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={level === k}
              onClick={() => setLevel(k)}
              className={cx('rounded-full px-[1rem] py-[0.35rem] text-[1rem] transition-colors', level === k ? 'bg-fg text-bg' : 'text-fg-2 hover:text-fg')}
            >
              {LEVELS[k].label}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute left-[5.5rem] right-[5.5rem] top-[19.75rem] grid h-[19.5rem] grid-cols-3 gap-[1.25rem]">
        <Card n={1} title="Rain increases" show>
          <div className="mt-[0.6rem] text-[2.25rem] font-[620] tracking-[-0.03em] text-fg">
            <AnimatedCounter value={peak} /> mm
          </div>
          <div className="text-[0.9375rem] text-fg-3">expected on Thursday</div>
          <div className="mt-auto flex h-[6rem] items-end gap-[0.5rem]">
            {L.rain.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-[0.3rem]">
                <motion.div className={cx('w-full max-w-[1.5rem] rounded-t-[4px]', i >= 3 && i <= 5 ? 'bg-accent' : 'bg-mute')} initial={{ height: 0 }} animate={{ height: `${(v / 62) * 4.6 + 0.15}rem` }} transition={{ duration: 0.7, delay: 0.4 + i * 0.05, ease: EASE }} />
                <span className="font-mono text-[0.75rem] text-fg-3">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card n={2} title="Umbrella searches increase" show={step >= 1}>
          <div className="mt-[0.6rem] text-[2.25rem] font-[620] tracking-[-0.03em] text-fg">
            +<AnimatedCounter value={step >= 1 ? L.search : 0} />%
          </div>
          <div className="text-[0.9375rem] text-fg-3">vs. a normal week</div>
          <svg viewBox="0 0 300 96" className="mt-auto w-full overflow-visible" aria-hidden>
            <line x1={0} x2={300} y1={88} y2={88} className="stroke-line" />
            <motion.path
              key={level}
              d={searchSeries.map((v, i) => `${i ? 'L' : 'M'}${i * 50} ${88 - ((v - 90) / 200) * 80}`).join(' ')}
              fill="none"
              className="stroke-accent"
              strokeWidth={2.5}
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: step >= 1 ? 1 : 0 }}
              transition={{ duration: 1, ease: EASE }}
            />
          </svg>
        </Card>
        <Card n={3} title="Expected sales increase" show={step >= 2}>
          <div className="mt-[0.6rem] text-[2.25rem] font-[620] tracking-[-0.03em] text-fg">
            <AnimatedCounter value={step >= 2 ? L.perDay : NORMAL_PER_DAY} from={NORMAL_PER_DAY} /> / day
          </div>
          <div className="text-[0.9375rem] text-fg-3">umbrellas, vs. {NORMAL_PER_DAY} normally</div>
          <div className="mt-auto space-y-[0.5rem]">
            {[
              ['Normal', NORMAL_PER_DAY, 'bg-mute'],
              ['Expected', L.perDay, 'bg-accent'],
            ].map(([k, v, c]) => (
              <div key={k as string} className="flex items-center gap-[0.75rem] text-[0.9375rem] text-fg-2">
                <span className="w-[4.75rem]">{k}</span>
                <motion.span className={cx('h-[1.1rem] rounded-r-[4px]', c as string)} initial={false} animate={{ width: step >= 2 ? `${((v as number) / 1120) * 13}rem` : '0rem' }} transition={{ duration: 0.8, ease: EASE }} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <motion.div
        className="absolute left-[5.5rem] right-[5.5rem] top-[40.5rem] grid h-[9rem] grid-cols-[1fr_auto] items-center gap-[2rem] rounded-[1.25rem] bg-fg px-[2rem] text-bg"
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 20 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div>
          <div className="text-[2.5rem] font-[640] leading-[1] tracking-[-0.04em]">Move stock before demand exceeds availability.</div>
          <div className="mt-[0.75rem] text-[1.125rem] opacity-75">
            City stores hold {STORE_STOCK.toLocaleString('en-IN')} umbrellas; Thursday to Saturday needs about {demand3.toLocaleString('en-IN')}.
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[0.875rem] opacity-60">{gap ? 'transfer from regional warehouse' : 'no transfer needed'}</div>
          <div className="text-[3rem] font-[640] tracking-[-0.04em] text-[#84cba3] tnum">{gap ? `${gap.toLocaleString('en-IN')} units` : 'Monitor'}</div>
        </div>
      </motion.div>
      <Illustrative className="absolute left-[33rem] top-[16.1rem]">Illustrative numbers for teaching</Illustrative>
    </div>
  )
}

/* ------------------------------------------------------------------ closing */

const NET_NODES = [
  ['weather', 120, 640], ['search', 300, 720], ['cart', 470, 610], ['price', 640, 700], ['coupon', 780, 600], ['store', 930, 690],
  ['stock', 1080, 610], ['review', 1230, 700], ['location', 1330, 630], ['festival', 1430, 720], ['return', 560, 790], ['delivery', 1150, 790],
] as const
const NET_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [2, 10], [10, 3], [6, 11], [11, 7], [0, 2], [3, 5], [6, 8],
]

function SignalNet() {
  const presence = usePresenceData() as TransitionCustom | undefined
  const forward = (presence?.dir ?? 1) > 0
  return (
    <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      {NET_EDGES.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={NET_NODES[a][1]}
          y1={NET_NODES[a][2]}
          x2={NET_NODES[b][1]}
          y2={NET_NODES[b][2]}
          className="stroke-accent/45"
          strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.6, delay: 1.8 + i * 0.09 }}
        />
      ))}
      {NET_NODES.map(([name, x, y], i) => (
        <motion.g
          key={name}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={forward ? { x: 0, y: 760 - y, opacity: 0, transition: { duration: 0.8, ease: [0.5, 0, 0.75, 0] } } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.2 + i * 0.06 }}
        >
          <circle cx={x} cy={y} r={7} className={i % 3 === 0 ? 'fill-signal' : 'fill-accent'} />
          <text x={x + 14} y={y + 5} fontSize={16} className="fill-fg-3 font-mono">
            {name}
          </text>
        </motion.g>
      ))}
    </svg>
  )
}

export function DataClosing() {
  return (
    <div className="stage">
      <SignalNet />
      <div className="absolute left-[5.5rem] right-[5.5rem] top-[8.5rem]">
        <AnimatedHeadline as="h2" text={["Don't just record", 'what happened.', 'Connect the signals.']} delay={0.3} stagger={0.07} className="text-[5.25rem] font-[640] uppercase leading-[0.9] tracking-[-0.05em] text-fg" />
        <Reveal delay={1.3} className="mt-[2.25rem] max-w-[56rem] text-[1.5rem] leading-[1.45] text-fg-2">
          “The value of retail data isn't just knowing what customers bought. It's connecting different signals to understand what they are likely to do next.”
        </Reveal>
      </div>
    </div>
  )
}
