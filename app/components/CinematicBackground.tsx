"use client";

/**
 * CinematicBackground
 * -------------------
 * Global fixed video layer that persists across ALL page sections.
 *
 * Z-index stack (bottom → top):
 *   #0a0a0a page canvas  (html background — body is transparent)
 *   z = -1  video layer  (this component — fixed, full page)
 *   z = -1  gradient overlay (same stacking layer, rendered after video)
 *   z = auto content     (navbar, main, footer — all natural flow)
 *
 * Opacity curve:
 *   scroll 0px    → video 0.38  (hero — strong cinematic presence)
 *   scroll 1500px → video 0.18  (lower sections — recedes, text reads clearly)
 *   Eased by Framer Motion's built-in cubic interpolation.
 *
 * Overlay curve (opposite direction):
 *   scroll 0px    → overlay 0.28 (lighter — video breathes in hero)
 *   scroll 1200px → overlay 0.66 (darker  — protects text in lower sections)
 */

import { useScroll, useTransform, motion } from "framer-motion";

export default function CinematicBackground() {
  // useScroll() with no target tracks the entire document scroll (window)
  const { scrollY } = useScroll();

  // Video opacity: strong at top, fades as user scrolls
  // Range: first ~1500px of scroll (≈ 1.5× a 1000px viewport)
  const videoOpacity = useTransform(scrollY, [0, 1500], [0.38, 0.18]);

  // Gradient overlay: lightens hero, darkens lower sections for readability
  const overlayOpacity = useTransform(scrollY, [0, 1200], [0.28, 0.66]);

  return (
    <>
      {/* ── Video layer ─────────────────────────────────────────── */}
      {/*
        position: fixed + z-index: -1 works here because:
        - html element has background-color: #0a0a0a (the page canvas)
        - body has background: transparent
        - z=-1 fixed elements sit between the html canvas and body content
        See: globals.css + layout.tsx for the html/body split.
      */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: -1 }}
      >
        <motion.div
          style={{ opacity: videoOpacity }}
          className="absolute inset-0"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: "brightness(0.65) contrast(0.9) saturate(0.75)",
            }}
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>

      {/* ── Global gradient overlay ──────────────────────────────── */}
      {/*
        This is the "readability layer" — it darkens as you scroll past
        the hero, ensuring text always reads cleanly over the video
        regardless of section position.
      */}
      <motion.div
        aria-hidden="true"
        style={{
          opacity: overlayOpacity,
          zIndex: -1,
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(10,10,10,0.9) 100%)",
        }}
      />
    </>
  );
}
