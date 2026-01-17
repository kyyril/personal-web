import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "../lib/metadata";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  sticky?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = "",
  sticky = false,
}) => {
  const generateBreadcrumbData = () => {
    const itemsWithPosition = items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `${siteUrl}${item.href}` }),
    }));

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: itemsWithPosition,
    };
  };

  return (
    <div className={sticky ? "sticky top-0 z-40 -mx-4 px-4 md:-mx-16 md:px-16 py-3 bg-background/80 backdrop-blur-md mb-2" : ""}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbData()),
        }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-sm text-muted-foreground overflow-hidden ${className}`}
      >
        {items.map((item, index) => (
          <div key={index} className="flex items-center min-w-0 shrink-0 last:shrink">
            {index > 0 && (
              <ChevronRight
                className="w-4 h-4 flex-shrink-0 mx-1"
                aria-hidden="true"
              />
            )}
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors whitespace-nowrap"
                aria-label={`Navigate to ${item.label}`}
                title={item.label}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-foreground font-medium truncate"
                aria-current={index === items.length - 1 ? "page" : undefined}
                title={item.label}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Breadcrumb;

