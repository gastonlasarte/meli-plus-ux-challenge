import { useId, useState } from "react";
import type { Plan } from "../data/plans";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { ServiceLogo } from "./ServiceLogo";
import { ServiceCarousel } from "./ServiceCarousel";

export function BenefitsList({ benefits }: { benefits: Plan["benefits"] }) {
  return <ul className="plan-card__benefits">
    {benefits.map((benefit, index) => <li key={index}>
      {benefit.service
        ? <ServiceLogo service={benefit.service} />
        : <Icon name="check" size={16} />}
      <div>{benefit.title && <h4>{benefit.title}</h4>}<p>{benefit.text}</p></div>
    </li>)}
  </ul>;
}

export function PlanCard({ plan, subscribed = false, active = true, onChoose, collapsible = false, billing }: {
  plan: Plan; subscribed?: boolean; active?: boolean; onChoose?: () => void; collapsible?: boolean; billing?: string;
}) {
  const titleId = useId();
  const mediaId = useId();
  const benefitsId = useId();
  const aboutId = useId();
  const [expanded, setExpanded] = useState(false);
  // En una pantalla de gestión lo esencial es qué plan, que está activo y cuánto
  // cuesta; el contenido del plan queda a un toque de distancia.
  const hidden = collapsible && !expanded;
  return <article className={`plan-card plan-card--${plan.id}${subscribed ? " plan-card--subscribed" : ""}`} aria-labelledby={titleId}>
    <div id={mediaId} hidden={hidden}>
      {plan.id === "total" ? <ServiceCarousel enabled={active && !hidden} /> : <div className="plan-card__cover">
        <img src={`/assets/figma/${plan.cover}`} alt="" width="320" height="236" draggable="false" />
      </div>}
    </div>
    <div className="plan-card__header">
      <div className="subscription-title"><h3 id={titleId}>{plan.name}</h3>{subscribed && <span className="subscription-badge">Activa</span>}</div>
      <p id={aboutId} hidden={hidden}>{plan.description}</p>
    </div>
    <div id={benefitsId} hidden={hidden}><BenefitsList benefits={plan.benefits} /></div>
    <footer className="plan-card__footer">
      {billing
        ? <div className="plan-card__billing">
            <div><span>Suscripción mensual</span><strong>{plan.price}</strong></div>
            <p>{billing}</p>
          </div>
        : <p className="price"><strong>{plan.price}</strong><span>Por mes</span></p>}
      {!subscribed && <Button className="choose-plan" disabled={!onChoose} onClick={onChoose}>Elegir plan</Button>}
    </footer>
    {collapsible && <button className="plan-card__toggle" type="button" aria-expanded={expanded}
      aria-controls={`${mediaId} ${aboutId} ${benefitsId}`} onClick={() => setExpanded(!expanded)}>
      {expanded ? "Ver menos" : "Ver qué incluye"}
    </button>}
  </article>;
}
