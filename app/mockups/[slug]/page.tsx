import Image from "next/image";
import Link from "next/link";
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import mockups from "@/data/mockups";

interface Mockup {
  slug: string;
  title: string;
  image: string;
  details: string;
  downloadlink: string;
  category: string;
  fileTypes: string[];
  tag: string;
}

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mockup = mockups.find((m) => m.slug === params.slug);
  
  return {
    title: `${mockup?.title || 'Mockup'} | Your Site Name`,
    description: mockup?.details,
    openGraph: {
      images: [mockup?.image || '/default-image.jpg'],
    },
  };
}

const MockupPage = async ({ params }: Props) => {
  const mockup = mockups.find((m) => m.slug === params.slug);

  if (!mockup) {
    notFound();
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
          <div>
            <div>
              <Image
                src={mockup.image}
                alt={mockup.title}
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, 600px"
                priority
              />
            </div>
            <div className="mockup-detail-content-main">
              <div>
                <p className="mu-details-heading">Details:</p>
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
            <div className="ad-type-2">
              {/* Ad space */}
            </div>
            <div className="mockup-detail-content-main-2">
              <div>
                <p className="mu-details-heading">Category</p>
                <p className="mu-details-content">{mockup.category}</p>
              </div>
              <div>
                <p className="mu-details-heading">File Type</p>
                <p className="mu-details-content">{mockup.fileTypes.join(", ")}</p>
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
};

export default MockupPage;

export async function generateStaticParams() {
  return mockups.map((mockup) => ({
    slug: mockup.slug,
  }));
}