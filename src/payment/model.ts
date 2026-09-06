export const methods = [
  { id: "mastercard", name: "Mastercard terminada en 5470", detail: "Payoneer · Vence en 09/28", icon: "mastercard.svg" },
  { id: "visa", name: "Visa terminada en 8743", detail: "Santander Río · Vence en 10/28", icon: "visa.svg" },
  { id: "balance", name: "Dinero en cuenta", detail: "$13.000 disponibles", icon: "mercado-pago.svg" },
] as const;

// Datos de demostración del ciclo de cobro.
export const subscription = {
  amount: "$17,90",
  nextCharge: "15 de septiembre",
  retryCharge: "18 de septiembre",
} as const;

export type MethodId = typeof methods[number]["id"];
type PaymentState = { readonly primary: "visa"; readonly alternate: MethodId | null };
export const initialPayment: PaymentState = { primary: "visa", alternate: null };
export function saveAlternate(state: PaymentState, id: MethodId): PaymentState {
  if (id === state.primary) throw new Error("El principal no puede ser también el alternativo.");
  if (!methods.some(method => method.id === id)) throw new Error("Medio de pago no disponible.");
  return { ...state, alternate: id };
}
export function removeAlternate(state: PaymentState): PaymentState {
  return { ...state, alternate: null };
}
