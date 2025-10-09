import React from 'react';

import ClockIcon from '@/icons/ClockIcon';
import StarIcon from '@/icons/StarIcon';
import RewardIcon from '@/icons/RewardIcon';

const MyLoyaltyCard = ({ points, showHistory, setShowHistory }) => {
  return (
    <div className='bg-primary rounded-xl p-5 relative'>
      <div className='text-white'>You have</div>
      <div className='flex items-center gap-1 font-bold text-2xl text-white uppercase'>
        <StarIcon /> {points}
      </div>
      <button
        onClick={() => {
          setShowHistory((prev) => !prev);
        }}
        className='absolute right-3 top-3'
      >
        {showHistory ? <RewardIcon className='text-primary' /> : <ClockIcon />}
      </button>
    </div>
  );
};

export default MyLoyaltyCard;
