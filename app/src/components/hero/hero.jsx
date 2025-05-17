"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Face from "./images/face.svg";
import MascotSmirk from "./images/mascot-smirk.svg";
import MascotSmile from "./images/mascot-smile.svg";
import Authenticate from "../auth/authenticate/Authenticate";

const getFadeVariants = (stage) => ({
  initial: { opacity: 0, y: 20, scale: 0.8 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: stage < 2 ? 0.7 : 0.9,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
});

export default function Hero() {
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    let timer;
    if (stage === -1) {
      timer = setTimeout(() => setStage(0), 1000);
    } else if (stage === 0) {
      timer = setTimeout(() => setStage(1), 2000);
    } else if (stage === 1) {
      timer = setTimeout(() => setStage(2), 4000);
    }
    return () => clearTimeout(timer);
  }, [stage]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 text-center">
      <div className="flex flex-1 flex-col justify-center items-center w-full">
        <AnimatePresence mode="wait" initial={false}>
          {stage === 0 && (
            <motion.div
              key="stage0"
              variants={getFadeVariants(0)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4 flex flex-col items-center justify-center"
            >
              <Image src={Face} alt="Face" width={150} height={150} />
              <h1 className="text-4xl font-bold">SCAMZAP</h1>
            </motion.div>
          )}

          {stage === 1 && (
            <motion.div
              key="stage1"
              variants={getFadeVariants(1)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4 flex flex-col items-center justify-center"
            >
              <Image
                src={MascotSmirk}
                alt="Mascot Smirk"
                width={150}
                height={150}
              />
              <p className="whitespace-pre-line text-lg leading-relaxed">
                {
                  "A simple, safe, \nand fun way\nto learn about \ntoday’s scams"
                }
              </p>
            </motion.div>
          )}

          {stage === 2 && (
            <motion.div
              key="stage2"
              variants={getFadeVariants(2)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4 flex flex-col items-center justify-center"
            >
              <Image
                src={MascotSmile}
                alt="Mascot Smile"
                width={150}
                height={150}
              />
              <div className="flex justify-center">
                <Authenticate />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
