# State Map (Tranche 0)

Source of authority: `data/state-contract.json`

## Key lifecycle summary

- `searchParams` — written only by `performSearch`. Read by results + detail + checkout surfaces for context.
- `selectedHotelId` — written by `selectHotel`. Once set, the Detail and Checkout surfaces become enabled. Cleared only via full Reset.
- `selectedRoomId` — written by `selectRoom`. Enables the operation state transitions in section 4.
- `currentOperationState` — coarse state machine for the booking intent. Starts at "intake". Advanced explicitly in checkout-preview or implicitly when room is selected.
- `filteredHotelIds` — derived for the results grid. Not persisted.

## Writers vs Readers (for future mindmap / mutation views)

See state-contract.json for the full per-key writers/readers arrays.

This map + the operationStates and branches declared in workflow.json for the checkout-preview section are the inputs a later State Mutation Map will consume.
