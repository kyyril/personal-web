"use client";

import React, { useEffect, useState } from "react";
import { RefObject } from "react";

interface ReadingProgressBarProps {
  targetRef?: RefObject<HTMLElement>;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ targetRef }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      let targetElement: HTMLElement | null = null;
      
      if (targetRef?.current) {
        // Use the target element if provided
        targetElement = targetRef.current;
      } else {
        // Fallback to comments section if no target provided
        targetElement = document.getElementById("comments-section") ||
                        document.querySelector('[data-comments-section]') as HTMLElement ||
                        document.documentElement;
      }

      if (!targetElement) return;

      const targetRect = targetElement.getBoundingClientRect();
      const targetTop = targetRect.top + window.pageYOffset;
      const targetHeight = targetElement.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate progress from the start of the page to when the target element is fully visible
      const maxScrollTop = targetTop + targetHeight - viewportHeight;
      const currentScrollTop = scrollTop;
      
      // Calculate progress as a percentage
      const newProgress = Math.min((currentScrollTop / maxScrollTop) * 100, 100);
      setProgress(Math.max(newProgress, 0)); // Ensure progress doesn't go below 0
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetRef]);

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