"use client";

import { ReactNode, useRef, useEffect } from "react";
import { onceInView, animate, EASE } from "@/app/lib/animations";

interface SectionWrapperProps {
  children : ReactNode;
  className?: string;
  id?      : string;
  hero?    : boolean;
}

export default function SectionWrapper({
  children,
  className = "",
  id,
  hero = false,
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
       *   mobile  → py-[72px]
       *   desktop → py-24 (standard) or py-32 (hero)
       */
      className={`${hero ? "py-[72px] md:py-32" : "py-[72px] md:py-24"} ${className}`}
    >
      {children}
    </section>
  );
}
