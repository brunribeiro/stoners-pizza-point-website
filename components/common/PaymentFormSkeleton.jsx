import React from 'react';

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const PaymentFormSkeleton = () => {
  return (
    <div className='mt-5 mx-5'>
      <div className='flex items-center space-x-3 mb-6'>
        <SkeletonBox className='w-10 h-10' />
        <SkeletonBox className='w-40 h-10' />
      </div>
      <div className='max-w-2xl  border-[3px] rounded-3xl p-6 shadow-sm py-8'>
        {/* Name */}
        <div className='space-y-4 mb-8'>
          <SkeletonBox className='w-28 h-10' />
          <div className='grid  gap-4'>
            <SkeletonBox className='h-12 w-full' />
            <SkeletonBox className='h-12 w-full' />
          </div>
        </div>

        {/* Billing Address */}
        <div className='space-y-4 mb-8'>
          <SkeletonBox className='w-36 h-10' />
          <div className='grid grid-cols-2 gap-4'>
            <SkeletonBox className='h-12 w-full' />
            <SkeletonBox className='h-12 w-full' />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <SkeletonBox className='h-12 w-full' />
            <SkeletonBox className='h-12 w-full' />
            <SkeletonBox className='h-12 w-full' />
          </div>
          <SkeletonBox className='h-12 w-full' />
        </div>

        {/* Payment Details */}
        <div className='space-y-4 mb-8'>
          <SkeletonBox className='w-32 h-10' />
          <div className='grid grid-cols-3 gap-4'>
            <SkeletonBox className='h-12 w-full' />
            <SkeletonBox className='h-12 w-full' />
            <SkeletonBox className='h-12 w-full' />
          </div>
          <div className='grid grid-cols-2 gap-4 mt-4'>
            <SkeletonBox className='h-12 w-full' />
            <SkeletonBox className='h-12 w-full' />
          </div>
        </div>

        {/* Button */}
        <div className='mt-14'>
          <SkeletonBox className='h-16 w-full rounded-full' />
        </div>
      </div>
    </div>
  );
};

export default PaymentFormSkeleton;
