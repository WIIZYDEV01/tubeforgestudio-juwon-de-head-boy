import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit, Syne } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { site } from "@/lib/site";
import "./globals.css";

const display = Syne({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700", "800"] });
const body = Outfit({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: {
    default: `${site.name} — YouTube Automation Studio`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: `${site.name} — YouTube Automation Studio`,
    description: site.description,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — YouTube Automation Studio`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeBoot = `try{var t=localStorage.getItem("tfs-theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark");}catch(e){document.documentElement.setAttribute("data-theme","dark");}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-studio font-sans text-ink">
        <Script id="tfs-theme" strategy="beforeInteractive">
          {themeBoot}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
