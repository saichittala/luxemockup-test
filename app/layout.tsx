import type { Metadata } from "next";
import LayoutWrapper from "./components/LayoutWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuxeMockups - Premium Design Mockups",
  description: "Download high-quality free and premium design mockups for your creative projects",
  metadataBase: new URL("https://luxemockups.com"),
  openGraph: {
    title: "LuxeMockups - Premium Design Mockups",
    description: "Download high-quality free and premium design mockups for your creative projects",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxeMockups - Premium Design Mockups",
    description: "Download high-quality free and premium design mockups for your creative projects",
    images: ["/images/og-default.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8420729734991072"
          crossOrigin="anonymous"
        />
      </head>
      <body className="global-container">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}