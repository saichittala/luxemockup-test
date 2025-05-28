"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./header";
import Footer from "./footer";


export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const hiddenheaderRoutes = ["/login", "/signup", "/dashboard", "/404"];
  const hiddenfooterRoutes = ["/convertpng", "/convertjpg", "/convertwebp", "/compressimages", "/convertpdf"];

  return (
    <>
      {currentPath && !hiddenheaderRoutes.includes(currentPath) && <Header />}
      <main>{children}</main>
      {currentPath && !hiddenfooterRoutes.includes(currentPath) && <Footer />}
    </>
  );
}
