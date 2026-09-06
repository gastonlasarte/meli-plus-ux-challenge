import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { subscription } from "./model";

const stake = "Si falla el cobro con tu medio principal y no tenés un alternativo, tu suscripción se cancela y perdés los beneficios.";

export function SubscriptionInvitation({ chargeFailed, primaryName, onAdd, onDismiss, onNotice }: {
  chargeFailed: boolean;
  primaryName: string;
  onAdd: () => void;
  onDismiss: () => void;
  onNotice: (message: string) => void;
}) {
  return (
    <aside
      className={`payment-invitation${chargeFailed ? " payment-invitation--failed" : ""}`}
      aria-labelledby="invitation-title"
    >
      <button
        className="payment-close"
        type="button"
        aria-label={chargeFailed ? "Cerrar aviso" : "Cerrar sugerencia"}
        onClick={onDismiss}
      >
        <Icon name="close" size={20} />
      </button>
      <h2 id="invitation-title">
        {chargeFailed ? "No pudimos cobrar tu suscripción" : "Agregá un medio de pago alternativo"}
      </h2>
      <p>
        {chargeFailed
          ? `Intentamos cobrar ${subscription.amount} con tu ${primaryName} el ${subscription.nextCharge}. Reintentamos el ${subscription.retryCharge}. Agregá un medio de pago alternativo para que lo intentemos ahí.`
          : stake}
      </p>
      <Button variant="dark" id="banner-add-alternate" className="payment-primary" type="button" onClick={onAdd}>
        Agregar como alternativo
      </Button>
      {!chargeFailed && (
        <p className="invitation-support">
          O contactá a <button type="button" onClick={() => onNotice("Contactar a soporte")}>soporte</button>.
        </p>
      )}
    </aside>
  );
}
