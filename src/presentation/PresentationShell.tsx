import { MotionConfig } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SectionDef, SlideDef, SlideState } from './deck'
import { Footer, Header, ProgressIndicator, SmallScreenNotice } from './Navigation'
import { SlideRenderer } from './SlideRenderer'

interface Nav {
  index: number
  step: number
  dir: 1 | -1
  /** Slide we came from; the later slide of the pair decides the transition. */
  from: number
}

/** Ignore a second slide change that lands while the first one is still mid-flight. */
const SLIDE_LOCK_MS = 380
const STEP_LOCK_MS = 140

const stepsOf = (s: SlideDef) => s.steps?.length ?? 0

function indexFromHash(slides: SlideDef[]) {
  const id = decodeURIComponent(window.location.hash.replace(/^#\/?/, ''))
  const i = slides.findIndex((s) => s.id === id)
  return i < 0 ? 0 : i
}

function useFullscreen() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const sync = () => setOn(document.fullscreenElement != null)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])
  const toggle = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => {})
  }, [])
  return [on, toggle] as const
}

/** Warm the cache after first paint so later scenes never pop in. */
function usePreload(urls: string[]) {
  useEffect(() => {
    const run = () => urls.forEach((u) => (new Image().src = u))
    const id = window.setTimeout(run, 1200)
    return () => window.clearTimeout(id)
  }, [urls])
}

interface Props {
  sections: SectionDef[]
  slides: SlideDef[]
  preload: string[]
}

export function PresentationShell({ sections, slides, preload }: Props) {
  const [nav, setNav] = useState<Nav>(() => {
    const index = indexFromHash(slides)
    return { index, step: 0, dir: 1, from: index }
  })
  const navRef = useRef(nav)
  const lockUntil = useRef(0)
  const [fullscreen, toggleFullscreen] = useFullscreen()
  const [allowSmall, setAllowSmall] = useState(false)
  usePreload(preload)

  const commit = useCallback((n: Nav) => {
    navRef.current = n
    setNav(n)
  }, [])

  const goToIndex = useCallback(
    (index: number, step = 0) => {
      const cur = navRef.current
      if (index < 0 || index >= slides.length) return
      if (index === cur.index) {
        if (step !== cur.step) commit({ ...cur, step, dir: step > cur.step ? 1 : -1 })
        return
      }
      const now = performance.now()
      if (now < lockUntil.current) return
      lockUntil.current = now + SLIDE_LOCK_MS
      commit({ index, step, dir: index > cur.index ? 1 : -1, from: cur.index })
    },
    [commit, slides.length],
  )

  // Builds are quick, but never fire while a slide is still arriving (a double-tap must not skip one).
  const buildStep = useCallback(
    (delta: 1 | -1) => {
      const now = performance.now()
      if (now < lockUntil.current) return
      lockUntil.current = now + STEP_LOCK_MS
      commit({ ...navRef.current, step: navRef.current.step + delta, dir: delta })
    },
    [commit],
  )

  const next = useCallback(() => {
    const { index, step } = navRef.current
    if (step < stepsOf(slides[index])) buildStep(1)
    else goToIndex(index + 1)
  }, [buildStep, goToIndex, slides])

  const prev = useCallback(() => {
    const { index, step } = navRef.current
    if (step > 0) buildStep(-1)
    else if (index > 0) goToIndex(index - 1, stepsOf(slides[index - 1]))
  }, [buildStep, goToIndex, slides])

  const goToSection = useCallback(
    (sectionId: string) => goToIndex(slides.findIndex((s) => s.section === sectionId)),
    [goToIndex, slides],
  )

  // Keyboard: presenter clickers send PageUp/PageDown; Space only advances when it isn't pressing a focused control.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t?.closest('input, textarea, select, [contenteditable="true"]')) return
      const keyboardFocusedControl = !!t?.closest('button, a, [role="button"]') && t.matches(':focus-visible')
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault()
          if (!e.repeat) next()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          if (!e.repeat) prev()
          break
        case ' ':
          if (keyboardFocusedControl) return
          e.preventDefault()
          if (!e.repeat) (e.shiftKey ? prev : next)()
          break
        case 'Home':
          e.preventDefault()
          goToIndex(0)
          break
        case 'End':
          e.preventDefault()
          goToIndex(slides.length - 1)
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        default:
          if (/^[1-9]$/.test(e.key) && sections[Number(e.key) - 1]) goToSection(sections[Number(e.key) - 1].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, goToIndex, goToSection, toggleFullscreen, sections, slides.length])

  // Keep the URL on the current slide so a refresh lands in the same place.
  useEffect(() => {
    const id = slides[nav.index].id
    if (decodeURIComponent(window.location.hash.slice(1)) !== id) window.history.replaceState(null, '', `#${id}`)
  }, [nav.index, slides])

  useEffect(() => {
    const onHash = () => goToIndex(indexFromHash(slides))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [goToIndex, slides])

  const slide = slides[nav.index]
  const theme = slide.theme ?? 'light'

  const sectionSlides = useMemo(
    () => slides.map((s, index) => ({ slide: s, index })).filter((x) => x.slide.section && x.slide.section === slide.section),
    [slides, slide.section],
  )

  const stepFraction = stepsOf(slide) ? nav.step / (stepsOf(slide) + 1) : 0
  const local = sectionSlides.findIndex((x) => x.index === nav.index)
  const sectionProgress = sectionSlides.length ? (local + 1) / sectionSlides.length : 0
  const progress = (nav.index + stepFraction) / (slides.length - 1)

  const state = useMemo<SlideState>(
    () => ({
      step: nav.step,
      dir: nav.dir,
      setStep: (step: number) => goToIndex(navRef.current.index, Math.max(0, Math.min(step, stepsOf(slides[navRef.current.index])))),
      goTo: (id: string) => goToIndex(slides.findIndex((s) => s.id === id)),
    }),
    [nav.step, nav.dir, goToIndex, slides],
  )

  const kind = slides[Math.max(nav.index, nav.from)].transition ?? 'rise'

  // Chrome follows the slide theme, flipping mid-transition rather than before the new slide is visible.
  const [chromeTheme, setChromeTheme] = useState(theme)
  useEffect(() => {
    const id = window.setTimeout(() => setChromeTheme(theme), 320)
    document.documentElement.dataset.theme = theme
    return () => window.clearTimeout(id)
  }, [theme])

  return (
    <MotionConfig reducedMotion="user">
      <div data-theme={chromeTheme} className="relative h-full w-full overflow-hidden text-fg" style={{ background: 'var(--shell)' }}>
        <SlideRenderer slide={slide} custom={{ dir: nav.dir, kind }} state={state} />
        <ProgressIndicator value={progress} />
        <Header
          sections={sections}
          activeId={slide.section}
          progress={sectionProgress}
          onSelect={goToSection}
          index={nav.index}
          total={slides.length}
          fullscreen={fullscreen}
          onHome={() => goToIndex(0)}
          onFullscreen={toggleFullscreen}
        />
        <Footer slides={slides} index={nav.index} step={nav.step} sectionSlides={sectionSlides} onPrev={prev} onNext={next} onGo={goToIndex} />
        {!allowSmall && <SmallScreenNotice onDismiss={() => setAllowSmall(true)} />}
      </div>
    </MotionConfig>
  )
}
