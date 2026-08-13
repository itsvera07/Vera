"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";

const MotionLink = motion.create(Link);

export function TiltLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Only devices with a real mouse get the 3D tilt-follow — on touch
  // screens, tap events can fire a synthetic "mouse moved" right before the
  // click registers, causing a brief unwanted tilt-flash on every tap. This
  // check keeps mobile taps clean and simple instead.
  const [supportsHover, setSupportsHover] = useState(false);
  useEffect(() => {
    setSupportsHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const springConfig = { stiffness: 220, damping: 22, mass: 0.3 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    if (!supportsHover) return;
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
    <MotionLink href={href} ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={supportsHover ? { rotateX, rotateY, transformPerspective: 800 } : undefined} whileHover={supportsHover ? { scale: 1.015, transition: { type: "spring", stiffness: 320, damping: 22 } } : undefined} whileTap={{ scale: 0.97, transition: { duration: 0.1 } }} className={`block will-change-transform ${className}`}>
      {children}
    </MotionLink>
  );
}
