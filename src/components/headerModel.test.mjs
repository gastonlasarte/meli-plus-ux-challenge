import test from "node:test";
import assert from "node:assert/strict";
import { nextHeaderState } from "./headerModel.ts";

const visible = { hidden: false, from: 0 };

test("cerca del inicio la barra siempre se ve", () => {
  assert.deepEqual(nextHeaderState({ hidden: true, from: 400 }, 40), { hidden: false, from: 40 });
  assert.deepEqual(nextHeaderState(visible, 96), { hidden: false, from: 96 });
});
test("bajar esconde la barra y subir la devuelve", () => {
  const down = nextHeaderState({ hidden: false, from: 200 }, 320);
  assert.deepEqual(down, { hidden: true, from: 320 });
  assert.deepEqual(nextHeaderState(down, 260), { hidden: false, from: 260 });
});
test("el temblor del dedo no mueve la barra", () => {
  const state = { hidden: false, from: 300 };
  assert.deepEqual(nextHeaderState(state, 305), state);
  assert.deepEqual(nextHeaderState({ hidden: true, from: 300 }, 295), { hidden: true, from: 300 });
});
test("el ruido se acumula hasta cruzar el umbral", () => {
  let state = { hidden: false, from: 300 };
  for (const to of [303, 306, 309]) state = nextHeaderState(state, to);
  assert.deepEqual(state, { hidden: true, from: 309 });
});
