import React from 'react';

import DownIcon from '@/icons/DownIcon';

const LocationDropdown = ({
  locationname,
  locationaddress,

  error,
  mandatory = false,
  label,
}) => {
  return (
    <div>
      {label && (
        <label className='inline-block mb-2 text-xs font-medium text-foreground'>
          {label}
          {mandatory && <span className='text-red pl-0.5'>*</span>}
        </label>
      )}
      <div className='relative'>
        <div className='absolute top-8 right-6 z-10'>
          <DownIcon />
        </div>
        <div className='bg-white border border-gray-300 rounded-3xl px-4 p-2'>
          <div className='text-black font-semibold'>{locationname}</div>
          <div className='text-sm text-gray-500 max-w-[200px]'>{locationaddress}</div>
        </div>
      </div>
      {error && <p className='mt-1 text-xs font-medium text-red'>{error}</p>}
    </div>
  );
};

export default LocationDropdown;
