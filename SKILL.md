# SKILL.md — Single-Canvas Workflow Wireframe

**Status: Stub / template definition only. Not yet an active Grok skill.**

This file will eventually describe how to use this repository as a reusable template via a Grok skill (e.g. "spin up a new hotel booking workflow wireframe" or "create a football-draft-assistant specimen").

## Current rules
- Do **not** use this SKILL.md to drive implementation of Tranche 0 or Tranche 1.
- Implementation is driven by the human orchestrator instructions + AGENTS.md + the merged Tranche 0 spec.
- When the skill is activated later, it should:
  1. Copy the template structure.
  2. Populate `data/workflow.json`, `data/state-contract.json`, and the four initial sections in `index.html` from a short domain description.
  3. Generate the initial handoff/ stubs.
  4. Leave the specimen in a runnable state with the same strict anti-scope rules.

## Until activated
Treat this file as documentation of intent. The real usage contract lives in README.md and AGENTS.md.

If you are asked to "use the skill", reply that the skill is not yet implemented and point to the manual process described in the repo.
