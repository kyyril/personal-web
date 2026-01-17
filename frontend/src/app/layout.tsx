import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});
import { PERSONAL_KEYWORDS, siteUrl, SEO_DESCRIPTION } from "../lib/metadata";
import {
  generateAlternates,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "../lib/seo";
import { Navigation } from "../components/BottomBar";
import { ThemeProvider } from "../components/ThemeProvider";
import FooterWrapper from "../components/FooterWrapper";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "../contexts/AuthContext";
import { LazyMotion, domAnimation } from "framer-motion";
import GuestbookPrefetcher from "../components/GuestbookPrefetcher";

/**
 * Viewport configuration
 */
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

/**
 * Root layout metadata following Google's SEO best practices
 * https://developers.google.com/search/docs
 */
export const metadata: Metadata = {
  title: {
    default: "Khairil Rahman Hakiki | Software Engineer",
    template: "%s | Khairil Rahman Hakiki",
  },
  description: SEO_DESCRIPTION.main,
  applicationName: "Khairil Rahman Hakiki",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Khairil Rahman Hakiki",
  },
  keywords: [
    ...PERSONAL_KEYWORDS,
    "Web Development",
    "Next.js",
    "TypeScript",
    "React",
    "Node.js",
    "Software Engineer",
    "Information Systems",
    "Full Stack Developer",
    "JavaScript",
    "Frontend Developer",
    "Backend Developer",
    "Portfolio",
    "Personal Website",
  ],
  authors: [{ name: "Khairil Rahman Hakiki" }],
  creator: "Khairil Rahman Hakiki Hrp",
  publisher: "Khairil Rahman Hakiki Hrp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),

  // Default alternates with canonical - helps fix "Alternate page with proper canonical tag"
  alternates: generateAlternates(),

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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Khairil Rahman Hakiki",
    title: "Khairil Rahman Hakiki | Software Engineer",
    description: SEO_DESCRIPTION.main,
    images: [
      {
        url: `${siteUrl}/assets/profile.webp`,
        width: 1200,
        height: 630,
        alt: "Khairil Rahman Hakiki - Software Engineer",
      },
    ],
  },
  twitter: {
    title: "Khairil Rahman Hakiki | Software Engineer",
    description: SEO_DESCRIPTION.main,
    card: "summary_large_image",
    site: "@kyyril_dev",
    creator: "@kyyril_dev",
    images: [`${siteUrl}/assets/profile.webp`],
  },
  // Additional metadata for better SEO
  category: "Technology",
  classification: "Portfolio",
  // Enhanced icons configuration for all browsers and Google Search
  // Google favicon bot prefers multiples of 48px
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/profile.webp", sizes: "48x48", type: "image/webp" },
      { url: "/assets/profile.webp", sizes: "96x96", type: "image/webp" },
      { url: "/assets/profile.webp", sizes: "144x144", type: "image/webp" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/assets/profile.webp", sizes: "180x180", type: "image/webp" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/assets/profile.webp",
        color: "#000000",
      },
    ],
  },
  manifest: "/manifest.json",
  // Verification for search consoles
  verification: {
    google: "24f9cc081f9ae37b",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate structured data for the entire site
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  // Combined @graph for linked structured data
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      websiteSchema,
      organizationSchema,
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: "Khairil Rahman Hakiki | Software Engineer",
        description: SEO_DESCRIPTION.main,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#person`,
        },
        audience: {
          "@type": "Audience",
          audienceType: "Software Developers, Tech Enthusiasts",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}/assets/profile.webp`,
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://github-readme-stats-fast.vercel.app" />
        <link rel="dns-prefetch" href="https://github-readme-stats-fast.vercel.app" />
        <link rel="preconnect" href="https://wakatime.com" />
        <link rel="dns-prefetch" href="https://wakatime.com" />

        {/* Preload LCP Images (guessing dark theme as default) */}
        <link
          rel="preload"
          as="image"
          href="https://github-readme-stats-fast.vercel.app/api?username=kyyril&show_icons=true&theme=dark&bg_color=00000000&hide_border=true&title_color=3b82f6&text_color=888888"
        />
        <link
          rel="preload"
          as="image"
          href="https://github-readme-stats-fast.vercel.app/api/streak?username=kyyril&theme=dark&bg_color=00000000&hide_border=true&ring=3b82f6&stroke=3b82f6&currStreakLabel=3b82f6"
        />

        {/* Structured Data - Combined Schema Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(combinedSchema),
          }}
        />
      </head>
      <body className={`${jetbrainsMono.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LazyMotion features={domAnimation}>
            <AuthProvider>
              {/* Skip Links for Accessibility */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
              >
                Skip to main content
              </a>
              <a
                href="#navigation"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
              >
                Skip to navigation
              </a>

              <Navigation />
              <main id="main-content" role="main" className="min-h-screen">
                {children}
              </main>
              {/* Analytics with proper configuration to avoid insights 404 */}
              {process.env.VERCEL && <Analytics />}
              <FooterWrapper />

              {/* Silent prefetcher for guestbook data - warms cache in background */}
              <GuestbookPrefetcher />
            </AuthProvider>
          </LazyMotion>
        </ThemeProvider>
      </body>
    </html>
  );
}
