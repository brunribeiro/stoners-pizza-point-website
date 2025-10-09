import React, { useEffect } from 'react';
import Image from 'next/image';

import AllergySkeleton from '../common/AllergySkeleton';

import CheckRoundIcon from '@/icons/CheckRoundIcon';
import { DEFAULT_IMAGE } from '@/utils/constant';

const AllergySelector = ({ dt }) => {
  const formValue = dt.watch('extendedAttributes.ALLERGIES');

  const itemImage = DEFAULT_IMAGE;

  // Sync allergy state with form value when drawer opens
  useEffect(() => {
    if (dt.openPreferenceDetail) {
      dt.setAllergySelected(formValue || '');
    }
  }, [dt.openPreferenceDetail]);

  const toggleSelection = (value) => {
    dt.setAllergySelected((prev) => (prev === value ? '' : value));
  };

  return (
    <div className='bg-black h-full'>
      <div className='bg-black grid grid-cols-3 gap-6 px-12 py-9'>
        {dt?.loader?.master ? (
          <AllergySkeleton />
        ) : (
          dt?.masterList?.map((item) => {
            const isSelected = dt.allergySelected === item.code;
            return (
              <button
                key={item.id}
                type='button'
                onClick={() => toggleSelection(item.code)}
                className={`relative flex flex-col items-center justify-center py-3 rounded-md shadow-md border-2 ${
                  isSelected ? 'bg-[#c3f2b2] border-green' : 'bg-white border-white'
                }`}
              >
                <div className='w-[100px] h-[100px]'>
                  <Image
                    src={item.img ? item.img : itemImage}
                    alt={item.code}
                    width={100}
                    height={100}
                    className='w-full h-full object-contain'
                  />
                </div>
                <span className='text-xs font-bold text-black text-center mt-1'>
                  {item.name.toUpperCase()}
                </span>
                {isSelected && (
                  <div className='absolute top-0 right-0 text-green'>
                    <CheckRoundIcon size='28' green />
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AllergySelector;
