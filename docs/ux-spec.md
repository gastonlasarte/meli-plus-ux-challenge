
# Landing interaction spec

## Shared structure

1. App header
2. Meli+ hero
3. "Elegí el plan que más se adapta a vos"
4. Plan selection
5. FAQ
6. Legal

---

## B1 — Tabs + swipe

### Initial state
- Esencial selected.
- Both tabs visible:
  [Esencial] [Total]

### Interaction
- Tap Esencial -> show Esencial.
- Tap Total -> show Total.
- Horizontal swipe may also change plans.
- Tabs remain the primary affordance.
- Swipe is enhancement only.

### First-use motion
An optional subtle horizontal hint may reveal the presence of
another plan.

Must not be required to understand the UI.

### Reduced motion
When prefers-reduced-motion is active:
- don't perform the first-use movement;
- tab interaction still works;
- no information is lost.

---

## B2 — Vertical + contextual pill

Both plan sections remain stacked vertically.

### Pill
Appears when the user reaches the plan-selection area.

Example:

[ Esencial ↑ | Total ↓ ]

### Behavior
- Sticky inside the plan section.
- Current plan is visually active.
- Tap Total -> jump to Total.
- Tap Esencial -> jump to Esencial.
- Active state updates automatically based on viewport position.
- Pill disappears after leaving the plan section.

### Reduced motion
Use instant positioning instead of animated scrolling.