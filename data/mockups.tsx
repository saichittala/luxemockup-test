

import * as LZString from 'lz-string';


export interface Mockup {
  title: string;
  fileTypes: string[];
  image: ImageType;
  tag: string;
  category: string;
  details: string;
  slug: string;  // Changed from 'link' to 'slug'
  downloadlink: string;  // Changed from 'link' to 'slug'
}

type ImageType = string | {
  data?: {
    attributes: {
      url: string;
      alternativeText?: string;
      formats?: any;
    };
  };
};
const STORAGE_KEY = 'mockups_app_data';
const STRAPI_URL =
  process.env.NODE_ENV === "development"
    ? "https://luxe-backend-8jiz.onrender.com"
    : "http://localhost:1337";

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
    slug: "smartphone-3",
    details: "A realistic mockup of a perfume bottle, perfect for showcasing your fragrance designs."

  },
];

export async function getMockups(): Promise<Mockup[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/mockups?populate=image`);
    const json = await res.json();

    return json.data.map((item: any) => ({
      title: item.title ?? '',
      fileTypes: item.fileTypes?.split(',').map((f: string) => f.trim()) ?? [],
      image: item.image ?? null,
      tag: item.tag ?? '',
      category: item.category ?? '',
      details: item.details ?? '',
      slug: item.slug ?? '',
      downloadlink: item.downloadlink ?? '',
    }));
  } catch (error) {
    console.error('Error fetching mockups from API:', error);

    try {
      const compressed = localStorage.getItem(`${STORAGE_KEY}_compressed`);
      if (compressed) {
        const decompressed = LZString.decompressFromUTF16(compressed);
        return decompressed ? JSON.parse(decompressed) : initialMockups;
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialMockups;
    } catch (lsError) {
      console.error('Error loading mockups from localStorage:', lsError);
      return initialMockups;
    }
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
export function getMockupImageUrl(mockup: Mockup): string {
  if (typeof mockup.image === 'string') {
    return mockup.image; // Direct string path
  }
  // Handle API response structure
  return mockup.image?.data?.attributes?.url || '/img/sample.png';
}
export function getImageUrl(image: any): string {
const STRAPI_URL =
  process.env.NODE_ENV === "development"
    ? "https://luxe-backend-8jiz.onrender.com"
    : "http://localhost:1337";

  if (image?.data?.attributes?.url) {
    return STRAPI_URL + image.data.attributes.url;
  }

  if (typeof image === 'string') {
    if (image.startsWith('http')) return image;
    if (image.startsWith('/')) return image;
  }

  // Fallback image
  return '/img/fallback-image.png';
}



export default initialMockups;