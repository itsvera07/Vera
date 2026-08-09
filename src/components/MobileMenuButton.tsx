"use client";

import { useState } from "react";
import { Menu } from "@/lib/icons";
import { MobileNavDrawer } from "./MobileNavDrawer";

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button aria-label="Menu" onClick={() => setOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5 lg:hidden">
        <Menu size={20} />
      </button>
      <MobileNavDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
