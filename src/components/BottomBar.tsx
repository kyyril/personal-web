"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggler from "./ThemeToggle";
import Image from "next/image";
import {
  ChatBubbleIcon,
  CodeIcon,
  PaperPlaneIcon,
  HomeIcon,
} from "@radix-ui/react-icons";

export const navigationItems = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Projects", href: "/projects", icon: CodeIcon },
  { name: "GuestBooks", href: "/guestbook", icon: PaperPlaneIcon },
  { name: "Chat", href: "/chat", icon: ChatBubbleIcon },
];

export function Navigation() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[340px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 z-50 rounded-2xl">
        <div className="flex justify-around items-center py-3 px-5">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative group flex flex-col items-center gap-1"
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  isActive(item.href)
                    ? "text-custom"
                    : "group-hover:text-custom/80"
                }`}
              />
              {/* Hover tooltip */}
              <span className="absolute -top-8 scale-0 transition-all rounded bg-custom/90 p-2 text-xs text-white group-hover:scale-100">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      {/* Settings Button - Fixed to top right */}
      <div className="fixed top-2 right-2 z-50">
        <ThemeToggler />
      </div>
      {/* Bottom Spacer */}
      <div className="h-12" /> {/* Increased height for bottom margin */}
    </>
  );
}
