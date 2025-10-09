import React from 'react';

const Skeleton = () => {
  return (
    <div className='w-full border rounded-2xl border-b-gray p-5 animate-pulse  bg-gray-100 pt-6'>
      {/* Top Section */}
      <div className='w-full'>
        <div className='flex items-center justify-between w-full'>
          <div className='h-4 w-1/3 bg-gray-200 '></div>
        </div>
        <div className='h-4 w-1/2 bg-gray-200  mt-2'></div>
      </div>

      {/* Bottom Section */}
      <div className='w-full flex items-center justify-between gap-4 mt-6'>
        {/* Favorite Button */}
        {/* Receipt Button */}
        <div className='h-14 w-full rounded-full bg-gray-200'></div>
        {/* Reorder Button */}
        <div className='h-14 w-full  rounded-full bg-gray-200 '></div>
      </div>
    </div>
  );
};

const OrderHistorySkeleton = ({ hasHeader = true, noOfBoxes = 9 }) => {
  return (
    <div className=''>
      {hasHeader && (
        <div className='flex items-center gap-5 pb-6'>
          <div className='h-12 bg-gray-200 w-24 sm:w-80 shimmer'></div>
        </div>
      )}
      <div className='grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-7 '>
        {Array(noOfBoxes)
          .fill()
          .map((_, index) => (
            <Skeleton key={index} />
          ))}
      </div>
    </div>
  );
};

export default OrderHistorySkeleton;
