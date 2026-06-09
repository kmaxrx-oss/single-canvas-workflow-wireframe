# Open Decisions — Tranche 0 Specimen

This document captures decisions that are intentionally left open or stubbed so the production team has clear inputs.

## Scope decisions already locked (do not reopen lightly)
- This repo is the executable specimen only. Production implementation lives in a separate repository.
- No real payment, auth, booking, or extension code will ever be added here.
- State and metadata (data-section-id + state-contract) are the contract. DOM is a consumer.

## Currently open / to be resolved before production handoff
- Exact guest details form fields and validation rules for the real checkout step (we only stub the preview).
- How room inventory and rate availability will be fetched (real-time vs cached).
- Cancellation policy presentation and which states allow free cancel vs fee.
- Operator / admin view surfaces (we have a stub section 4 that can evolve into operation states).
- Whether the real app will be multi-tenant (different brands) or single product.
- Image strategy and CDN for hero / room photos (we use deterministic picsum here).
- SEO canonical strategy for hotel detail pages vs search landing pages.
- Whether the Chrome extension use-case (football draft) will reuse this same wireframe template or fork it.

## Next tranche candidates (after Tranche 0 is stable)
- Add 1–2 real primitives (Drop Tile, simple card grid) with insertion points but still no full toolbox.
- Add a “Save / Load demo state” button (explicit, not automatic localStorage).
- Generate initial surface-inventory.md + state-map.md from the JSON + DOM metadata.
- One minimal side-by-side proof (two sections side-by-side in a modal or split pane) that consumes the same section metadata.

Write new open decisions here with owner + date when they arise.
