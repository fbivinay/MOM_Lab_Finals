import { motion } from 'motion/react'
import { AnimatedHeadline, Reveal, usePhases } from '../components/motion'
import { useSlide } from '../presentation/deck'
import { EASE } from '../presentation/transitions'
import { sections } from './sections'

/* Barcode widths in modules; the same 30 bars later become a sales chart. */
const BAR = [1, 2, 1, 3, 1, 1, 2, 1, 4, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 4, 1, 2, 1, 3, 1, 1, 2, 1, 3]
const GAP = [1, 2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 1]
const X0 = 24
const SPAN = 640
const BASE = 330
const TOP = 70
const unit = SPAN / (BAR.reduce((a, b) => a + b, 0) + GAP.reduce((a, b) => a + b, 0))
const barcode = (() => {
  let acc = X0
  return BAR.map((w, i) => {
    const x = acc
    acc += (w + (GAP[i] ?? 0)) * unit
    return { x, w: w * unit }
  })
})()
const slot = SPAN / BAR.length
const chart = BAR.map((_, i) => {
  const h = 62 + i * 4.4 + 26 * Math.sin(i * 0.85) + ((i * 7) % 5) * 5
  return { x: X0 + i * slot + (slot - 11) / 2, w: 11, h }
})
const trend = chart.map((c, i) => `${i ? 'L' : 'M'}${(c.x + c.w / 2).toFixed(1)} ${(BASE - c.h - 14).toFixed(1)}`).join(' ')

function BarcodeToChart() {
  // 0 barcode grows · 1 scanned · 2 bars become a chart · 3 trend line
  const phase = usePhases([1.5, 2.4, 3.5])
  const asChart = phase >= 2
  return (
    <svg viewBox="0 0 690 420" className="h-full w-full overflow-visible" aria-label="A barcode whose bars rearrange into a rising sales chart">
      <motion.line
        x1={X0}
        x2={X0 + SPAN}
        y1={BASE + 0.5}
        y2={BASE + 0.5}
        className="stroke-line-2"
        strokeWidth={1}
        initial={{ opacity: 0 }}
        animate={{ opacity: asChart ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      />
      {barcode.map((b, i) => {
        const c = chart[i]
        const hot = i >= BAR.length - 3
        return (
          <motion.rect
            key={i}
            rx={asChart ? 3 : 0}
            initial={{ attrX: b.x, width: b.w, attrY: BASE, height: 0 }}
            animate={
              asChart
                ? { attrX: c.x, width: c.w, attrY: BASE - c.h, height: c.h, fill: hot ? 'var(--accent)' : 'var(--mute)' }
                : { attrX: b.x, width: b.w, attrY: TOP, height: BASE - TOP, fill: 'var(--fg)' }
            }
            transition={
              asChart
                ? { duration: 1, ease: EASE, delay: i * 0.018 }
                : { duration: 0.7, ease: EASE, delay: 0.35 + i * 0.022 }
            }
          />
        )
      })}
      {/* scanner flash */}
      <motion.line
        x1={X0 - 16}
        x2={X0 + SPAN + 16}
        y1={210}
        y2={210}
        stroke="var(--signal)"
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={phase === 1 ? { pathLength: 1, opacity: [0, 1, 1, 0] } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      <motion.text
        x={X0}
        y={BASE + 34}
        className="fill-fg-3 font-mono"
        fontSize={17}
        letterSpacing={6}
        initial={{ opacity: 0 }}
        animate={{ opacity: asChart ? 0 : 1 }}
        transition={{ duration: 0.5, delay: asChart ? 0 : 1 }}
      >
        8 901234 567896
      </motion.text>
      <motion.path
        d={trend}
        fill="none"
        className="stroke-accent"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={phase >= 3 ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <motion.circle
        cx={chart[chart.length - 1].x + 5.5}
        cy={BASE - chart[chart.length - 1].h - 14}
        r={6}
        className="fill-accent stroke-bg"
        strokeWidth={3}
        initial={{ scale: 0 }}
        animate={{ scale: phase >= 3 ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 1.1, ease: EASE }}
      />
      <motion.text
        x={X0}
        y={BASE + 34}
        className="fill-fg-3 font-mono"
        fontSize={15}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        Every scan becomes a data point.
      </motion.text>
    </svg>
  )
}

export function Cover() {
  const { goToSection } = useSlide()
  return (
    <div className="stage">
      <div className="absolute left-[5.5rem] top-[9.5rem]">
        <Reveal className="t-label !text-[1.0625rem]" delay={0.1} y={8}>
          MSc Big Data Analytics
        </Reveal>
        <AnimatedHeadline
          as="h1"
          text={['Retail', 'Analytics']}
          delay={0.2}
          stagger={0.12}
          className="mt-[1.25rem] text-[8.75rem] font-[650] leading-[0.86] tracking-[-0.06em] text-fg"
        />
        <Reveal delay={0.75} className="mt-[1.75rem] text-[2.25rem] font-[400] tracking-[-0.03em] text-fg-2">
          From data to decisions
        </Reveal>
      </div>

      <div className="absolute right-[4.5rem] top-[9rem] h-[27rem] w-[43rem]">
        <BarcodeToChart />
      </div>

      <nav aria-label="Chapters" className="absolute bottom-[8rem] left-[5.5rem] right-[5.5rem] grid grid-cols-6 border-t border-line">
        {sections.map((s, i) => (
          <motion.button
            key={s.id}
            type="button"
            onClick={() => goToSection(s.id)}
            className="group flex flex-col items-start gap-[0.4rem] pr-[1.5rem] pt-[1.1rem] text-left"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 + i * 0.08, ease: EASE }}
          >
            <span className="font-mono text-[0.9375rem] text-accent">{s.number}</span>
            <span className="text-[1.25rem] font-[560] tracking-[-0.015em] text-fg transition-colors group-hover:text-accent-ink">{s.label}</span>
            <span className="text-[0.9375rem] leading-[1.35] text-fg-3">{s.title}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  )
}
