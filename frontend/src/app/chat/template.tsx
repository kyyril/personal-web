"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Transition({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    // Scroll to top when navigating to this page
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ ease: "easeInOut", duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
