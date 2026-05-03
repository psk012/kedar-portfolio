"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Button from "@/app/components/Button";
import { ArrowRight, Mail } from "lucide-react";
import { animate, stagger, EASE } from "@/app/lib/animations";
import localFont from "next/font/local";
import { Akronim } from "next/font/google";

const saman = localFont({
  src    : "../fonts/saman.ttf",
  display: "swap",
});

const akronim = Akronim({
  subsets: ["latin"],
  weight : ["400"],
  display: "swap",
});

// Framer Motion: scroll-driven parallax only.
// All entrance + loop + hover animations: Anime.js.

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

/* ── Timing ──────────────────────────────────────────────────────── */
const ROLE_HOLD_MS  = 1900;
const ROLE_IN_MS    = 520;
const ROLE_OUT_MS   = 380;
const ROTATOR_START = 2400;

export default function Hero() {
  const sectionRef           = useRef<HTMLElement>(null);
  const portraitContainerRef = useRef<HTMLDivElement>(null);
  const portraitFloatRef     = useRef<HTMLDivElement>(null);
  const roleRef              = useRef<HTMLParagraphElement>(null);
  const nameRef              = useRef<HTMLHeadingElement>(null);
  const isHoverAnimating     = useRef(false);

  // ── Framer Motion: scroll parallax ─────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  // ── Anime.js: entrance + role rotator ──────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const badge     = section.querySelector<HTMLElement>("[data-hero-badge]");
    const chars     = section.querySelectorAll<HTMLElement>("[data-hero-char]");
    const identity  = section.querySelector<HTMLElement>("[data-hero-identity]");
    const sanskrit  = section.querySelector<HTMLElement>("[data-hero-sanskrit]");
    const cta       = section.querySelector<HTMLElement>("[data-hero-cta]");
    const scrollCue = section.querySelector<HTMLElement>("[data-scroll-cue]");
    const portrait  = portraitContainerRef.current;

    const initEl = (el: HTMLElement | null, y = 20) => {
      if (!el) return;
      el.style.opacity    = "0";
      el.style.transform  = `translateY(${y}px)`;
      el.style.willChange = "transform, opacity";
    };

    initEl(badge);
    chars.forEach((c) => initEl(c, 18));
    initEl(identity, 16);
    if (sanskrit) {
      sanskrit.style.opacity    = "0";
      sanskrit.style.willChange = "opacity";
    }
    initEl(cta, 16);
    if (scrollCue) scrollCue.style.opacity = "0";
    if (portrait) {
      portrait.style.opacity    = "0";
      portrait.style.transform  = "scale(0.97)";
      portrait.style.willChange = "transform, opacity";
    }

    // Entrance sequence
    if (badge) {
      animate(badge, { opacity: [0, 1], translateY: [20, 0], duration: 800, ease: EASE });
    }
    if (chars.length) {
      animate(Array.from(chars), {
        opacity   : [0, 1],
        translateY: [18, 0],
        duration  : 700,
        ease      : EASE,
        delay     : stagger(50, { start: 200 }),
      });
    }
    if (identity) {
      animate(identity, { opacity: [0, 1], translateY: [16, 0], duration: 700, ease: EASE, delay: 550 });
    }
    if (sanskrit) {
      animate(sanskrit, { opacity: [0, 0.75], duration: 1500, ease: "linear", delay: 720 });
    }
    if (cta) {
      animate(cta, { opacity: [0, 1], translateY: [16, 0], duration: 700, ease: EASE, delay: 920 });
    }
    if (portrait) {
      animate(portrait, {
        opacity   : [0, 1],
        scale     : [0.97, 1],
        duration  : 1200,
        ease      : EASE,
        delay     : 150,
        onComplete: () => {
          if (portraitFloatRef.current) {
            animate(portraitFloatRef.current, {
              translateY: [0, -10, 0],
              duration  : 6000,
              ease      : "inOutSine",
              loop      : true,
            });
          }
          if (portrait) portrait.style.willChange = "auto";
        },
      });
    }
    if (scrollCue) {
      animate(scrollCue, { opacity: [0, 1], duration: 800, ease: EASE, delay: 2800 });
    }

    // ── Role rotator ────────────────────────────────────────
    const roleEl = roleRef.current;
    let isMounted   = true;
    let currentRole = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    function cycleToNext() {
      if (!isMounted || !roleEl) return;
      animate(roleEl, {
        opacity   : [1, 0],
        translateY: [0, -7],
        duration  : ROLE_OUT_MS,
        ease      : "outQuad",
        onComplete: () => {
          if (!isMounted || !roleEl) return;
          currentRole = (currentRole + 1) % ROLES.length;
          roleEl.textContent = ROLES[currentRole];
          animate(roleEl, {
            opacity   : [0, 1],
            translateY: [10, 0],
            duration  : ROLE_IN_MS,
            ease      : EASE,
            onComplete: () => { timeoutId = setTimeout(cycleToNext, ROLE_HOLD_MS); },
          });
        },
      });
    }

    timeoutId = setTimeout(cycleToNext, ROTATOR_START);

    return () => {
      isMounted = false;
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, []);

  // ── Name hover: character wave ──────────────────────────────
  const handleNameEnter = () => {
    if (isHoverAnimating.current) return;
    isHoverAnimating.current = true;
    const el = nameRef.current;
    if (!el) { isHoverAnimating.current = false; return; }
    const chars = el.querySelectorAll<HTMLElement>("[data-hero-char]");
    animate(Array.from(chars), {
      y: [
        { to: "-100%", duration: 300, ease: "in(3)"  },
        { to: ["100%", "0%"], duration: 400, ease: "out(3)" },
      ],
      delay     : stagger(40),
      onComplete: () => { isHoverAnimating.current = false; },
    });
  };
  const handleNameLeave = () => {
    // Intentionally empty — let the wave finish naturally
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-screen min-h-[600px] overflow-hidden bg-transparent"
    >
      {/* ── Gradient overlays ─────────────────────────────── */}
      {/* Top/bottom vignette — all screen sizes */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/*
       * Side gradient: darkens the left on desktop so text is readable.
       * Hidden on mobile where the layout is centered, not left-biased.
       */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.50) 38%, rgba(10,10,10,0.04) 68%, transparent 100%)",
        }}
      />

      {/* Bottom fade into page */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)" }}
      />

      {/* ── Content ─────────────────────────────────────── */}
      <div className="relative z-10 h-full flex items-center w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:pl-20 xl:pl-6">

        {/*
         * Layout:
         *   Mobile (< md) → flex-col, centered
         *                   portrait on top (order-1), text below (order-2)
         *   Desktop (md+) → flex-row, text left, portrait right (existing layout)
         */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-center w-full gap-8 sm:gap-10 md:gap-16 lg:gap-52">

          {/* ── TEXT (order-2 mobile → left on desktop) ───── */}
          <motion.div
            style={{ y: textY }}
            className="flex flex-col gap-5 md:gap-6 max-w-md lg:max-w-lg min-w-0
                       items-center text-center
                       md:items-start md:text-left
                       order-2 md:order-1"
          >
            {/* Status badge */}
            <div data-hero-badge>
              <span className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-500 border border-zinc-800/50 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm bg-black/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-shrink-0" />
                Open to internships and collaborations
              </span>
            </div>

            {/* Name — character-split for stagger + hover wave */}
            <h1
              ref={nameRef}
              className={`${akronim.className} tracking-normal text-zinc-100 cursor-default select-none pb-1 md:pb-2`}
              style={{
                /*
                 * clamp min drops from 3rem → 2rem so the name fits
                 * comfortably when centered on a 360px-wide phone.
                 */
                fontSize  : "clamp(2.4rem, 10vw, 5.5rem)",
                lineHeight: 1.05,
                display   : "inline-block",
              }}
              onMouseEnter={handleNameEnter}
              onMouseLeave={handleNameLeave}
            >
              {CHARS.map((char, i) => (
                <span key={i} className="inline-flex overflow-hidden relative">
                  <span data-hero-char className="inline-block">
                    {char}
                  </span>
                </span>
              ))}
            </h1>

            {/* Dynamic identity / role rotator */}
            <p
              ref={roleRef}
              data-hero-identity
              className="font-display text-lg sm:text-xl md:text-xl font-medium text-zinc-400 tracking-tight -mt-1 md:-mt-2"
              style={{ minHeight: "1.75em" }}
            >
              {ROLES[0]}
            </p>

            {/*
             * CTAs — full-width stacked on mobile, inline on sm+.
             * items-stretch makes the <a> tags fill the flex column width.
             * Button className w-full + justify-center fills the span inside.
             * sm:w-auto + sm:justify-start restores natural sizing on wider screens.
             */}
            <div
              data-hero-cta
              className="flex flex-col items-stretch sm:flex-row sm:items-center gap-3 sm:gap-4 pt-1 md:pt-2 w-full sm:w-auto"
            >
              <Button
                href="#projects"
                variant="primary"
                className="w-full sm:w-auto justify-center sm:justify-start"
              >
                View Projects
                <ArrowRight size={14} strokeWidth={2} />
              </Button>
              <Button
                href="#contact"
                variant="ghost"
                className="w-full sm:w-auto justify-center sm:justify-start"
              >
                Contact Me
                <Mail size={14} strokeWidth={1.5} />
              </Button>
            </div>
          </motion.div>

          {/* ── PORTRAIT (order-1 mobile → right on desktop) ─ */}
          <motion.div
            style={{ y: portraitY }}
            className="
              relative flex flex-col flex-shrink-0 items-center justify-end
              order-1 md:order-2
              self-center md:self-end
              h-[230px] w-auto
              sm:h-[270px]
              md:h-full
            "
          >
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 md:w-64 h-32 md:h-48 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(74,222,128,0.04) 0%, transparent 70%)",
                filter    : "blur(24px)",
              }}
            />

            {/* Outer: entrance animation target */}
            <div ref={portraitContainerRef} className="flex flex-col items-center">
              {/* Inner: float loop target */}
              <div
                ref={portraitFloatRef}
                style={{
                  filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.75)) drop-shadow(0 4px 16px rgba(0,0,0,0.5))",
                }}
              >
                {/*
                 * Mobile portrait — explicit px dimensions required for next/image fill.
                 * Shown only on < md (hidden on desktop via the desktop div below).
                 */}
                <div className="relative block md:hidden w-[155px] h-[232px] sm:w-[180px] sm:h-[270px]">
                  <Image
                    src="/images/portrait.png"
                    alt="P. S. Kedar — portrait"
                    fill
                    priority
                    className="object-contain object-bottom"
                    style={{ transform: "scale(1.08)", transformOrigin: "bottom center" }}
                    sizes="(max-width: 640px) 155px, 180px"
                  />
                </div>

                {/* Desktop portrait — clamp-sized, shown md+ only */}
                <div
                  className="relative hidden md:block"
                  style={{
                    width : "clamp(240px, 26vw, 400px)",
                    height: "clamp(360px, 70vh, 570px)",
                  }}
                >
                  <Image
                    src="/images/portrait.png"
                    alt="P. S. Kedar — portrait"
                    fill
                    priority
                    className="object-contain object-bottom"
                    style={{ transform: "scale(1.08)", transformOrigin: "bottom center" }}
                    sizes="(max-width: 1279px) 280px, 400px"
                  />
                </div>
              </div>

              {/* Sanskrit tagline — desktop only (too tall for mobile hero) */}
              <p
                data-hero-sanskrit
                className={`${saman.className} hidden md:block text-center text-zinc-300 mt-6 tracking-widest text-lg md:text-xl`}
              >
                Yatha Chintayati Tatha Bhavati
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Scroll cue — hidden on mobile (space is tight) ── */}
      <div
        data-scroll-cue
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-medium tracking-[0.25em] uppercase text-zinc-700">
          Scroll
        </span>
        <div
          className="w-px h-8 bg-gradient-to-b from-zinc-700 to-transparent"
          style={{ animation: "scrollCuePulse 1.8s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}
