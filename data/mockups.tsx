

import * as LZString from 'lz-string';


export interface Mockup {
  title: string;
  fileTypes: string[];
  image: string;
  tag: string;
  category: string;
  details: string;
  slug: string;  // Changed from 'link' to 'slug'
  downloadlink: string;  // Changed from 'link' to 'slug'
}

const STORAGE_KEY = 'mockups_app_data';

const initialMockups: Mockup[] = [
  {
    title: "Open Book Mockup On Chair Mockup",
    fileTypes: ["PSD", "JPG"],
    image: "/img/mockups/books/Open-Book-Mockup-On-Chair-Mockup.webp",
    tag: "Free",
    downloadlink: "https://creatoom.com/shop/open-book-mockup-on-velvet-chair-v4-isometric/",
    category: "Books",
    slug: "book-cover-1",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."
  },
  {
    title: "Open Book Mockup On Chair Mockup--2 ",
    fileTypes: ["PSD", "JPG"],
    image: "/img/mockups/books/Open-Book-Mockup-On-Chair-Mockup.webp",
    tag: "Free",
    downloadlink: "https://creatoom.com/shop/open-book-mockup-on-velvet-chair-v4-isometric/",
    category: "Books",
    slug: "book-cover-sample-2",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."
  },
  {
    title: "Free Smartphone Mockup",
    fileTypes: ["PSD", "Figma"],
    image: "/img/sample.png",
    tag: "Free",
    downloadlink: "https://mockups-design.com/urban-citylight-mockup/",
    category: "Technology",
    slug: "smartphone-1",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."
  },
  {
    title: "Free Perfume Bottle Mockup",
    fileTypes: ["PSD", "FIG"],
    image: "/img/sample.png",
    tag: "Free",
    downloadlink: "https://mockups-design.com/urban-citylight-mockup/",
    category: "Fashion",

    slug: "perfume-bottle-2",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."
  },
  {
    title: "Free T-Shirt Mockup",
    fileTypes: ["PSD", "AI"],
    image: "/img/sample.png",
    tag: "Free",
    downloadlink: "https://mockups-design.com/urban-citylight-mockup/",
    category: "Fashion",
    slug: "t-shirt-2",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."
  },
  {
    title: "Free Coffee Cup Mockup",
    fileTypes: ["PSD", "SKETCH"],
    image: "/img/sample.png",
    tag: "Free",
    downloadlink: "https://mockups-design.com/urban-citylight-mockup/",
    category: "Food & Drink",
    slug: "coffee-cup-2",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."
  },
  {
    title: "Free Book Cover Mockup",
    fileTypes: ["PSD", "INDD"],
    image: "/img/sample.png",
    tag: "Free",
    downloadlink: "https://mockups-design.com/urban-citylight-mockup/",
    category: "Print",
    slug: "book-cover-2",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."

  },
  {
    title: "Free Smartphone Mockup",
    fileTypes: ["PSD", "Figma"],
    image: "/img/sample.png",
    tag: "Free",
    downloadlink: "https://mockups-design.com/urban-citylight-mockup/",
    category: "Technology",
    slug: "smartphone-2",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."

  },
  {
    title: "Free Perfume Bottle Mockup",
    fileTypes: ["PSD", "FIG"],
    image: "/img/sample.png",
    tag: "Free",
    downloadlink: "https://mockups-design.com/urban-citylight-mockup/",
    category: "Fashion",
    slug: "perfume-bottle-3",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."

  },
  {
    title: "Free T-Shirt Mockup",
    fileTypes: ["PSD", "AI"],
    image: "/img/sample.png",
    tag: "Free",
    downloadlink: "https://mockups-design.com/urban-citylight-mockup/",
    category: "Fashion",
    slug: "t-shirt-3",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."

  },
  {
    title: "Free Coffee Cup Mockup",
    fileTypes: ["PSD", "SKETCH"],
    image: "/img/sample.png",
    tag: "Free",
    downloadlink: "https://mockups-design.com/urban-citylight-mockup/",
    category: "Food & Drink",
    slug: "coffee-cup-3",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."

  },
  {
    title: "Free Book Cover Mockup",
    fileTypes: ["PSD", "INDD"],
    image: "/img/sample.png",
    tag: "Free",
    downloadlink: "https://mockups-design.com/urban-citylight-mockup/",
    category: "Print",
    slug: "book-cover-3",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."

  },
  {
    title: "Free Smartphone Mockup",
    fileTypes: ["PSD", "Figma"],
    image: "/img/sample.png",
    tag: "Free",
    downloadlink: "https://mockups-design.com/urban-citylight-mockup/",
    category: "Technology",
    slug: "smartphone-3",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."

  },
];

// Optimized storage functions
export function getMockups(): Mockup[] {
  if (typeof window === 'undefined') return initialMockups;
  
  try {
    // First try to get compressed data
    const compressed = localStorage.getItem(`${STORAGE_KEY}_compressed`);
    if (compressed) {
      const decompressed = LZString.decompressFromUTF16(compressed);
      return decompressed ? JSON.parse(decompressed) : initialMockups;
    }
    
    // Fallback to regular data
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialMockups;
  } catch (error) {
    console.error('Error loading mockups:', error);
    return initialMockups;
  }
}

export function saveMockups(mockups: Mockup[]) {
  if (typeof window === 'undefined') return;
  
  try {
    // Try to save compressed version
    const compressed = LZString.compressToUTF16(JSON.stringify(mockups));
    localStorage.setItem(`${STORAGE_KEY}_compressed`, compressed);
    
    // Also save regular version as fallback
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockups));
  } catch (error) {
    console.error('Error saving mockups:', error);
    
    // Fallback - save only essential data if full data is too large
    const minimalData = mockups.map(({ title, slug, image }) => ({ title, slug, image }));
    localStorage.setItem(`${STORAGE_KEY}_minimal`, JSON.stringify(minimalData));
  }
}


export default initialMockups;
