
# Meli+ UX Challenge

## Context
Mercado: Argentina
Platform: mobile-first
Reference viewport: 360px width

Meli+ offers two subscription plans:
- Meli+ Esencial
- Meli+ Total

## Business goal
Increase adoption of new Meli+ subscribers.

## Experience goal
Help people understand the difference between plans and choose
the one that best fits their needs.

## Current problem
The provided exploration presents both plans vertically in a long page.
This preserves all information but makes comparison costly on a
small viewport.

## Design hypothesis
Improve plan comparison while preserving the expressive Meli+
identity and the ability to understand the complete offering.

## Directions

### B1 — Tabs + optional swipe
Both plans occupy the same spatial position.
Users switch explicitly using tabs and may also swipe between them.

### B2 — Vertical + contextual navigation pill
Both plans remain fully available in the document flow.
A sticky contextual control lets users jump between Esencial and Total.

## Principles
1. Make the existence of two plans explicit.
2. Make comparison fast.
3. Do not depend on gestures or motion for comprehension.
4. Preserve Mercado Libre / Meli+ visual language.
5. Mobile behavior must remain usable at 360px width.
6. Respect prefers-reduced-motion.

## Out of scope
- Desktop design
- Checkout/subscription purchase flow
- Redesigning Mercado Libre navigation
- New Meli+ features