"use client";

import { useRef, useEffect } from "react";
import SectionWrapper from "@/app/components/SectionWrapper";
import AnimatedHeading from "@/app/components/AnimatedHeading";
import { Github, Mail, Linkedin } from "lucide-react";
import { onceInView, animate, stagger, EASE } from "@/app/lib/animations";

const contactLinks = [
  {
    label: "GitHub",
    href : "https://github.com/psk012",
    icon : Github,
  },
  {
    label: "Email",
    href : "mailto:pskedhar@gmail.com",
    icon : Mail,
  },
  {
    label: "LinkedIn",
    href : "https://linkedin.com/in/subrahmanyakedarpantula816",
    icon : Linkedin,
  },
];

export default function Contact() {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── "Contact" label ───────────────────────────────────
    const label = labelRef.current;
    if (label) {
      label.style.opacity = "0";
      onceInView(label, () => {
        animate(label, { opacity: [0, 1], duration: 600, ease: EASE });
      }, 0.5);
    }

    // ── Link row ──────────────────────────────────────────
    const row = linksRef.current;
    if (row) {
      const links = row.querySelectorAll<HTMLElement>("[data-contact-link]");
      links.forEach((el) => {
        el.style.opacity    = "0";
        el.style.transform  = "translateY(12px)";
        el.style.willChange = "transform, opacity";
      });

      onceInView(row, () => {
        animate(Array.from(links), {
          opacity   : [0, 1],
          translateY: [12, 0],
          duration  : 700,
          ease      : EASE,
          delay     : stagger(90),
          onComplete: () => links.forEach((el) => { el.style.willChange = "auto"; }),
        });
      }, 0.2);
    }
  }, []);

  return (
    /*
     * SectionWrapper provides py-24 (96px) — no custom padding override needed.
     * border-t gives a faint horizontal rule that closes the content above.
     * No min-h-screen — height is purely content-driven.
     */
    <SectionWrapper id="contact" className="border-t border-white/[0.06]">
      <div className="text-center flex flex-col items-center">

        <p
          ref={labelRef}
          className="text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-600 mb-6"
        >
          Contact
        </p>

        <AnimatedHeading className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-100 mb-4 md:mb-5">
          Let's build something meaningful.
        </AnimatedHeading>

        <p className="text-sm md:text-base text-zinc-600 mb-8 md:mb-10 max-w-xs sm:max-w-sm leading-relaxed">
          Open to internships, collaborations, and real-world problem solving.
        </p>

        {/* Equal-weight link row — stacks on mobile */}
        <div
          ref={linksRef}
          className="flex flex-row items-center gap-6 sm:gap-10"
        >
          {contactLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              data-contact-link
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="group flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-100 transition-colors duration-200"
            >
              <Icon
                size={15}
                strokeWidth={1.5}
                className="transition-colors duration-200 group-hover:text-accent"
              />
              <span className="border-b border-transparent group-hover:border-zinc-700 transition-colors duration-200 pb-px">
                {label}
              </span>
            </a>
          ))}
        </div>

        {/*
         * Visual closure — a short centered gradient rule.
         * Acts as a quiet full-stop before the footer.
         * Fades in with the section (SectionWrapper handles the reveal).
         */}
        <div
          aria-hidden="true"
          className="mt-14 w-16 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(63,63,70,0.6), transparent)",
          }}
        />
      </div>
    </SectionWrapper>
  );
}
