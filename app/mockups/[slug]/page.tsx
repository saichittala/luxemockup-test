"use client";

import Image from "next/image";
import Link from "next/link";
import { getMockups } from '@/data/mockups';
import React, { useEffect, useState } from "react";

const STRAPI_URL =
  process.env.NODE_ENV === "development"
    ? "https://luxe-backend-8jiz.onrender.com"
    : "http://localhost:1337";


const getImageUrl = (image: any): string => {

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
export default function MockupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params); // <-- Unwrap the params Promise
  const [mockup, setMockup] = useState<any>(null);

  useEffect(() => {
    getMockups().then((mockups) => {
      const found = mockups.find((m: any) => m.slug === slug);
      setMockup(found);
    });
  }, [slug]);

  if (!mockup) {
    return <div>Mockup not found</div>;
  }

  return (
    <div className="mockup-detail">
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/mockups">Mockups</Link>
        <span>/</span>
        <span className="breadcrumbs-active">{mockup.title}</span>
      </div>
      <div>
        <h1 className="heading-h1-mockupdetails">{mockup.title}</h1>
        <div className="mockup-detail-contentwad">
          <div className="width-100">
            <div>
              <Image
                src={getImageUrl(mockup.image)}
                alt={mockup.title}
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, 600px"
                priority
              />
            </div>
            <div className="mockup-detail-content-main">
              <div>
                <p className="mu-details-heading">Details</p>
                <p className="mu-details-content">{mockup.details}</p>
              </div>
              <div className="d-flex">
                <Link
                  href={mockup.downloadlink}
                  className="btn-1 download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Mockup
                </Link>
              </div>
            </div>
          </div>
          <div className="ad-type-main">
            <div className="ad-type-2">{/* Ad space */}</div>
            <div className="mockup-detail-content-main-2">
              <div>
                <p className="mu-details-heading">Category</p>
                <p className="mu-details-content">{mockup.category}</p>
              </div>
              <div>
                <p className="mu-details-heading">File Type</p>
                <p className="mu-details-content">
                  {Array.isArray(mockup.fileTypes)
                    ? mockup.fileTypes.join(", ")
                    : mockup.fileTypes || ""}
                </p>
              </div>
              <div>
                <p className="mu-details-heading">Tag</p>
                <p className="mu-details-content">{mockup.tag}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}