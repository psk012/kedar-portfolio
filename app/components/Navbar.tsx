"use client";

import { useEffect, useRef, useState } from "react";
import { Home, Layers, User, Mail, Code2 } from "lucide-react";
import { animate, EASE } from "@/app/lib/animations";
import { useActiveSection } from "@/app/hooks/useActiveSection";

const links = [
  { href: "home",     icon: Home,   label: "Home"     },
  { href: "about",    icon: User,   label: "About"    },
  { href: "projects", icon: Layers, label: "Projects" },
  { href: "skills",   icon: Code2,  label: "Skills"   },
  { href: "contact",  icon: Mail,   label: "Contact"  },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

/**
 * Tracks scroll direction with rAF coalescing + a small jitter threshold.
 * Returns 'up' when stationary or scrolling up; 'down' while scrolling down.
 *
 * - rAF coalescing: at most one update per frame, even on devices that
 *   fire scroll events at high rate.
 * - 6px threshold: prevents flapping during sub-pixel scroll jitter or
 *   trackpad inertia "hover".
 */
function useScrollDirection(): "up" | "down" {
  const [direction, setDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    let lastY  = window.scrollY;
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - lastY) > 6) {
          // Always 'up' near the top — feels right when bouncing back to hero
          setDirection(y > lastY && y > 80 ? "down" : "up");
          lastY = y;
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return direction;
}

export default function Navbar() {
  const active        = useActiveSection(links.map((l) => l.href));
  const scrollDir     = useScrollDirection();
  const desktopRef    = useRef<HTMLElement>(null);
  const mobileRef     = useRef<HTMLElement>(null);

  useEffect(() => {
    if (desktopRef.current) {
      const el = desktopRef.current;
      el.style.opacity   = "0";
      el.style.transform = "translateX(-14px)";
      animate(el, {
        opacity   : [0, 1],
        translateX: [-14, 0],
        duration  : 700,
        ease      : EASE,
        delay     : 400,
      });
    }

    if (mobileRef.current) {
      const el = mobileRef.current;
      el.style.opacity   = "0";
      el.style.transform = "translateY(14px)";
      animate(el, {
        opacity   : [0, 1],
        translateY: [14, 0],
        duration  : 700,
        ease      : EASE,
        delay     : 400,
      });
    }
  }, []);

  /*
   * Pill opacity:
   *   scrolling down → 0.55  (recedes, doesn't compete with content)
   *   stationary/up  → 0.92  (visible, ready for use)
   *
   * Applied to the inner pill — the outer <nav> opacity is owned by the
   * Anime.js entrance animation, so the two never fight.
   */
  const pillOpacity = scrollDir === "down" ? 0.55 : 0.92;

  return (
    <>
      {/* ── Desktop: Left vertical rail ───────────────────── */}
      <nav
        ref={desktopRef}
        className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col items-start gap-0.5"
        aria-label="Site navigation"
      >
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = active === href;
          return (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              aria-label={label}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200
                ${isActive ? "text-zinc-100" : "text-zinc-600 hover:text-zinc-300"}`}
            >
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full transition-all duration-300
                  ${isActive ? "bg-accent opacity-100" : "bg-transparent opacity-0"}`}
              />
              <Icon
                size={15}
                strokeWidth={isActive ? 2 : 1.5}
                className="flex-shrink-0 transition-all duration-200"
              />
              <span
                className={`text-[10px] font-medium tracking-widest uppercase whitespace-nowrap transition-all duration-200
                  ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Mobile: Bottom floating pill ─────────────────── */}
      {/*
       * Layout:
       *   bottom-4         → 16px from viewport edge (per spec)
       *   w-[88vw]         → 88% screen width
       *   max-w-[420px]    → never wider than 420px on tablets
       *   left-1/2 + -translate-x-1/2 → centered horizontally
       */}
      <nav
        ref={mobileRef}
        className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[88vw] max-w-[420px]"
        aria-label="Site navigation"
      >
        {/*
         * The pill itself: lighter background (rgba 0,0,0,0.45), softer blur (12px),
         * and dynamic opacity tied to scroll direction. justify-evenly distributes
         * the 5 icons across the now-wider pill so it reads as a "control bar".
         */}
        <div
          className="flex items-center justify-evenly gap-1 rounded-full px-3 py-2 border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          style={{
            background           : "rgba(0, 0, 0, 0.45)",
            backdropFilter       : "blur(12px)",
            WebkitBackdropFilter : "blur(12px)",
            opacity              : pillOpacity,
            transition           : "opacity 300ms ease",
          }}
        >
          {links.map(({ href, icon: Icon, label }) => {
            const isActive = active === href;
            return (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                aria-label={label}
                className={`relative flex items-center justify-center p-2 rounded-full transition-all duration-200
                  ${isActive ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}`}
              >
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
                <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
