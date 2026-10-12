import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PresentationShell } from './presentation/PresentationShell'
import { preload, sections, slides } from './slides'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PresentationShell sections={sections} slides={slides} preload={preload} />
  </StrictMode>,
)
