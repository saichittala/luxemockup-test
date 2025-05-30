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
              src="/img/logowt.svg"
              alt="SnapIMG - Free Online Image Compression and Conversion Tool"
              width={100}
              height={50}
            />
          </a>
        </div>
        <div className="footer-sub mb-24">
          <Link href="/" className="footer-link">Home</Link>
          <Link href="/about-us" className="footer-link">About</Link>
          <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
          <Link href="/terms-conditions" className="footer-link">Terms and Conditions</Link>
          <Link href="/redistribution" className="footer-link">Redistribution</Link>
          <Link href="/contactus" className="footer-link">Contact</Link>
          {/* <Link href="/login" className="footer-link">Login</Link> */}
        </div>
      </div>
      <p className="copyrights-text">&copy; 2025 LuxeMockups. All rights reserved.</p>
    </footer>
  );
}