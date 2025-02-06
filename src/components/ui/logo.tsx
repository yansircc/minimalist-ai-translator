"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LogoProps {
  onReset: () => void;
  shouldAnimate: boolean;
}

export function Logo({ onReset, shouldAnimate }: LogoProps) {
  return (
    <button
      onClick={onReset}
      className="fixed left-1/2 top-4 -translate-x-1/2 transform rounded-full transition-opacity hover:opacity-80"
      title="Clear and start new translation"
      data-test="app-logo"
    >
      <motion.div
        animate={
          shouldAnimate
            ? {
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
              }
            : { rotate: 0, scale: 1 }
        }
        transition={{
          duration: 1,
          repeat: 0,
        }}
        data-test="logo-motion"
      >
        <Image
          src="/logo.png"
          alt="Translator Logo"
          width={36}
          height={36}
          className="rounded-full transition-transform hover:rotate-12"
          priority
          data-test="logo-image"
        />
      </motion.div>
    </button>
  );
}
