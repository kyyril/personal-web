"use client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import ThemeToggler from "./ThemeToggle";

export const navigationItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Guestbooks",
    href: "/guestbook",
  },
  {
    name: "Projects",
    href: "/projects",
  },
];

export function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 max-w-7xl mx-auto px-4 md:px-8 py-3 grid grid-cols-12 outline-none border-none backdrop-blur-sm bg-primary-foreground/0.5">
      <div className="col-span-6 flex md:col-span-3">
        <ThemeToggler />
      </div>
      <div className="hidden sm:flex justify-center items-center col-span-6">
        <NavigationMenu>
          <NavigationMenuList>
            {navigationItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    active={pathname === item.href}
                    className={navigationMenuTriggerStyle()}
                  >
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center justify-end md:col-span-3 col-span-6">
        <div className="sm:hidden">
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
