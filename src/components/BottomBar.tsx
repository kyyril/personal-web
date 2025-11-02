"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggler from "./ThemeToggle";
import Image from "next/image";
import {
  ChatBubbleIcon,
  CodeIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { motion } from "framer-motion";

export const navigationItems = [
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
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[330px] bg-background/30 backdrop-blur-xl supports-[backdrop-filter]:bg-background/30 z-50 rounded-lg">
        <div className="flex justify-around items-center py-3 px-2">
          <Link href="/" className="relative group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Image
                src="/assets/profile.webp"
                alt="Profile"
                width={24}
                height={24}
                quality={100}
                className={`rounded-full border-spacing-3 transition-all duration-300 ${
                  pathname === "/"
                    ? "ring-2 ring-custom"
                    : "ring-2 ring-primary/10"
                }`}
              />
            </motion.div>
          </Link>
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
            </Link>
          ))}
        </div>
      </div>
      {/* Theme Toggler */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="fixed top-2 right-2 z-50"
      >
        <ThemeToggler />
      </motion.div>
      {/* Bottom Spacer */}
      <div className="h-12" /> {/* Increased height for bottom margin */}
    </>
  );
}
