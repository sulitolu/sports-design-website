import type { Metadata, Viewport } from "next";
import { Poppins, Noto_Sans_JP, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import CustomCursor from "@/components/custom-cursor";
import { LoadingProvider } from "@/components/loading-context";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-jp",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const siteUrl = "https://sportsdesignjapan.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sports Design Japan — Cinematic Sports Media & Athlete Branding",
    template: "%s | Sports Design Japan",
  },
  description:
    "Sports Design Japan is a sports media and athlete branding agency founded by a professional rugby player. Cinematic film, athlete branding, and social content for teams and athletes in Japan.",
  keywords: [
    "sports media Japan",
    "athlete branding",
    "rugby video production",
    "Japan Rugby League One",
    "cinematic sports film",
    "social content agency",
  ],
  openGraph: {
    title: "Sports Design Japan — Cinematic Sports Media & Athlete Branding",
    description:
      "Cinematic film, athlete branding, and social content for teams and athletes in Japan. Built from inside the game by a professional rugby player.",
    url: siteUrl,
    siteName: "Sports Design Japan",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sports Design Japan — Cinematic Sports Media & Athlete Branding",
    description:
      "Cinematic film, athlete branding, and social content for teams and athletes in Japan.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f3ef",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${notoSansJP.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-ink text-paper antialiased">
        <LoadingProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <CustomCursor />
        </LoadingProvider>
      </body>
    </html>
  );
}
