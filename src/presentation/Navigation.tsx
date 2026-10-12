import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Maximize2, Minimize2 } from 'lucide-react'
import type { SectionDef, SlideDef } from './deck'
import { EASE } from './transitions'

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

export function ProgressIndicator({ value }: { value: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[3px] bg-line/60" aria-hidden>
      <motion.div
        className="h-full origin-left bg-accent"
        initial={false}
        animate={{ scaleX: value }}
        transition={{ duration: 0.7, ease: EASE }}
      />
    </div>
  )
}

function BrandMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.75rem] w-[1.75rem]" aria-hidden>
      {[5, 8, 7, 12, 16].map((h, i) => (
        <rect key={i} x={2 + i * 4.3} y={21 - h} width="2.6" height={h} rx="1" className={i === 4 ? 'fill-accent' : 'fill-fg'} />
      ))}
    </svg>
  )
}

interface SectionNavProps {
  sections: SectionDef[]
  activeId?: string
  progress: number
  onSelect: (sectionId: string) => void
}

export function SectionNavigation({ sections, activeId, progress, onSelect }: SectionNavProps) {
  return (
    <nav aria-label="Sections" className="pointer-events-auto flex items-center gap-[2.25rem]">
      {sections.map((s) => {
        const on = s.id === activeId
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            aria-current={on ? 'step' : undefined}
            className="group relative flex items-baseline gap-[0.5rem] rounded-sm py-[0.875rem] text-[1.0625rem] tracking-[-0.01em]"
          >
            <span className={cx('font-mono text-[0.8125rem] transition-colors duration-300', on ? 'text-accent' : 'text-fg-3')}>{s.number}</span>
            <span className={cx('transition-colors duration-300', on ? 'text-fg' : 'text-fg-3 group-hover:text-fg-2')}>{s.label}</span>
            {on && (
              <motion.span
                layoutId="section-line"
                className="absolute inset-x-0 bottom-[0.25rem] h-[2px] overflow-hidden rounded-full bg-line-2"
                transition={{ duration: 0.55, ease: EASE }}
              >
                <motion.span
                  className="block h-full origin-left rounded-full bg-accent"
                  initial={false}
                  animate={{ scaleX: progress }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </motion.span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

interface HeaderProps extends SectionNavProps {
  index: number
  total: number
  fullscreen: boolean
  onHome: () => void
  onFullscreen: () => void
}

export function Header({ index, total, fullscreen, onHome, onFullscreen, ...nav }: HeaderProps) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[5.5rem] text-fg">
      <div className="relative mx-auto grid h-full w-[100rem] grid-cols-[1fr_auto_1fr] items-center px-[5.5rem]">
        <button type="button" onClick={onHome} className="pointer-events-auto flex items-center gap-[0.75rem] justify-self-start rounded-sm" aria-label="Back to the title slide">
          <BrandMark />
          <span className="text-[1.125rem] font-[560] tracking-[-0.02em]">Retail Analytics</span>
        </button>
        <SectionNavigation {...nav} />
        <div className="pointer-events-auto flex items-center gap-[1.25rem] justify-self-end">
          <span className="font-mono text-[0.9375rem] text-fg-3 tnum" aria-label={`Slide ${index + 1} of ${total}`}>
            <span className="text-fg">{String(index + 1).padStart(2, '0')}</span> / {total}
          </span>
          <button
            type="button"
            onClick={onFullscreen}
            title={fullscreen ? 'Exit fullscreen (F or Esc)' : 'Fullscreen (F)'}
            aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="grid h-[2.5rem] w-[2.5rem] place-items-center rounded-full border border-line-2 text-fg-2 transition-colors hover:border-fg-3 hover:text-fg"
          >
            {fullscreen ? <Minimize2 className="h-[1.1rem] w-[1.1rem]" /> : <Maximize2 className="h-[1.1rem] w-[1.1rem]" />}
          </button>
        </div>
      </div>
    </header>
  )
}

interface FooterProps {
  slides: SlideDef[]
  index: number
  step: number
  sectionSlides: { slide: SlideDef; index: number }[]
  onPrev: () => void
  onNext: () => void
  onGo: (index: number) => void
}

export function Footer({ slides, index, step, sectionSlides, onPrev, onNext, onGo }: FooterProps) {
  const slide = slides[index]
  const steps = slide.steps ?? []
  const nextSlide = slides[index + 1]
  const local = sectionSlides.findIndex((s) => s.index === index)
  const nextLabel = step < steps.length ? steps[step] : nextSlide?.title ?? 'End of presentation'
  const atEnd = index === slides.length - 1 && step >= steps.length

  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[5.5rem] text-fg">
      <div className="mx-auto flex h-full w-[100rem] items-center justify-between px-[5.5rem]">
        <div className="pointer-events-auto flex min-w-0 items-center gap-[1.25rem]">
          <button
            type="button"
            onClick={onPrev}
            disabled={index === 0 && step === 0}
            aria-label="Previous"
            className="grid h-[2.75rem] w-[2.75rem] shrink-0 place-items-center rounded-full border border-line-2 text-fg-2 transition-colors hover:border-fg-3 hover:text-fg disabled:opacity-35"
          >
            <ArrowLeft className="h-[1.1rem] w-[1.1rem]" />
          </button>

          {slide.section && (
            <>
              <div className="flex items-center gap-[0.5rem]" role="group" aria-label="Slides in this section">
                {sectionSlides.map(({ slide: s, index: i }) => {
                  const on = i === index
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onGo(i)}
                      aria-label={s.title}
                      aria-current={on ? 'step' : undefined}
                      className="relative grid h-[1.5rem] place-items-center"
                      style={{ width: on ? '2rem' : '0.75rem' }}
                    >
                      {on ? (
                        <motion.span layoutId="footer-dot" className="h-[0.5rem] w-full rounded-full bg-accent" transition={{ duration: 0.45, ease: EASE }} />
                      ) : (
                        <span className={cx('h-[0.5rem] w-[0.5rem] rounded-full transition-colors', i < index ? 'bg-fg-3' : 'bg-line-2')} />
                      )}
                    </button>
                  )
                })}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={slide.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="truncate text-[1.0625rem] text-fg-2"
                >
                  <b className="mr-[0.6rem] font-mono text-[0.9375rem] font-medium text-fg">{String(local + 1).padStart(2, '0')}</b>
                  {slide.title}
                </motion.span>
              </AnimatePresence>
            </>
          )}
        </div>

        <div className="pointer-events-auto flex items-center gap-[1.25rem]">
          {steps.length > 0 && (
            <span className="font-mono text-[0.875rem] text-fg-3 tnum" aria-label={`Build ${step + 1} of ${steps.length + 1}`}>
              {step + 1}/{steps.length + 1}
            </span>
          )}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={nextLabel}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
              className="max-w-[24rem] truncate text-[1.0625rem] text-fg-2"
            >
              {nextLabel}
            </motion.span>
          </AnimatePresence>
          <motion.button
            type="button"
            onClick={onNext}
            disabled={atEnd}
            aria-label={`Next: ${nextLabel}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="grid h-[3.5rem] w-[3.5rem] place-items-center rounded-full bg-fg text-bg transition-colors disabled:opacity-30"
          >
            <ArrowRight className="h-[1.25rem] w-[1.25rem]" />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}

export function SmallScreenNotice({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 hidden flex-col items-start justify-center gap-4 bg-bg px-6 text-fg max-[899px]:flex" role="dialog" aria-labelledby="small-screen-title">
      <h1 id="small-screen-title" className="text-[28px] font-semibold leading-tight tracking-tight">
        This presentation is optimised for laptops and larger displays.
      </h1>
      <p className="text-[17px] leading-relaxed text-fg-2">Open it on a laptop or desktop, ideally in fullscreen, for the full experience.</p>
      <button type="button" onClick={onDismiss} className="mt-2 rounded-full border border-line-2 px-5 py-2.5 text-[15px] text-fg-2">
        View anyway
      </button>
    </div>
  )
}
