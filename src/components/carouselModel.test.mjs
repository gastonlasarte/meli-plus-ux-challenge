import test from "node:test";
import assert from "node:assert/strict";
import { carouselKeyIndex, nearestSlide, swipeHintOffset } from "./carouselModel.ts";

test("keyboard arrows move within the current carousel", () => {
  assert.equal(carouselKeyIndex("ArrowRight", 1, 4), 2);
  assert.equal(carouselKeyIndex("ArrowLeft", 1, 4), 0);
});
test("keyboard boundaries never select a nonexistent slide", () => {
  assert.equal(carouselKeyIndex("ArrowLeft", 0, 4), 0);
  assert.equal(carouselKeyIndex("ArrowRight", 3, 4), 3);
  assert.equal(carouselKeyIndex("Home", 2, 4), 0);
  assert.equal(carouselKeyIndex("End", 1, 4), 3);
});
test("vertical navigation keys are left to the browser", () => {
  for (const key of ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Tab"]) {
    assert.equal(carouselKeyIndex(key, 1, 4), null);
  }
});
test("drag settling tolerates overscroll at both ends", () => {
  assert.equal(nearestSlide(-80, 328, 4), 0);
  assert.equal(nearestSlide(2000, 328, 4), 3);
  assert.equal(nearestSlide(620, 328, 4), 2);
});
test("the demonstration always starts and finishes at the original slide", () => {
  assert.equal(swipeHintOffset(0, 328), 0);
  assert.equal(swipeHintOffset(1, 328), 0);
});
test("the hint reveals content without crossing the active slide threshold", () => {
  for (const width of [288, 328, 358, 380, 448]) {
    for (let step = 0; step <= 100; step++) {
      assert.ok(swipeHintOffset(step / 100, width) <= width * 0.22);
    }
  }
});
