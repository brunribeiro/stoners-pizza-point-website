import Image from 'next/image';
import React from 'react';

const PromotionModel = () => {
  return (
    <div className='flex items-center sm:flex-row flex-col rounded-2xl overflow-hidden'>
      <div className='sm:min-w-[125px] relative'>
        <div className='sm:w-[125px] w-full h-[135px]'>
          <Image src='/images/product.webp' fill className='object-cover' alt='Product Image' />
        </div>
        <div className='absolute top-2 left-2 px-4 py-2 rounded-full bg-primary text-white font-bold text-xs'>
          NEW
        </div>
      </div>
      <div className='py-3 px-5 bg-white'>
        <div className='text-lg font-bold text-black mb-1 leading-tight'>
          YOU DID IT! 150 Points = A chocolate chip cooke
        </div>
        <p className='mb-2 text-sm'>
          You earned 150 Points. Please enjoy free chocolate chip cookie
        </p>
        <div className='text-xs text-black text-opacity-50'>Last month</div>
      </div>
    </div>
  );
};

export default PromotionModel;
