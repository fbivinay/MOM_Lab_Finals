import { motion } from 'motion/react'
import { useState } from 'react'
import { EASE } from '../presentation/transitions'
import { cx } from './motion'

/**
 * Official mark (Wikimedia Commons), stored locally.
 * `scale` evens out optical size: wide wordmarks read larger than square icons at the same height.
 */
export const BRANDS = {
  target: { name: 'Target', src: '/brands/target.svg', ratio: 432 / 574, scale: 1.7, color: '#CC0000', note: 'US general-merchandise retailer based in Minneapolis' },
} as const

export type BrandId = keyof typeof BRANDS

export const BRAND_URLS = Object.values(BRANDS).map((b) => b.src)

/** A brand mark at its true proportions; falls back to the plain name if the file is missing. */
export function BrandLogo({ id, height = 2.5, className }: { id: BrandId; height?: number; className?: string }) {
  const b = BRANDS[id]
  const [failed, setFailed] = useState(false)
  const h = height * b.scale
  if (failed) return <span className={cx('text-[1.25rem] font-semibold text-fg', className)}>{b.name}</span>
  return (
    <img
      src={b.src}
      alt={`${b.name} logo`}
      draggable={false}
      onError={() => setFailed(true)}
      className={cx('block max-w-none select-none', className)}
      style={{ height: `${h}rem`, width: `${h * b.ratio}rem` }}
    />
  )
}

/**
 * Logos enter on a mask and answer the pointer: lift, a rule in the brand's own colour,
 * and a one-line note about the company.
 */
export function BrandReveal({
  id,
  height = 2.5,
  delay = 0,
  className,
}: {
  id: BrandId
  height?: number
  delay?: number
  className?: string
}) {
  const b = BRANDS[id]
  return (
    <motion.div
      className={cx('group relative', className)}
      initial={{ opacity: 0, y: 24, clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', transitionEnd: { clipPath: 'none' } }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      <motion.div
        tabIndex={0}
        aria-label={`${b.name}: ${b.note}`}
        className="relative rounded-[0.9rem] outline-none"
        whileHover={{ y: -4 }}
        whileFocus={{ y: -4 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <BrandLogo id={id} height={height} />
        <span
          className="absolute -bottom-[0.6rem] left-0 h-[3px] w-full origin-left scale-x-0 rounded-full transition-transform duration-500 group-hover:scale-x-100 group-focus-within:scale-x-100"
          style={{ background: b.color, transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)' }}
        />
      </motion.div>
      <span className="pointer-events-none absolute left-0 top-full mt-[1.1rem] whitespace-nowrap rounded-md bg-fg px-[0.7rem] py-[0.35rem] text-[0.875rem] text-bg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        {b.note}
      </span>
    </motion.div>
  )
}
