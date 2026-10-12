import { AnimatePresence, motion } from 'motion/react'
import { SlideContext, type SlideDef, type SlideState } from './deck'
import { slideVariants, type TransitionCustom } from './transitions'

interface Props {
  slide: SlideDef
  custom: TransitionCustom
  state: SlideState
}

/** Only the current slide is mounted; AnimatePresence keeps the outgoing one alive for its exit. */
export function SlideRenderer({ slide, custom, state }: Props) {
  const { Component } = slide
  return (
    <AnimatePresence custom={custom}>
      <motion.section
        key={slide.id}
        className="absolute inset-0 overflow-hidden bg-bg text-fg will-change-transform"
        custom={custom}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        aria-roledescription="slide"
        aria-label={slide.title}
      >
        <SlideContext.Provider value={state}>
          <Component />
        </SlideContext.Provider>
      </motion.section>
    </AnimatePresence>
  )
}
