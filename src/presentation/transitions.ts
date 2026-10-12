import type { Transition, Variants } from 'motion/react'
import type { TransitionKind } from './deck'

export type Bezier = [number, number, number, number]
export const EASE: Bezier = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT: Bezier = [0.65, 0, 0.35, 1]

export interface TransitionCustom {
  dir: 1 | -1
  kind: TransitionKind
}

const tr = (duration: number, ease: Bezier = EASE): Transition => ({
  duration,
  ease,
  zIndex: { duration: 0 },
  pointerEvents: { duration: 0 },
})

const FULL_INSET = 'inset(0% 0% 0% 0%)'
const FULL_CIRCLE = 'circle(75% at 50% 50%)'

/*
 * Rule of thumb: the incoming slide sits on top and settles in while the outgoing
 * one stays opaque underneath, so two slides never fade against the shell at once.
 * Wipe / curtain / iris swap that order when played backwards, so the later slide
 * retracts and reveals the earlier one.
 */
export const slideVariants: Variants = {
  enter: ({ dir, kind }: TransitionCustom) => {
    switch (kind) {
      case 'rise':
        return { opacity: 0, y: `${5 * dir}%`, zIndex: 2 }
      case 'push':
        return { opacity: 0, x: `${5 * dir}%`, zIndex: 2 }
      case 'zoom':
        return dir > 0
          ? { opacity: 0, scale: 1.04, zIndex: 2 }
          : { opacity: 1, scale: 0.93, borderRadius: '1.5rem', zIndex: 1 }
      case 'wipe':
        return dir > 0
          ? { clipPath: 'inset(0% 0% 0% 100%)', zIndex: 2 }
          : { x: '-3%', clipPath: FULL_INSET, zIndex: 1 }
      case 'curtain':
        return dir > 0
          ? { clipPath: 'inset(100% 0% 0% 0%)', zIndex: 2 }
          : { y: '-3%', clipPath: FULL_INSET, zIndex: 1 }
      case 'iris':
        return dir > 0
          ? { clipPath: 'circle(0% at 50% 50%)', zIndex: 2 }
          : { scale: 0.95, clipPath: FULL_CIRCLE, zIndex: 1 }
      case 'fade':
        return { opacity: 1, zIndex: 1 }
    }
  },
  center: ({ kind }: TransitionCustom) => {
    const base = { opacity: 1, x: '0%', y: '0%', scale: 1, borderRadius: '0rem', pointerEvents: 'auto' as const }
    switch (kind) {
      case 'wipe':
      case 'curtain':
        return { ...base, clipPath: FULL_INSET, transition: tr(0.9, EASE_IN_OUT) }
      case 'iris':
        return { ...base, clipPath: FULL_CIRCLE, transition: tr(1, EASE_IN_OUT) }
      case 'zoom':
        return { ...base, transition: tr(0.8) }
      default:
        return { ...base, transition: tr(0.75) }
    }
  },
  exit: ({ dir, kind }: TransitionCustom) => {
    const off = { pointerEvents: 'none' as const }
    switch (kind) {
      case 'rise':
        return { ...off, y: `${-2 * dir}%`, scale: 0.985, zIndex: 1, transition: tr(0.75) }
      case 'push':
        return { ...off, x: `${-2.5 * dir}%`, zIndex: 1, transition: tr(0.75) }
      case 'zoom':
        return dir > 0
          ? { ...off, scale: 0.93, borderRadius: '1.5rem', zIndex: 1, transition: tr(0.8) }
          : { ...off, opacity: 0, scale: 1.04, zIndex: 2, transition: tr(0.6) }
      case 'wipe':
        return dir > 0
          ? { ...off, x: '-3%', zIndex: 1, transition: tr(0.9, EASE_IN_OUT) }
          : { ...off, clipPath: 'inset(0% 0% 0% 100%)', zIndex: 2, transition: tr(0.9, EASE_IN_OUT) }
      case 'curtain':
        return dir > 0
          ? { ...off, y: '-3%', zIndex: 1, transition: tr(0.9, EASE_IN_OUT) }
          : { ...off, clipPath: 'inset(100% 0% 0% 0%)', zIndex: 2, transition: tr(0.9, EASE_IN_OUT) }
      case 'iris':
        return dir > 0
          ? { ...off, scale: 0.95, zIndex: 1, transition: tr(1, EASE_IN_OUT) }
          : { ...off, clipPath: 'circle(0% at 50% 50%)', zIndex: 2, transition: tr(0.85, EASE_IN_OUT) }
      case 'fade':
        return { ...off, opacity: 0, zIndex: 2, transition: tr(0.6) }
    }
  },
}
