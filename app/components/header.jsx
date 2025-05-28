"use client";




import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header>
      <div className="header-main">
        <a href="/">
          <Image
            className="logo"
            src="/img/logo.svg"
            alt="SnapIMG - Free Online Image Compression and Conversion Tool"
            width={100}
            height={50}
          />
        </a>
        <nav>
          <div className='buttons-div-header'>
            <Link href="/compressimages" className="btn-2 ci">Compress Images</Link>
            <Link href="/convertpng" className="btn-2 ctp">Convert to PNG</Link>
            <Link href="/convertjpg" className="btn-2 ctj">Convert JPG</Link>
            <Link href="/convertwebp" className="btn-2 ctw">Convert to WebP</Link>
          </div>
        </nav>
        <div className='buttons-div-header'>
          <a className="btn-1 login" href="#">Login</a>
          <a className="btn-3" href="#">Signup</a>
        </div>
      </div>
    </header>
  );
}