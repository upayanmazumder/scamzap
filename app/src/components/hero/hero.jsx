"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Authenticate from "../auth/authenticate/Authenticate";

const containerVariants = {
  initial: { opacity: 0, y: 40, scale: 0.85 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    scale: 0.9,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const childFadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

export default function Hero() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    if (session) {
      router.push("/learn");
      return;
    }

    let timer;
    if (stage === -1) {
      timer = setTimeout(() => setStage(0), 0);
    } else if (stage === 0) {
      timer = setTimeout(() => setStage(1), 3000);
    } else if (stage === 1) {
      timer = setTimeout(() => setStage(2), 5000);
    }
    return () => clearTimeout(timer);
  }, [stage, session, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-12 text-center">
      <div className="flex flex-1 flex-col justify-center items-center w-full max-w-5xl">
        <AnimatePresence mode="wait" initial={false}>
          {stage === 0 && (
            <motion.div
              key="stage0"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center space-y-6"
            >
              <motion.img
                src="/mascot/face.svg"
                alt="Face"
                width={250}
                height={250}
                variants={childFadeUp}
                draggable={false}
              />
              <motion.h1
                className="text-7xl font-extrabold text-white select-none"
                variants={childFadeUp}
              >
                SCAMZAP
              </motion.h1>
            </motion.div>
          )}

          {stage === 1 && (
            <motion.div
              key="stage1"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center space-y-6"
            >
              <motion.img
                src="/mascot/smirk.svg"
                alt="Mascot Smirk"
                width={250}
                height={250}
                variants={childFadeUp}
                draggable={false}
              />
              <motion.p
                className="whitespace-pre-line text-2xl leading-relaxed max-w-xl text-white select-none"
                variants={childFadeUp}
              >
                {"A simple, safe,\nand fun way\nto learn about\ntoday’s scams"}
              </motion.p>
            </motion.div>
          )}

          {stage === 2 && !session && (
            <motion.div
              key="stage2"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-12 bg-[#164A78cc] backdrop-blur-lg rounded-3xl shadow-2xl space-y-8 flex flex-col items-center justify-center max-w-2xl w-full"
            >
              <motion.img
                src="/mascot/smile.svg"
                alt="Mascot Smile"
                width={250}
                height={250}
                variants={childFadeUp}
                draggable={false}
              />
              <motion.div
                className="flex justify-center w-full"
                variants={childFadeUp}
              >
                <Authenticate />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
