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

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

// Function to extract headings from MDX content
function extractHeadingsFromContent(content: string): Heading[] {
  const headings: Heading[] = [];
  const slugCounts: Record<string, number> = {};

  // Handle different line endings (Windows \r\n, Unix \n, old Mac \r)
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    // Check if line is inside a code block (simple heuristic)
    if (line.trim().startsWith("```")) {
      // Logic to skip code blocks could be added here if needed, 
      // but simplistic regex usually avoids code comments if strictly checking for # at start
    }

    // Trim the line to remove any extra whitespace
    const trimmedLine = line.trim();
    // Allow for up to 6 hashes, ensure space after hashes
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();

      // Basic slug generation
      let id = slugify(text);

      // Handle duplicates (github-slugger style)
      if (slugCounts[id]) {
        const count = slugCounts[id];
        slugCounts[id] += 1;
        id = `${id}-${count}`;
      } else {
        slugCounts[id] = 1;
      }

      headings.push({
        id,
        text,
        level,
      });
    }
  }

  return headings;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings?: Heading[];
  content?: string;
  className?: string;
  showProgress?: boolean;
  isMobile?: boolean;
}

export function TableOfContents({
  headings,
  content,
  className,
  showProgress = false,
  isMobile = false,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Extract headings from content if provided, otherwise use headings prop
  const extractedHeadings = content
    ? extractHeadingsFromContent(content)
    : headings || [];

  // Filter out h1 headings from TOC (they're usually the main title)
  const filteredHeadings = extractedHeadings.filter(
    (heading: Heading) => heading.level > 1
  );

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
        .map((heading: Heading) => ({
          id: heading.id,
          element: document.getElementById(heading.id),
        }))
        .filter(
          (section: { id: string; element: HTMLElement | null }) =>
            section.element
        );

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
        size="icon"
        className="fixed bottom-40 backdrop-blur-sm supports-[backdrop-filter]:bg-primary/50 right-4 md:hidden z-50"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background  shadow-lg">
            <div className="flex items-center justify-between p-4">
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
              "px-2 py-1 rounded",
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
      {/* Full Screen Progress Bar */}
      {showProgress && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm ">
          <div className="w-full bg-secondary h-1">
            <div
              className="bg-primary h-1 transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between px-4 py-1 text-xs text-muted-foreground">
            <span>Reading Progress</span>
            <span>{Math.round(scrollProgress)}%</span>
          </div>
        </div>
      )}

      {/* Desktop TOC */}
      <div
        className={cn(
          "hidden md:block shadow-md sticky top-32 w-64 max-h-[calc(100vh-8rem)] bg-background p-4",
          className
        )}
      >
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
