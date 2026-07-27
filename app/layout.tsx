import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import RouteProgress from "@/components/RouteProgress";
import PageTransition from "@/components/PageTransition";
import Noise from "@/components/Noise";
import ChapterRail from "@/components/ChapterRail";
import { SITE_URL } from "@/lib/site";

/* ------------------------------------------------------------------
   TYPOGRAPHY — self-hosted, on purpose.

   These used to load from api.fontshare.com. Fontshare began returning
   "Access to the Fontshare API has been temporarily restricted." to browser
   requests, which silently dropped Clash Display, General Sans and Satoshi
   and rendered the entire site in a system fallback — while IBM Plex Mono,
   served by Google, kept working. Nothing in the CSS had changed, so the
   failure looked like a design regression rather than a dead CDN.

   Typography is the brand here. It does not get to depend on somebody else's
   rate limiter. Both faces are variable, so two files cover every weight.
------------------------------------------------------------------- */
const clash = localFont({
  src: "../fonts/ClashDisplay-Variable.woff2",
  weight: "200 700",
  style: "normal",
  display: "swap",
  variable: "--font-clash",
});

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  style: "normal",
  display: "swap",
  variable: "--font-satoshi",
});

/* IBM Plex Mono still comes from Google, which has never failed us the way
   Fontshare did. TODO: self-host this too, for the same reason as above —
   `npx sv add @fontsource/ibm-plex-mono` or drop the woff2 into ./fonts and
   switch it to localFont. It is the last external font dependency. */

const TITLE = "Astralyn Group — Powered by Astralyn";
const DESCRIPTION =
  "Astralyn Group is a technology house. We architect businesses. We engineer products. We shape the future. Strategy. Design. Technology.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Astralyn Group",
  },
  description: DESCRIPTION,
  applicationName: "Astralyn Group",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Astralyn Group",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${clash.variable} ${satoshi.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-midnight text-white">
        <Noise />
        <Preloader />
        <PageTransition />
        <RouteProgress />
        <SmoothScroll>
          <Nav />
          <ChapterRail />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
