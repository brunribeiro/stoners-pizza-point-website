import Image from 'next/image';
import React from 'react';

import Button from '@/widgets/button';

const NoData = ({ title = '', desc, IsOrderHistory = false, showButton }) => {
  return (
    <div className=' bg-white flex flex-col items-center '>
      {title && (
        <h1 className='text-2xl font-stone uppercase sm:text-[48px] mb-5 w-full text-left'>
          {title}
        </h1>
      )}

      <div className='flex flex-col items-center justify-center flex-1'>
        <div className='w-40 h-40 my-8'>
          <Image
            src='/images/EmptyBox.svg'
            alt='No Orders'
            className='object-contain w-full h-full'
            width={122}
            height={50}
          />
        </div>

        <h2 className='text-center text-3xl font-stone uppercase text-black mb-4 w-[300px]'>
          {desc}
        </h2>

        {IsOrderHistory && (
          <p className='text-sm text-gray-600 mb-4'>Make your first order today</p>
        )}

        {showButton && (
          <Button
            title='START AN ORDER'
            className='w-[90%] text-xl bg-slate-50 text-zinc-800  hover:bg-zinc-700'
            onClick={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default NoData;
