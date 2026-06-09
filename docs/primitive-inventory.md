# Primitive Inventory (Tranche 0)

Tranche 0 deliberately contains **no active primitives / sockets / toolbox**.

This file exists so that when we add the first reusable Canvas Tile or Drop Tile in a later tranche, we have a place to document:

- The primitive's name
- What state it reads / writes (must be declared)
- Which sections it is allowed to appear in
- Markup + hydrator location (will live under primitives/ when activated)
- Whether it is safe to clone for side-by-side / mindmap views

Current status: inventory empty. The only reusable patterns right now are the hotel-card and room-rate-card patterns inside the results and detail sections. They are **not** yet extracted as portable primitives.
