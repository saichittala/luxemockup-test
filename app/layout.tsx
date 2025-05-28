import type { Metadata } from "next";
import LayoutWrapper from "./components/LayoutWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapIMG - Free Online Image Compression & Conversion",
  description: "Compress images and convert JPG, PNG, WebP files easily. No downloads, no quality loss!",
  openGraph: {
    title: "SnapIMG - Free Online Image Compression & Conversion",
    description: "Compress images and convert JPG, PNG, WebP files easily. No downloads, no quality loss!",
    url: "https://snapimg.site",
    siteName: "SnapIMG",
    images: [
      {
        url: "/img/og-image.jpg", // Ensure this path is correct
        width: 1200,
        height: 630,
        alt: "SnapIMG - Free Online Image Compression & Conversion",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapIMG - Free Online Image Compression & Conversion",
    description: "Compress images and convert JPG, PNG, WebP files easily. No downloads, no quality loss!",
    images: ["/img/og-image.jpg"], // Ensure the correct path
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
        ></script>
      </head>
      <body className="global-container">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>

    </html>
  );
}
