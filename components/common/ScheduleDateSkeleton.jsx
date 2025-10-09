import React from 'react';

const ScheduleDateSkeleton = () => {
  return (
    <div className='flex gap-3 py-4'>
      {[...Array(4)].map((_, index) => (
        <div key={index} className='w-[96px] h-24 bg-gray-300 animate-pulse rounded-xl' />
      ))}
    </div>
  );
};
export default ScheduleDateSkeleton;
