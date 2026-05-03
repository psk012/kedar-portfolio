"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface FeaturedProjectProps {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  href?: string;
}

export default function FeaturedProject({
  title,
  description,
  tags,
  image,
  href = "#",
}: FeaturedProjectProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="group relative flex flex-col glass rounded-xl overflow-hidden hover:border-zinc-700/50 transition-all duration-300 cursor-pointer mb-8"
    >
      {image && (
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-70 group-hover:opacity-90 transition-all duration-500 grayscale group-hover:grayscale-0"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <div className="p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium tracking-widest uppercase text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-start justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-medium text-zinc-100 mb-3 group-hover:text-white transition-colors">
              {title}
            </h3>
            <p className="text-base text-zinc-500 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
          <ArrowUpRight
            size={20}
            className="text-zinc-600 group-hover:text-zinc-300 transition-all duration-200 flex-shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </motion.a>
  );
}
