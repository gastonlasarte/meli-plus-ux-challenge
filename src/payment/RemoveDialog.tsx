import { useEffect, useRef } from "react";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";

export function RemoveDialog({ methodName, open, onCancel, onConfirm }: {
  methodName?: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const modal = dialog.current;
    if (!modal || !open) return;
    modal.showModal();
    cancelButton.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function cancel() {
    // Cerrar antes de enfocar: el fondo sigue inerte mientras el diálogo está abierto.
    dialog.current?.close();
    onCancel();
  }

  return (
    <dialog
      className="payment-dialog"
      ref={dialog}
      aria-labelledby="remove-title"
      aria-describedby="remove-description"
      onCancel={event => { event.preventDefault(); cancel(); }}
    >
      <button className="payment-close" type="button" aria-label="Cerrar confirmación" onClick={cancel}>
        <Icon name="close" size={20} />
      </button>
      <h2 id="remove-title">¿Querés eliminar este medio de pago alternativo?</h2>
      <p id="remove-description">
        {methodName} dejará de usarse como respaldo para Meli+ Total. Seguirá guardado en tu cuenta y tu medio principal no cambiará.
      </p>
      <div className="payment-dialog__actions">
        <Button variant="danger" className="payment-primary" type="button" onClick={onConfirm}>Eliminar alternativo</Button>
        <Button variant="text" ref={cancelButton} className="payment-secondary" type="button" onClick={cancel}>Cancelar</Button>
      </div>
    </dialog>
  );
}
