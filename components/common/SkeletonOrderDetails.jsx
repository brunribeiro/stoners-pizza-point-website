import React from 'react';

const SkeletonOrderDetails = ({ sidemenu= false }) => {
  return (
    <div className='animate-pulse space-y-6 px-2'>
      {/* timestamp */}
      {!sidemenu ? (
        <div className='h-4 w-32 bg-gray-300 rounded mx-9' />
      ) : (
        <div className='h-20 mt-10 w-full bg-gray-200 rounded' />
      )}

      {/* status icons + progress bar */}
      <div className='flex flex-col items-center justify-center space-y-4 h-56 bg-primary-light'></div>

      {/* items list */}
      <div className='space-y-2 px-9'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='flex gap-6 py-4 border-b-2 border-gray-200/60'>
            <div className='h-16 w-20 bg-gray-300 rounded' />
            <div className='flex-1 space-y-2'>
              <div className='flex justify-between'>
                <div className='h-4 w-24 bg-gray-300 rounded' />
                <div className='h-4 w-16 bg-gray-300 rounded' />
              </div>
              {[...Array(2)].map((_, j) => (
                <div key={j} className='h-3 w-32 bg-gray-300 rounded' />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* totals & customer / payment info */}
      <div className='space-y-6 px-9 pb-8'>
        {/* headings */}
        <div className='h-5 w-40 bg-gray-300 rounded' />

        {/* subtotal / tax / tip */}
        <div className='space-y-2'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='flex justify-between'>
              <div className='h-3 w-28 bg-gray-300 rounded' />
              <div className='h-3 w-16 bg-gray-300 rounded' />
            </div>
          ))}
        </div>

        {/* grand total */}
        <div className='flex justify-between py-3'>
          <div className='h-4 w-24 bg-gray-300 rounded' />
          <div className='h-4 w-20 bg-gray-300 rounded' />
        </div>

        {/* two info cards */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className='p-4 bg-gray-100 rounded space-y-2'>
            <div className='h-3 w-32 bg-gray-300 rounded' />
            {[...Array(3)].map((_, j) => (
              <div key={j} className='h-3 w-40 bg-gray-300 rounded' />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonOrderDetails;
