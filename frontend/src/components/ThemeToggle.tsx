"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggler() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  if (!mounted) return null; // Prevent rendering until theme is resolved

  return (
    <Button
      className="relative flex items-center justify-center w-10 h-10 rounded hover:bg-transparent"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${
        resolvedTheme === "light" ? "dark" : "light"
      } mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === "light" ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <SunIcon className="w-5 h-5 text-custom-secondary" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MoonIcon className="w-5 h-5 text-custom" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
