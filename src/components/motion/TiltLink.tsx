"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";

// Wrapping Link this way (instead of the old legacyBehavior + nested <a>
// pattern) is what current React/Next want: Link forwards its ref straight
// to the underlying anchor, so motion() can animate it directly.
const MotionLink = motion.create(Link);

export function TiltLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.4 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig);

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <MotionLink href={href} ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformPerspective: 800 }} whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }} whileTap={{ scale: 0.95, rotateX: 4, transition: { type: "spring", stiffness: 400, damping: 15 } }} className={`block will-change-transform ${className}`}>
      {children}
    </MotionLink>
  );
}
