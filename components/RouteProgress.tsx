"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Slim top progress bar that fires on every route change, so navigation always
 * has a visible cue and never feels like it's hanging.
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const t = window.setTimeout(() => setActive(false), 620);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={pathname}
          className="fixed left-0 top-0 z-[150] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_rgba(245,246,247,0.6)]"
          initial={{ width: "0%", opacity: 1 }}
          animate={{ width: "100%" }}
          exit={{ opacity: 0 }}
          transition={{
            width: { duration: 0.55, ease: EASE },
            opacity: { duration: 0.3 },
          }}
        />
      )}
    </AnimatePresence>
  );
}
