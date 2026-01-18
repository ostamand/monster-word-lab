import type { Metadata, Viewport } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import { SessionProvider } from "@/contexts/session.contexts";
import I18nProvider from "@/components/I18nProvider";
import Script from "next/script";
import JsonLd from "@/components/JsonLd";

import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.monsterwordlab.com"),
  title: {
    default: "Monster Word Lab | Free Reading App for Kids",
    template: "%s | Monster Word Lab",
  },
  description: "A free, fun, and interactive way for kids to learn to read in English, French, and Spanish. Customized monster stories and audio pronunciations for all ages.",
  keywords: ["learn to read", "reading app for kids", "free educational app", "phonics", "sight words", "bilingual education", "spanish for kids", "french for kids", "reading practice"],
  authors: [{ name: "Monster Word Lab Team" }],
  creator: "Monster Word Lab",
  publisher: "Monster Word Lab",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.monsterwordlab.com",
    siteName: "Monster Word Lab",
    title: "Monster Word Lab | Learn to Read in English, French & Spanish",
    description: "Join the Monster Word Lab! A unique, free experience where kids learn to read with beautiful images and correct audio pronunciation.",
    images: [
      {
        url: "/common/background.jpeg", // Using a representative image
        width: 1200,
        height: 630,
        alt: "Monster Word Lab - Fun Reading Experiment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Monster Word Lab | Free Reading App for Kids",
    description: "Help your child learn to read with our free, interactive monster stories. Available in English, French, and Spanish.",
    images: ["/common/background.jpeg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: "https://www.monsterwordlab.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${quicksand.variable} antialiased font-fredoka`}
      >
        <I18nProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </I18nProvider>
        <JsonLd />
        {/* disable umami tracking: localStorage.setItem("umami.disabled", "true") */}
        <Script
          src="https://umami-analytics-453586259507.us-central1.run.app/script.js"
          data-website-id="b8f14cf2-032e-441e-b321-d35e5ecca6b8"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
