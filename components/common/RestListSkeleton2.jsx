import React from 'react';

const RestListSkeleton2 = () => {
  return (
    <div className=' w-full grid gap-6 mt-2 p-3'>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className='h-12 w-full bg-gray-200 animate-pulse'></div>
      ))}
    </div>
  );
};

export default RestListSkeleton2;
