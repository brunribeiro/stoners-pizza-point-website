import React from 'react';

const AccountSkeleton = () => {
  return (
    <div className=' animate-pulse space-y-14'>
      {/* Top Profile Section */}
      <div className='flex justify-between flex-wrap items-center bg-gray-100 p-6 rounded-lg'>
        <div className='flex items-center space-x-4'>
          <div className='w-16 h-16 bg-gray-300 rounded-full'></div>
          <div>
            <div className='h-5 w-40 bg-gray-300 rounded mb-2'></div>
            <div className='h-4 w-48 sm:w-60 bg-gray-200 rounded'></div>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center sm:flex-row gap-5 mt-4 lg:mt-0'>
          <div className='w-48 h-12 bg-gray-300 rounded-lg'></div>
          <div className='w-48 h-12 bg-gray-300 rounded-lg'></div>
        </div>
      </div>

      {/* Customer Info Section */}
      <div className='space-y-7 '>
        <div className='h-6 w-40 bg-gray-300 rounded'></div>

        <div className='grid grid-cols-3 gap-6'>
          <div className='h-12 bg-gray-200 rounded'></div>
          <div className='h-12 bg-gray-200 rounded'></div>
          <div className='h-12 bg-gray-200 rounded'></div>
        </div>

        <div className='h-6 w-40 bg-gray-300 rounded '></div>

        <div className='flex gap-6 '>
          <div className='h-12 w-[32%] bg-gray-200 rounded'></div>
          <div className='h-12 w-[32%] bg-gray-200 rounded'></div>
        </div>

        <div className='flex items-center space-x-2 mt-2'>
          <div className='w-5 h-5 bg-gray-200 rounded'></div>
          <div className='h-4 w-40 bg-gray-200 rounded'></div>
        </div>

        <div className='flex justify-end'>
          <div className='w-24 h-10 bg-gray-300 rounded-lg'></div>
        </div>
      </div>

      {/* Divider */}
      <div className='border-t pt-8 space-y-6'>
        {/* Change Password Section */}
        <div className='h-6 w-48 bg-gray-300 rounded'></div>

        <div className='grid grid-cols-3 gap-6'>
          <div className='h-12 bg-gray-200 rounded'></div>
          <div className='h-12 bg-gray-200 rounded'></div>
          <div className='h-12 bg-gray-200 rounded'></div>
        </div>

        <div className='flex justify-end'>
          <div className='w-24 h-10 bg-gray-300 rounded-lg'></div>
        </div>
      </div>
    </div>
  );
};

export default AccountSkeleton;
