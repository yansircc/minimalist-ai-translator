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
      <div className="relative">
        {/* Loading ring animation */}
        {shouldAnimate && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-300 dark:border-t-zinc-600"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: "44px",
              height: "44px",
              margin: "-4px",
            }}
            data-test="logo-motion"
          />
        )}
        {/* Logo with success shake animation */}
        <motion.div
          animate={
            shouldAnimate
              ? { scale: 1 }
              : {
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
                }
          }
          transition={{
            duration: 1,
            repeat: 0,
          }}
        >
          <Image
            src="/logo.png"
            alt="Translator Logo"
            width={36}
            height={36}
            className="rounded-full"
            priority
            data-test="logo-image"
          />
        </motion.div>
      </div>
    </button>
  );
}
