import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import OpeningTime from './OpeningTime';

import Location from '@/shared/location';
import { DEFAULT_IMAGE } from '@/utils/constant';
import { formatPhoneNumber2 } from '@/utils/helper';

const StoreDetail = ({ rest }) => {
  const isValidSrc = (src) => {
    if (!src) return false;
    return src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://');
  };

  return (
    <div>
      <div className='w-full  h-[265px] border'>
        <Location restDetail={rest} showControllers={false} />
      </div>
      <div className=' bg-white max-w-3xl mx-auto flex flex-col gap-4 p-3 sm:p-8 sm:px-9'>
        <div className='flex flex-col gap-1 '>
          <h2 className='text-xl font-stone uppercase text-gray-800'>{rest?.name}</h2>

          <button
            onClick={() => {
              if (rest?.lat && rest?.long) {
                const mapsUrl = `https://www.google.com/maps?q=${rest.lat},${rest.long}`;
                window.open(mapsUrl, '_blank');
              }
            }}
            className='text-sm text-foreground font-medium text-left hover:text-primary transition-all'
          >
            {`${rest?.streetAddress}, ${rest?.city}, ${rest?.state}, ${rest?.country}, ${rest?.zip}`}
          </button>

          <div className='text-foreground font-medium text-sm'>
            <Link
              href={`tel:${rest?.telephone}`}
              className='underline underline-offset-2 border-foreground hover:text-primary transition-colors duration-300 hover:text-blue-600 hover:border-blue-600'
            >
              {formatPhoneNumber2(rest?.telephone)}
            </Link>
          </div>
        </div>
        {isValidSrc(rest?.mediumImg) && (
          <div className='h-40 overflow-hidden rounded-lg'>
            <Image
              width={400}
              height={164}
              src={rest?.mediumImg || DEFAULT_IMAGE}
              alt={rest?.name || 'Store Image'}
              className='w-full h-full object-contain'
              title={rest?.name}
              loading='eager'
            />
          </div>
        )}
      </div>
      <OpeningTime rest={rest} />
    </div>
  );
};

export default StoreDetail;
