// components/EnhancedSeo.tsx
import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  schemaMarkup?: object;
  noindex?: boolean;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

export default function EnhancedSeo({
  title,
  description,
  keywords = "mockups, free mockups, design templates, psd mockups, premium mockups, graphic design, branding mockups, web design mockups",
  ogImage = "https://luxemockups.com/images/og-default.jpg",
  canonical,
  schemaMarkup,
  noindex = false,
  article = false,
  publishedTime,
  modifiedTime,
  author = "LuxeMockups",
  section = "Design"
}: SEOProps) {
  // Ensure title is optimized and not redundant
  const fullTitle = title.includes('LuxeMockups') ? title : `${title} | LuxeMockups`;
  
  // Create default schema markup if none provided
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": article ? "Article" : "WebSite",
    "name": fullTitle,
    "description": description,
    "url": canonical || "https://luxemockups.com",
    ...(article && {
      "headline": title,
      "author": {
        "@type": "Person",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "LuxeMockups",
        "logo": {
          "@type": "ImageObject",
          "url": "https://luxemockups.com/images/logo.png"
        }
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "articleSection": section,
      "image": ogImage
    }),
    ...(!article && {
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://luxemockups.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    })
  };

  const finalSchema = schemaMarkup || defaultSchema;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="language" content="English" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:site_name" content="LuxeMockups" />
      <meta property="og:locale" content="en_US" />
      {canonical && <meta property="og:url" content={canonical} />}
      
      {/* Article specific Open Graph */}
      {article && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:section" content={section} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@luxemockups" />
      <meta name="twitter:creator" content="@luxemockups" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots Meta Tag */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(finalSchema) }}
      />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
      
      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    </Head>
  );
}