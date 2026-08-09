"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

// Distinct 3D-leaning entrance styles — deliberately just a handful, each
// assigned to a different page/section, rather than every card in the app
// doing the same fade-up. Keep this list short; the point is variety
// between sections, not a showcase of every possible effect on one screen.
const VARIANTS: Record<string, Variants> = {
  // Home topic cards — a slight 3D flip up, like a tile settling into place
  flip: {
    hidden: { opacity: 0, rotateX: -35, y: 20, transformPerspective: 600 },
    visible: { opacity: 1, rotateX: 0, y: 0 },
  },
  // Story cards — tilts in from the side with depth, like a card being dealt
  tiltIn: {
    hidden: { opacity: 0, rotateY: 25, x: -18, transformPerspective: 700 },
    visible: { opacity: 1, rotateY: 0, x: 0 },
  },
  // Chat theme chips / My Space tiles — pops forward out of the page
  depth: {
    hidden: { opacity: 0, scale: 0.85, z: -40 },
    visible: { opacity: 1, scale: 1, z: 0 },
  },
  // Lesson content blocks, list rows — simple rise, no rotation (keeps
  // long reading flows calm instead of everything having motion)
  rise: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  },
};

export function ScrollReveal({ children, delay = 0, variant = "rise", className = "" }: { children: ReactNode; delay?: number; variant?: keyof typeof VARIANTS; className?: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={VARIANTS[variant]} transition={{ type: "spring", stiffness: 260, damping: 24, delay }} style={{ transformStyle: "preserve-3d" }} className={className}>
      {children}
    </motion.div>
  );
}
