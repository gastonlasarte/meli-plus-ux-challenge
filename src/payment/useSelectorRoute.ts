import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { scrollBehavior } from "../motion";

const selectorPath = "/details/payment-methods";
const detailPath = "/details";
const titles = {
  selector: "Elegí un medio de pago alternativo | Meli+",
  detail: "Detalle de tu suscripción | Meli+",
};

type FocusTarget = "none" | "heading" | "restore" | "payments";

export function useSelectorRoute(onEnterSelector: () => void) {
  const search = window.location.search;
  const [selecting, setSelecting] = useState(() => window.location.pathname === selectorPath);
  const heading = useRef<HTMLHeadingElement>(null);
  const paymentsHeading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<string>("");
  const returnScroll = useRef(0);
  const ownsHistoryEntry = useRef(false);
  const focusTarget = useRef<FocusTarget>("none");
  const onEnter = useRef(onEnterSelector);
  onEnter.current = onEnterSelector;

  function goToPayments() {
    paymentsHeading.current?.focus({ preventScroll: true });
    paymentsHeading.current?.scrollIntoView({ block: "center", behavior: scrollBehavior() });
  }

  function open() {
    opener.current = (document.activeElement as HTMLElement | null)?.id ?? "";
    returnScroll.current = window.scrollY;
    focusTarget.current = "heading";
    ownsHistoryEntry.current = true;
    window.history.pushState(null, "", `${selectorPath}${search}`);
    setSelecting(true);
  }

  function close(target: Exclude<FocusTarget, "none" | "heading"> = "restore") {
    focusTarget.current = target;
    if (ownsHistoryEntry.current) window.history.back();
    else {
      window.history.replaceState(null, "", `${detailPath}${search}`);
      setSelecting(false);
    }
  }

  useEffect(() => {
    const onPop = () => {
      const next = window.location.pathname === selectorPath;
      if (next) {
        onEnter.current();
        focusTarget.current = "heading";
      } else if (focusTarget.current !== "payments") focusTarget.current = "restore";
      setSelecting(next);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useLayoutEffect(() => {
    document.title = selecting ? titles.selector : titles.detail;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content",
      getComputedStyle(document.documentElement).getPropertyValue("--brand-violet").trim());

    if (focusTarget.current === "none") return;
    if (selecting) {
      window.scrollTo({ top: 0, behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    } else if (focusTarget.current === "payments") {
      goToPayments();
    } else {
      window.scrollTo({ top: returnScroll.current, behavior: "instant" });
      const returnElement = document.getElementById(opener.current)
        ?? document.getElementById("modify-alternate")
        ?? paymentsHeading.current;
      returnElement?.focus({ preventScroll: true });
    }
    focusTarget.current = "none";
  }, [selecting]);

  return { selecting, open, close, goToPayments, heading, paymentsHeading };
}
