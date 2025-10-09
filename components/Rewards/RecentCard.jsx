import React from 'react';

import { formatDate } from '@/utils/helper';

const RecentCard = ({ no = '', date = '', title = '' }) => {
  return (
    <div className='bg-gray-100 rounded-xl p-4 flex justify-between items-center gap-5'>
      <div>
        <div className='text-black font-semibold'>{title}</div>
        <div className='text-black text-opacity-50 text-sm'>{formatDate(date)}</div>
      </div>
      <div className='py-2 px-4 bg-primary rounded-xl text-white leading-none'>{no}</div>
    </div>
  );
};

export default RecentCard;
