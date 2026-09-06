import { useRef, useState } from "react";
import type { KeyboardEvent, Ref } from "react";
import { Header } from "./components/Header";
import { PlanCard } from "./components/PlanCard";
import { plans } from "./data/plans";
import { faq } from "./data/faq";
import type { FaqEntry } from "./data/faq";
import { Icon } from "./components/Icon";
import { Toast } from "./components/Toast";
import { useSnapCarousel } from "./components/useSnapCarousel";
import { carouselKeyIndex } from "./components/carouselModel";

const asset = (name: string) => `/assets/figma/${name}`;

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="meli-logo" src={asset("meli-logo.svg")} alt="Meli+" width="60" height="24" />
      <h1 id="hero-title">Conseguí <strong>envíos gratis, cuotas extra sin intereses, cashback</strong> y beneficios en entretenimiento.</h1>
    </section>
  );
}

function PlanCarousel({ onChoose }: { onChoose: () => void }) {
  const { active, changed, rail, slides, select } = useSnapCarousel(plans.length, 0);
  const indicators = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const next = carouselKeyIndex(event.key, index, plans.length);
    if (next === null) return;
    event.preventDefault();
    if (next !== index) select(next);
    indicators.current[next]?.focus({ preventScroll: true });
  };

  return (
    <div className="carousel" role="region" aria-roledescription="carrusel" aria-label="Planes Meli+">
      <div className="plan-tabs" role="group" aria-label="Elegir plan">
        {plans.map((plan, index) => (
          <button
            key={plan.id}
            type="button"
            ref={(element) => { indicators.current[index] = element; }}
            aria-controls={`slide-${plan.id}`}
            aria-pressed={active === index}
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {plan.short}
          </button>
        ))}
      </div>
      <div className="carousel__rail" ref={rail}>
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            id={`slide-${plan.id}`}
            data-index={index}
            className={`carousel__slide${index === active ? " is-active" : ""}`}
            ref={(element) => { slides.current[index] = element; }}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${plans.length}: ${plan.name}`}
            inert={active !== index}
          >
            <PlanCard plan={plan} active={active === index} onChoose={onChoose} />
          </div>
        ))}
      </div>

      <p className="sr-only" role="status" aria-live="polite">{changed ? plans[active].name : ""}</p>
    </div>
  );
}

function MarketingZone({ onChoose, heading }: { onChoose: () => void; heading: Ref<HTMLHeadingElement> }) {
  return (
    <section className="marketing" aria-labelledby="plans-title">
      <div className="marketing__background" aria-hidden="true">
        <img className="marketing__top-wave" src={asset("wave-top.svg")} alt="" width="752" height="84" />
        <div className="marketing__gradient" />
        <img className="marketing__bottom-layers" src={asset("wave-layers.svg")} alt="" width="752" height="43" />
        <img className="marketing__bottom-wave" src={asset("wave-bottom.svg")} alt="" width="752" height="37" />
      </div>
      <img className="hero-art" src={asset("hero.png")} alt="" width="360" height="303" fetchPriority="high" />
      <h2 id="plans-title" tabIndex={-1} ref={heading}>Elegí un plan</h2>
      <PlanCarousel onChoose={onChoose} />
    </section>
  );
}

function FaqItem({ id, question, answer }: FaqEntry) {
  const [open, setOpen] = useState(false);
  const button = `faq-question-${id}`;
  const panel = `faq-answer-${id}`;
  return (
    <div className="faq__item">
      <h3>
        <button
          id={button}
          className="faq__question"
          type="button"
          aria-expanded={open}
          aria-controls={panel}
          onClick={() => setOpen(!open)}
        >
          <span>{question}</span>
          <Icon name="chevron" />
        </button>
      </h3>
      <div className="faq__answer" id={panel} role="region" aria-labelledby={button} hidden={!open}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

function FrequentlyAskedQuestions() {
  return (
    <section className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">Preguntas frecuentes</h2>
      {faq.map((entry) => <FaqItem key={entry.id} {...entry} />)}
    </section>
  );
}

function Legal() {
  return (
    <footer className="legal">
      <p>Los beneficios de Meli son válidos para usuarios mayores de edad.</p>
      <p>(1) Envíos gratis para productos seleccionados con la etiqueta Meli+ en la modalidad de entrega "Tu Día de Entregas" y sujeto a condiciones. Consultá los Términos y condiciones.</p>
      <p>(2) Cashback en Meli Dólares en tu cuenta de Mercado Pago. Tope de hasta 5% por compras realizadas en Mercado Libre y 0,6% por pago con tarjeta de crédito de Mercado Pago. Sujeto a Términos y condiciones.</p>
    </footer>
  );
}

const CHECKOUT_FUERA_DE_ALCANCE = "Elegir un plan no forma parte de este prototipo.";

export function App() {
  const [notice, setNotice] = useState("");
  const plansHeading = useRef<HTMLHeadingElement>(null);
  return (
    <div className={`page${notice ? " page--notice" : ""}`}>
      <a className="skip-link" href="#plans-title">Ir a los planes</a>
      <Header hideOnScroll />
      <main><Hero /><MarketingZone onChoose={() => setNotice(CHECKOUT_FUERA_DE_ALCANCE)} heading={plansHeading} /><FrequentlyAskedQuestions /></main>
      <Legal />
      <Toast message={notice} onDismiss={() => {
        plansHeading.current?.focus({ preventScroll: true });
        setNotice("");
      }} />
    </div>
  );
}
