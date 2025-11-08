"use client";

import React, { useEffect, useState } from "react";

export const ReadingProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const newProgress = Math.min((scrollTop / scrollHeight) * 100, 100);
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="w-full bg-secondary h-1">
        <div
          className="bg-primary h-0.5 transition-transform duration-300 ease-out origin-left"
          style={{ transform: `scaleX(${progress / 100})` }}
          id="reading-progress-bar"
        />
      </div>
    </div>
  );
};