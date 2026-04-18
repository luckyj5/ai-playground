# SMUS Enablement — Interactive Demo

A story-driven, single-page simulation of **Amazon SageMaker Unified Studio (SMUS)** for enterprise enablement / interview presentations.

The app demonstrates how SMUS lifts developer + data scientist productivity by **~3x** by collapsing data access, analytics, and ML workflows into a single governed experience.

![SMUS demo screenshot placeholder](./public/smus.svg)

## What it covers

Left navigation → 8 interactive sections:

1. **Overview** — 3x productivity story + headline stats.
2. **Data Access & Governance** — Before/After toggle showing the GDC vs. legacy IAM+Lake Formation flow.
3. **AI Query Editor** — Natural-language input → generated SQL + explanation + preview results.
4. **Poly-Compute Notebook** — Multi-cell notebook with per-cell kernel selection (Python, Spark, SQL, R).
5. **Data Notebook** — Drag-drop governed datasets, preview, filter/groupby/aggregate, ML handoff.
6. **Unified Studio Workflow** — 5-step workflow (Data → Query → Notebook → Train → Deploy) with Before/After minutes and speedup callout.
7. **Before vs After** — Quantitative comparison table across 6 dimensions.
8. **Architecture** — 5-layer view (Experience, AI, Governance, Compute, Data).

Also included:

- ▶ **Play guided tour** — auto-navigates every section on a timer.
- **Keyboard shortcuts** — `1`–`8` jump to a section, `←`/`→` step, `T` toggles the tour.
- **Tooltips**, smooth fade/slide transitions, AWS-inspired dark dashboard styling.
- **Mock datasets** (`src/data/mock.ts`) for customers, sales, and pre-baked NL → SQL examples.

## Tech stack

- [Vite](https://vitejs.dev/) + **React 19** + **TypeScript**
- [Tailwind CSS](https://tailwindcss.com/) (JIT, custom AWS-flavored palette)
- No backend — all content + sample results are mocked in `src/data/mock.ts`.

## Run locally

Requires Node.js 20+ (works with 22.x).

```bash
cd smus-demo
npm install
npm run dev
```

Open http://localhost:5173.

Other scripts:

```bash
npm run lint      # ESLint
npm run build     # Type-check + production bundle into ./dist
npm run preview   # Preview the production build
```

## Folder structure

```
smus-demo/
├── index.html
├── public/                # Static assets (favicon, icons)
├── src/
│   ├── App.tsx            # Shell: nav, topbar, shortcut + tour logic
│   ├── main.tsx
│   ├── index.css          # Tailwind + component tokens
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── Tooltip.tsx
│   │   └── ValueBanner.tsx
│   ├── sections/          # One file per nav section
│   │   ├── Overview.tsx
│   │   ├── DataAccess.tsx
│   │   ├── QueryEditor.tsx
│   │   ├── PolyNotebook.tsx
│   │   ├── DataNotebook.tsx
│   │   ├── UnifiedWorkflow.tsx
│   │   ├── BeforeAfter.tsx
│   │   └── Architecture.tsx
│   └── data/
│       └── mock.ts        # Nav metadata, mock datasets, NL→SQL examples, workflow steps
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## Demo talk track (suggested for an interview)

1. Open on **Overview** — anchor on 3x + pillars.
2. Go to **Data Access & Governance**, flip Before → After. Land the "days → minutes" story.
3. **AI Query Editor** — type an NL prompt, show generated SQL + explain panel.
4. **Poly-Compute Notebook** — change a cell's kernel to show Python↔Spark↔SQL in one notebook.
5. **Data Notebook** — drag `gdc.customers`, flip through filter/groupby/aggregate, click "Promote to Feature Group".
6. **Unified Workflow** — step through 1→5, toggle Before/After to quantify the speedup.
7. **Before vs After** — close with the quantified table.
8. Optionally open **Architecture** to show how it lays on top of AWS primitives.

Or just hit **▶ Play guided tour** and let it auto-advance.

## License

MIT — feel free to fork for internal enablement or customer demos.
