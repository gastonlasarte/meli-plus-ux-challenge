import { useState } from "react";
import { Header } from "../components/Header";
import { PlanCard } from "../components/PlanCard";
import { Toast } from "../components/Toast";
import { plans } from "../data/plans";
import { outOfScope } from "./copy";
import { initialPayment, methods, removeAlternate, saveAlternate, subscription } from "./model";
import type { MethodId } from "./model";
import { PaymentMethods } from "./PaymentMethods";
import { RemoveDialog } from "./RemoveDialog";
import { SelectMethod } from "./SelectMethod";
import { ServiceCode } from "./ServiceCode";
import { SubscriptionInvitation } from "./SubscriptionInvitation";
import { useSelectorRoute } from "./useSelectorRoute";

const currentPlan = {
  ...plans.find(plan => plan.id === "total")!,
  description: <>Estás disfrutando de las mejores películas, series y música, además de todos los beneficios de <strong>Meli+ Esencial.</strong></>,
};

export function PaymentFlow() {
  const [payment, setPayment] = useState(initialPayment);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const { selecting, open, close, goToPayments, heading, paymentsHeading } = useSelectorRoute(() => setNotice(""));

  const chargeFailed = new URLSearchParams(window.location.search).get("cobro") === "fallido";
  const primary = methods.find(method => method.id === payment.primary)!;
  const alternate = methods.find(method => method.id === payment.alternate);

  function openSelector() {
    setNotice("");
    open();
  }

  function save(id: MethodId) {
    const wasEditing = Boolean(payment.alternate);
    const changed = payment.alternate !== id;
    setPayment(saveAlternate(payment, id));
    setNotice(changed
      ? (wasEditing ? "Cambiaste el medio de pago alternativo." : "Agregaste un medio de pago alternativo.")
      : "El medio de pago alternativo no cambió.");
    close("payments");
  }

  function confirmRemoval() {
    setRemoveOpen(false);
    setPayment(removeAlternate(payment));
    setBannerDismissed(false);
    setNotice("Eliminaste el medio de pago alternativo de esta suscripción.");
    requestAnimationFrame(goToPayments);
  }

  return (
    <div className={`page payment-page${selecting ? " payment-page--selection" : ""}${notice ? " page--notice" : ""}`}>
      <a className="skip-link" href={selecting ? "#choose-method" : "#payment-methods"}>Ir a los medios de pago</a>
      <Header
        title={selecting ? "Medio de pago alternativo" : "Detalle"}
        onBack={selecting ? () => close() : undefined}
        headingRef={heading}
        hideOnScroll={!selecting}
      />

      {selecting ? (
        <SelectMethod primaryId={payment.primary} current={payment.alternate} onSave={save} />
      ) : <>
        <main>
          <section className="subscription-area" aria-labelledby="subscription-heading">
            {!alternate && !bannerDismissed && (
              <SubscriptionInvitation
                chargeFailed={chargeFailed}
                primaryName={primary.name}
                onAdd={openSelector}
                onDismiss={() => { setBannerDismissed(true); paymentsHeading.current?.focus(); }}
                onNotice={what => setNotice(outOfScope(what))}
              />
            )}
            <div className="subscription-content">
              <h2 id="subscription-heading">Tu suscripción actual</h2>
              <PlanCard
                plan={currentPlan}
                subscribed
                collapsible
                billing={chargeFailed
                  ? `Reintentamos el cobro el ${subscription.retryCharge}`
                  : `Próximo cobro: ${subscription.nextCharge}`}
              />
              <ServiceCode onNotice={setNotice} />
            </div>
          </section>

          <div className="subscription-waves" aria-hidden="true">
            <img className="subscription-waves__layers" src="/assets/payment/detail-wave-layers.svg" width="752" height="43" alt="" />
            <img className="subscription-waves__main" src="/assets/payment/detail-wave.svg" width="752" height="37" alt="" />
          </div>

          <PaymentMethods
            primary={primary}
            alternate={alternate}
            headingRef={paymentsHeading}
            onAdd={openSelector}
            onChange={openSelector}
            onRemove={() => setRemoveOpen(true)}
          />
        </main>

        <footer className="subscription-footer">
          <p>Podés <button type="button" onClick={() => setNotice(outOfScope("Cancelar la suscripción"))}>cancelar tu suscripción</button> en cualquier momento.</p>
          <button type="button" onClick={() => setNotice(outOfScope("Los términos y condiciones"))}>Términos y condiciones</button>
        </footer>
      </>}

      <Toast message={notice} onDismiss={() => { paymentsHeading.current?.focus({ preventScroll: true }); setNotice(""); }} />
      <RemoveDialog
        methodName={alternate?.name}
        open={removeOpen}
        onCancel={() => { setRemoveOpen(false); document.getElementById("modify-alternate")?.focus(); }}
        onConfirm={confirmRemoval}
      />
    </div>
  );
}
