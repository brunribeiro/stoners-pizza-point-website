import React from 'react';

const RestListSkeleton = ({ isChange }) => {
  return (
    <div className='w-full grid gap-6 mt-4 px-3 sm:px-8'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className='flex flex-col p-4 animate-pulse bg-gray-100 rounded-lg'>
          <div className='flex gap-2 items-center justify-between'>
            <div className='h-7 w-1/2 bg-gray-200 '></div>
            <div className='flex gap-2 items-center'>
              <div className='h-7 w-4 bg-gray-200 '></div>
            </div>
          </div>
          <div className='h-4 w-2/3 bg-gray-200  mt-2 mb-4'></div>

          {!isChange && (
            <>
              <div className='h-8 w-1/2 bg-gray-200'></div>

              <div className='mt-4 flex gap-3'>
                <div className='h-12 w-full bg-gray-200 rounded-full'></div>
                <div className='h-12 w-full bg-gray-200 rounded-full'></div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default RestListSkeleton;
