"use client";

import { useRef, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { onceInView, animate, EASE, EASE_FAST } from "@/app/lib/animations";

interface SkillItemProps {
  label : string;
  icon  : LucideIcon;
  index?: number;
}

export default function SkillItem({ label, icon: Icon, index = 0 }: SkillItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initial state
    el.style.opacity   = "0";
    el.style.transform = "translateY(14px)";
    el.style.willChange = "transform, opacity";

    // Stagger: each item delays based on its column position
    const io = onceInView(el, () => {
      animate(el, {
        opacity   : [0, 1],
        translateY: [14, 0],
        duration  : 700,
        ease      : EASE,
        delay     : index * 55,
        onComplete: () => { el.style.willChange = "auto"; },
      });
    }, 0.1);

    return () => io.disconnect();
  }, [index]);

  const handleEnter = () => {
    if (ref.current) animate(ref.current, { scale: 1.03, duration: 180, ease: EASE_FAST });
  };
  const handleLeave = () => {
    if (ref.current) animate(ref.current, { scale: 1, duration: 180, ease: EASE_FAST });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group flex items-center gap-3 glass rounded-xl px-4 py-3 hover:border-zinc-700/50 transition-colors duration-200 cursor-default"
    >
      <Icon
        size={16}
        strokeWidth={1.5}
        className="text-zinc-500 group-hover:text-zinc-300 transition-colors duration-200 flex-shrink-0"
      />
      <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200">
        {label}
      </span>
    </div>
  );
}
