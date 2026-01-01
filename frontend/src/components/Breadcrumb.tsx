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
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = "",
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
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbData()),
        }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center flex-wrap gap-y-2 text-xs sm:text-sm text-muted-foreground ${className}`}
      >
        {items.map((item, index) => (
          <div key={index} className="flex items-center min-w-0">
            {index > 0 && (
              <ChevronRight
                className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mx-1 sm:mx-2"
                aria-hidden="true"
              />
            )}
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[200px] md:max-w-none"
                aria-label={`Navigate to ${item.label}`}
                title={item.label}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-foreground font-medium truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[300px] md:max-w-none"
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
