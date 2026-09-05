export const methods = [
  { id: "mastercard", name: "Mastercard terminada en 5470", detail: "Payoneer · Vence en 09/28", icon: "mastercard.svg" },
  // Fictional fixture updated from 10/24 to match the approved valid-primary scenario.
  { id: "visa", name: "Visa terminada en 8743", detail: "Santander Río · Vence en 10/28", icon: "visa.svg" },
  { id: "balance", name: "Dinero en cuenta", detail: "$13.000 disponibles", icon: "mercado-pago.svg" },
] as const;

export type MethodId = typeof methods[number]["id"];
export type PaymentState = { readonly primary: "visa"; readonly alternate: MethodId | null };
export const initialPayment: PaymentState = { primary: "visa", alternate: null };
export function saveAlternate(state: PaymentState, id: MethodId): PaymentState {
  if (id === state.primary) throw new Error("El principal no puede ser también el alternativo.");
  if (!methods.some(method => method.id === id)) throw new Error("Medio de pago no disponible.");
  return { ...state, alternate: id };
}
export function removeAlternate(state: PaymentState): PaymentState {
  return { ...state, alternate: null };
}
