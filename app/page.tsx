
"use client";

import Image from "next/image";
import { useState } from "react";
import "./globals.css";
import Link from "next/link";
import MockupGrid from "./components/mockupgrid";
import { useMockups } from "@/context/MockupContext";
import EnhancedSeo from "./components/Seo";
import { SchemaMarkup } from "./components/SchemaMarkup";


// Optional: export const metadata...

const AdSlot = ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) => (
  <div className="ad-slot">
    <Image src={src} alt={alt} width={width} height={height} />
  </div>
);

const Home = () => {
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const categories = ["All", "iPhone","iPad","Macbook","Paper & Books","Poster & Pictures", "Packaging", "Apple Watch","Android Devices","Food & Beverages", "Fashion", "Technology", "Books", "Food & Drink"];
  const [loading, setLoading] = useState(false);
  const { mockups } = useMockups();

  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LuxeMockups",
  };

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 12);
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <EnhancedSeo
        title="Free & Premium Design Mockups - High-Quality PSD Templates"
        description="Download thousands of professional design mockups, PSD templates, and creative resources. Free and premium mockups for branding, web design, packaging, and more. Curated by top designers worldwide."
        keywords="free mockups, premium mockups, psd mockups, design templates, mockup download, graphic design resources, branding mockups, packaging mockups, web design mockups, mobile app mockups, print design mockups"
        canonical="https://luxemockups.com"
        ogImage="https://luxemockups.com/images/og-homepage.jpg"
        schemaMarkup={homepageSchema}
      />
      <main>
        {/* Hero Section */}
        <section className="mb-unset">
          <div className="hero-container-main">
            <div className="hero-container">
              <div>
                <h1 className="heading-h1-text">LuxeMockups</h1>
                <p className="heading-h1-desc">
                  All of the finest mockups taken from top creators, all in one place.
                </p>
              </div>
              <div className="hero-content">
                <p>Need Web Design Services?</p>
                <Link href="https://saichittala.vercel.app/" className="btn-2">
                  Contact here
                </Link>
              </div>
            </div>
            <div>
              <Link href="/contribute" className="btn-1">Contribute</Link>
            </div>
          </div>
        </section>

        <div className="bg-main-container">
          <div className="filter-container">
            <div className="filter-type">
              <select className="custom-select" onChange={(e) => setTag(e.target.value)} value={tag}>
                <option value="All">All</option>
                <option value="Free">Free</option>
                <option value="Premium">Premium</option>
                <option value="New">New</option>
              </select>
            </div>
            <div className="filter-category">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`btn-1 ${category === cat ? "active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat === "Technology" ? "Tech" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-sub-container">
            {/* First Ad Block */}
            <div className="ad-type-main">
              <div className="ad-type-2">
                {/* <AdSlot src="/img/ad-type-1.png" alt="Ad Type 1" width={300} height={600} /> */}
              </div>
              <div className="ad-type-3">
                {/* <AdSlot src="/img/ad-type-2.png" alt="Ad Type 2" width={300} height={250} /> */}
              </div>
            </div>

            {/* Main Content + Load More */}
            <div className="card-grid-main">
              <MockupGrid category={category} tag={tag} visibleCount={visibleCount} mockups={mockups} />
              <div className="load-more btn-1" onClick={handleLoadMore}>
                {loading && (
                  <Image
                    src="/img/loading.svg"
                    alt="Loading"
                    width={20}
                    height={20}
                    className="spin"
                  />
                )}
                <p>{loading ? "Loading..." : "Load More"}</p>
              </div>

              {/* Mid-page Ad */}
              <div className="ad-type-1 ma">
                {/* <AdSlot src="/img/ad-type-3.png" alt="Ad Type 3" width={728} height={90} /> */}
              </div>
            </div>

            {/* Bottom Ad Block */}
            <div className="ad-type-main">
              <div className="ad-type-2">
                {/* <AdSlot src="/img/ad-type-1.png" alt="Ad Type 1" width={300} height={600} /> */}
              </div>
              <div className="ad-type-3">
                {/* <AdSlot src="/img/ad-type-2.png" alt="Ad Type 2" width={300} height={250} /> */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

