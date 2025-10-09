import React from 'react';

const AllergySkeleton = () => {
  return Array.from({ length: 9 }).map((_, index) => (
    <div
      key={index}
      className='flex flex-col items-center justify-center py-3 rounded-md shadow-md border-2 border-black bg-gray-600 animate-pulse h-36'
    >
      <div className='w-16 h-16 bg-gray-400 rounded-full mb-5' />
      <div className='w-20 h-4 bg-gray-400 rounded' />
    </div>
  ));
};
export default AllergySkeleton;
