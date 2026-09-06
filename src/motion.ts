export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? "instant" : "smooth");
