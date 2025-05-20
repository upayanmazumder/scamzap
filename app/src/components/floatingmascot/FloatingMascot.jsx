"use client";

import React from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import Image from "next/image";

export const FloatingMascot = () => {
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const rotate = useMotionValue(0);

  const smoothY = useSpring(y, { stiffness: 20, damping: 10 });
  const smoothX = useSpring(x, { stiffness: 20, damping: 10 });
  const smoothRotate = useSpring(rotate, { stiffness: 20, damping: 10 });

  useAnimationFrame((t) => {
    y.set(Math.sin(t / 1000) * 20);
    x.set(Math.cos(t / 1200) * 10);
    rotate.set(Math.sin(t / 1500) * 2);
  });

  return (
    <motion.div
      style={{
        y: smoothY,
        x: smoothX,
        rotate: smoothRotate,
      }}
    >
      <Image
        src="/mascot/full.webp"
        alt="Mascot"
        width={360}
        height={388}
        className="object-contain max-h-full max-w-full"
        priority
      />
    </motion.div>
  );
};
