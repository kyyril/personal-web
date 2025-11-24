import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "../components/BottomBar";
import { ThemeProvider } from "../components/ThemeProvider";
import FooterWrapper from "../components/FooterWrapper";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "../contexts/AuthContext";

export const runtime = "edge";
export const metadata: Metadata = {
  title: "Khairil Rahman | Software Engineer",
  description:
    "I'm an Information Systems student who loves programming, especially software development. I specialize in React.js and Node.js with TypeScript",
  keywords: [
    "Khairil Rahman Hakiki",
    "Khairil Rahman Hakiki Hrp",
    "Khairil Rahman Hakiki Harahap",
    "Web Development",
    "Next.js",
    "TypeScript",
    "React",
    "Software Engineer",
    "Information Systems",
  ],
  authors: [{ name: "Khairil Rahman Hakiki" }],
  creator: "Khairil Rahman Hakiki Hrp",
  publisher: "Khairil Rahman Hakiki Hrp",
  robots: "index, follow",
  alternates: {
    canonical: "https://kyyril.vercel.app",
  },
  verification: {
    google: "24f9cc081f9ae37b",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kyyril.vercel.app",
    siteName: "Khairil Rahman Hakiki",
    title: "Khairil Rahman Hakiki | Software Engineer",
    description:
      "Software Engineer specializing in React.js and Node.js with TypeScript",
    images: [
      {
        url: "https://kyyril.vercel.app/assets/profile.webp",
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
    images: ["https://kyyril.vercel.app/assets/profile.webp"],
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
        <link rel="apple-touch-icon" href="/assets/profile.webp" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://kyyril.vercel.app/#website",
                  url: "https://kyyril.vercel.app/",
                  name: "Khairil Rahman Hakiki | Software Engineer",
                  description:
                    "Software Engineer specializing in React.js and Node.js with TypeScript",
                  potentialAction: {
                    "@type": "SearchAction",
                    target:
                      "https://kyyril.vercel.app/search?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                  publisher: {
                    "@id": "https://kyyril.vercel.app/#person",
                  },
                },
                {
                  "@type": "Person",
                  "@id": "https://kyyril.vercel.app/#person",
                  name: "Khairil Rahman Hakiki",
                  alternateName: "Khairil Rahman Hakiki Hrp",
                  url: "https://kyyril.vercel.app",
                  image: "https://kyyril.vercel.app/assets/profile.webp",
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
                    "Software Engineering",
                    "Information Systems",
                  ],
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "Information Systems",
                  },
                },
                {
                  "@type": "WebPage",
                  "@id": "https://kyyril.vercel.app/#webpage",
                  url: "https://kyyril.vercel.app",
                  name: "Khairil Rahman Hakiki | Software Engineer",
                  description:
                    "Software Engineer specializing in React.js and Node.js with TypeScript",
                  isPartOf: {
                    "@id": "https://kyyril.vercel.app/#website",
                  },
                  about: {
                    "@id": "https://kyyril.vercel.app/#person",
                  },
                  audience: {
                    "@type": "Audience",
                    audienceType: "Software Developers, Tech Enthusiasts",
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
