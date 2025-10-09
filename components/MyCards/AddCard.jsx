import React from 'react';

import PlusIcon from '@/icons/PlusIcon';

const AddCard = ({ name = '', handlePurchase }) => {
  return (
    <button
      onClick={handlePurchase}
      className='flex items-center justify-center p-4 rounded-2xl bg-gray-100 text-black h-[80px] w-full text-opacity-50'
    >
      <span className='flex items-center gap-1'>
        <PlusIcon className='w-3 text-black text-opacity-50' />
        {name}
      </span>
    </button>
  );
};

export default AddCard;
