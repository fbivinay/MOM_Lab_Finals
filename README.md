# Retail Analytics: From Data to Decisions

An animated, full-screen presentation website for an MSc Big Data Analytics talk. It behaves like a slide deck: one scene fills the screen, Next moves to the next build or scene, and every section flows into the next.

Five sections, 37 scenes:

1. **Roles** – from data to decision: Data Engineer, Retail Analyst, Data Scientist, ML Engineer, Business Analyst
2. **Data** – the customer journey, transactions, digital behaviour, inventory, pricing and external signals
3. **AI/ML** – reporting vs prediction, demand forecasting, recommendations, market basket analysis
4. **Industry** – e-commerce, physical retail and quick commerce compared
5. **Careers** – fundamentals, analytics, prediction, big data and business understanding

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

Requires Node 20.19+ (built with Node 24).

## Presenting

| Key | Action |
| --- | --- |
| `→` `↓` `Space` `Page Down` | Next build or scene |
| `←` `↑` `Shift+Space` `Page Up` | Previous |
| `1`–`5` | Jump to a section |
| `Home` / `End` | First / last scene |
| `F` | Toggle fullscreen (`Esc` also exits) |

Presenter clickers that send Page Up / Page Down work out of the box. The URL keeps the current scene (`#data-journey`), so a refresh lands in the same place. The deck scales to any 16:9-ish screen; laptops and projectors are the target, and small screens get a notice.

## How it is built

- React 19, TypeScript, Vite, Tailwind CSS 4, Motion for React, Lucide icons, Geist fonts (bundled, so it works offline).
- `src/presentation/` – the deck engine: `PresentationShell` (state, keyboard, fullscreen, URL sync), `SlideRenderer` and `transitions.ts` (rise, push, zoom, wipe, curtain, iris and fade transitions), and `Navigation` (section tabs with in-section progress, footer dots, build counter, progress bar).
- `src/slides/index.ts` – the running order. Each slide declares its section, theme, transition and optional build `steps`; adding a scene means adding one line here and one component.
- `src/slides/*.tsx` – one file per section, plus `shared.tsx` for chapter openers and closing statements.
- `src/components/` – animation primitives (`AnimatedHeadline`, `AnimatedCounter`, `FlowDots`, `Highlight`) and brand logos (`BrandLogo`, `BrandReveal`).

Reduced-motion preferences are respected: transform animations are disabled and the travelling data dots are removed.

## Content notes

Every number marked "illustrative" is an invented teaching example, not company data. The market basket measures are computed live from the twelve baskets shown on screen.

Company names and logos are trademarks of their owners, used for identification in an educational presentation. Logos come from Wikimedia Commons; the Instamart mark comes from Swiggy's published Instamart brand book. Photography is from Unsplash (Unsplash License). All assets are stored locally in `public/`.
