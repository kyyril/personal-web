"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggler from "./ThemeToggle";
import Image from "next/image";
import {
  ChatBubbleIcon,
  CodeIcon,
  FileTextIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { m } from "framer-motion";

export const navigationItems = [
  { name: "Projects", href: "/projects", icon: CodeIcon },
  { name: "Blog", href: "/blog", icon: FileTextIcon },
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
      <m.nav
        id="navigation"
        role="navigation"
        aria-label="Main navigation"
        className="fixed bottom-6 w-[300px] inset-x-0 mx-auto bg-background/10 backdrop-blur-sm supports-[backdrop-filter]:bg-background/50 z-50 rounded"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 17, delay: 0.2 }}
      >
        <ul className="flex justify-around items-center py-3 px-2 m-0 p-0 list-none w-full">
          <li>
            <Link
              href="/"
              className="relative group block"
              aria-label="Navigate to home page"
              aria-current={pathname === "/" ? "page" : undefined}
            >
              <m.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Image
                  src="/assets/profile.webp"
                  alt="Profile"
                  width={28}
                  height={28}
                  quality={100}
                  className={`rounded-full border-spacing-3 transition-all w-6 h-6 duration-300 object-cover  ${pathname === "/"
                    ? "ring-1 ring-custom"
                    : "ring-1 ring-primary/10"
                    }`}
                />
              </m.div>
            </Link>
          </li>
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="relative group flex flex-col items-center gap-1"
                aria-label={`Navigate to ${item.name} page`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors ${isActive(item.href)
                    ? "text-custom"
                    : "group-hover:text-custom/80"
                    }`}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </m.nav>
      {/* Theme Toggler */}
      <m.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="fixed top-2 right-2 z-50"
      >
        <ThemeToggler />
      </m.div>
      {/* Bottom Spacer */}
      <div className="h-12" /> {/* Increased height for bottom margin */}
    </>
  );
}
