import React from 'react';

import CoupanIcon from '@/icons/CoupanIcon';
import Button from '@/widgets/button';

const ApplyOffer = () => {
  return (
    <>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center bg-white py-3 sm:px-5 px-3 rounded-2xl'>
          <div className='flex'>
            <div className='text-teal-500'>
              <CoupanIcon color='primary' />
            </div>
            <span className='ml-2 text-gray-800 font-medium'>10% Off on your order</span>
          </div>
          <input
            type='radio'
            aria-label='discount'
            name='discount'
            className='ml-auto form-radio h-5 w-5 border-2 text-gray-400 border-black border-opacity-10 focus:ring-0'
          />
        </div>
        <div className='flex items-center bg-white py-3 sm:px-5 px-3 rounded-2xl'>
          <div className='flex'>
            <div className='text-teal-500'>
              <CoupanIcon />
            </div>
            <span className='ml-2 text-gray-800 font-medium'>20% Off on your order</span>
          </div>
          <input
            type='radio'
            aria-label='discount'
            name='discount'
            className='ml-auto form-radio h-5 w-5 text-gray-400 border-gray-300 focus:ring-0'
          />
        </div>
        <div className='flex items-center bg-white py-3 sm:px-5 px-3 rounded-2xl'>
          <div className='flex'>
            <div className='text-teal-500'>
              <CoupanIcon />
            </div>
            <span className='ml-2 text-gray-800 font-medium'>
              Free drink and fries with any order over $20
            </span>
          </div>
          <input
            type='radio'
            aria-label='discount'
            name='discount'
            className='ml-auto form-radio h-5 w-5 text-gray-400 border-gray-300 focus:ring-0'
          />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-2'>
        <Button title='Cancel' className='bg-white !  w-full' />
        <Button title='Apply' className='w-full' />
      </div>
    </>
  );
};

export default ApplyOffer;
