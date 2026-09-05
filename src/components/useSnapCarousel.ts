import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** Native scrolling owns gestures; observation is the shared source of active state. */
export function useSnapCarousel(count: number, initial = 0) {
  const [active, setActive] = useState(initial);
  const activeRef = useRef(initial);
  const rail = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const select = useCallback((index: number, instant = false) => {
    const container = rail.current;
    const slide = slides.current[index];
    if (!container || !slide) return;
    const inset = parseFloat(getComputedStyle(container).scrollPaddingInlineStart) || 0;
    container.scrollTo({
      left: slide.offsetLeft - inset,
      behavior: instant || matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, []);

  useLayoutEffect(() => {
    select(initial, true);
    let width = rail.current?.clientWidth;
    const resize = new ResizeObserver(() => {
      if (width !== rail.current?.clientWidth) {
        width = rail.current?.clientWidth;
        select(activeRef.current, true);
      }
    });
    if (rail.current) resize.observe(rail.current);
    return () => resize.disconnect();
  }, [initial, select]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting && entry.intersectionRatio >= 0.65);
      if (visible) {
        const index = Number((visible.target as HTMLElement).dataset.index);
        activeRef.current = index;
        setActive(index);
      }
    }, { root: rail.current, threshold: 0.65 });
    slides.current.slice(0, count).forEach(slide => { if (slide) observer.observe(slide); });
    return () => observer.disconnect();
  }, [count]);

  return { active, rail, slides, select };
}
