/**
 * animations.ts — shared Anime.js animation utilities
 * ─────────────────────────────────────────────────────
 * All animations follow the design rules:
 *   - GPU-only: transform + opacity
 *   - Easing: cubicBezier(0.22, 1, 0.36, 1) (cinematic quint-out)
 *   - Duration range: 600ms – 1000ms
 *   - "Breathing, not performing"
 */

import { animate, stagger } from "animejs";

// ── Constants ────────────────────────────────────────────
export const EASE    = "cubicBezier(0.22, 1, 0.36, 1)";
export const EASE_FAST = "outQuad";
export const DURATION  = 800;

// ── Init helpers (set before-state via inline CSS) ───────

/** Mark an element as invisible before animation starts. */
export function setHidden(el: HTMLElement, y = 20) {
  el.style.opacity        = "0";
  el.style.transform      = `translateY(${y}px)`;
  el.style.willChange     = "transform, opacity";
}

/** Mark multiple elements hidden. */
export function setHiddenAll(els: HTMLElement[], y = 20) {
  els.forEach((el) => setHidden(el, y));
}

// ── Animation helpers ────────────────────────────────────

/**
 * Reveal a single element with a fade-up.
 * Call AFTER setHidden so anime reads the current state as "from".
 */
export function revealFadeUp(
  el: HTMLElement,
  delay = 0,
  duration = DURATION,
  fromY = 20
) {
  animate(el, {
    opacity  : [0, 1],
    translateY: [fromY, 0],
    duration,
    ease  : EASE,
    delay,
  });
}

/**
 * Stagger-reveal a list of elements.
 * Pass the array of DOM elements and the stagger interval in ms.
 */
export function revealStagger(
  els : HTMLElement[] | NodeListOf<Element>,
  staggerMs = 80,
  startDelay = 0,
  fromY = 20
) {
  animate(Array.from(els) as HTMLElement[], {
    opacity   : [0, 1],
    translateY: [fromY, 0],
    duration  : DURATION,
    ease      : EASE,
    delay     : stagger(staggerMs, { start: startDelay }),
  });
}

/**
 * Hover scale — call on mouseenter, pass 1.03 or 1.05.
 */
export function hoverScale(el: HTMLElement, scale = 1.03) {
  animate(el, { scale, duration: 200, ease: EASE_FAST });
}

/**
 * Reset hover scale to 1.
 */
export function hoverReset(el: HTMLElement) {
  animate(el, { scale: 1, duration: 200, ease: EASE_FAST });
}

/**
 * Click bounce — quick scale down then spring back.
 */
export function clickBounce(el: HTMLElement) {
  animate(el, { scale: [1, 0.95, 1], duration: 200, ease: EASE_FAST });
}

// ── IntersectionObserver factory ─────────────────────────

/**
 * Create and attach an IntersectionObserver that fires the callback once,
 * then disconnects. threshold = fraction of element visible before triggering.
 */
export function onceInView(
  el: Element,
  callback: () => void,
  threshold = 0.18
): IntersectionObserver {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        callback();
        io.unobserve(el);
      }
    },
    { threshold }
  );
  io.observe(el);
  return io;
}

export { animate, stagger };
