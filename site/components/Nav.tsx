"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS, CTA } from "@/lib/site";
import Logo from "./Logo";

const EASE = [0.22, 1, 0.36, 1] as const;

const PREVIEW: Record<string, string> = {
  "/about": "/art/nebula-dual.svg",
  "/manifesto": "/art/nebula-dual.svg",
  "/capabilities": "/art/field-teal.svg",
  "/products": "/art/field-amber.svg",
  "/work": "/art/corridor.svg",
  "/lab": "/art/sig-03.svg",
  "/founders": "/art/sig-01.svg",
  "/partners": "/art/chrome-macro.svg",
  "/contact": "/art/sig-04.svg",
};

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState(NAV_LINKS[0].href);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Backdrop fades in smoothly on scroll — no popping border */}
        <div
          className={`absolute inset-0 border-b border-white/10 bg-midnight/70 backdrop-blur-xl transition-opacity duration-500 ${
            scrolled && !open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="relative mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
          <Link href="/" aria-label="Astralyn — home" className="group">
            <Logo markClass="h-6 w-auto transition-transform duration-500 group-hover:scale-105 md:h-7" />
          </Link>

          <div className="flex items-center gap-6">
            <span className="hidden lg:inline-flex">
              <Link href={CTA.href} className="btn-core">
                Start Something
              </Link>
            </span>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="group flex h-10 w-10 flex-col items-center justify-center gap-[7px]"
            >
              <span
                className={`block h-px w-7 bg-white transition-all duration-500 ${
                  open ? "translate-y-1 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-7 bg-white transition-all duration-500 ${
                  open ? "-translate-y-1 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-midnight/95 px-6 backdrop-blur-2xl md:px-12"
          >
            <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="label mb-8">Navigation</p>
                <ul className="space-y-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: EASE }}
                      onMouseEnter={() => setHover(link.href)}
                    >
                      <Link
                        href={link.href}
                        className={`group flex items-baseline gap-4 py-1 transition-colors duration-500 ${
                          pathname === link.href ? "text-white" : "text-silver hover:text-white"
                        }`}
                      >
                        <span className="font-mono text-xs text-steel">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="display text-4xl md:text-6xl">
                          {link.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mt-12"
                >
                  <Link href={CTA.href} className="btn-core btn-solid">
                    {CTA.label}
                  </Link>
                </motion.div>
              </div>

              {/* Hover preview — the menu shows where you're headed */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
                className="img-frame hidden aspect-[4/5] w-full md:block"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={hover}
                    src={PREVIEW[hover] ?? "/art/nebula-dual.svg"}
                    alt=""
                    aria-hidden
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="cap">
                  <p className="font-mono text-[0.6rem] tracking-[0.3em] text-white/70 uppercase">
                    {NAV_LINKS.find((l) => l.href === hover)?.label}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
