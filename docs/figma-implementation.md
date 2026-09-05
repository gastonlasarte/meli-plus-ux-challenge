# Figma implementation

Branch: `figma/implementation`

Source: https://www.figma.com/design/3iU60ByWEkvtF8qQGl54ac/HISP---Challenge-UX-tech-3?node-id=40000024-493

Frame: Plan Selection, 360 × 1975. Esencial is selected initially.

This branch follows the supplied Figma frame, including its copy, prices, assets,
plan order and carousel. The earlier B1/B2 requirements and copy remain preserved
in the documentation and in branch `prototype/b1-b2`; they are not merged into
this new visual implementation.

## Implemented behavior

- Native horizontal scroll with CSS scroll snapping.
- Plan selectors support pointer, keyboard, arrow keys, Home and End.
- IntersectionObserver keeps the selectors in sync with the visible card.
- Reduced motion uses instant positioning and removes opacity transitions.
- Original images and SVG exports are stored in `public/assets/figma`.
- Proxima Nova fonts are stored locally from Mercado Libre's public webfont CDN.

## Pending source information

- The frame includes collapsed FAQ questions but no answers. Questions remain
  disabled until approved answers are supplied.
- The back button has no specified previous page and remains disabled.
- “Elegir Plan” has no destination in the supplied frame. It remains disabled;
  checkout is outside the current project scope.

No subscription, payment or FAQ-answer behavior is fabricated.

## Verification

- Production build passes (`npm run build`).
- Browser checked at 360, 390 and 412 CSS pixels; no document-level horizontal
  overflow. All local images load and no console warnings/errors were reported.
- Verified initial Esencial selection, pointer selection of Total, keyboard
  navigation, and native horizontal scrolling updating the active indicator.
- Vertical scrolling preserves the selected plan.
- Reduced-motion handling is implemented and code-reviewed; OS preference
  emulation and a physical touchscreen were not tested.
- The 8px dots have an 8px visual gap, matching Figma, within adjacent 44px
  selector targets that do not overlap.
