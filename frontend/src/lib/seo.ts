/**
 * SEO Utilities for Next.js
 * Implements Google Search Central best practices:
 * https://developers.google.com/search/docs
 */

import { Metadata } from "next";
import { siteUrl, PERSONAL_KEYWORDS, SEO_DESCRIPTION } from "./metadata";

/**
 * Default metadata configuration following Google's SEO guidelines
 */
export const defaultMetadata: Metadata = {
    metadataBase: new URL(siteUrl),
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "24f9cc081f9ae37b",
    },
};

/**
 * Generate consistent alternates metadata with canonical URL
 * This helps fix "Alternate page with proper canonical tag" issue
 */
export function generateAlternates(path: string = "") {
    const canonicalUrl = path ? `${siteUrl}${path}` : siteUrl;

    return {
        canonical: canonicalUrl,
        languages: {
            "en-US": canonicalUrl,
            "x-default": canonicalUrl,
        },
    };
}

/**
 * Generate OpenGraph metadata
 */
export function generateOpenGraph(options: {
    title: string;
    description: string;
    path?: string;
    type?: "website" | "article";
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    section?: string;
    tags?: string[];
    images?: Array<{
        url: string;
        width?: number;
        height?: number;
        alt?: string;
    }>;
}) {
    const url = options.path ? `${siteUrl}${options.path}` : siteUrl;

    return {
        type: options.type || "website",
        locale: "en_US",
        url,
        siteName: "Khairil Rahman Hakiki",
        title: options.title,
        description: options.description,
        ...(options.publishedTime && { publishedTime: options.publishedTime }),
        ...(options.modifiedTime && { modifiedTime: options.modifiedTime }),
        ...(options.authors && { authors: options.authors }),
        ...(options.section && { section: options.section }),
        ...(options.tags && { tags: options.tags }),
        images: options.images || [
            {
                url: `${siteUrl}/assets/profile.webp`,
                width: 1200,
                height: 630,
                alt: options.title,
            },
        ],
    };
}

/**
 * Generate Twitter card metadata
 */
export function generateTwitter(options: {
    title: string;
    description: string;
    images?: string[];
}) {
    return {
        card: "summary_large_image" as const,
        site: "@kyyril_dev",
        creator: "@kyyril_dev",
        title: options.title,
        description: options.description,
        images: options.images || [`${siteUrl}/assets/profile.webp`],
    };
}

/**
 * Generate complete page metadata following Google's best practices
 */
export function generatePageMetadata(options: {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
    type?: "website" | "article";
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    section?: string;
    tags?: string[];
    images?: Array<{
        url: string;
        width?: number;
        height?: number;
        alt?: string;
    }>;
    noIndex?: boolean;
}): Metadata {
    const fullKeywords = [...PERSONAL_KEYWORDS, ...(options.keywords || [])];

    return {
        ...defaultMetadata,
        title: options.title,
        description: options.description,
        keywords: fullKeywords,
        authors: options.authors?.map(name => ({ name })) || [{ name: "Khairil Rahman Hakiki" }],
        creator: "Khairil Rahman Hakiki",
        publisher: "Khairil Rahman Hakiki",
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        alternates: generateAlternates(options.path),
        openGraph: generateOpenGraph({
            title: options.title,
            description: options.description,
            path: options.path,
            type: options.type,
            publishedTime: options.publishedTime,
            modifiedTime: options.modifiedTime,
            authors: options.authors,
            section: options.section,
            tags: options.tags,
            images: options.images,
        }),
        twitter: generateTwitter({
            title: options.title,
            description: options.description,
            images: options.images?.map(img => img.url),
        }),
        robots: options.noIndex
            ? { index: false, follow: false }
            : defaultMetadata.robots,
    };
}

/**
 * Website Organization structured data
 */
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Khairil Rahman Hakiki",
        alternateName: "Khairil Rahman Hakiki Hrp",
        url: siteUrl,
        image: `${siteUrl}/assets/profile.webp`,
        jobTitle: "Software Engineer",
        description: SEO_DESCRIPTION.main,
        sameAs: [
            "https://github.com/kyyril",
            "https://www.linkedin.com/in/khairilrahman/",
            "https://twitter.com/kyyril_dev",
        ],
        knowsAbout: [
            "Web Development",
            "Next.js",
            "TypeScript",
            "React",
            "Node.js",
            "JavaScript",
            "Software Engineering",
            "Information Systems",
            "Full Stack Development",
        ],
        address: {
            "@type": "PostalAddress",
            addressCountry: "ID",
        },
    };
}

/**
 * Website structured data
 */
export function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Khairil Rahman Hakiki | Software Engineer",
        description: SEO_DESCRIPTION.main,
        publisher: {
            "@id": `${siteUrl}/#person`,
        },
        potentialAction: {
            "@type": "SearchAction",
            target: `${siteUrl}/blog?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };
}

/**
 * WebPage structured data
 */
export function generateWebPageSchema(options: {
    title: string;
    description: string;
    path?: string;
    datePublished?: string;
    dateModified?: string;
}) {
    const url = options.path ? `${siteUrl}${options.path}` : siteUrl;

    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: options.title,
        description: options.description,
        isPartOf: {
            "@id": `${siteUrl}/#website`,
        },
        about: {
            "@id": `${siteUrl}/#person`,
        },
        ...(options.datePublished && { datePublished: options.datePublished }),
        ...(options.dateModified && { dateModified: options.dateModified }),
        primaryImageOfPage: {
            "@type": "ImageObject",
            url: `${siteUrl}/assets/profile.webp`,
        },
    };
}

/**
 * BlogPosting structured data for articles
 */
export function generateArticleSchema(options: {
    title: string;
    description: string;
    slug: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    category?: string;
    tags?: string[];
    wordCount?: number;
    readTime?: string;
    coverImage?: string;
}) {
    const url = `${siteUrl}/blog/${options.slug}`;

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
        headline: options.title,
        description: options.description,
        url,
        author: {
            "@type": "Person",
            name: options.author,
            url: siteUrl,
        },
        publisher: {
            "@type": "Person",
            name: "Khairil Rahman Hakiki",
            url: siteUrl,
            image: {
                "@type": "ImageObject",
                url: `${siteUrl}/assets/profile.webp`,
            },
        },
        datePublished: options.datePublished,
        dateModified: options.dateModified || options.datePublished,
        ...(options.category && { articleSection: options.category }),
        ...(options.tags && { keywords: options.tags.join(", ") }),
        ...(options.wordCount && { wordCount: options.wordCount }),
        ...(options.readTime && { timeRequired: `PT${options.readTime.split(" ")[0]}M` }),
        image: {
            "@type": "ImageObject",
            url: options.coverImage || `${siteUrl}/assets/profile.webp`,
            width: 1200,
            height: 630,
        },
        isPartOf: {
            "@id": `${siteUrl}/#website`,
        },
    };
}

/**
 * BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{ label: string; href?: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            ...(item.href && { item: item.href.startsWith("http") ? item.href : `${siteUrl}${item.href}` }),
        })),
    };
}

/**
 * ItemList structured data for collection pages
 */
export function generateItemListSchema(options: {
    name: string;
    description: string;
    items: Array<{
        name: string;
        url: string;
        position: number;
    }>;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: options.name,
        description: options.description,
        numberOfItems: options.items.length,
        itemListElement: options.items.map(item => ({
            "@type": "ListItem",
            position: item.position,
            name: item.name,
            url: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
        })),
    };
}
