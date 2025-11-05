import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "../components/BottomBar";
import { ThemeProvider } from "../components/ThemeProvider";
import FooterWrapper from "../components/FooterWrapper";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "../contexts/AuthContext";

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
    url: "https://kyyril.vercel.app",
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
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://kyyril.vercel.app/",
              name: "Khairil Rahman Hakiki | Software Engineer",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://kyyril.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navigation />
            {children}
            <Analytics />
            <FooterWrapper />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
