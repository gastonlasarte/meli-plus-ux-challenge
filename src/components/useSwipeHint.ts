import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { swipeHintOffset } from "./carouselModel";
import { prefersReducedMotion } from "../motion";

// Estado de módulo a propósito: una sola demostración por carga del documento,
// aunque el componente se desmonte y vuelva a montar.
let demonstrated = false;

export function useSwipeHint(rail: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const stop = useRef<() => void>(() => {});
  const cancel = useCallback(() => {
    demonstrated = true;
    stop.current();
  }, []);

  useEffect(() => {
    const element = rail.current;
    if (!element || !enabled || demonstrated) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");

    let timer = 0;
    let frame = 0;
    let origin: number | null = null;
    const abort = () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      if (origin !== null) element.scrollLeft = origin;
      element.removeAttribute("data-swipe-hint");
      origin = null;
    };
    stop.current = abort;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.8);
      if (!visible) { abort(); return; }
      if (motion.matches || demonstrated || element.closest("[inert]")) return;
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (demonstrated || motion.matches || element.closest("[inert]")) return;
        demonstrated = true;
        origin = element.scrollLeft;
        element.setAttribute("data-swipe-hint", "");
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / 1200, 1);
          element.scrollLeft = origin! + swipeHintOffset(progress, element.clientWidth);
          if (progress < 1) frame = requestAnimationFrame(tick);
          else abort();
        };
        frame = requestAnimationFrame(tick);
      }, 500);
    }, { threshold: 0.8 });
    observer.observe(element);
    motion.addEventListener("change", abort);
    document.addEventListener("visibilitychange", abort);
    return () => {
      abort();
      observer.disconnect();
      motion.removeEventListener("change", abort);
      document.removeEventListener("visibilitychange", abort);
      stop.current = () => {};
    };
  }, [enabled, rail]);

  return cancel;
}
