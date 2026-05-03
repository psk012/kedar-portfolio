"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  href?: string;
  index?: number;
}

export default function ProjectCard({
  title,
  description,
  tags,
  image,
  href = "#",
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group relative flex flex-col glass rounded-xl overflow-hidden hover:border-zinc-700/50 transition-all duration-300 cursor-pointer"
    >
      {image && (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-70 group-hover:opacity-90 transition-all duration-500 grayscale group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium tracking-widest uppercase text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-medium text-zinc-100 mb-1 group-hover:text-white transition-colors">
              {title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
          </div>
          <ArrowUpRight
            size={16}
            className="text-zinc-600 group-hover:text-zinc-300 transition-all duration-200 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </motion.a>
  );
}
