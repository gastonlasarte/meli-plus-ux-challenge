import { useCallback, useEffect, useRef, useState } from "react";
import { nextHeaderState } from "./headerModel";
import type { HeaderScroll } from "./headerModel";

export function useHideOnScroll(enabled: boolean) {
  const [hidden, setHidden] = useState(false);
  const scroll = useRef<HeaderScroll>({ hidden: false, from: 0 });

  const reveal = useCallback(() => {
    scroll.current = { hidden: false, from: window.scrollY };
    setHidden(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      scroll.current = { hidden: false, from: window.scrollY };
      setHidden(false);
      return;
    }
    scroll.current = { ...scroll.current, from: window.scrollY };
    const onScroll = () => {
      scroll.current = nextHeaderState(scroll.current, window.scrollY);
      setHidden(scroll.current.hidden);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return { hidden, reveal };
}
