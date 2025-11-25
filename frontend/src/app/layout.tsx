import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "../components/BottomBar";
import { ThemeProvider } from "../components/ThemeProvider";
import FooterWrapper from "../components/FooterWrapper";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "../contexts/AuthContext";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kyyril.vercel.app";

export const runtime = "edge";
export const metadata: Metadata = {
  title: {
    default: "Khairil Rahman | Software Engineer",
    template: "%s | Khairil Rahman Hakiki",
  },
  description:
    "Information Systems student specializing in software development. I leverage React.js and Node.js with Typescript to build robust, scalable applications.",
  keywords: [
    "Khairil Rahman Hakiki",
    "Khairil Rahman Hakiki Hrp",
    "Khairil Rahman Hakiki Harahap",
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
  alternates: {
    canonical: "/",
  },
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Khairil Rahman Hakiki",
    title: "Khairil Rahman Hakiki | Software Engineer",
    description:
      "Software Engineer specializing in React.js and Node.js with TypeScript",
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
    description:
      "Software Engineer specializing in React.js and Node.js with TypeScript",
    card: "summary_large_image",
    images: [`${siteUrl}/assets/profile.webp`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Khairil HR" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href={`${siteUrl}/assets/profile.webp`} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  url: siteUrl,
                  name: "Khairil Rahman Hakiki | Software Engineer",
                  description:
                    "Software Engineer specializing in React.js and Node.js with TypeScript",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: `${siteUrl}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string",
                  },
                  publisher: {
                    "@id": `${siteUrl}/#person`,
                  },
                },
                {
                  "@type": "Person",
                  "@id": `${siteUrl}/#person`,
                  name: "Khairil Rahman Hakiki",
                  alternateName: "Khairil Rahman Hakiki Hrp",
                  url: siteUrl,
                  image: `${siteUrl}/assets/profile.webp`,
                  jobTitle: "Software Engineer",
                  description:
                    "Information Systems student who loves programming, especially software development. Specializing in React.js and Node.js with TypeScript",
                  sameAs: [
                    "https://github.com/kyyril",
                    "https://www.linkedin.com/in/khairil-rahman-hakiki/",
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
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "Information Systems",
                  },
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "ID",
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "professional",
                    url: siteUrl,
                  },
                },
                {
                  "@type": "WebPage",
                  "@id": `${siteUrl}/#webpage`,
                  url: siteUrl,
                  name: "Khairil Rahman Hakiki | Software Engineer",
                  description:
                    "Software Engineer specializing in React.js and Node.js with TypeScript",
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
            }),
          }}
        />
      </head>
      <body className={`antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
