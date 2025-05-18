"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Authenticate from "../auth/authenticate/Authenticate";

const getFadeVariants = (stage) => ({
  initial: { opacity: 0, y: 30, scale: 0.85 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: stage < 2 ? 0.75 : 0.95,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
});

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
      timer = setTimeout(() => setStage(0), 1000);
    } else if (stage === 0) {
      timer = setTimeout(() => setStage(1), 2000);
    } else if (stage === 1) {
      timer = setTimeout(() => setStage(2), 4000);
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
              variants={getFadeVariants(0)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8 flex flex-col items-center justify-center"
            >
              <img src="/mascot/face.svg" alt="Face" width={250} height={250} />
              <h1 className="text-7xl font-extrabold">SCAMZAP</h1>
            </motion.div>
          )}

          {stage === 1 && (
            <motion.div
              key="stage1"
              variants={getFadeVariants(1)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8 flex flex-col items-center justify-center"
            >
              <img
                src="/mascot/smirk.svg"
                alt="Mascot Smirk"
                width={250}
                height={250}
              />
              <p className="whitespace-pre-line text-2xl leading-relaxed max-w-xl">
                {
                  "A simple, safe, \nand fun way\nto learn about \ntoday’s scams"
                }
              </p>
            </motion.div>
          )}

          {stage === 2 && !session && (
            <motion.div
              key="stage2"
              variants={getFadeVariants(2)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-10 sm:p-12 md:p-16 bg-[#164A78] backdrop-blur-md rounded-2xl shadow-xl space-y-8 flex flex-col items-center justify-center max-w-2xl w-full"
            >
              <img
                src="/mascot/smile.svg"
                alt="Mascot Smile"
                width={250}
                height={250}
              />
              <div className="flex justify-center w-full">
                <Authenticate />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
