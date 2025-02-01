import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";
import FooterWrapper from "@/components/FooterWrapper";

export const metadata: Metadata = {
  title: "kyyril",
  description: "Nosce te ipsum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
