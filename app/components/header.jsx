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
            alt="LuxeMockup - best Mockup website"
            width={19}
            height={24}
          />
        </a>
        <nav>
          {/* <div className='buttons-div-header'>
            <Link href="/compressimages" className="btn-2 ci">Compress Images</Link>
            <Link href="/convertpng" className="btn-2 ctp">Convert to PNG</Link>
            <Link href="/convertjpg" className="btn-2 ctj">Convert JPG</Link>
            <Link href="/convertwebp" className="btn-2 ctw">Convert to WebP</Link>
          </div> */}
          <div className='buttons-div-header'>
            <Link href="/" className="menu-item-btn">Mockups</Link>
            {/* <Link href="/convertpng" className="menu-item-btn">Portfolios</Link> */}
            <Link href="/about-us" className="menu-item-btn">About</Link>
          </div>
        </nav>
        {/* <div className='buttons-div-header'>
          <a className="btn-1 login" href="#">Login</a>
          <a className="btn-3" href="#">Signup</a>
        </div> */}
        <div className='buttons-div-header'>
          <Image
            className="logo"
            src="/img/search.svg"
            alt="LuxeMockup - best Mockup website"
            width={24}
            height={24}
          />        </div>
      </div>
    </header>
  );
}