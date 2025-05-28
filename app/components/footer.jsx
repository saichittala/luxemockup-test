"use client";




import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-sub">
          <a href="/">
            <Image
              className='logo'
              src="/img/logo.svg"
              alt="SnapIMG - Free Online Image Compression and Conversion Tool"
              width={100}
              height={50}
            />
          </a>
          <p className="footer-text">Compress & Convert Images Online (JPG, PNG, WebP)</p>
        </div>
        <div className="footer-sub">
          <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
          <Link href="/terms" className="footer-link">Terms of Use</Link>
        </div>
      </div>
      <p className="copyrights-text">&copy; 2025 SnapIMG. All rights reserved.</p>
    </footer>
  );
}