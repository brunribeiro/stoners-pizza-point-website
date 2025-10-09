import React from 'react';
import { useRouter } from 'next/router';

const ErrorPage = () => {
  const router = useRouter();

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='bg-white shadow-lg rounded-lg p-6 md:p-10 lg:p-14 text-center cursor-pointer'>
        <h1 className='text-6xl md:text-8xl lg:text-9xl font-extrabold text-slate-800'>404</h1>
        <p className='text-lg md:text-xl lg:text-2xl mt-4 font-semibold text-slate-600'>
          Oops! Page not found.
        </p>
        <p className='text-gray-500 mt-2'>The page you’re looking for doesn’t exist.</p>
        <button
          onClick={() => router.push('/')}
          className='mt-6 px-4 py-2 md:px-6 md:py-3 bg-slate-800 text-white font-semibold rounded-lg shadow hover:bg-black'
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
