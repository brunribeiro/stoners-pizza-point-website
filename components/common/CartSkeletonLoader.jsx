import React from 'react';

const CartSkeletonLoader = () => {
  const array = [1, 2];
  return (
    <div className='h-[88dvh] flex flex-col justify-between mt-4'>
      <div className='px-4 animate-pulse '>
        {array.map((_, index) => (
          <div key={index} className='flex gap-5 bg-gray-100 px-6 p-3 border-b '>
            <div className='h-16 w-20 bg-gray-200 rounded mt-7'></div>
            <div className='flex flex-col py-4 w-full'>
              <div className='flex gap-5 justify-between mt-3 mb-2'>
                <div className='h-6 bg-gray-200  w-1/3 '></div>
                <div className='h-6 bg-gray-200  w-1/6'></div>
              </div>

              <div className='flex gap-5 justify-between my-3'>
                <div className='text-gray-700 text-[14px] w-full'>
                  {[...Array(1)].map((_, i) => (
                    <div key={i} className='mb-2'>
                      <div className='h-4 bg-gray-200  w-1/4 mb-1'></div>
                      {[...Array(0)].map((_, j) => (
                        <div key={j} className='flex w-full justify-between'>
                          <div className='h-4 bg-gray-200  w-1/3'></div>
                          <div className='h-4 bg-gray-200  w-1/6'></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons and PlusMinusCart */}
              <div className='flex justify-between gap-5 items-end'>
                <div className='flex gap-4'>
                  <div className='h-5 w-14 bg-gray-200 '></div>
                  <div className='h-5 w-14 bg-gray-200 '></div>
                </div>
                <div className='flex gap-4'>
                  <div className='h-8 w-8 bg-gray-200 rounded-full'></div>
                  <div className='h-8 w-6 bg-gray-200 '></div>
                  <div className='h-8 w-8 bg-gray-200 rounded-full'></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='flex-col sticky pt-2 bottom-0 flex gap-1 w-full px-4'>
        <div className='flex-col sticky pt-2 bg-white bottom-0 flex gap-1 w-full'>
          {/* Subtotal and Tax Skeleton */}
          <div className=' my-3 text-gray-500 text-sm'>
            <div className='flex items-center justify-between'>
              <div className='bg-gray-200  h-3 w-20 animate-pulse'></div>
              <div className='bg-gray-200 h-3 w-16 animate-pulse'></div>
            </div>
            <div className='flex items-center justify-between my-3'>
              <div className='bg-gray-200  h-3 w-20 animate-pulse'></div>
              <div className='bg-gray-200 h-3 w-16 animate-pulse'></div>
            </div>
          </div>

          {/* Total Skeleton */}
          {/* <div className='flex items-center justify-between text-xl mb-6'>
            <div className='bg-gray-200 h-6 w-16 animate-pulse'></div>
            <div className='bg-gray-200  h-6 w-24 animate-pulse'></div>
          </div> */}

          {/* Button Skeleton */}
          {/* <div className='mt-8 '>
            <div className='bg-gray-200 rounded-full h-16 w-full animate-pulse'></div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CartSkeletonLoader;
