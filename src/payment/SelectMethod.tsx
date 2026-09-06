import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { MethodIcon } from "./MethodIcon";
import { explanation } from "./copy";
import { methods } from "./model";
import type { MethodId } from "./model";

export function SelectMethod({ primaryId, current, onSave }: {
  primaryId: MethodId;
  current: MethodId | null;
  onSave: (id: MethodId) => void;
}) {
  const [selection, setSelection] = useState<MethodId | "">(current ?? "");
  const [error, setError] = useState("");
  const firstOption = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!selection) {
      setError("Elegí un medio de pago para continuar.");
      firstOption.current?.focus();
      return;
    }
    onSave(selection);
  }

  return <>
    <main className="method-selection" id="choose-method" tabIndex={-1}>
      <h2>Elegí un medio de pago alternativo</h2>
      <p className="selection-explanation" id="selection-explanation">{explanation} Tu medio principal no cambia.</p>
      <form onSubmit={submit}>
        <fieldset aria-describedby={`selection-explanation${error ? " selection-error" : ""}`}>
          <legend className="sr-only">Medios guardados</legend>
          <div className="method-list">
            {methods.map((method, index) => (
              <label key={method.id} className={`method-option${method.id === primaryId ? " method-option--principal" : ""}`}>
                <MethodIcon method={method} />
                <span className="method-text">
                  <strong>{method.name}</strong><span>{method.detail}</span>
                  {method.id === primaryId && <span className="method-tag">Principal</span>}
                </span>
                <input
                  ref={index === 0 ? firstOption : undefined}
                  type="radio"
                  name="alternate"
                  value={method.id}
                  disabled={method.id === primaryId}
                  checked={selection === method.id}
                  onChange={() => { setSelection(method.id); setError(""); }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "selection-error" : undefined}
                />
              </label>
            ))}
          </div>
        </fieldset>
        {error && <p className="selection-error" id="selection-error">{error}</p>}
        <button className="add-method selection-new" type="button" disabled>
          <span className="add-method__icon"><Icon name="add" /></span>
          Agregar un nuevo medio de pago
        </button>
        <Button className="payment-primary selection-submit" type="submit">
          {current ? "Guardar alternativo" : "Agregar como alternativo"}
        </Button>
      </form>
    </main>
    <footer className="payment-security"><Icon name="lock" size={16} />Pago seguro.</footer>
  </>;
}
