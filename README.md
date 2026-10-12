# Retail Analytics: From Data to Decisions

An animated, full-screen presentation website for an MSc Big Data Analytics talk. It behaves like a slide deck: one scene fills the screen, Next moves to the next build or scene, and every section flows into the next.

Six sections, 33 scenes, all in a light theme:

1. **Roles** – from data to decision: Data Engineer, Retail Analyst, Data Scientist, ML Engineer, Business Analyst
2. **Data** – the customer journey, digital behaviour, pricing and external signals
3. **AI/ML** – reporting vs prediction, demand forecasting, recommendations, market basket analysis
4. **Industry** – a Target company profile with the interviewee, then four slides from interview notes: business problems and metrics, the Essential Beauty analytics project, collaboration and tools, machine learning and challenges
5. **Careers** – fundamentals, analytics, prediction, big data and business understanding
6. **Jobs** – fresher analyst openings in India, collected every morning from employer career sites, and 16 job sites with ready-made searches

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
| `1`–`6` | Jump to a section |
| `Home` / `End` | First / last scene |
| `F` | Toggle fullscreen (`Esc` also exits) |

Presenter clickers that send Page Up / Page Down work out of the box. The URL keeps the current scene (`#data-journey`), so a refresh lands in the same place. The deck scales to any 16:9-ish screen; laptops and projectors are the target, and small screens get a notice.

## How it is built

- React 19, TypeScript, Vite, Tailwind CSS 4, Motion for React, Lucide icons, Geist fonts (bundled, so it works offline).
- `src/presentation/` – the deck engine: `PresentationShell` (state, keyboard, fullscreen, URL sync), `SlideRenderer` and `transitions.ts` (rise, push, zoom, wipe, curtain, iris and fade transitions), and `Navigation` (section tabs with in-section progress, footer dots, build counter, progress bar).
- `src/slides/index.ts` – the running order. Each slide declares its section, transition and optional build `steps`; adding a scene means adding one line here and one component.
- `src/slides/*.tsx` – one file per section, plus `shared.tsx` for chapter openers and closing statements.
- `src/components/` – animation primitives (`AnimatedHeadline`, `AnimatedCounter`, `FlowDots`, `Highlight`) and brand logos (`BrandLogo`, `BrandReveal`).

Reduced-motion preferences are respected: transform animations are disabled and the travelling data dots are removed.

## Jobs board

`scripts/jobs/` collects analyst openings in India that are open to freshers or 0–1 years of experience and writes `public/data/jobs.json`. The Jobs slide reads that file from GitHub, so it stays current without a redeploy, and falls back to the copy bundled at deploy time.

```bash
npm run jobs:collect  # fetch listings into public/data/jobs.json (Node 24+, no credentials)
npm run jobs:check    # type-check the collector and run the pipeline self-check
```

- **Sources** (`sources.ts`, one fetcher per platform): the Greenhouse Job Board API, the Lever Postings API, the SmartRecruiters Posting API, and Workday career sites whose robots.txt allows crawling and lists a sitemap; the schema.org `JobPosting` data on each Workday job page supplies the fields. All are public and need no login or key.
- **Employers** (`employers.json`): Target, TJX, Fractal (campus and main career sites), Swiggy, NielsenIQ, Meesho, dunnhumby, Sigmoid, Coupang and Mintel. To add one, append `{ "company", "platform", "board" }`, where `board` is the slug in the employer's job-board URL, or the career-site URL for Workday. Check a Workday site's robots.txt before adding it.
- **Rules** (`pipeline.ts`): India locations and analyst titles only (data, business, BI, pricing, merchandising, demand, supply chain, inventory, customer insights, analytics internships). Senior titles and postings that ask for two or more years are left out. A posting that states no experience stays in and is flagged "Check experience". Anything a source does not publish (salary, deadline, posting date, employment type) is stored as `null` and shown as not stated.
- **Status**: `active` when seen at the last check; `expired` when gone from a board that loaded or past its deadline (removed 14 days later); `unverified` when its board could not be reached for more than three days.
- **Schedule**: `.github/workflows/collect-jobs.yml` runs every day at about 06:00 IST, or on demand from the Actions tab, and commits `jobs.json` when it changes. Pull before pushing, because the workflow commits to `main`. GitHub pauses scheduled workflows in a repository with no activity for 60 days; re-enable it from the Actions tab.
- **Job sites** (LinkedIn, Indeed, Naukri and 13 more) appear only as links to pre-filtered searches. None of them offers a public jobs API we can use, and several prohibit automated collection.

## Content notes

Every number marked "illustrative" is an invented teaching example, not company data. The market basket measures are computed live from the twelve baskets shown on screen.

The four interview slides in Industry use only the wording of the interview notes; their visuals are schematic and show no data.

The Target slide uses figures from Target's fiscal 2025 annual report (year ended 31 January 2026): headquarters at 1000 Nicollet Mall, Minneapolis; 1,995 stores; approximately 415,000 team members; administrative functions in Bengaluru (Bangalore), India. The interviewee profile (Hariharan, MSc BDA, St Joseph’s University, graduated 2026) comes from the presenters.

Company names and logos are trademarks of their owners, used for identification in an educational presentation. The Target logo comes from Wikimedia Commons, where it is public domain. Photography is from Unsplash (Unsplash License). All assets are stored locally in `public/`.
