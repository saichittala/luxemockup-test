"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./header";
import Footer from "./footer";
import { MockupProvider } from "@/context/MockupContext";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Wait until component is mounted on client
    setIsMounted(true);
  }, []);

  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  const hiddenheaderRoutes = ["/login", "/signup", "/dashboard", "/404"];
  const hiddenfooterRoutes = [
    "/convertpng",
    "/convertjpg",
    "/convertwebp",
    "/compressimages",
    "/convertpdf",
    "/login",
    "/dashboard",
    "/contribute",
    "/about-us",
    "/privacy-policy",
    "/terms-conditions",
    "/404",
    "/contactus",
  ];

  const shouldHideHeader = hiddenheaderRoutes.some((route) => normalizedPath.startsWith(route));
  const shouldHideFooter = hiddenfooterRoutes.some((route) => normalizedPath.startsWith(route));

  return (
    <MockupProvider>
      {/* Avoid conditional rendering on initial SSR */}
      {isMounted && !shouldHideHeader && <Header />}
      <main>{children}</main>
      {isMounted && !shouldHideFooter && <Footer />}
    </MockupProvider>
  );
}
