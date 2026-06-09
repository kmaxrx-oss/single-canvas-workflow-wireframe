# AGENTS.md — Single-Canvas Workflow Wireframe

**This repository is the executable specimen / blueprint. It is not the production application and must never become it.**

## Non-negotiable rules for every change (human or AI)

1. **State and metadata are the source of truth.**
   - All demo behavior changes must go through named actions in `src/actions.js`.
   - Every section declares `data-section-id`, reads, and writes (visible in its contract block and in `data/` JSONs).
   - The DOM (index.html) is one consumer. Side-by-side, mindmap, and handoff exporters will be other consumers.

2. **Strict Tranche 0 scope (do not expand).**
   - 4 inline sections only (intake-search, results-grid, detail-selection, checkout-preview).
   - No `sections/` folder, no separate HTML fragments, no dynamic loading of section markup.
   - No toolbox, no primitive insertion, no drag & drop, no Canvas Tile / Drop Tile yet.
   - No side-by-side view implementation.
   - No mindmap / Operation Map / State Mutation Map UI.
   - No handoff export generator.
   - No automatic `localStorage` persistence. Explicit "Save/Load" buttons may be added later.
   - No React, Vue, Svelte, Angular, Next.js, or any framework.
   - No real API calls, auth, payments, booking engine, geolocation, maps, or backend.
   - No Web Components in Tranche 0.
   - Hash used only for anchor scrolling if needed; never as client-side routing.

3. **Anti-production drift**
   - Every button, form, or interactive element that looks like production must carry an obvious "DEMO / MOCK / SPECIMEN ONLY" label or class.
   - The specimen must reset cleanly on page reload (deterministic starting state).
   - Never copy this folder structure or code into a production repo. Use `/handoff` as the contract bridge.

4. **Adding behavior**
   - New state keys → first add to `data/state-contract.json` and `data/demo-state.json`.
   - New section or surface → first add to `data/workflow.json`.
   - Every action must be logged via the action log mechanism so the sticky Demo State panel shows it.
   - Update the per-section contract block (or the JSON that renders it) so the proof condition remains accurate.

5. **Handoff discipline**
   - `/handoff` is the deliverable. Keep `surface-inventory.md`, `state-map.md`, `demo-to-production-map.md`, and `component-surface-map.json` accurate.
   - When a generator is added later, it will read from the same `data-section-id` + `data-reads`/`data-writes` + state-contract.

6. **Proof before "done"**
   - A reviewer must be able to complete the full 4-section flow, watch every mutation appear live in the Demo State panel, open/close the focus overlay, and read every contract block without asking the author for clarification.
   - Run the section checklist in `docs/section-checklist.md` for each section.

## What loses in review
- Any PR that makes the canvas depend on a framework.
- Any PR that adds real booking/payment logic "for demo".
- Any PR that buries state inside visual components instead of the central observable store.
- Any PR that implements toolbox or view modes before the core reactive specimen + metadata is solid.
- Code that writes `localStorage` without an explicit user-initiated "Save demo state" action.

## Future (post Tranche 0) is welcome when the core is proven
- Primitives (with declared read/write contracts)
- Generated handoff
- Side-by-side and Operation Map views that consume the same metadata
- Additional domain specimens (e.g. football draft assistant) that reuse the same core

If you are an AI agent or human contributor, read this file, `docs/template-rules.md`, and the current `data/*.json` files before making any edit.

Violations of the above will be rejected.
