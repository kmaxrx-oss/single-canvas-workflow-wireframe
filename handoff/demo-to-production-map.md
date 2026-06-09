# Demo-to-Production Map

| Wireframe behavior (specimen)                          | Production equivalent                                      | Owner          | Open questions / risks                              |
|--------------------------------------------------------|------------------------------------------------------------|----------------|-----------------------------------------------------|
| Client-side search + filter on mock JSON               | Real /hotels/search or GraphQL query with availability     | Backend        | Rate limiting, caching strategy, geo radius         |
| Click card → set selectedHotelId + scroll              | SPA navigation or <a> to /hotel/{slug} with state restore  | Frontend       | Deep link support, back button behavior             |
| Room selection writes selectedRoomId                   | Add to cart / start reservation session                    | Frontend+API   | How long does a held rate last?                     |
| Operation state buttons (payment-pending-demo etc.)    | Real state machine in booking service + webhooks           | Backend        | What are the exact terminal states?                 |
| Focus overlay on image/card                            | Lightbox, modal gallery, or dedicated media viewer         | Design/FE      | Accessibility (focus trap, aria)                    |
| Per-section contract blocks                            | Living documentation generated from same metadata          | Eng + PM       | How do we keep them from rotting?                   |
| No persistence on reload                               | Real app will have URL state + server session              | FE             | What belongs in URL vs local/session storage?       |

**Rule**: The specimen never becomes the production codebase. This map is the bridge.
