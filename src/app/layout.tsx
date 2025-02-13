import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import FooterWrapper from "@/components/FooterWrapper";

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
        <title>khairil rahman hakiki</title>
      </head>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          {children}
          <FooterWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
