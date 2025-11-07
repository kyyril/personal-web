import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "../components/BottomBar";
import { ThemeProvider } from "../components/ThemeProvider";
import FooterWrapper from "../components/FooterWrapper";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "../contexts/AuthContext";

export const runtime = "edge";
export const metadata: Metadata = {
  title: "Khairil Rahman Hakiki | Software Engineer",
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
  verification: {
    google: "24f9cc081f9ae37b",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kyyril.pages.dev",
    siteName: "Khairil Rahman Hakiki",
    title: "Khairil Rahman Hakiki | Software Engineer",
    description:
      "Software Engineer specializing in React.js and Node.js with TypeScript",
  },
  twitter: {
    title: "Khairil Rahman Hakiki | Software Engineer",
    description:
      "Software Engineer specializing in React.js and Node.js with TypeScript",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://kyyril.pages.dev/",
              name: "Khairil Rahman Hakiki | Software Engineer",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://kyyril.pages.dev/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
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
