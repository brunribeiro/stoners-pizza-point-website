import React from 'react';

const CheckoutSkeleton = ({ notcheckOut = false }) => {
  return (
    <div className='  animate-pulse  w-[85%] mx-auto px-4'>
      {/* Progress Bar */}
      {/* {!notcheckOut && (
        <div className='flex items-center justify-center space-x-4 mb-16'>
          <div className='md:h-12 md:w-12 h-9 w-14 rounded-full bg-gray-300'></div>
          <div className='h-2 w-32 bg-gray-300'></div>
          <div className='md:h-12 md:w-12 h-9 w-14 rounded-full bg-gray-300'></div>
          <div className='h-2 w-32 bg-gray-300'></div>
          <div className='md:h-12 md:w-12 h-9 w-14  rounded-full bg-gray-300'></div>
        </div>
      )} */}

      {/* Main Content */}
      <div
        className={`flex xl:gap-16  gap-5 justify-center lg:flex-nowrap flex-wrap ${notcheckOut && 'mt-10'}`}
      >
        {/* Left Column */}
        <div className='mt-6 lg:w-4/6 w-full  p-3'>
          <div className='h-10 mb-4 w-1/4 bg-gray-300'></div>
          <div className='space-y-4'>
            <div className='h-20 w-full bg-gray-300'></div>
            <div className='h-20 w-full bg-gray-300'></div>
            <div className='h-20 w-full bg-gray-300'></div>
            <div className='h-20 w-full bg-gray-300'></div>
          </div>
          <div className='flex justify-end my-4'>
            <div className='h-4 w-20 bg-gray-300'></div>
          </div>
          <div className='mb-4'>
            <div className='h-6 mb-4 w-20 bg-gray-300'></div>
            <div className='flex gap-2'>
              <div className='h-32 w-full bg-gray-300'></div>
              <div className='h-32 w-full bg-gray-300'></div>
              <div className='h-32 w-full bg-gray-300'></div>
              <div className='h-32 w-full bg-gray-300'></div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-12  w-full lg:w-[35%]'>
          <div className='mt-16'></div>

          <div className='space-y-4 mt-6'>
            {notcheckOut && <div className='h-24 w-full bg-gray-200'></div>}

            <div className='h-24 w-full bg-gray-200'></div>
            <div className='h-6 w-3/4 bg-gray-300'></div>
            <div className='h-6 w-3/4 bg-gray-300'></div>
          </div>
          <div className=' flex flex-col gap-6'>
            <div className='flex  justify-between'>
              <div className='h-6 w-1/2 bg-gray-200'></div>
              <div className='h-6  w-1/5 bg-gray-200'></div>
            </div>
            <div className='flex  justify-between'>
              <div className='h-6 w-1/2 bg-gray-200'></div>
              <div className='h-6  w-1/5 bg-gray-200'></div>
            </div>
          </div>
          <div className='h-14 w-full bg-gray-300 '></div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton;
