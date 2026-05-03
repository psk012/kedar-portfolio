"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import SectionWrapper from "@/app/components/SectionWrapper";
import AnimatedHeading from "@/app/components/AnimatedHeading";
import {
  ArrowUpRight,
  ShieldCheck,
  Brain,
  FileText,
  Activity,
  Code2,
  Users,
  Zap,
  Lock,
} from "lucide-react";
import { onceInView, animate, stagger, EASE, EASE_FAST } from "@/app/lib/animations";

/* ── Project data ──────────────────────────────────────── */
const projects = [
  {
    title      : "MANAS",
    description: "A real-time emotional distress detection platform built to help people navigate difficult moments securely.",
    image      : "/projects/manas-logo.png",
    imageBg    : "bg-[#fff8f5]",
    imageFit   : "object-contain scale-75",
    href       : "https://github.com/psk012/dose_app",
    bullets: [
      { icon: Brain,       text: "Analyzes text to detect distress in real-time"             },
      { icon: Users,       text: "Built for users in vulnerable, high-stress situations"     },
      { icon: Lock,        text: "Keeps all data strictly private with AES encryption"       },
      { icon: ShieldCheck, text: "Automatically triggers safe fallbacks on edge cases"       },
      { icon: Code2,       text: "Stack: MERN, NLP, Gemini API"                             },
    ],
  },
  {
    title      : "Medical Report Analyzer",
    description: "An AI-powered tool that automatically extracts and structures important information from complex medical reports.",
    image      : "/projects/medical.png",
    imageBg    : "bg-zinc-950",
    imageFit   : "object-cover",
    href       : "https://github.com/psk012/Medical-Report-Analyser_AI-and-NLP",
    bullets: [
      { icon: FileText, text: "Turns messy documents into clean, structured data"     },
      { icon: Users,    text: "Built for healthcare professionals and researchers"    },
      { icon: Zap,      text: "Ensures high accuracy without missing crucial details" },
      { icon: Activity, text: "Features a clean, completely modular architecture"    },
      { icon: Code2,    text: "Stack: Python, spaCy, NLTK, Pandas"                  },
    ],
  },
];

export default function Projects() {
  const headerLabelRef = useRef<HTMLParagraphElement>(null);
  const gridRef        = useRef<HTMLDivElement>(null);
  const cardRefs       = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    // Header label
    const label = headerLabelRef.current;
    if (label) {
      label.style.opacity = "0";
      onceInView(label, () => {
        animate(label, { opacity: [0, 1], duration: 600, ease: EASE });
      }, 0.5);
    }

    // Grid cards
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    cards.forEach((c) => {
      c.style.opacity    = "0";
      c.style.transform  = "translateY(20px)";
      c.style.willChange = "transform, opacity";
    });

    const grid = gridRef.current;
    if (grid && cards.length) {
      onceInView(grid, () => {
        animate(cards, {
          opacity   : [0, 1],
          translateY: [20, 0],
          duration  : 700,
          ease      : EASE,
          delay     : stagger(100),
          onComplete: () => cards.forEach((c) => { c.style.willChange = "auto"; }),
        });
      }, 0.08);
    }
  }, []);

  const onEnter = (el: HTMLElement | null) => {
    if (el) animate(el, { scale: 1.015, duration: 200, ease: EASE_FAST });
  };
  const onLeave = (el: HTMLElement | null) => {
    if (el) animate(el, { scale: 1, duration: 200, ease: EASE_FAST });
  };

  return (
    <SectionWrapper id="projects" className="border-t border-white/[0.08]">
      {/* Header */}
      <div className="mb-8 md:mb-12 lg:mb-16">
        <p
          ref={headerLabelRef}
          className="text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-600 mb-5 md:mb-6"
        >
          Projects
        </p>
        <AnimatedHeading className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-100">
          Here's what I've built so far
        </AnimatedHeading>
      </div>

      {/* Cards — single column on mobile, 2-col on md+ */}
      <div ref={gridRef} className="flex flex-col gap-4 md:gap-6">
        {projects.map((project, i) => (
          <a
            key={project.title}
            ref={(el) => { cardRefs.current[i] = el; }}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => onEnter(cardRefs.current[i])}
            onMouseLeave={() => onLeave(cardRefs.current[i])}
            className="group flex flex-col sm:flex-row w-full glass rounded-xl overflow-hidden
                       border border-white/[0.05] hover:border-white/[0.1]
                       hover:shadow-2xl hover:shadow-black/50 transition-all duration-300
                       cursor-pointer bg-zinc-950/40"
          >
            {/*
             * IMAGE
             * Mobile  (flex-col): full width, fixed 160px height, border at bottom
             * sm+     (flex-row): 1/4 width, auto height, border at right
             */}
            <div
              className={`
                relative flex-shrink-0 overflow-hidden
                w-full h-40 sm:w-1/4 sm:h-auto
                border-b border-white/[0.05] sm:border-b-0 sm:border-r border-white/[0.05]
                ${project.imageBg || "bg-zinc-950"}
              `}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className={`${project.imageFit || "object-cover"} transition-transform duration-700 group-hover:scale-105`}
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-transparent to-zinc-950/20 mix-blend-overlay pointer-events-none" />
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2 md:mb-3">
                  <h3 className="font-display text-base sm:text-lg md:text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <ArrowUpRight
                    size={16}
                    className="text-zinc-600 group-hover:text-zinc-300 transition-all duration-200 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4 md:mb-5">
                  {project.description}
                </p>

                {/* Show all bullets on desktop, cap at 3 on mobile for brevity */}
                <div className="space-y-2 md:space-y-3">
                  {project.bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 ${idx >= 3 ? "hidden sm:flex" : ""}`}
                    >
                      <bullet.icon
                        size={14}
                        strokeWidth={1.5}
                        className="text-zinc-600 mt-0.5 flex-shrink-0 group-hover:text-zinc-400 transition-colors"
                      />
                      <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                        {bullet.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}
