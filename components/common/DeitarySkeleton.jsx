import React from 'react';

const DeitarySkeleton = ({ rewards }) => {
  return Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className={`flex items-center justify-between w-full p-4 py-2 rounded-md border-2 border-black shadow-md bg-gray-600 animate-pulse h-32  ${rewards ? '!bg-gray-200 !border-gray-200' : ''}`}
    >
      <div className='flex items-center gap-4'>
        {!rewards && <div className='w-20 h-20 bg-gray-400 rounded-full' />}
        <div className='w-24 h-4 bg-gray-400 rounded' />
      </div>
      <div className='w-5 h-5 rounded-full border-2 border-gray-400' />
    </div>
  ));
};

export default DeitarySkeleton;
