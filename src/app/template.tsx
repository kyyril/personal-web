"use client";

import { motion } from "framer-motion";

export default function Transition({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.75 }}
    >
      {children}
    </motion.div>
    // Add the necessary motion.div component to transition the children elements
  );
}
