import { animate, motion, useReducedMotion } from 'motion/react'
import { Info } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { EASE } from '../presentation/transitions'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/** Headline that rises word by word out of a mask. */
export function AnimatedHeadline({
  text,
  className,
  style,
  delay = 0.15,
  stagger = 0.06,
  as: Tag = 'h2',
}: {
  text: string | string[]
  className?: string
  style?: CSSProperties
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
}) {
  const lines = Array.isArray(text) ? text : text.split('\n')
  let n = 0
  return (
    <Tag className={className} style={style}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(' ').map((word, wi, words) => {
            const i = n++
            return (
              <span key={wi}>
                <span className="-mb-[0.1em] -mr-[0.08em] inline-block overflow-hidden pb-[0.1em] pr-[0.08em] align-top">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '108%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.85, ease: EASE, delay: delay + i * stagger }}
                  >
                    {word}
                  </motion.span>
                </span>
                {wi < words.length - 1 ? ' ' : null}
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}

/** Generic entrance: fade plus a short travel. Use sparingly; most scenes have bespoke motion. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  x = 0,
  duration = 0.75,
  className,
  style,
}: {
  children?: ReactNode
  delay?: number
  y?: number
  x?: number
  duration?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Marker sweep behind an important phrase; works across line wraps. */
export function Highlight({
  children,
  on = true,
  delay = 0,
  tone = 'accent',
}: {
  children: ReactNode
  on?: boolean
  delay?: number
  tone?: 'accent' | 'signal'
}) {
  return (
    <motion.span
      className="box-decoration-clone text-fg"
      style={{
        backgroundImage: `linear-gradient(var(--${tone}-wash), var(--${tone}-wash))`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 92%',
      }}
      initial={false}
      animate={{ backgroundSize: on ? '100% 48%' : '0% 48%' }}
      transition={{ duration: 0.9, delay: on ? delay : 0, ease: EASE }}
    >
      {children}
    </motion.span>
  )
}

const fmtInt = (v: number) => Math.round(v).toLocaleString('en-IN')

/** Number that counts toward its value whenever the value changes. */
export function AnimatedCounter({
  value,
  from = 0,
  duration = 1.4,
  delay = 0,
  format = fmtInt,
  className,
}: {
  value: number
  from?: number
  duration?: number
  delay?: number
  format?: (v: number) => string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const current = useRef(from)
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      current.current = value
      el.textContent = format(value)
      return
    }
    const controls = animate(current.current, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        current.current = v
        el.textContent = format(v)
      },
    })
    return () => controls.stop()
  }, [value]) // re-run only when the target changes; the rest are read fresh each time
  return (
    <span ref={ref} className={cx('tnum', className)}>
      {format(from)}
    </span>
  )
}

/** Dots travelling along an SVG path, in user units of the parent SVG. Hidden under reduced motion. */
export function FlowDots({
  path,
  count = 3,
  dur = 2.4,
  begin = 0,
  r = 4,
  className = 'fill-accent',
}: {
  path: string
  count?: number
  dur?: number
  begin?: number
  r?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const b = `${(begin + (i * dur) / count).toFixed(2)}s`
        return (
          <circle key={i} r={r} className={className} opacity={0}>
            <animateMotion dur={`${dur}s`} begin={b} repeatCount="indefinite" path={path} />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.88;1" dur={`${dur}s`} begin={b} repeatCount="indefinite" />
          </circle>
        )
      })}
    </>
  )
}

/** Steps through phases on a schedule (seconds from mount). Reduced motion jumps to the end. */
export function usePhases(times: number[]) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState(reduce ? times.length : 0)
  useEffect(() => {
    if (reduce) return
    const ids = times.map((t, i) => window.setTimeout(() => setPhase(i + 1), t * 1000))
    return () => ids.forEach(window.clearTimeout)
  }, []) // schedule once per mount; a remount replays the sequence
  return phase
}

export function Illustrative({ children = 'Illustrative example — not real company data', className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cx('t-label inline-flex items-center gap-[0.4rem] !text-[0.8125rem]', className)}>
      <Info className="h-[0.85rem] w-[0.85rem] shrink-0" aria-hidden />
      {children}
    </span>
  )
}

/** Image with a quiet fallback tile if the file is missing. */
export function Img({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: CSSProperties }) {
  const [failed, setFailed] = useState(false)
  if (failed)
    return (
      <div role="img" aria-label={alt} className={cx('grid place-items-center bg-bg-2 p-[1rem] text-center t-label', className)} style={style}>
        {alt}
      </div>
    )
  return <img src={src} alt={alt} className={className} style={style} draggable={false} decoding="async" onError={() => setFailed(true)} />
}

/** Small mono caption with a leading key mark. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('t-label', className)}>{children}</div>
}
