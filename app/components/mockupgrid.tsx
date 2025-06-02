"use client";

import Image from "next/image";
import Link from "next/link";
import { Mockup } from "@/data/mockups";

interface MockupGridProps {
  mockups: Mockup[];
  category?: string;
  tag?: string;
  visibleCount?: number;
}

const getTagClass = (tag: string) => {
  switch (tag) {
    case "Free":
      return "free-tag";
    case "Premium":
      return "premium-tag";
    case "New":
      return "new-tag";
    default:
      return "";
  }
};


const getImageUrl = (image: any): string => {
const STRAPI_URL =
  process.env.NODE_ENV === "development"
    ? "https://luxe-backend-8jiz.onrender.com"
    : "http://localhost:1337";

  // Case 1: Image is already a full URL string
  if (typeof image === 'string') {
    if (image.startsWith('http')) return image;
    if (image.startsWith('/')) return `${STRAPI_URL}${image}`;
    return `${STRAPI_URL}/${image}`;
  }

  // Case 2: Strapi v4 response structure (from API)
  if (image?.attributes?.url) {
    const url = image.attributes.url;
    return `${STRAPI_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  // Case 3: Alternative structure (direct url property)
  if (image?.url) {
    const url = image.url;
    return `${STRAPI_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  // Case 4: Fallback image
  return '/img/sample.png';
};

const MockupGrid = ({
  mockups,
  category = "All",
  tag = "All",
  visibleCount = 12
}: MockupGridProps) => {
  if (!Array.isArray(mockups)) {
    console.error("mockups is not an array:", mockups);
    return <p>Error loading mockups</p>;
  }

  const filteredMockups = mockups.filter(mockup =>
    (category === "All" || mockup.category === category) &&
    (tag === "All" || mockup.tag === tag)
  );

  const visibleMockups = filteredMockups.slice(0, visibleCount);

  if (visibleMockups.length === 0) {
    return <div><p>No mockups found for selected filters</p></div>;
  }

  return (
    <div className="card-grid">
      {visibleMockups.map((mockup, index) => {
        const imageUrl = getImageUrl(mockup.image);
        console.log('Rendering mockup:', {
          title: mockup.title,
          imageObject: mockup.image,
          constructedUrl: imageUrl
        });

        return (
          <Link
            href={`/mockups/${mockup.slug}`}
            key={`${mockup.slug}-${index}`}
            className="card-grid-item"
            title={mockup.title}
          >
            <div className="card-image-main">
              <div className={getTagClass(mockup.tag)}>{mockup.tag}</div>
              <Image
                src={imageUrl}
                alt={mockup.title}
                width={600}
                height={600}
                className="mockup-img"
                unoptimized={true} // Disable Next.js optimization for development
                priority={index < 3} // Load first 3 images immediately
              />
            </div>
            <div className="card-grid-item-content">
              <p className="card-grid-item-title-1">{mockup.title}</p>
              <p className="card-grid-item-title-2">{mockup.fileTypes}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MockupGrid;