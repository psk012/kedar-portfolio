"use client";

import { useRef, useEffect } from "react";
import SectionWrapper from "@/app/components/SectionWrapper";
import AnimatedHeading from "@/app/components/AnimatedHeading";
import {
  Code2,
  Globe,
  Server,
  Database,
  GitBranch,
  Terminal,
  Send,
  Cloud,
  Shield,
  Network,
  Brain,
  Lock,
} from "lucide-react";
import SkillItem from "@/app/components/SkillItem";
import { onceInView, animate, stagger, EASE } from "@/app/lib/animations";

const skillGroups = [
  {
    category: "Languages & Tech",
    skills: [
      { label: "JavaScript", icon: Code2 },
      { label: "Python", icon: Terminal },
      { label: "React", icon: Globe },
      { label: "Node.js / Express", icon: Server },
      { label: "MongoDB", icon: Database },
      { label: "Tailwind CSS", icon: Code2 },
    ],
  },
  {
    category: "Tools",
    skills: [
      { label: "Git / GitHub", icon: GitBranch },
      { label: "Postman", icon: Send },
      { label: "Vercel", icon: Cloud },
      { label: "Render", icon: Cloud },
    ],
  },
  {
    category: "Concepts",
    skills: [
      { label: "REST API Design", icon: Network },
      { label: "Authentication (JWT / OTP)", icon: Lock },
      { label: "AES Encryption", icon: Shield },
      { label: "NLP Pipelines", icon: Brain },
      { label: "Backend Architecture", icon: Server },
    ],
  },
];

export default function Skills() {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const groupRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    // ── "Capabilities" label ──────────────────────────────
    const label = labelRef.current;
    if (label) {
      label.style.opacity = "0";
      onceInView(label, () => {
        animate(label, { opacity: [0, 1], duration: 600, ease: EASE });
      }, 0.5);
    }

    // ── Group category labels ─────────────────────────────
    const groupEls = groupRefs.current.filter(Boolean) as HTMLParagraphElement[];
    groupEls.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
    });

    if (groupEls.length) {
      onceInView(groupEls[0], () => {
        animate(groupEls, {
          opacity: [0, 1],
          translateY: [8, 0],
          duration: 600,
          ease: EASE,
          delay: stagger(80),
        });
      }, 0.1);
    }
  }, []);

  return (
    <SectionWrapper id="skills" className="border-t border-white/[0.08]">
      <p
        ref={labelRef}
        className="text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-600 mb-6"
      >
        Capabilities
      </p>

      <AnimatedHeading className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-zinc-100 mb-16">
        Stack & Skills
      </AnimatedHeading>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {skillGroups.map((group, gi) => (
          <div key={group.category}>
            <p
              ref={(el) => { groupRefs.current[gi] = el; }}
              className="text-[10px] font-medium tracking-[0.15em] uppercase text-zinc-600 mb-6"
            >
              {group.category}
            </p>
            <div className="flex flex-col gap-3">
              {group.skills.map((skill, si) => (
                <SkillItem
                  key={skill.label}
                  label={skill.label}
                  icon={skill.icon}
                  index={gi * 6 + si}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
