import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nova-pa-alpha.vercel.app"),
  title: {
    default: "NOVA 8 | NOVA Performing Arts",
    template: "%s | NOVA Performing Arts",
  },
  description:
    "NOVA Performing Arts expands access to high-quality youth performing arts education through NOVA 8, a noncompetitive marching percussion academy in Central Texas.",
  keywords: [
    "NOVA 8",
    "NOVA Performing Arts",
    "youth percussion",
    "marching percussion",
    "Central Texas",
    "performing arts nonprofit",
  ],
  openGraph: {
    title: "NOVA 8 | NOVA Performing Arts",
    description:
      "More time to grow. More room to belong. Help build NOVA 8 for Central Texas youth.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/hero-percussion.jpg",
        width: 926,
        height: 343,
        alt: "Young percussionists performing together",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
