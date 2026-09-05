import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

type Plan = {
  id: "esencial" | "total";
  name: string;
  price: string;
  description: string;
};

const plans: Record<Plan["id"], Plan> = {
  esencial: {
    id: "esencial",
    name: "Meli+ Esencial",
    price: "$X / mes",
    description: "Ahorrá en tus compras y pagos y hacé rendir más tu dinero.",
  },
  total: {
    id: "total",
    name: "Meli+ Total",
    price: "$X / mes",
    description:
      "Disfrutá entretenimiento y todos los beneficios de Meli+ Esencial.",
  },
};

const planOrder: Plan["id"][] = ["esencial", "total"];

function BrandMark() {
  return (
    <div className="brand" aria-label="Mercado Libre">
      <span className="brand__symbol" aria-hidden="true">
        <svg viewBox="0 0 40 28" role="img">
          <path d="M5.5 14c2.4-5.2 7.1-8.5 14.5-8.5S32.1 8.8 34.5 14c-2.4 5.2-7.1 8.5-14.5 8.5S7.9 19.2 5.5 14Z" />
          <path d="m12 14 5-3.4c1.2-.8 2.7-.6 3.6.4l1.3 1.4c.6.6 1.5.8 2.3.4l3.8-2" />
          <path d="m11 14.4 5.4 3.2m1.8-1.4 3.6 2.2m1.3-3.6 3.1 1.8" />
        </svg>
      </span>
      <span className="brand__name">
        mercado
        <br />
        libre
      </span>
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <BrandMark />
        <span className="menu-glyph" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="page-title">
      <div className="meli-badge">Meli+</div>
      <h1 id="page-title">Elegí el plan que más se adapta a vos</h1>
    </section>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-frame">
      <Header />
      <main>{children}</main>
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={`plan-card plan-card--${plan.id}`}
      aria-labelledby={`${plan.id}-title`}
    >
      <div className="plan-card__heading">
        <h2 id={`${plan.id}-title`}>{plan.name}</h2>
        <span className="sparkle" aria-hidden="true">✦</span>
      </div>
      <p className="plan-card__price">{plan.price}</p>
      <p className="plan-card__description">{plan.description}</p>
      <div className="plan-card__placeholder" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </article>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

type B1TabsProps = {
  activePlan: Plan["id"];
  onSelect: (planId: Plan["id"]) => void;
};

function B1Tabs({ activePlan, onSelect }: B1TabsProps) {
  const tabRefs = useRef<Record<Plan["id"], HTMLButtonElement | null>>({
    esencial: null,
    total: null,
  });

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentPlan: Plan["id"],
  ) => {
    const currentIndex = planOrder.indexOf(currentPlan);
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % planOrder.length;
    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + planOrder.length) % planOrder.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = planOrder.length - 1;

    if (nextIndex === null) return;

    event.preventDefault();
    const nextPlan = planOrder[nextIndex];
    onSelect(nextPlan);
    tabRefs.current[nextPlan]?.focus();
  };

  return (
    <div className="plan-control b1-tabs" role="tablist" aria-label="Planes disponibles">
      {planOrder.map((planId) => {
        const isActive = activePlan === planId;
        const label = planId === "esencial" ? "Esencial" : "Total";

        return (
          <button
            key={planId}
            ref={(element) => {
              tabRefs.current[planId] = element;
            }}
            id={`b1-tab-${planId}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="b1-plan-panel"
            tabIndex={isActive ? 0 : -1}
            className={isActive ? "is-active" : undefined}
            onClick={() => onSelect(planId)}
            onKeyDown={(event) => handleKeyDown(event, planId)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

type SwipeGesture = {
  pointerId: number;
  startX: number;
  startY: number;
  axis: "pending" | "horizontal" | "vertical";
};

function B1Route() {
  const [activePlan, setActivePlan] = useState<Plan["id"]>("esencial");
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const gesture = useRef<SwipeGesture | null>(null);
  const hintEligibility = useRef<boolean | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setShowSwipeHint(false);
      return;
    }

    if (hintEligibility.current === null) {
      const hintStorageKey = "meli-b1-swipe-hint-seen";

      try {
        hintEligibility.current = !window.sessionStorage.getItem(hintStorageKey);
        if (hintEligibility.current) {
          window.sessionStorage.setItem(hintStorageKey, "true");
        }
      } catch {
        // The hint can still run when storage is unavailable.
        hintEligibility.current = true;
      }
    }

    if (!hintEligibility.current) return;

    setShowSwipeHint(true);
    const timer = window.setTimeout(() => {
      setShowSwipeHint(false);
      hintEligibility.current = false;
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  const selectPlan = (planId: Plan["id"]) => {
    setShowSwipeHint(false);
    setAnnouncement("");
    setActivePlan(planId);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) {
      return;
    }

    gesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      axis: "pending",
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const currentGesture = gesture.current;
    if (!currentGesture || currentGesture.pointerId !== event.pointerId) return;

    const distanceX = Math.abs(event.clientX - currentGesture.startX);
    const distanceY = Math.abs(event.clientY - currentGesture.startY);

    if (currentGesture.axis !== "pending" || Math.max(distanceX, distanceY) < 10) {
      return;
    }

    if (distanceY > distanceX * 0.9) {
      currentGesture.axis = "vertical";
      return;
    }

    if (distanceX > distanceY * 1.5) {
      currentGesture.axis = "horizontal";
    }
  };

  const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const currentGesture = gesture.current;
    gesture.current = null;

    if (!currentGesture || currentGesture.pointerId !== event.pointerId) return;

    const distanceX = event.clientX - currentGesture.startX;
    const distanceY = event.clientY - currentGesture.startY;
    const isHorizontal =
      currentGesture.axis === "horizontal" ||
      (Math.abs(distanceX) >= 52 && Math.abs(distanceX) > Math.abs(distanceY) * 1.5);

    if (!isHorizontal || Math.abs(distanceX) < 52) return;

    const nextPlan: Plan["id"] = distanceX < 0 ? "total" : "esencial";
    if (nextPlan === activePlan) return;

    setShowSwipeHint(false);
    setActivePlan(nextPlan);
    setAnnouncement(plans[nextPlan].name);
  };

  const cancelSwipe = () => {
    gesture.current = null;
  };

  return (
    <PageShell>
      <Hero />
      <section className="plans plans--b1" aria-label="Planes Meli+">
        <B1Tabs activePlan={activePlan} onSelect={selectPlan} />
        <div
          className={`single-plan-stage b1-swipe-surface${showSwipeHint ? " is-hinting" : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishSwipe}
          onPointerCancel={cancelSwipe}
        >
          <div
            id="b1-plan-panel"
            role="tabpanel"
            aria-labelledby={`b1-tab-${activePlan}`}
            tabIndex={0}
          >
            <PlanCard plan={plans[activePlan]} />
          </div>
        </div>
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
      </section>
    </PageShell>
  );
}

type B2PillProps = {
  activePlan: Plan["id"];
  onNavigate: (planId: Plan["id"]) => void;
};

function B2Pill({ activePlan, onNavigate }: B2PillProps) {
  return (
    <nav className="plan-control b2-pill" aria-label="Navegación entre planes">
      {planOrder.map((planId) => {
        const isActive = activePlan === planId;
        const label = planId === "esencial" ? "Esencial" : "Total";
        const direction = !isActive ? (planId === "esencial" ? "↑" : "↓") : null;

        return (
          <button
            key={planId}
            type="button"
            className={isActive ? "is-active" : undefined}
            aria-current={isActive ? "true" : undefined}
            aria-label={isActive ? `${label}, plan actual` : `Ir a ${label}`}
            onClick={() => onNavigate(planId)}
          >
            <span>{label}</span>
            {direction && (
              <span className="b2-pill__direction" aria-hidden="true">
                {direction}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

function B2Route() {
  const [activePlan, setActivePlan] = useState<Plan["id"]>("esencial");
  const sectionRefs = useRef<Record<Plan["id"], HTMLDivElement | null>>({
    esencial: null,
    total: null,
  });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const observedSections = planOrder
      .map((planId) => sectionRefs.current[planId])
      .filter((section): section is HTMLDivElement => section !== null);

    const visibleSections = new Map<Plan["id"], IntersectionObserverEntry>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const planId = (entry.target as HTMLElement).dataset.planId as
            | Plan["id"]
            | undefined;

          if (!planId) return;

          if (entry.isIntersecting) {
            visibleSections.set(planId, entry);
          } else {
            visibleSections.delete(planId);
          }
        });

        const nextActivePlan = planOrder
          .map((planId) => ({ planId, entry: visibleSections.get(planId) }))
          .filter(
            (candidate): candidate is { planId: Plan["id"]; entry: IntersectionObserverEntry } =>
              candidate.entry !== undefined,
          )
          .sort((a, b) => {
            const ratioDifference = b.entry.intersectionRatio - a.entry.intersectionRatio;
            if (Math.abs(ratioDifference) > 0.05) return ratioDifference;

            return (
              Math.abs(a.entry.boundingClientRect.top - 80) -
              Math.abs(b.entry.boundingClientRect.top - 80)
            );
          })[0]?.planId;

        if (nextActivePlan) setActivePlan(nextActivePlan);
      },
      {
        root: null,
        rootMargin: "-80px 0px 0px 0px",
        threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
      },
    );

    observedSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const navigateToPlan = (planId: Plan["id"]) => {
    sectionRefs.current[planId]?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <PageShell>
      <Hero />
      <section className="plans plans--b2" aria-label="Planes Meli+">
        <B2Pill activePlan={activePlan} onNavigate={navigateToPlan} />
        <div className="plan-stack">
          {planOrder.map((planId) => (
            <div
              key={planId}
              id={`b2-plan-${planId}`}
              ref={(element) => {
                sectionRefs.current[planId] = element;
              }}
              className="b2-plan-section"
              data-plan-id={planId}
            >
              <PlanCard plan={plans[planId]} />
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export function App() {
  return window.location.pathname === "/b2" ? <B2Route /> : <B1Route />;
}
