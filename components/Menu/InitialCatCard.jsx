import React from 'react';
import Image from 'next/image';

import { DEFAULT_IMAGE } from '@/utils/constant';

const InitialCatCard = ({ data, onClick }) => {
  return (
    <>
      {data.map((item) => {
        const hqImageUrl = item.smallImg || DEFAULT_IMAGE;

        return (
          <button
            onClick={() => onClick?.(item.id, item.name)}
            key={item.id}
            className='relative text-center group rounded-3xl border-[3px] h-[200px] sm:h-[260px] border-gray-300 hover:shadow-xl transition duration-300 cursor-pointer bg-gray-50 overflow-hidden'
          >
            <div className='relative w-full h-[260px] overflow-hidden'>
              <Image
                src={hqImageUrl}
                alt={item.name}
                title={item.name}
                fill
                className='object-cover transition-transform duration-300 hover:scale-105'
                loading='lazy'
              />
            </div>

            <div className='absolute bottom-0 w-full px-3 py-4 sm:p-4 sm:pt-6 sm:px-5 bg-gradient-to-t from-black to-transparent text-left font-stone uppercase text-white md:text-3xl flex flex-col justify-end z-10'>
              <div className='line-clamp-2 max-h-[96px] overflow-hidden text-white'>
                {item.name}
              </div>
            </div>
          </button>
        );
      })}
    </>
  );
};

export default InitialCatCard;
