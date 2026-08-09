"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Compass, BookOpen, MessageCircle, User, X } from "@/lib/icons";
import { Logo } from "./Header";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Explore", icon: Compass },
  { href: "/stories", label: "Stories", icon: BookOpen },
  { href: "/chat", label: "Chat Library", icon: MessageCircle },
  { href: "/my-space", label: "My Space", icon: User },
];

export function MobileNavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && [
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          // Inline style instead of a Tailwind opacity-color utility — this
          // is guaranteed to render regardless of how the custom color
          // tokens get compiled, which is what was going wrong before.
          style={{ backgroundColor: "rgba(26, 26, 46, 0.45)" }}
          className="fixed inset-0 z-[60] lg:hidden"
        />,
        <motion.div
          key="drawer"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          // Same here — a solid, guaranteed-opaque background rather than a
          // Tailwind color utility that turned out to render transparent.
          style={{ backgroundColor: "#FBF7EF" }}
          className="fixed top-0 left-0 bottom-0 w-[78%] max-w-[300px] z-[70] lg:hidden px-5 py-6 shadow-lift flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <Logo className="text-2xl" />
            <button aria-label="Close menu" onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-card">
              <X size={16} />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {LINKS.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05, type: "spring", stiffness: 300, damping: 24 }}>
                  <Link href={link.href} onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold text-ink transition-colors duration-200 hover:bg-white">
                    <Icon size={19} className="text-brand-orange" />
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-2">
            <Link href="/login" onClick={onClose} className="text-center border border-ink/20 font-semibold rounded-pill px-4 py-2.5 text-sm">
              Log In
            </Link>
            <Link href="/signup" onClick={onClose} className="text-center bg-brand-green text-white font-semibold rounded-pill px-4 py-2.5 text-sm">
              Create Account
            </Link>
          </div>
        </motion.div>,
      ]}
    </AnimatePresence>
  );
}
