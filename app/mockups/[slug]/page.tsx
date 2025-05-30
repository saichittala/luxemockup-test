import Image from "next/image";
import Link from "next/link";
// Make sure the file exists at this path, or update the path if needed
import mockups from "@/data/mockups";
// app/mockups/[slug]/page.tsx

interface PageProps {
  params: {
    slug: string;
  };
}

const MockupPage = ({ params }: PageProps) => {
  const mockup = mockups.find((m) => m.slug === params.slug);

  if (!mockup) {
    return (
      <div className="mockup-detail">
        <Link href="/">← Back</Link>
        <p>Mockup not found 😢</p>
      </div>
    );
  }

  return (
    <div className="mockup-detail">
      <div className="breadcrumbs">
        <a href="/">Home</a>
        <a >/</a>
        <a href="/">Mockups</a>
        <a>/</a>
        <a className="breadcrumbs-active">{mockup.title}</a>
      </div>
      <div>
        <h1 className="heading-h1-mockupdetails">{mockup.title}</h1>

        {/* <Link className="btn-1" href="/">← Back</Link> */}
        <div className="mockup-detail-contentwad">
          <div >
            <div>
              <Image
                src={mockup.image}
                alt={mockup.title}
                width={600}
                height={600}
                priority
              />
            </div>
            <div className="mockup-detail-content-main">
              <div>
                <p className="mu-details-heading">Details:</p>
                <p className="mu-details-content">{mockup.details}</p>
              </div>
              <div className="d-flex">
                <Link href={mockup.downloadlink} className="btn-1 download-btn" target="_blank">
                  Download Mockup
                </Link>
              </div>
            </div>

          </div>
          {/* <div className="border-line">

          </div> */}
          <div className="ad-type-main">
            <div className="ad-type-2">
              {/* <Image src="/img/ad-type-1.png" alt="Ad Type 1" width={300} height={600} /> */}
            </div>
            <div className="mockup-detail-content-main-2 ">
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