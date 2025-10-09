import React from 'react';

import CloseIcon from '@/icons/CloseIcon';
import Button from '@/widgets/button';
import Dropdown from '@/widgets/dropdown';
import LocationDropdown from '@/widgets/locationDropdown';

const onVisible = () => {};

const SchedulerCard = () => {
  return (
    <div className='bg-gray-100 p-4 rounded-3xl'>
      <div className='flex justify-between items-center mb-2'>
        <div className='  text-lg font-bold'>Schedule Order</div>
        <button
          type='button'
          className='rounded-full focus:outline-none focus:ring-1 focus:ring-primary'
          onClick={() => {
            onVisible(false);
          }}
        >
          <CloseIcon className='w-4 h-4' />
        </button>
      </div>
      <div className='pb-3 mb-3 border-b border-gray-300'>
        <LocationDropdown
          locationaddress='20 North San Pedro Street San Jose, CA, 95110'
          locationname='My Home'
        />
      </div>
      <div className='grid grid-cols-2 gap-2 mb-4'>
        <Dropdown label='Select Day' />
        <Dropdown label='Select Time' />
      </div>
      <Button title='START MY ORDER' className='uppercase w-full' />
    </div>
  );
};

export default SchedulerCard;
