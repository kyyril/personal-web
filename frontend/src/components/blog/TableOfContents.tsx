"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  List,
  ArrowUp,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  className?: string;
  showProgress?: boolean;
}

export function TableOfContents({
  headings,
  className,
  showProgress = true,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Filter out h1 headings from TOC (they're usually the main title)
  const filteredHeadings = headings.filter((heading) => heading.level > 1);

  // Track scroll progress and active section - MUST be called before any conditional returns
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setScrollProgress(Math.min(progress, 100));

      // Find active section
      const sections = filteredHeadings
        .map((heading) => ({
          id: heading.id,
          element: document.getElementById(heading.id),
        }))
        .filter((section) => section.element);

      let currentActive = "";

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150) {
            // Offset for TOC
            currentActive = section.id;
            break;
          }
        }
      }

      setActiveId(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredHeadings]);

  // Early return - safe because all hooks are called above
  if (filteredHeadings.length === 0) {
    return null;
  }

  // Create hierarchical structure
  const createHierarchy = (headings: Heading[]) => {
    // For simplicity, return filtered headings as flat structure
    // Indentation will be handled in rendering
    return headings;
  };

  const hierarchy = createHierarchy(filteredHeadings);

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed headers
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
    // Close mobile TOC after navigation
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  // Mobile TOC Component
  const MobileTOC = () => (
    <>
      {/* Mobile FAB */}
      <Button
        variant="default"
        size="lg"
        className="fixed bottom-6 right-6 z-50 md:hidden shadow-lg border-2 border-primary"
        onClick={() => setIsMobileOpen(true)}
      >
        <List className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background border-l shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Table of Contents</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-80px)] p-4 pr-2">
              <TocList />
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  );

  // Desktop TOC List Component
  const TocList = () => (
    <nav className="space-y-1">
      {hierarchy.map((heading) => {
        const isActive = activeId === heading.id;
        const isChild = heading.level > 2;

        return (
          <button
            key={heading.id}
            onClick={() => scrollToSection(heading.id)}
            className={cn(
              "w-full text-left text-sm transition-colors hover:text-foreground",
              "px-2 py-1 rounded-md",
              isActive
                ? "text-primary bg-primary/10 font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
            style={{
              paddingLeft: `${(heading.level - 2) * 16 + 8}px`,
            }}
          >
            <span className="line-clamp-2">{heading.text}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop TOC */}
      <div
        className={cn(
          "hidden md:block shadow-md sticky top-24 w-64 max-h-[calc(100vh-6rem)] bg-background p-4",
          className
        )}
      >
        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Reading Progress</span>
              <span>{Math.round(scrollProgress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* TOC Header */}
        <div className="flex items-center gap-2 mb-3">
          <List className="h-4 w-4" />
          <h3 className="font-semibold text-sm">Table of Contents</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-auto"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* TOC Content */}
        {!isCollapsed && (
          <ScrollArea className="h-[calc(100vh-12rem)] pr-2">
            <TocList />
          </ScrollArea>
        )}
      </div>

      {/* Mobile TOC */}
      <MobileTOC />
    </>
  );
}

// Back to top button component
export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      size={"icon"}
      className="fixed bottom-40 border backdrop-blur-sm supports-[backdrop-filter]:bg-primary/50 right-2 md:hidden"
      onClick={scrollToTop}
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}
