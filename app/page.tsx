"use client"; // Required for client-side rendering

import Image from "next/image";
import OptionsGrid from "./components/card-grid"; // Use absolute import for clarity
import "./globals.css"; // Ensure styles are imported
import Seo from "./components/Seo";


const Home = () => {

  const seoConfig = {
    title: "Free Online Image Compressor & Converter | SnapIMG",
    description:
      "Compress and convert images online for free. Reduce image size, convert JPG, PNG, WebP, and maintain high quality. No downloads required! Try SnapIMG now.",
    canonicalUrl: "https://snapimg.site",
    keywords: [
      "free image compressor",
      "image compression tool",
      "compress images online",
      "reduce image size",
      "convert images online",
      "JPG to PNG converter",
      "PNG to WebP conversion",
      "WebP to JPG tool",
      "best image converter",
      "fast image compressor",
      "online image optimizer",
      "bulk image compression",
      "high-quality image compression",
      "SnapIMG free image tool",
      "convert images without losing quality",
      "compress photos without losing quality",
      "fastest image compressor online",
      "image resizer and converter"
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Free Online Image Compressor & Converter | SnapIMG",
      description:
        "Compress and convert images online for free. Reduce image size, convert JPG, PNG, WebP, and maintain high quality. No downloads required! Try SnapIMG now.",
      url: "https://snapimg.site",
    },

    
  };
  


  return (
    <div>
      <Seo {...seoConfig} />

      <main>
        {/* Hero Section */}
        <section>
          <div>
            <h1>Free Online Image Compression & Conversion Tool</h1>
            <p className="heading-desc">
              Compress images and convert JPG, PNG, WebP files easily. No downloads, no quality loss!
            </p>
          </div>
          <OptionsGrid />
        </section>

        {/* Why Choose SnapIMG */}
        <div className="bg-white">
          <section className="common-padding">
            <h2>Why Choose SnapIMG?</h2>
            <div className="why-choose-grid">
              {[
                { title: "Fast & Free Image Compression", desc: "Reduce file size while maintaining quality." },
                { title: "Convert Between JPG, PNG, WebP", desc: "Simple and efficient format conversion." },
                { title: "Secure & Private", desc: "Your images are processed instantly in your browser." },
                { title: "No Software Required", desc: "Works 100% online, no downloads needed." }
              ].map((item, index) => (
                <div className="why-choose-item" key={index}>
                  <Image className="options-icon" src="/img/correct.svg" alt={item.title} width={50} height={50} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* How to Use SnapIMG */}
        <section className="common-padding">
          <div className="how-to-use-container">
            <h2>How to Use SnapIMG?</h2>
            <div className="how-to-use-grid">
              {[
                { title: "Upload Image", desc: "Choose your JPG, PNG, or WebP file to compress or convert.", img: "/img/how-upload.svg" },
                { title: "Compress or Convert", desc: "Select the desired action to optimize your image.", img: "/img/how-compress.svg" },
                { title: "Download Image", desc: "Get your optimized image instantly.", img: "/img/how-download.svg" }
              ].map((item, index) => (
                <div className="how-to-use-item" key={index}>
                  <Image className="options-icon" src={item.img} alt={item.title} width={50} height={50} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conversion & Compression Info */}
        <div className="bg-gradient">
          <section className="common-padding">
            <div className="readable-grid-container">
              {[
                { title: "Convert Image Formats Easily", desc: "Convert JPG to PNG, PNG to JPG, JPG to WebP, or PNG to WebP in just a few clicks. SnapIMG supports bulk conversion and ensures high-quality results." },
                { title: "Compress Images Online for Free", desc: "SnapIMG allows you to compress images online without losing quality. Whether you need to reduce the size of JPG, PNG, or WebP files, our tool ensures fast compression." }
              ].map((item, index) => (
                <div className="readable-container" key={index}>
                  <h2 className="readable-heading">{item.title}</h2>
                  <p className="readable-text">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
