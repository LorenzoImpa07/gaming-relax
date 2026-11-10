"use client";

import { useEffect, useState } from "react";

/** Soft radial spotlight that follows the cursor (desktop). */
export function HeroSpotlight({ className = "" }: { className?: string }) {
  const [pos, setPos] = useState({ x: 50, y: 40 });
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPos({ x, y });
      setOn(true);
    };
    const leave = () => setOn(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
        on ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{
        background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, rgba(167,139,250,0.18), transparent 45%)`,
      }}
      aria-hidden
    />
  );
}
