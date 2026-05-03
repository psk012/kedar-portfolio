"use client";

/**
 * AnimatedHeading — word-split stagger reveal heading.
 *
 * • Splits the string children into individual word <span>s.
 * • IO-triggered: each word slides up and fades in with a stagger.
 * • Applies .hover-lift so the whole heading drifts 2px up on hover.
 *
 * Usage:
 *   <AnimatedHeading className="font-display text-3xl ...">
 *     Selected Projects.
 *   </AnimatedHeading>
 *
 * Only accepts a plain string as children (no JSX nodes).
 */

import { useRef, useEffect } from "react";
import { onceInView, animate, stagger, EASE } from "@/app/lib/animations";

interface AnimatedHeadingProps {
  children  : string;
  className?: string;
  /** Stagger interval in ms between each word. Default: 55. */
  staggerMs?: number;
  /** IO threshold before animation fires. Default: 0.2. */
  threshold?: number;
}

export default function AnimatedHeading({
  children,
  className  = "",
  staggerMs  = 55,
  threshold  = 0.2,
}: AnimatedHeadingProps) {
  const ref   = useRef<HTMLHeadingElement>(null);
  // Split on whitespace, keep empty tokens filtered out
  const words = children.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const wordEls = el.querySelectorAll<HTMLElement>("[data-word]");

    // Set initial hidden state
    wordEls.forEach((w) => {
      w.style.opacity    = "0";
      w.style.transform  = "translateY(22px)";
      w.style.willChange = "transform, opacity";
    });

    // Fire once the heading enters the viewport
    const io = onceInView(el, () => {
      animate(Array.from(wordEls), {
        opacity   : [0, 1],
        translateY: [22, 0],
        duration  : 680,
        ease      : EASE,
        delay     : stagger(staggerMs),
        onComplete: () => {
          wordEls.forEach((w) => { w.style.willChange = "auto"; });
        },
      });
    }, threshold);

    return () => io.disconnect();
  }, [staggerMs, threshold]);

  return (
    /*
     * The h2 itself carries hover-lift (2px upward drift on hover).
     * Word spans are inline-block so translateY entrance works correctly.
     * A hair of extra right-margin approximates the space character.
     */
    <h2 ref={ref} className={`hover-lift ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          data-word
          style={{
            display    : "inline-block",
            marginRight: i < words.length - 1 ? "0.28em" : 0,
          }}
        >
          {word}
        </span>
      ))}
    </h2>
  );
}
