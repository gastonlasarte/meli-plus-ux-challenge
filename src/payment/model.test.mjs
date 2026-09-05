import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialPayment, methods, saveAlternate, removeAlternate } from './model.ts';

test('starts with a primary and no alternate', () => {
  assert.deepEqual(initialPayment, { primary: 'visa', alternate: null });
});
test('adding an alternate never changes the primary', () => {
  assert.deepEqual(saveAlternate(initialPayment, 'mastercard'), { primary: 'visa', alternate: 'mastercard' });
  assert.equal(initialPayment.alternate, null);
});
test('cannot reuse the primary as an alternate', () => {
  assert.throws(() => saveAlternate(initialPayment, 'visa'));
});
test('can replace the alternate with another saved method', () => {
  assert.deepEqual(saveAlternate(saveAlternate(initialPayment, 'mastercard'), 'balance'), { primary: 'visa', alternate: 'balance' });
});
test('removal only unlinks the alternate from this subscription', () => {
  assert.deepEqual(removeAlternate(saveAlternate(initialPayment, 'mastercard')), initialPayment);
  assert.equal(methods.length, 3);
});
test('rejects unknown saved methods', () => {
  assert.throws(() => saveAlternate(initialPayment, 'missing'));
});
