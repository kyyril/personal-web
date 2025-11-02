import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/BottomBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import FooterWrapper from "@/components/FooterWrapper";
import { Analytics } from "@vercel/analytics/next";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import FloatingMusicPlayer from "@/components/FloatingMusicPlayer";

export const metadata: Metadata = {
  title: "Khairil Rahman Hakiki | Frontend Developer",
  description:
    "I'm an Information Systems student who loves programming, especially software web development. I specialize in Next.js with Typescript and am currently learning backend development with Golang.",
  keywords: [
    "Khairil Rahman Hakiki",
    "Frontend Developer",
    "Web Development",
    "Next.js",
    "TypeScript",
    "React",
    "Software Engineer",
    "Information Systems",
  ],
  authors: [{ name: "Khairil Rahman Hakiki" }],
  creator: "Khairil Rahman Hakiki",
  publisher: "Khairil Rahman Hakiki",
  robots: "index, follow",
  verification: {
    google: "24f9cc081f9ae37b",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kyyril.vercel.app",
    siteName: "Khairil Rahman Hakiki",
    title: "Khairil Rahman Hakiki | Frontend Developer",
    description: "Frontend Developer specializing in Next.js and TypeScript",
  },
  twitter: {
    title: "Khairil Rahman Hakiki | Frontend Developer",
    description: "Frontend Developer specializing in Next.js and TypeScript",
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
              name: "Khairil Rahman Hakiki | Frontend Developer",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://kyyril.vercel.app/search?q={search_term_string}",
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
          <MusicPlayerProvider>
            <FloatingMusicPlayer />
            <Navigation />
            {children}
            <Analytics />
            <FooterWrapper />
          </MusicPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
