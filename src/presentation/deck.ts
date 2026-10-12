import { createContext, useContext, type ComponentType } from 'react'

export type Theme = 'light' | 'dark'

/** How a slide arrives. The later slide of a pair owns the transition, so going back plays it in reverse. */
export type TransitionKind = 'rise' | 'push' | 'zoom' | 'wipe' | 'curtain' | 'iris' | 'fade'

export interface SectionDef {
  id: string
  number: string
  label: string
  title: string
}

export interface SlideDef {
  id: string
  /** Undefined for the cover. */
  section?: string
  /** Short name shown in the footer and used as the slide's accessible label. */
  title: string
  theme?: Theme
  transition?: TransitionKind
  /** In-slide builds after the initial state; Next walks through them before leaving the slide. */
  steps?: string[]
  Component: ComponentType
}

export interface SlideState {
  step: number
  dir: 1 | -1
  setStep: (step: number) => void
  goTo: (slideId: string) => void
}

export const SlideContext = createContext<SlideState>({
  step: 0,
  dir: 1,
  setStep: () => {},
  goTo: () => {},
})

export const useSlide = () => useContext(SlideContext)
