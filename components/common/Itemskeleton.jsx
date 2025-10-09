import React from 'react';

const Itemskeleton = ({ className }) => {
  return (
    <div className='animate-pulse flex flex-col-reverse md:flex-row gap-4 sm:pt-10 pb-20'>
      <div className=' bg-gray-100 rounded md:w-1/2 flex flex-col gap-3 p-4'>
        <div className=' bg-gray-200  rounded w-72 flex flex-col gap-3 p-4 mb-4'></div>
        <div className='mb-2 animate-pulse'>
          <div className='h-6 bg-gray-300 rounded w-1/3 mb-3'></div>

          <div className='h-4 bg-gray-200 rounded w-2/3 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-5/6 mb-2'></div>
          <div className='w-full text-right mt-3'>
            <div className='inline-block h-8 w-24 bg-gray-300 rounded'></div>
          </div>
        </div>

        <div className='p-6'>
          {Array(4)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className={`animate-pulse border-[3px] border-[#dadada] rounded-[10px] items-center relative gap-1 flex justify-between cursor-pointer px-3 ${className} my-4`}
              >
                <div className='p-2.5 pr-0 flex flex-col gap-2'>
                  <div className='h-4 w-24 bg-gray-300 rounded'></div>
                  <div className='h-4 w-16 bg-gray-200 rounded'></div>
                </div>

                <div className='px-2 '>
                  <div className='w-10 h-10 bg-gray-300 rounded-full'></div>
                </div>
              </div>
            ))}
          <div className='bg-gray-200 h-20 rounded w-full'></div>
        </div>
      </div>
      <div className='h-80 bg-gray-300 rounded md:w-1/2'></div>
    </div>
  );
};

const Buttonskeleton = () => {
  return <div className='bg-gray-200 animate-pulse h-14 rounded-full w-1/2'></div>;
};
const PlusMinusSkeleton = () => {
  return <div className='bg-gray-200 animate-pulse h-14 rounded-full w-1/4'></div>;
};
const SectionSkeleton = () => {
  return (
    <div className='bg-primary-light animate-pulse absolute -top-16 left-1 h-14 rounded-t-[25px] w-full'></div>
  );
};
export { Itemskeleton, Buttonskeleton, PlusMinusSkeleton, SectionSkeleton };
