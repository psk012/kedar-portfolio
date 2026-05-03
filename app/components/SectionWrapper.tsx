"use client";

import { ReactNode, useRef, useEffect } from "react";
import { onceInView, animate, EASE } from "@/app/lib/animations";

interface SectionWrapperProps {
  children : ReactNode;
  className?: string;
  id?      : string;
}

export default function SectionWrapper({
  children,
  className = "",
  id,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity    = "0";
    el.style.transform  = "translateY(30px)";
    el.style.willChange = "transform, opacity";

    const io = onceInView(el, () => {
      animate(el, {
        opacity   : [0, 1],
        translateY: [30, 0],
        duration  : 800,
        ease      : EASE,
        onComplete: () => { el.style.willChange = "auto"; },
      });
    }, 0.08);

    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      /*
       * Vertical rhythm:
       *   mobile  → py-16 (64px) — premium app cadence, breathable but not airy
       *   tablet  → py-20 (80px)
       *   desktop → py-24 (96px)
       */
      className={`py-16 md:py-20 lg:py-24 ${className}`}
    >
      {children}
    </section>
  );
}
