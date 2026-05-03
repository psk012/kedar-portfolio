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

    // Initial state — hidden below its natural position
    el.style.opacity   = "0";
    el.style.transform = "translateY(30px)";
    el.style.willChange = "transform, opacity";

    // Reveal once section enters viewport
    const io = onceInView(el, () => {
      animate(el, {
        opacity   : [0, 1],
        translateY: [30, 0],
        duration  : 800,
        ease      : EASE,
        onComplete: () => { el.style.willChange = "auto"; },
      });
    }, 0.12);

    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`${hero ? "py-32" : "py-24"} ${className}`}
    >
      {children}
    </section>
  );
}
