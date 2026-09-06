/** Scroll que se ignora: por debajo de esto la barra no reacciona al temblor del dedo. */
const NOISE = 8;
/** Cerca del inicio la barra siempre se ve: ahí no hay contenido que ganar. */
const ANCHOR = 96;

export type HeaderScroll = { hidden: boolean; from: number };

export function nextHeaderState({ hidden, from }: HeaderScroll, to: number): HeaderScroll {
  if (to <= ANCHOR) return { hidden: false, from: to };
  const delta = to - from;
  if (Math.abs(delta) < NOISE) return { hidden, from };
  return { hidden: delta > 0, from: to };
}
