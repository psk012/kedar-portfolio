"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Button from "@/app/components/Button";
import { ArrowRight, Mail } from "lucide-react";
import { animate, stagger, EASE } from "@/app/lib/animations";
import localFont from "next/font/local";

const saman = localFont({
  src: "../fonts/saman.ttf",
  display: "swap",
});

import { Akronim } from "next/font/google";

const akronim = Akronim({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Framer Motion used ONLY for scroll-driven parallax MotionValues.
// All entrance + loop + hover animations are handled by Anime.js.

/* ── Identity roles ──────────────────────────────────────────────── */
const ROLES = [
  "Full-stack Developer",
  "AI/ML Enthusiast",
  "NLP Systems Builder",
  "Backend Architect",
  "Problem Solver",
  "Poet",
  "Storyteller",
  "Singer",
  "Visual Thinker",
];

const CHARS = "KEDAR".split("");

/* ── Timing constants ────────────────────────────────────────────── */
const ROLE_HOLD_MS = 1900;  // how long each role stays visible
const ROLE_IN_MS = 520;   // fade-in duration
const ROLE_OUT_MS = 380;   // fade-out duration
const ROTATOR_START = 2400;  // ms after mount before first role switch

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitContainerRef = useRef<HTMLDivElement>(null);
  const portraitFloatRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const isHoverAnimating = useRef(false);

  // ── Framer Motion: scroll-driven parallax ──────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  // ── Anime.js: entrance animations + role rotator ────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // ── Collect targets ──────────────────────────────────
    const badge = section.querySelector<HTMLElement>("[data-hero-badge]");
    const chars = section.querySelectorAll<HTMLElement>("[data-hero-char]");
    const identity = section.querySelector<HTMLElement>("[data-hero-identity]");
    const sanskrit = section.querySelector<HTMLElement>("[data-hero-sanskrit]");
    const cta = section.querySelector<HTMLElement>("[data-hero-cta]");
    const scrollCue = section.querySelector<HTMLElement>("[data-scroll-cue]");
    const portrait = portraitContainerRef.current;

    // ── Initial hidden state ─────────────────────────────
    const initEl = (el: HTMLElement | null, y = 20) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = `translateY(${y}px)`;
      el.style.willChange = "transform, opacity";
    };

    initEl(badge);
    chars.forEach((c) => initEl(c, 18));
    initEl(identity, 16);
    if (sanskrit) {
      sanskrit.style.opacity = "0";
      sanskrit.style.willChange = "opacity";
    }
    initEl(cta, 16);
    if (scrollCue) scrollCue.style.opacity = "0";
    if (portrait) {
      portrait.style.opacity = "0";
      portrait.style.transform = "scale(0.97)";
      portrait.style.willChange = "transform, opacity";
    }

    // ── Staggered entrance sequence ──────────────────────
    // Badge (0ms)
    if (badge) {
      animate(badge, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        ease: EASE,
      });
    }

    // Name characters (200ms start, 50ms stagger)
    if (chars.length) {
      animate(Array.from(chars), {
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 700,
        ease: EASE,
        delay: stagger(50, { start: 200 }),
      });
    }

    // Identity line (550ms)
    if (identity) {
      animate(identity, {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 700,
        ease: EASE,
        delay: 550,
      });
    }

    // Sanskrit tagline (720ms)
    if (sanskrit) {
      animate(sanskrit, {
        opacity: [0, 0.75],
        duration: 1500,
        ease: "linear",
        delay: 720,
      });
    }

    // CTAs (920ms)
    if (cta) {
      animate(cta, {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 700,
        ease: EASE,
        delay: 920,
      });
    }

    // Portrait (150ms — early, builds presence)
    if (portrait) {
      animate(portrait, {
        opacity: [0, 1],
        scale: [0.97, 1],
        duration: 1200,
        ease: EASE,
        delay: 150,
        onComplete: () => {
          if (portraitFloatRef.current) {
            animate(portraitFloatRef.current, {
              translateY: [0, -10, 0],
              duration: 6000,
              ease: "inOutSine",
              loop: true,
            });
          }
          if (portrait) portrait.style.willChange = "auto";
        },
      });
    }

    // Scroll cue (2800ms — appears last)
    if (scrollCue) {
      animate(scrollCue, {
        opacity: [0, 1],
        duration: 800,
        ease: EASE,
        delay: 2800,
      });
    }

    // ── Role rotator ─────────────────────────────────────
    const roleEl = roleRef.current;
    let isMounted = true;
    let currentRole = 0; // index into ROLES (0 = "Full-stack Developer", already shown)
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Fade out the current role text, swap content, fade in the next.
     * Each cycle: ROLE_OUT_MS + ROLE_IN_MS + ROLE_HOLD_MS ≈ 2.8s.
     */
    function cycleToNext() {
      if (!isMounted || !roleEl) return;

      // Fade out current
      animate(roleEl, {
        opacity: [1, 0],
        translateY: [0, -7],
        duration: ROLE_OUT_MS,
        ease: "outQuad",
        onComplete: () => {
          if (!isMounted || !roleEl) return;

          // Advance to next role
          currentRole = (currentRole + 1) % ROLES.length;
          roleEl.textContent = ROLES[currentRole];

          // Fade in new role
          animate(roleEl, {
            opacity: [0, 1],
            translateY: [10, 0],
            duration: ROLE_IN_MS,
            ease: EASE,
            onComplete: () => {
              // Hold, then cycle again
              timeoutId = setTimeout(cycleToNext, ROLE_HOLD_MS);
            },
          });
        },
      });
    }

    // Start cycling after ROTATOR_START ms (entrance is done by then)
    timeoutId = setTimeout(cycleToNext, ROTATOR_START);

    // ── Cleanup ──────────────────────────────────────────
    return () => {
      isMounted = false;
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, []);

  // ── Name hover: stagger-lift each character ────────────────
  const handleNameEnter = () => {
    if (isHoverAnimating.current) return;
    isHoverAnimating.current = true;

    const el = nameRef.current;
    if (!el) {
      isHoverAnimating.current = false;
      return;
    }
    const chars = el.querySelectorAll<HTMLElement>("[data-hero-char]");

    animate(Array.from(chars), {
      y: [
        { to: '-100%', duration: 300, ease: 'in(3)' },
        { to: ['100%', '0%'], duration: 400, ease: 'out(3)' }
      ],
      delay: stagger(40),
      onComplete: () => {
        isHoverAnimating.current = false;
      }
    });
  };

  const handleNameLeave = () => {
    // Intentionally empty: we want the hover animation to finish fully
    // irrespective of how long the user hovers over the name.
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-screen min-h-[600px] overflow-hidden bg-transparent"
    >
      {/* ── Hero-specific gradient overlays ──────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.50) 38%, rgba(10,10,10,0.04) 68%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)" }}
      />

      {/* ── Content ─────────────────────────────────────── */}
      <div className="relative z-10 h-full flex items-center justify-center max-w-[1200px] mx-auto px-6 lg:pl-20 xl:pl-6">
        <div className="flex items-center justify-center w-full gap-16 lg:gap-52">

          {/* LEFT — FM wrapper for parallax only */}
          <motion.div
            style={{ y: textY }}
            className="flex flex-col gap-6 max-w-md lg:max-w-lg min-w-0"
          >
            {/* Status badge */}
            <div data-hero-badge>
              <span className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-500 border border-zinc-800/50 rounded-full px-4 py-2 backdrop-blur-sm bg-black/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Open to internships and collaborations
              </span>
            </div>

            {/*
             * Name — character split for stagger entrance.
             * nameRef attached for hover → per-letter lift animation.
             */}
            <h1
              ref={nameRef}
              className={`${akronim.className} tracking-normal text-zinc-100 cursor-default select-none pb-2 pr-2`}
              style={{
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                lineHeight: 1.05,
                display: "inline-block",
              }}
              onMouseEnter={handleNameEnter}
              onMouseLeave={handleNameLeave}
            >
              {CHARS.map((char, i) => (
                <span
                  key={i}
                  className="inline-flex overflow-hidden relative"
                >
                  <span
                    data-hero-char
                    className="inline-block"
                  >
                    {char}
                  </span>
                </span>
              ))}
            </h1>

            {/*
             * Dynamic identity line — role rotator target.
             * Entrance animation handles the initial reveal;
             * the rotator cycles content via DOM mutation after ROTATOR_START ms.
             * minHeight prevents layout shift during text swaps.
             */}
            <p
              ref={roleRef}
              data-hero-identity
              className="font-display text-lg md:text-xl font-medium text-zinc-400 tracking-tight -mt-2"
              style={{ minHeight: "1.75em" }}
            >
              {ROLES[0]}
            </p>

            {/* CTAs */}
            <div data-hero-cta className="flex items-center gap-4 flex-wrap pt-2">
              <Button href="#projects" variant="primary">
                View Projects
                <ArrowRight size={14} strokeWidth={2} />
              </Button>
              <Button href="#contact" variant="ghost">
                Contact Me
                <Mail size={14} strokeWidth={1.5} />
              </Button>
            </div>
          </motion.div>

          {/* RIGHT — Portrait (FM for parallax, Anime.js for entrance + float) */}
          <motion.div
            style={{ y: portraitY }}
            className="relative hidden md:flex flex-col flex-shrink-0 items-center justify-end self-end h-full"
          >
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-48 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(74,222,128,0.04) 0%, transparent 70%)",
                filter: "blur(24px)",
              }}
            />

            {/* Outer: entrance animation target */}
            <div ref={portraitContainerRef}>
              {/* Inner: float loop target */}
              <div
                ref={portraitFloatRef}
                style={{
                  filter:
                    "drop-shadow(0 24px 48px rgba(0,0,0,0.75)) drop-shadow(0 4px 16px rgba(0,0,0,0.5))",
                }}
              >
                <div
                  className="relative"
                  style={{
                    width: "clamp(240px, 26vw, 400px)",
                    height: "clamp(360px, 70vh, 570px)",
                  }}
                >
                  <Image
                    src="/images/portrait.png"
                    alt="P. S. Kedar — portrait"
                    fill
                    priority
                    className="object-contain object-bottom"
                    style={{
                      transform: "scale(1.08)",
                      transformOrigin: "bottom center",
                    }}
                    sizes="(max-width: 767px) 0px, (max-width: 1279px) 280px, 400px"
                  />
                </div>
              </div>
            </div>

            {/* Sanskrit Tagline */}
            <p
              data-hero-sanskrit
              className={`${saman.className} text-center text-zinc-300 mt-6 tracking-widest text-lg md:text-xl`}
            >
              Yatha Chintayati Tatha Bhavati
            </p>
          </motion.div>

        </div>
      </div>

      {/* ── Scroll cue ──────────────────────────────────── */}
      <div
        data-scroll-cue
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-medium tracking-[0.25em] uppercase text-zinc-700">
          Scroll
        </span>
        {/* CSS-only pulse so it works even before JS */}
        <div
          className="w-px h-8 bg-gradient-to-b from-zinc-700 to-transparent"
          style={{ animation: "scrollCuePulse 1.8s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}
