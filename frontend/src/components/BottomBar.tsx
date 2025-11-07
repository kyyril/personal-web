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
      <motion.nav
        id="navigation"
        role="navigation"
        aria-label="Main navigation"
        className="fixed bottom-6 w-[300px] inset-x-0 mx-auto bg-background/90 backdrop-blur-sm supports-[backdrop-filter]:bg-background/90 z-50 rounded"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 17, delay: 0.2 }}
      >
        <div className="flex justify-around items-center py-3 px-2">
          <Link
            href="/"
            className="relative group"
            aria-label="Navigate to home page"
            aria-current={pathname === "/" ? "page" : undefined}
          >
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
                className={`rounded-full border-spacing-3 transition-all w-6 h-6 duration-300 object-cover  ${
                  pathname === "/"
                    ? "ring-1 ring-custom"
                    : "ring-1 ring-primary/10"
                }`}
              />
            </motion.div>
          </Link>
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative group flex flex-col items-center gap-1"
              aria-label={`Navigate to ${item.name} page`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  isActive(item.href)
                    ? "text-custom"
                    : "group-hover:text-custom/80"
                }`}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </motion.nav>
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
