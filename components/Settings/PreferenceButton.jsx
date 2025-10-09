import React from 'react';

import RightIcon from '@/icons/RightIcon';

const PreferenceButton = ({ dt }) => {
  return (
    <div className='flex flex-col gap-1 mt-3'>
      <span className='font-extrabold '> Nutritional</span>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-y-4 gap-x-5'>
        <button
          type='button'
          onClick={() => {
            dt.setOpenPreferenceDetail(true);
            dt.fetchMasters('ALLERGIES');
          }}
          className='flex items-center justify-between w-full px-4 py-3 primary-border rounded-lg shadow-sm text-sm font-medium  hover:bg-gray-50'
        >
          <span>Allergies</span>
          <RightIcon />
        </button>
        <button
          type='button'
          onClick={() => {
            dt.setOpenDietDetail(true);
            dt.fetchMasters('DIETARY');
          }}
          className='flex items-center justify-between w-full px-4 py-3 primary-border rounded-lg shadow-sm text-sm font-medium  hover:bg-gray-50'
        >
          <span>Dietary Preference</span>
          <RightIcon />
        </button>
      </div>
    </div>
  );
};

export default PreferenceButton;
