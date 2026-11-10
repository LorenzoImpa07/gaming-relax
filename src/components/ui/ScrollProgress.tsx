"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] h-[2.5px] origin-left bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 shadow-[0_0_14px_rgba(167,139,250,0.85)]"
      style={{ scaleX }}
    />
  );
}
