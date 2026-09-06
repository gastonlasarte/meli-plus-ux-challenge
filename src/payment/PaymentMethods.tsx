import { useEffect, useRef, useState } from "react";
import type { Ref } from "react";
import { Icon } from "../components/Icon";
import { MethodIcon } from "./MethodIcon";
import { explanation } from "./copy";
import type { methods } from "./model";

type Method = typeof methods[number];

export function PaymentMethods({ primary, alternate, headingRef, onAdd, onChange, onRemove }: {
  primary: Method;
  alternate?: Method;
  headingRef: Ref<HTMLHeadingElement>;
  onAdd: () => void;
  onChange: () => void;
  onRemove: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const modifyButton = useRef<HTMLButtonElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [menuOpen]);

  return (
    <section className="payment-methods" aria-labelledby="payment-methods">
      <h2 id="payment-methods" tabIndex={-1} ref={headingRef}>Medios de pago</h2>
      <p className="payment-status">{alternate
        ? "Tu suscripción tiene respaldo. Si falla el cobro con el principal, lo intentamos con el alternativo."
        : "Tu suscripción no tiene respaldo. Si falla el cobro, se cancela."}</p>

      <div className="method-list">
        <div className="saved-method">
          <MethodIcon method={primary} />
          <div className="method-text">
            <strong>{primary.name}</strong><span>{primary.detail}</span>
            <div className="method-tags">
              <span className="method-tag">Principal</span>
              <span className="method-tag method-tag--valid">Habilitada</span>
            </div>
          </div>
        </div>

        {alternate && (
          <div className="saved-method">
            <MethodIcon method={alternate} />
            <div className="method-text">
              <strong>{alternate.name}</strong><span>{alternate.detail}</span>
              <span className="method-tag method-tag--alternate">Alternativo</span>
            </div>
            <div
              className="method-actions"
              ref={menu}
              onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMenuOpen(false); }}
              onKeyDown={event => {
                if (event.key !== "Escape") return;
                event.stopPropagation();
                setMenuOpen(false);
                modifyButton.current?.focus();
              }}
            >
              <button
                id="modify-alternate"
                ref={modifyButton}
                className="method-modify"
                type="button"
                aria-expanded={menuOpen}
                aria-controls="alternate-actions"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                Modificar
              </button>
              {menuOpen && (
                <div className="method-actions__panel" id="alternate-actions">
                  <button id="change-alternate" type="button" onClick={onChange}>Cambiar alternativo</button>
                  <button type="button" onClick={() => { setMenuOpen(false); onRemove(); }}>Eliminar alternativo</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!alternate && (
        <div className="add-method-row">
          <button id="add-alternate" className="add-method" type="button" onClick={onAdd}>
            <span className="add-method__icon"><Icon name="add" /></span>
            Agregar un medio de pago alternativo
          </button>
          <button
            ref={helpButton}
            className="payment-info"
            type="button"
            aria-label="Cómo funciona el medio alternativo"
            aria-expanded={helpOpen}
            aria-controls="alternate-help"
            onClick={() => setHelpOpen(!helpOpen)}
          >
            <Icon name="info" />
          </button>
        </div>
      )}
      {helpOpen && !alternate && (
        <div className="alternate-help" id="alternate-help">
          <p>{explanation}</p>
          <button type="button" onClick={() => { setHelpOpen(false); helpButton.current?.focus(); }}>Entendido</button>
        </div>
      )}
    </section>
  );
}
