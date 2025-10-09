import React from 'react';

const ScheduleTimeSkeleton = () => {
  return (
    <div className='flex w-full flex-col px-5 sm:px-10 gap-2'>
      {/* Label skeleton */}
      <div className='mb-2'>
        <div className='h-7 w-24 bg-gray-200 rounded animate-pulse'></div>
      </div>

      {/* Time options grid skeleton */}
      <div className='grid grid-cols-3 gap-2.5'>
        {Array.from({ length: 27 }).map((_, index) => (
          <div key={index} className='h-10 bg-gray-200 rounded-lg animate-pulse'></div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleTimeSkeleton;
