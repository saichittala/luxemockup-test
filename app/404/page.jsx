'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='error-404-main-container'>
      <div className="error-404-container">
        <h1 className="error-404-heading">404</h1>
        <p className="error-404-text">Oops! The page you're looking for doesn't exist.</p>
        <button className="error-404-button" onClick={() => router.push('/')}>Go Back Home</button>
      </div>
    </div>

  );
}
