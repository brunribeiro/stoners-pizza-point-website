import React from 'react';

const RewardSkeleton = () => {
  return (
    <div className='bg-white p-4 md:p-12 max-w-[85%] mx-auto text-center flex flex-col gap-5 animate-pulse '>
      {/* Banner Section Skeleton */}
      <div className='bg-primary-light p-8 pb-20 mb-1'>
        <div className='mb-8 text-left space-y-2'>
          <div className='h-8 md:h-12 bg-gray-300 rounded w-1/2'></div>
          <div className='h-8 md:h-12 bg-gray-300 rounded w-2/3'></div>
        </div>
        <div className='h-6 bg-gray-300 rounded w-1/3 mb-8 mt-12'></div>

        {/* Steps Skeleton */}
        <div className='flex flex-col gap-4 sm:grid grid-cols-11 gap-4 mb-8 items-center mt-2'>
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <div className='col-span-2 flex flex-col items-center gap-2'>
                <div className='w-20 h-20 bg-gray-300 rounded-full'></div>
                <div className='h-4 bg-gray-300 rounded w-3/4 mt-4'></div>
                <div className='h-3 bg-gray-200 rounded w-1/2'></div>
              </div>
              {i < 3 && (
                <div className='col-span-1 flex justify-center items-center'>
                  <div className='w-6 h-6 bg-gray-300 rounded'></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className='bg-white rounded-2xl p-4 md:flex justify-between items-center mb-8 -mt-20 w-[80%] mx-auto primary-border'>
        <div className='flex gap-4 items-center sm:ml-10 mb-4 md:mb-0'>
          <div className='w-20 h-20 bg-gray-300 rounded-full'></div>
          <div>
            <div className='h-4 bg-gray-300 rounded w-32 mb-3'></div>
            <div className='h-4 bg-gray-300 rounded w-40'></div>
          </div>
        </div>
        <div className='bg-gray-200 text-white pl-7 rounded-lg p-4 flex justify-between items-center gap-7 h-32 sm:w-96'></div>
      </div>

      <div className='text-left'>
        <div className='h-8 bg-gray-300 rounded w-1/3 mb-4'></div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='primary-border rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gray-100'
            >
              <div className='text-left w-full sm:w-3/5 space-y-2'>
                <div className='h-4 bg-gray-300 rounded w-1/2'></div>
                <div className='h-3 bg-gray-200 rounded w-full'></div>
                <div className='h-10 bg-gray-300 rounded w-full'></div>
              </div>
              <div className='w-full sm:w-2/5 flex justify-center sm:justify-end'>
                <div className='w-28 h-28 bg-gray-300 rounded'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardSkeleton;
