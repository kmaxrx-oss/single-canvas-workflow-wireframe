# Motion Rules

## Allowed
- Smooth scroll for section navigation (native { behavior: 'smooth' })
- Subtle opacity / transform transitions on selection state (cards, pills)
- Focus ring + temporary highlight when a section becomes active via nav or action
- Overlay enter/exit (opacity + scale, 120-180ms)

## Forbidden in this template
- Parallax, decorative bounces, long loading spinners that are not explicitly "demo API call"
- Continuous animations
- Animations that convey data that is not also available in the static state panel
- Anything > 250ms unless it is a deliberate "progression" step the user must wait for (and even then, prefer instant + status change)

## Implementation
- Prefer CSS transitions on class changes driven by state
- Use JS only for scrollIntoView and for orchestrating overlay
- Always check `prefers-reduced-motion` before applying any timed animation (Tranche 0 mostly relies on native)
