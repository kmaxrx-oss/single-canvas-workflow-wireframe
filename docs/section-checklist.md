# Section Checklist (before a section is considered "done" for the specimen)

- [ ] Has a stable data-section-id
- [ ] Contract block is present, complete, and matches workflow.json + state-contract.json
- [ ] All reads/writes listed are actually implemented in actions
- [ ] Primary action button(s) call named action(s) only
- [ ] Proof condition in the contract can be manually verified in < 30s
- [ ] Mock source is explicitly called out as non-production
- [ ] No real API calls, no auth, no payment, no persistence
- [ ] Works when state is reset (no hidden assumptions about prior selections)
- [ ] Visible MOCK / DEMO labels on any data that looks real
- [ ] Contributes at least one meaningful state write or read that downstream sections depend on

A reviewer must be able to go through the checklist for every section without asking the author questions.
