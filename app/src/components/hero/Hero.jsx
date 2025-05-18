"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Authenticate from "../auth/authenticate/Authenticate";

export default function Hero() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stage, setStage] = useState(-1);

  const stage0Ref = useRef(null);
  const stage1Ref = useRef(null);
  const stage2Ref = useRef(null);

  // Redirect if session exists
  useEffect(() => {
    if (session) {
      router.push("/learn");
    }
  }, [session, router]);

  useEffect(() => {
    if (session) return;

    let timer;
    if (stage === -1) {
      timer = setTimeout(() => setStage(0), 0);
    } else if (stage === 0) {
      timer = setTimeout(() => setStage(1), 3000);
    } else if (stage === 1) {
      timer = setTimeout(() => setStage(2), 5000);
    }
    return () => clearTimeout(timer);
  }, [stage, session]);

  // Animate stage visibility
  useLayoutEffect(() => {
    const tl = gsap.timeline();

    // Fade out all stages first
    tl.to([stage0Ref.current, stage1Ref.current, stage2Ref.current], {
      opacity: 0,
      y: -20,
      scale: 0.9,
      pointerEvents: "none",
      duration: 0.4,
      ease: "power1.inOut",
    });

    // Fade in active stage
    let activeStageRef = null;
    if (stage === 0) activeStageRef = stage0Ref.current;
    else if (stage === 1) activeStageRef = stage1Ref.current;
    else if (stage === 2 && !session) activeStageRef = stage2Ref.current;

    if (activeStageRef) {
      tl.to(
        activeStageRef,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: "auto",
          duration: 0.8,
          ease: "power3.out",
        },
        "+=0.1"
      );
    }

    return () => {
      tl.kill();
    };
  }, [stage, session]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-12 text-center">
      <div className="flex flex-1 flex-col justify-center items-center w-full max-w-5xl relative">
        {/* Stage 0 */}
        <div
          ref={stage0Ref}
          style={{ opacity: 0, position: "absolute", width: "100%" }}
          className="flex flex-col items-center space-y-6 pointer-events-none"
        >
          <img
            src="/mascot/face.svg"
            alt="Face"
            width={250}
            height={250}
            draggable={false}
            className="select-none"
          />
          <h1 className="text-7xl font-extrabold text-white select-none">
            SCAMZAP
          </h1>
        </div>

        {/* Stage 1 */}
        <div
          ref={stage1Ref}
          style={{ opacity: 0, position: "absolute", width: "100%" }}
          className="flex flex-col items-center space-y-6 pointer-events-none"
        >
          <img
            src="/mascot/smirk.svg"
            alt="Mascot Smirk"
            width={250}
            height={250}
            draggable={false}
            className="select-none"
          />
          <p className="whitespace-pre-line text-2xl leading-relaxed max-w-xl text-white select-none">
            {"A simple, safe,\nand fun way\nto learn about\ntoday’s scams"}
          </p>
        </div>

        {/* Stage 2 */}
        {!session && (
          <div
            ref={stage2Ref}
            style={{ opacity: 0, position: "absolute", width: "100%" }}
            className="p-12 bg-[#164A78cc] backdrop-blur-lg rounded-3xl shadow-2xl space-y-8 flex flex-col items-center justify-center max-w-2xl mx-auto pointer-events-none"
          >
            <img
              src="/mascot/smile.svg"
              alt="Mascot Smile"
              width={250}
              height={250}
              draggable={false}
              className="select-none"
            />
            <div className="flex justify-center w-full">
              <Authenticate />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
