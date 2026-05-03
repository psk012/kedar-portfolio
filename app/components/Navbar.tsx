"use client";

import { useRef, useEffect } from "react";
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

export default function Navbar() {
  const active   = useActiveSection(links.map((l) => l.href));
  const desktopRef = useRef<HTMLElement>(null);
  const mobileRef  = useRef<HTMLElement>(null);

  useEffect(() => {
    // ── Desktop entrance ─────────────────────────────────
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

    // ── Mobile entrance ───────────────────────────────────
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
              {/* Active accent dot */}
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

      {/* ── Mobile: Bottom pill ──────────────────────────── */}
      <nav
        ref={mobileRef}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        aria-label="Site navigation"
      >
        <div className="glass-navbar flex items-center gap-1 rounded-full px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {links.map(({ href, icon: Icon, label }) => {
            const isActive = active === href;
            return (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                aria-label={label}
                className={`relative flex items-center justify-center p-2.5 rounded-full transition-all duration-200
                  ${isActive ? "text-zinc-100" : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"}`}
              >
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
