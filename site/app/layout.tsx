import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import RouteProgress from "@/components/RouteProgress";
import PageTransition from "@/components/PageTransition";
import Noise from "@/components/Noise";
import { SITE_URL } from "@/lib/site";

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
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=general-sans@500,600,700&f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
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
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
