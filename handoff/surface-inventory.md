# Surface Inventory

Machine-readable source of truth for the four Tranche 0 surfaces lives in `data/workflow.json`.
This file is the human-readable summary for handoff.

| Section ID          | Title                        | Type (web / modal / drawer) | Primary user decision                          | Writes state keys          | Reads state keys             |
|---------------------|------------------------------|-----------------------------|------------------------------------------------|----------------------------|------------------------------|
| intake-search       | Intake / Search              | web:page                    | Refine trip parameters before seeing inventory | searchParams               | —                            |
| results-grid        | Results Grid                 | web:page                    | Choose which hotel to inspect                  | selectedHotelId            | searchParams, filteredHotelIds |
| detail-selection    | Detail / Selection           | web:page + inline cards     | Commit to a specific room/rate                 | selectedRoomId             | selectedHotelId, searchParams |
| checkout-preview    | Checkout Preview / Op-State  | web:page + state machine    | Confirm selections + observe operation status  | currentOperationState      | selectedHotelId, selectedRoomId, searchParams |

Future surfaces that will appear in later specimens (not built):
- confirmation
- manage-booking
- operator-dashboard

All surfaces above must be addressable by sectionId for side-by-side and Operation Map views.
