"use client";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center p-3"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="text-4xl font-bold mb-4">404 Not Found</h1>
      <p className="mb-6 text-lg text-gray-600">
        The page you are looking for does not exist!
      </p>
      <motion.img
        src="/mascot/expressionless.svg"
        alt="Not Found Image"
        className=" max-w-xs"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
    </motion.div>
  );
}
