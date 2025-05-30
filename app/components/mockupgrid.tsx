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

const MockupGrid = ({
  mockups,
  category = "All",
  tag = "All",
  visibleCount = 12
}: MockupGridProps) => {
  const filteredMockups = mockups.filter(mockup =>
    (category === "All" || mockup.category === category) &&
    (tag === "All" || mockup.tag === tag)
  );

  const visibleMockups = filteredMockups.slice(0, visibleCount);

  if (visibleMockups.length === 0) {
    return <div><p>No mockups found for selected filters</p>;</div>
  }

  return (
    <div className="card-grid">
      {visibleMockups.map((mockup, index) => (
        <Link
          href={`/mockups/${mockup.slug}`}
          key={`${mockup.slug}-${index}`}
          className="card-grid-item"
          title={mockup.title}
        >
          <div className="card-image-main">
            <div className={getTagClass(mockup.tag)}>{mockup.tag}</div>
            <Image
              className="mockup-img"
              src={mockup.image}
              alt={mockup.title}
              width={300}
              height={300}
            />
          </div>
          <div className="card-grid-item-content">
            <p className="card-grid-item-title-1">{mockup.title}</p>
            <p className="card-grid-item-title-2">{mockup.fileTypes.join(", ")}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MockupGrid;