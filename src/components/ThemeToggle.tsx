"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

export default function ThemeToggler() {
  const { theme, setTheme, resolvedTheme } = useTheme(); // Use resolvedTheme to ensure the theme is correctly detected
  const [mounted, setMounted] = React.useState(false);

  // Only render the icons when the component has mounted
  React.useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!mounted) {
    return null; // Prevent rendering until the theme has been resolved
  }

  return (
    <Button
      className="rounded-full hover:bg-transparent"
      variant={"ghost"}
      size="icon"
      onClick={toggleTheme}
    >
      <SunIcon
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-1000 ${
          resolvedTheme === "dark"
            ? "rotate-0 scale-0 "
            : "rotate-0 scale-100 animate-bounce"
        }`}
      />
      <MoonIcon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-1000 ${
          resolvedTheme === "light"
            ? "rotate-90 scale-0"
            : "rotate-0 scale-100 animate-bounce"
        }`}
      />
    </Button>
  );
}
