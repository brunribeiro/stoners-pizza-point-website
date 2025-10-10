import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { DEFAULT_IMAGE } from '@/utils/constant';
import { displayAmount } from '@/utils/helper';

const CategoryCard = ({ className = '', name = '', price = '', onClick, img = DEFAULT_IMAGE }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [img]);

  const lowQualityUrl = `${img}?quality=1`;

  return (
    <button
      className={`text-center relative rounded-3xl overflow-hidden border-[3px] border-gray-200 duration-300 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className='relative w-full h-[200px] sm:h-[250px] overflow-hidden'>
        <Image
          src={lowQualityUrl}
          width={300}
          height={300}
          alt={name}
          className={`absolute top-0 left-0 w-full h-[200px] sm:h-[250px] object-cover transition-opacity duration-300 ease-in-out ${
            isLoading ? 'opacity-100' : 'opacity-0'
          }`}
          title={name}
          loading='eager'
        />

        <Image
          src={img || DEFAULT_IMAGE}
          width={300}
          height={300}
          alt={name}
          className={`absolute top-0 left-0 w-full h-[200px] sm:h-[250px] object-cover transition-opacity duration-300 ease-in-out ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          title={name}
          loading='lazy'
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>

      <div className='p-3 px-4 sm:px-5 flex flex-col justify-between bg-primary-light'>
        <div className='mb-2 text-left'>
          <div className='font-extrabold text-base sm:text-[18px] text-black mb-1'>{name}</div>
          {/* {content && <div className='text-stone-black text-sm line-clamp-2'>{content}</div>} */}
        </div>
        <div className='flex justify-between gap-2 items-center'>
          <div className='text-sm sm:text-lg text-foreground font-semibold'>
            {price !== 0 && displayAmount(price)}
          </div>
        </div>
      </div>
    </button>
  );
};

export default CategoryCard;
