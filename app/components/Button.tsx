"use client";

import { ReactNode, useRef } from "react";
import { animate, EASE, EASE_FAST } from "@/app/lib/animations";

interface ButtonProps {
  children : ReactNode;
  href?    : string;
  variant? : "primary" | "ghost";
  className?: string;
}

export default function Button({
  children,
  href,
  variant   = "primary",
  className = "",
}: ButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const base =
    "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer select-none";

  /*
   * Primary — white pill. Hover: slight scale + faint outer glow.
   * Ghost  — glass pill.  Hover: more restrained scale, no glow.
   *
   * Scale is handled by Anime.js (GPU transform).
   * Glow / bg-shift is CSS (avoids animating box-shadow in JS).
   */
  const styles = {
    primary:
      "bg-zinc-100 text-zinc-900 hover:bg-white " +
      "hover:shadow-[0_0_28px_rgba(255,255,255,0.14)] transition-shadow duration-300",
    ghost:
      "glass text-zinc-300 hover:text-zinc-100 hover:border-zinc-700/70",
  };

  /* Scale target per variant — primary is more pronounced */
  const hoverScale = variant === "primary" ? 1.04 : 1.02;

  /* Bounce: scale down slightly, spring back */
  const handleDown = () => {
    if (!ref.current) return;
    animate(ref.current, {
      scale   : [1, 0.96, 1],
      duration: 200,
      ease    : EASE_FAST,
    });
  };

  const content = (
    <span
      ref={ref}
      className={`${base} ${styles[variant]} ${className}`}
      style={{ display: "inline-flex", willChange: "transform" }}
      onMouseEnter={() => {
        if (ref.current) animate(ref.current, { scale: hoverScale, duration: 200, ease: EASE_FAST });
      }}
      onMouseLeave={() => {
        if (ref.current) animate(ref.current, { scale: 1, duration: 220, ease: EASE });
      }}
      onMouseDown={handleDown}
    >
      {children}
    </span>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return <button className="outline-none">{content}</button>;
}
