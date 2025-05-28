"use client"; // Required for client-side navigation

import Image from "next/image";
import Link from "next/link";
import "../globals.css"; // Ensure styles are correctly imported

const options = [
  {
    title: "Convert to JPG",
    description: "Convert JPG, WEBP, SVG, and GIFs to JPG efficiently.",
    icon: "./img/JPG.svg",
    link: "/convertjpg",
  },
  {
    title: "Convert to PNG",
    description: "Convert JPG, WEBP, SVG, and GIFs to PNG efficiently.",
    icon: "./img/PNG.svg",
    link: "/convertpng",
  },
  {
    title: "Convert to WEBP",
    description: "Convert JPG, PNG, SVG, GIFs to WebP efficiently.",
    icon: "./img/WEBP.svg",
    link: "/convertwebp",
  },
  {
    title: "Compress Images",
    description: "Compress JPG, PNG, SVG, GIFs efficiently while preserving quality.",
    icon: "./img/Compress.svg",
    link: "/compressimages",
  },
  {
    title: "Img to PDF",
    description: "Convert JPG, PNG, SVG, and GIFs to PDF efficiently.",
    icon: "./img/pdf.svg",
    link: "/convertpdf",
  },
  {
    title: "Remove Background",
    description: "Resize your image to a specific width and height.",
    icon: "./img/bg-remove.svg",
    link: "/404",
  },
];

const OptionCard = ({ title, description, icon, link }) => {
  return (
    <Link href={link} className="option-link">
      <div className="option-card">
        {/* Use Next.js Image optimization */}
        <Image className="options-icon" src={icon} alt={`${title} icon`} width={50} height={50} priority />
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  );
};

const OptionsGrid = () => {
  return (
    <div className="options-grid">
      {options.map((option, index) => (
        <OptionCard key={index} {...option} />
      ))}
    </div>
  );
};

export default OptionsGrid;
