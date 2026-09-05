export function carouselKeyIndex(key: string, active: number, count: number): number | null {
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  if (key === "ArrowLeft") return Math.max(active - 1, 0);
  if (key === "ArrowRight") return Math.min(active + 1, count - 1);
  return null;
}

export function nearestSlide(left: number, width: number, count: number): number {
  return Math.max(0, Math.min(count - 1, Math.round(left / width)));
}

export function swipeHintOffset(progress: number, width: number): number {
  if (progress <= 0 || progress >= 1) return 0;
  return Math.min(72, width * 0.22) * Math.sin(Math.PI * progress) ** 2;
}
