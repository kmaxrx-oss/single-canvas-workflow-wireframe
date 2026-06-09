# Template Rules (Tranche 0+)

## Core principles
1. This is an **executable specimen**, not a prototype that will be forked into production.
2. State + metadata (data-section-id, workflow.json, state-contract.json) own the truth. The DOM renders a view of that truth.
3. All mutations happen through named actions in src/actions.js. No direct state writes from event handlers or render code.
4. Every interactive surface must declare what it reads and writes (visible in the collapsible contract block).
5. Motion clarifies state or progression only. ≤200ms, transform/opacity, reduced-motion safe.

## Adding a new section (when we go beyond Tranche 0)
- Add entry to data/workflow.json first.
- Add <section data-section-id="new-id"> in index.html with its own contract block.
- Add any new state keys to data/state-contract.json + initial demo-state.
- Implement the corresponding action(s) and a renderXXX function.
- Update handoff/ artifacts (or run generator when it exists).
- Update AGENTS.md if the new section introduces new anti-scope considerations.

## Naming
- HTML sections: data-section-id (kebab)
- State keys: camelCase, explicit
- Actions: verb + noun (performSearch, selectHotel, setOperationState)
- Primitives (future): Pascal or kebab in their folder, e.g. hotel-card, drop-tile

## What belongs in /handoff vs /data
- /data = live machine-readable contracts used by the running specimen.
- /handoff = curated, human + machine artifacts intended to be consumed by the production team. Some will be generated from /data + DOM metadata later.
