import React, { useContext } from 'react';

import RecentCard from './RecentCard';

import Button from '@/widgets/button';
import AppContext from '@/utils/appContext';

const RewardsOrderHistory = ({ data }) => {
  const { loyaltyHistories } = data;
  const { setOpenPopup } = useContext(AppContext);
  return (
    <>
      <div className='text-[21px] font-bold   mt-6 mb-6'>History</div>
      <div className='flex gap-4 flex-col mb-5'>
        {loyaltyHistories?.map((item, index) => {
          return (
            <RecentCard
              key={index + item.transactionDate}
              title={item.description}
              date={item.transactionDate}
              no={item.originalPoints}
            />
          );
        })}
      </div>
      <Button
        title='LOYALTY CARD'
        onClick={() => {
          setOpenPopup('Loyalty Card');
        }}
        className='w-full'
      />
    </>
  );
};

export default RewardsOrderHistory;
