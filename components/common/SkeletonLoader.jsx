import React from 'react';

export const Skeleton = () => {
  return (
    <div>
      <div className='relative h-[316px] animate-pulse bg-gray-200 rounded-3xl skeleton-wrapper'>
        <div className='absolute bottom-0 h-10 w-full bg-gray-200 rounded-md shimmer'></div>
        {/* <div className='bg-gray-200 rounded-3xl mb-4 shimmer'></div> */}
        {/* <div className='h-4 bg-gray-200 rounded-md mb-2 shimmer'></div>
        <div className='h-6 w-20 bg-gray-200 rounded-md shimmer mt-10'></div> */}
      </div>
    </div>
  );
};

const SkeletonLoader = ({ noOfBoxes = 8, wrapperClass = '' }) => {
  return (
    <div className='mt-8'>
      {/* {showHeader && (
        <div className='flex items-center gap-5 mb-10 mt-[2px]'>
          <div className='h-9 bg-gray-200 rounded-md w-32 shimmer'></div>
          <div className='border-b border-gray-300 w-full'></div>
        </div>
      )} */}

      <div className='h-[50px] max-w-[250px] bg-gray-200 rounded-md'></div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6 ${wrapperClass}`}
      >
        {Array(noOfBoxes)
          .fill()
          .map((_, index) => (
            <Skeleton key={index} />
          ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
