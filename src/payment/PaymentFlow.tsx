import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Header } from "../components/Header";
import { PlanCard } from "../components/PlanCard";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Toast } from "../components/Toast";
import { plans } from "../data/plans";
import { initialPayment, methods, removeAlternate, saveAlternate, subscription } from "./model";
import type { MethodId } from "./model";

const explanation = "Lo usaremos solo si no podemos cobrar tu suscripción con el medio principal.";
const stake = "Si falla el cobro con tu medio principal y no tenés un alternativo, tu suscripción se cancela y perdés los beneficios.";
const currentPlan = {
  ...plans[0],
  description: <>Estás disfrutando de las mejores películas, series y música, además de todos los beneficios de <strong>Meli+ Esencial.</strong></>,
};

function MethodIcon({ method }: { method: typeof methods[number] }) {
  return <span className={`method-icon${method.id === "balance" ? " method-icon--balance" : ""}`}><img src={`/assets/payment/${method.icon}`} alt="" width="40" height="32" /></span>;
}

export function PaymentFlow() {
  const [payment, setPayment] = useState(initialPayment);
  const search = window.location.search;
  const chargeFailed = new URLSearchParams(search).get("cobro") === "fallido";
  const [selecting, setSelecting] = useState(window.location.pathname === "/details/payment-methods");
  const [selection, setSelection] = useState<MethodId | "">("");
  const [error, setError] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const paymentsHeading = useRef<HTMLHeadingElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const modifyButton = useRef<HTMLButtonElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const firstOption = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const returnScroll = useRef(0);
  const ownsHistoryEntry = useRef(false);
  const focusTarget = useRef<"none" | "heading" | "restore" | "payments">("none");
  const primary = methods.find(method => method.id === payment.primary)!;
  const alternate = methods.find(method => method.id === payment.alternate);

  useEffect(() => {
    const onPop = () => {
      const next = window.location.pathname === "/details/payment-methods";
      if (next) {
        setSelection(payment.alternate ?? "");
        setError("");
        focusTarget.current = "heading";
      } else if (focusTarget.current !== "payments") focusTarget.current = "restore";
      setSelecting(next);
      setMenuOpen(false);
      setRemoveOpen(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [payment.alternate]);

  useLayoutEffect(() => {
    document.title = selecting ? "Elegí un medio de pago alternativo | Meli+" : "Detalle de tu suscripción | Meli+";
    if (focusTarget.current === "none") return;
    if (selecting) {
      window.scrollTo({ top: 0, behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    } else if (focusTarget.current === "payments") {
      paymentsHeading.current?.focus({ preventScroll: true });
      paymentsHeading.current?.scrollIntoView({ block: "center", behavior: "instant" });
    } else {
      window.scrollTo({ top: returnScroll.current, behavior: "instant" });
      const returnElement = document.getElementById(opener.current?.id ?? "") ?? modifyButton.current ?? paymentsHeading.current;
      returnElement?.focus({ preventScroll: true });
    }
    focusTarget.current = "none";
  }, [selecting]);

  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [menuOpen]);

  useEffect(() => {
    const modal = dialog.current;
    if (!modal || !removeOpen) return;
    modal.showModal();
    cancelButton.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [removeOpen]);

  function openSelector() {
    opener.current = document.activeElement as HTMLElement;
    returnScroll.current = window.scrollY;
    focusTarget.current = "heading";
    setSelection(payment.alternate ?? "");
    setError("");
    setNotice("");
    setMenuOpen(false);
    ownsHistoryEntry.current = true;
    window.history.pushState(null, "", `/details/payment-methods${search}`);
    setSelecting(true);
  }

  function closeSelector(target: "restore" | "payments" = "restore") {
    focusTarget.current = target;
    if (ownsHistoryEntry.current) window.history.back();
    else {
      window.history.replaceState(null, "", `/details${search}`);
      setSelecting(false);
    }
  }

  function save(event: FormEvent) {
    event.preventDefault();
    if (!selection) {
      setError("Elegí un medio de pago para continuar.");
      firstOption.current?.focus();
      return;
    }
    const changed = payment.alternate !== selection;
    const wasEditing = Boolean(payment.alternate);
    setPayment(saveAlternate(payment, selection));
    setNotice(changed ? (wasEditing ? "Cambiaste el medio de pago alternativo." : "Agregaste un medio de pago alternativo.") : "El medio de pago alternativo no cambió.");
    closeSelector("payments");
  }

  function cancelRemoval() {
    // Close the native modal before focusing the no-longer-inert background.
    dialog.current?.close();
    setRemoveOpen(false);
    modifyButton.current?.focus();
  }

  function confirmRemoval() {
    setRemoveOpen(false);
    setPayment(removeAlternate(payment));
    setBannerDismissed(false);
    setNotice("Eliminaste el medio de pago alternativo de esta suscripción.");
    requestAnimationFrame(() => {
      paymentsHeading.current?.focus({ preventScroll: true });
      paymentsHeading.current?.scrollIntoView({ block: "center", behavior: "instant" });
    });
  }

  return (
    <div className={`page payment-page${selecting ? " payment-page--selection" : ""}${notice ? " page--notice" : ""}`}>
      <a className="skip-link" href={selecting ? "#choose-method" : "#payment-methods"}>Ir a los medios de pago</a>
      <Header title={selecting ? "Medio de pago alternativo" : "Detalle"} onBack={selecting ? () => closeSelector() : undefined} headingRef={heading} />
      {selecting ? <>
        <main className="method-selection" id="choose-method" tabIndex={-1}>
          <h2>Elegí un medio de pago alternativo</h2>
          <p className="selection-explanation" id="selection-explanation">{explanation} Tu medio principal no cambia.</p>
          <form onSubmit={save}>
            <fieldset aria-describedby={`selection-explanation${error ? " selection-error" : ""}`}>
              <legend className="sr-only">Medios guardados</legend>
              <div className="method-list">
                {methods.map((method, index) => <label key={method.id} className={`method-option${method.id === payment.primary ? " method-option--principal" : ""}`}>
                  <MethodIcon method={method} />
                  <span className="method-text"><strong>{method.name}</strong><span>{method.detail}</span>{method.id === payment.primary && <span className="method-tag">Principal</span>}</span>
                  <input ref={index === 0 ? firstOption : undefined} type="radio" name="alternate" value={method.id} disabled={method.id === payment.primary} checked={selection === method.id} onChange={() => { setSelection(method.id); setError(""); }} aria-invalid={Boolean(error)} aria-describedby={error ? "selection-error" : undefined} />
                </label>)}
              </div>
            </fieldset>
            {error && <p className="selection-error" id="selection-error">{error}</p>}
            <button className="add-method selection-new" type="button" disabled><span className="add-method__icon"><Icon name="add" strokeWidth={2} /></span>Agregar un nuevo medio de pago</button>
            <Button className="payment-primary selection-submit" type="submit">{payment.alternate ? "Guardar alternativo" : "Agregar como alternativo"}</Button>
          </form>
        </main>
        <footer className="payment-security"><Icon name="lock" size={16} />Pago seguro.</footer>
      </> : <>
        <main>
          <section className="subscription-area" aria-labelledby="subscription-heading">
            {/* Un cobro fallido es un hecho de la cuenta, no una sugerencia: no se descarta. */}
            {!alternate && (chargeFailed
              ? <aside className="payment-invitation payment-invitation--failed" aria-labelledby="invitation-title">
                  <h2 id="invitation-title">No pudimos cobrar tu suscripción</h2>
                  <p>Intentamos cobrar {subscription.amount} con tu {primary.name} el {subscription.nextCharge}. Reintentamos el {subscription.retryCharge}. Agregá un medio de pago alternativo para que lo intentemos ahí.</p>
                  <Button variant="dark" id="banner-add-alternate" className="payment-primary" type="button" onClick={openSelector}>Agregar como alternativo</Button>
                </aside>
              : !bannerDismissed && <aside className="payment-invitation" aria-labelledby="invitation-title">
                  <button className="payment-close" type="button" aria-label="Cerrar sugerencia" onClick={() => { setBannerDismissed(true); paymentsHeading.current?.focus(); }}><Icon name="close" size={20} /></button>
                  <h2 id="invitation-title">Agregá un medio de pago alternativo</h2>
                  <p>{stake}</p>
                  <Button variant="dark" id="banner-add-alternate" className="payment-primary" type="button" onClick={openSelector}>Agregar como alternativo</Button>
                  <p className="invitation-support">O contactá a <button type="button" disabled>soporte</button>.</p>
                </aside>)}
            <div className="subscription-content">
              <h2 id="subscription-heading">Tu suscripción actual</h2>
              <div className="subscription-billing">
                <div><span>Suscripción mensual</span><strong>{subscription.amount}</strong></div>
                <p>{chargeFailed ? `Reintentamos el cobro el ${subscription.retryCharge}` : `Próximo cobro: ${subscription.nextCharge}`}</p>
              </div>
              <PlanCard plan={currentPlan} subscribed />
              <div className="service-code">
                <div><div className="service-code__value"><strong>314159265358</strong><button type="button" aria-label="Copiar código de servicio" onClick={async () => { try { await navigator.clipboard.writeText("314159265358"); setNotice("Copiaste el código de servicio."); } catch { setNotice("No pudimos copiar el código. Seleccionalo para copiarlo."); } }}><Icon name="copy" size={20} /></button></div><p>Código de servicio Disney+ / Star+</p></div>
                <button className="service-help" type="button" disabled aria-label="Ayuda con el código de servicio"><Icon name="help" size={24} /></button>
              </div>
            </div>
          </section>
          <div className="subscription-waves" aria-hidden="true"><img className="subscription-waves__layers" src="/assets/payment/detail-wave-layers.svg" width="752" height="43" alt="" /><img className="subscription-waves__main" src="/assets/payment/detail-wave.svg" width="752" height="37" alt="" /></div>
          <section className="payment-methods" aria-labelledby="payment-methods">
            <h2 id="payment-methods" tabIndex={-1} ref={paymentsHeading}>Medios de pago</h2>
            <p className="payment-status">{alternate
              ? "Tu suscripción tiene respaldo. Si falla el cobro con el principal, lo intentamos con el alternativo."
              : "Tu suscripción no tiene respaldo. Si falla el cobro, se cancela."}</p>
            <div className="method-list">
              <div className="saved-method"><MethodIcon method={primary} /><div className="method-text"><strong>{primary.name}</strong><span>{primary.detail}</span><div className="method-tags"><span className="method-tag">Principal</span><span className="method-tag method-tag--valid">Habilitada</span></div></div></div>
              {alternate && <div className="saved-method"><MethodIcon method={alternate} /><div className="method-text"><strong>{alternate.name}</strong><span>{alternate.detail}</span><span className="method-tag method-tag--alternate">Alternativo</span></div>
                <div className="method-actions" ref={menu} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMenuOpen(false); }} onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); setMenuOpen(false); modifyButton.current?.focus(); } }}>
                  <button id="modify-alternate" ref={modifyButton} className="method-modify" type="button" aria-expanded={menuOpen} aria-controls="alternate-actions" onClick={() => setMenuOpen(!menuOpen)}>Modificar</button>
                  {menuOpen && <div className="method-actions__panel" id="alternate-actions"><button type="button" onClick={openSelector}>Cambiar alternativo</button><button type="button" onClick={() => { setMenuOpen(false); setRemoveOpen(true); }}>Eliminar alternativo</button></div>}
                </div>
              </div>}
            </div>
            {!alternate && <div className="add-method-row"><button id="add-alternate" className="add-method" type="button" onClick={openSelector}><span className="add-method__icon"><Icon name="add" strokeWidth={2} /></span>Agregar un medio de pago alternativo</button><button ref={helpButton} className="payment-info" type="button" aria-label="Cómo funciona el medio alternativo" aria-expanded={helpOpen} aria-controls="alternate-help" onClick={() => setHelpOpen(!helpOpen)}><Icon name="info" /></button></div>}
            {helpOpen && !alternate && <div className="alternate-help" id="alternate-help"><p>{explanation}</p><button type="button" onClick={() => { setHelpOpen(false); helpButton.current?.focus(); }}>Entendido</button></div>}
          </section>
        </main>
        <footer className="subscription-footer"><p>Podés <button type="button" disabled>cancelar tu suscripción</button> en cualquier momento.</p><button type="button" disabled>Términos y condiciones</button></footer>
      </>}
      <Toast message={notice} onDismiss={() => {
        paymentsHeading.current?.focus({ preventScroll: true });
        setNotice("");
      }} />
      <dialog className="payment-dialog" ref={dialog} aria-labelledby="remove-title" aria-describedby="remove-description" onCancel={event => { event.preventDefault(); cancelRemoval(); }} onKeyDown={event => {
        if (event.key !== "Tab") return;
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }}>
        <button className="payment-close" type="button" aria-label="Cerrar confirmación" onClick={cancelRemoval}><Icon name="close" size={20} /></button>
        <h2 id="remove-title">¿Querés eliminar este medio de pago alternativo?</h2>
        <p id="remove-description">{alternate?.name} dejará de usarse como respaldo para Meli+ Total. Seguirá guardado en tu cuenta y tu medio principal no cambiará.</p>
        <div className="payment-dialog__actions"><Button variant="danger" className="payment-primary" type="button" onClick={confirmRemoval}>Eliminar alternativo</Button><Button variant="text" ref={cancelButton} className="payment-secondary" type="button" onClick={cancelRemoval}>Cancelar</Button></div>
      </dialog>
    </div>
  );
}
