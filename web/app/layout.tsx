import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import { SessionProvider } from "@/contexts/session.contexts";
import Script from "next/script";

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

export const metadata: Metadata = {
  title: "Monster Word Lab",
  description: "A fun language learning experiment for kids",
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
        <SessionProvider>
          {children}
        </SessionProvider>
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
