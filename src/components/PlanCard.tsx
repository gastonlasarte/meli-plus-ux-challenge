import { useId, useState } from "react";
import type { Plan } from "../data/plans";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { ServiceLogo } from "./ServiceLogo";
import { ServiceCarousel } from "./ServiceCarousel";

export function BenefitsList({ benefits }: { benefits: Plan["benefits"] }) {
  return <ul className="plan-card__benefits">
    {benefits.map(benefit => <li key={benefit.id}>
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
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const hidden = collapsible && !expanded;
  const titleId = `${id}-title`;
  const detail = [`${id}-media`, `${id}-about`, `${id}-benefits`];
  return <article className={`plan-card plan-card--${plan.id}${subscribed ? " plan-card--subscribed" : ""}`} aria-labelledby={titleId}>
    {/* Colapsada no monta el carrusel: sus portadas no se descargan. */}
    <div id={detail[0]} hidden={hidden}>
      {hidden ? null : plan.id === "total" ? <ServiceCarousel enabled={active} /> : <div className="plan-card__cover">
        <img src={`/assets/figma/${plan.cover}`} alt="" width="320" height="236" draggable="false" />
      </div>}
    </div>
    <div className="plan-card__header">
      <div className="subscription-title"><h3 id={titleId}>{plan.name}</h3>{subscribed && <span className="subscription-badge">Activa</span>}</div>
      {!subscribed && <p className="price"><strong>{plan.price}</strong><span>Por mes</span></p>}
      <p id={detail[1]} hidden={hidden}>{plan.description}</p>
    </div>
    <div id={detail[2]} hidden={hidden}><BenefitsList benefits={plan.benefits} /></div>
    <footer className="plan-card__footer">
      {billing && <div className="plan-card__billing">
        <div><span>Suscripción mensual</span><strong>{plan.price}</strong></div>
        <p>{billing}</p>
      </div>}
      {!subscribed && <Button className="choose-plan" disabled={!onChoose} onClick={onChoose}>Elegir plan</Button>}
    </footer>
    {collapsible && <button className="plan-card__toggle" type="button" aria-expanded={expanded}
      aria-controls={detail.join(" ")} onClick={() => setExpanded(!expanded)}>
      {expanded ? "Ver menos" : "Ver qué incluye"}
    </button>}
  </article>;
}
