import { AlignJustify } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";
import { navigationItems } from "./Navbar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={(state) => setOpen(state)}>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <AlignJustify className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[50%] outline-none border-none backdrop-blur-none bg-primary-foreground/30">
        <div className="mt-7 flex px-1 space-y-1 flex-col">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                pathname === item.href
                  ? "bg-muted"
                  : "hover:bg-muted hover:bg-opacity-80",
                "group flex items-center px-2 py-2 text-sm font-semibold rounded-md"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
