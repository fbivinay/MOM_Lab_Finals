import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { AnimatedHeadline, Reveal, cx } from '../components/motion'
import { useSlide } from '../presentation/deck'
import { EASE } from '../presentation/transitions'

/** Dark chapter card: number, title, the opening hook in two beats (second beat on Next), and a section-specific visual. */
export function ChapterOpener({
  number,
  label,
  title,
  first,
  second,
  visual,
  titleSize = 4.5,
  children,
}: {
  number: string
  label: string
  title: string
  first: ReactNode
  second: ReactNode
  visual: ReactNode
  titleSize?: number
  /** Extra full-stage layers, e.g. signals carried over from the previous chapter. */
  children?: ReactNode
}) {
  const { step } = useSlide()
  return (
    <div className="stage">
      {children}
      <div className="absolute left-[5.5rem] top-[8.25rem] w-[46rem]">
        <Reveal className="flex items-baseline gap-[0.75rem] text-[1.25rem]" delay={0.15} y={10}>
          <span className="font-mono text-accent">{number}</span>
          <span className="text-fg-2">{label}</span>
        </Reveal>
        <AnimatedHeadline
          as="h2"
          text={title}
          delay={0.3}
          style={{ fontSize: `${titleSize}rem` }}
          className="mt-[1.25rem] font-[600] leading-[0.98] tracking-[-0.045em] text-fg"
        />
        <div className="mt-[2.25rem] space-y-[1rem] text-[1.625rem] leading-[1.42] tracking-[-0.012em] text-fg-2">
          <Reveal delay={0.8}>{first}</Reveal>
          <motion.div
            initial={false}
            animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 14 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {second}
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-[6.5rem] left-[55rem] right-[5.5rem] top-[7rem]">{visual}</div>
    </div>
  )
}

/** Closing statement: the section's one idea, set large, with the spoken line beneath. */
export function Closing({
  statement,
  quote,
  children,
  size = 6,
}: {
  statement: string[]
  quote: string
  children?: ReactNode
  size?: number
}) {
  return (
    <div className="stage">
      {children}
      <div className="absolute left-[5.5rem] right-[5.5rem] top-[8.5rem]">
        <AnimatedHeadline
          as="h2"
          text={statement}
          delay={0.35}
          stagger={0.075}
          style={{ fontSize: `${size}rem` }}
          className="font-[640] uppercase leading-[0.9] tracking-[-0.05em] text-fg"
        />
        <Reveal delay={1.3} className="mt-[2.75rem] max-w-[58rem] text-[1.625rem] leading-[1.45] tracking-[-0.01em] text-fg-2">
          “{quote}”
        </Reveal>
      </div>
    </div>
  )
}

/** Row of capability chips; `on` lights the ones the scene is currently showing. */
export function Capabilities({ items, on = [], delay = 0.9, className }: { items: string[]; on?: string[]; delay?: number; className?: string }) {
  return (
    <div className={cx('flex flex-wrap gap-[0.6rem]', className)}>
      {items.map((it, i) => (
        <motion.span
          key={it}
          className="chip"
          data-on={on.includes(it)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + i * 0.07, ease: EASE }}
        >
          {it}
        </motion.span>
      ))}
    </div>
  )
}

/** Eyebrow + headline block used by most content scenes. */
export function SceneHead({
  eyebrow,
  title,
  size = 'display',
  fontSize,
  className,
  children,
}: {
  eyebrow?: ReactNode
  title: string | string[]
  size?: 'display' | 'display-sm' | 'title'
  /** Override in rem when a headline needs to fit a narrower column. */
  fontSize?: number
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <Reveal delay={0.1} y={8} className="mb-[1rem] text-[1.25rem] font-[560] tracking-[-0.01em] text-accent-ink">
          {eyebrow}
        </Reveal>
      )}
      <AnimatedHeadline as="h2" text={title} delay={0.2} className={`t-${size} text-fg`} style={fontSize ? { fontSize: `${fontSize}rem` } : undefined} />
      {children}
    </div>
  )
}
