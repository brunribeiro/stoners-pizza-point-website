import Image from 'next/image';
import React from 'react';

import { DEFAULT_IMAGE, TERMS_DATA } from '@/utils/constant';

const InboxDetail = ({ data }) => {
  return (
    <div className='bg-white rounded-3xl p-6 max-w-xl mx-auto text-black'>
      {/* Image */}
      <div className='relative  w-full h-[200px] sm:h-[260px] mb-6'>
        <Image
          src={data?.mediumImage || DEFAULT_IMAGE}
          alt={data?.title}
          fill
          className='object-contain'
        />
      </div>

      {/* Title and Description */}
      <h2 className='text-3xl font-stone uppercase mb-1'>{data?.title}</h2>
      <p className='text-foreground text-sm mb-6'>{data?.shortDescription}</p>

      {/* Validity */}
      <div className='mb-6'>
        <h3 className='font-extrabold text-base mb-1'>Validity</h3>
        <p className='text-sm text-foreground'>7 days upon redemption</p>
      </div>

      {/* Terms and Conditions */}
      <div>
        <h3 className='font-extrabold text-base mb-2'>Terms and Conditions</h3>
        <ol className='list-decimal list-inside text-sm text-foreground space-y-2'>
          {TERMS_DATA?.terms?.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default InboxDetail;
