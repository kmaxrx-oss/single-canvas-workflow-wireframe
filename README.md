# Single-Canvas Workflow Wireframe — Tranche 0

**Executable specimen, not a production app.**

This is the first working slice of the Single-Canvas Workflow Wireframe concept: a single vertical HTML canvas containing four linked sections of a hotel booking flow, driven by one central observable demo state, with machine-readable contracts on every surface.

## Run it

```bash
npm install
npm run dev
```

Open the local Vite URL. The right sidebar is the live **Demo State** panel.

## What Tranche 0 proves

- One vertical canvas with 4 inline sections (intake → results → detail/selection → checkout-preview / operation stub)
- All mutations go through named actions (`performSearch`, `selectHotel`, `selectRoom`, `setOperationState`)
- Live reactive state panel + action log
- Smooth scroll + IntersectionObserver active section tracking
- Click-to-focus overlay on cards and images (Escape or backdrop to close)
- Collapsible per-section contract blocks that declare purpose, decisions, reads, writes, mock sources, and proof conditions
- Deterministic reload (no automatic localStorage)
- Explicit MOCK / SPECIMEN labels everywhere

## Strict exclusions (see AGENTS.md)

No React, no real APIs, no auth, no payments, no backend, no toolbox, no separate section files, no side-by-side, no mindmap, no persistence, no production routing.

## Key files

- `index.html` — the single executable canvas
- `src/state.js` — Proxy-wrapped observable state
- `src/actions.js` — the only writers
- `data/state-contract.json` + `data/workflow.json` — the metadata contracts
- `handoff/` — the bridge artifacts for production teams

## Proof path (stop condition)

A reviewer can:
1. Click through the entire 4-section flow
2. Watch every state mutation appear live in the Demo State panel
3. Open/close the focus overlay on hotels and rooms
4. Inspect every contract block and confirm it matches reality
5. Confirm that reloading gives a clean deterministic start

When that is true, Tranche 0 is complete.

See `AGENTS.md` for the full constitution of this method.
