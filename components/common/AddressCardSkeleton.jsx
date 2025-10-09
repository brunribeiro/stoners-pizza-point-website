import React from 'react';

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const AddressCardSkeleton = () => {
  return (
    <div className='flex flex-col gap-6 mt-4 sm:px-8 px-6 mb-4'>
      <SkeletonBox className='h-5 w-1/3' />
      <SkeletonBox className='h-12 w-full' />

      <SkeletonBox className='h-5 w-1/3' />
      <SkeletonBox className='h-24 w-full' />

      <div className='h-12 w-full bg-red-300 animate-pulse rounded-full' />
    </div>
  );
};

export default AddressCardSkeleton;
