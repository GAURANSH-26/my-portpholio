import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MotionSetup } from "@/components/MotionSetup";
import { SmoothScroll } from "@/components/SmoothScroll";
import { siteContent } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteContent.profile.siteUrl),
  title: {
    default: siteContent.seo.title,
    template: `%s | ${siteContent.profile.name}`
  },
  description: siteContent.seo.description,
  keywords: siteContent.seo.keywords,
  authors: [{ name: siteContent.profile.name }],
  creator: siteContent.profile.name,
  openGraph: {
    title: siteContent.seo.title,
    description: siteContent.seo.description,
    url: siteContent.profile.siteUrl,
    siteName: siteContent.profile.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gauransh full-stack developer portfolio"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.seo.title,
    description: siteContent.seo.description,
    images: ["/og-image.png"]
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/apple-touch-icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        <MotionSetup />
        {children}
      </body>
    </html>
  );
}
