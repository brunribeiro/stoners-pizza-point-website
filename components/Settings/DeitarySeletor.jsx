import React, { useEffect } from 'react';
import Image from 'next/image';

import DeitarySkeleton from '../common/DeitarySkeleton';

import { DEFAULT_IMAGE } from '@/utils/constant';

const DietarySelector = ({ dt }) => {
  const formValue = dt.watch('extendedAttributes.DIETARY_PREFERENCES');
  const itemImage = DEFAULT_IMAGE;

  useEffect(() => {
    if (dt.openDietDetail) {
      dt.setDietSelected(formValue || '');
    }
  }, [dt.openDietDetail]);

  const toggleSelection = (value) => {
    dt.setDietSelected((prev) => (prev === value ? '' : value));
  };

  return (
    <div className='bg-black h-full'>
      <div className='bg-black grid grid-cols-1 gap-6 px-10 py-9 w-full'>
        {dt?.loader?.master ? (
          <DeitarySkeleton />
        ) : (
          dt?.masterList.map((item) => {
            const isSelected = dt.dietSelected === item.code;
            return (
              <button
                key={item.value}
                onClick={() => toggleSelection(item.code)}
                className={`relative flex items-center justify-between w-full p-4 py-2 rounded-md border-2 shadow-md transition-all 
                  ${isSelected ? 'bg-[#c3f2b2] border-green' : 'bg-white border-white'}`}
              >
                <div className='flex items-center gap-4'>
                  <div className='relative w-24 h-24'>
                    <Image
                      src={item.img ? item.img : itemImage}
                      alt={item.code}
                      fill
                      className='object-contain'
                    />
                  </div>
                  <span className='text-sm font-bold text-black'>{item.name.toUpperCase()}</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-green' : 'border-gray-400'
                  }`}
                >
                  {isSelected && <div className='w-2.5 h-2.5 bg-green rounded-full' />}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DietarySelector;
