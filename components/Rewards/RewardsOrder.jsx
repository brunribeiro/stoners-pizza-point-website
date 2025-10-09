import React from 'react';

import InboxLists from '../Inbox';

import MyLoyaltyCard from './MyLoyaltyCard';
import RewardsOrderHistory from './RewardsOrderHistory';

import useRewards from '@/hook/rewards/useRewards';
import IncentivioLoader from '@/widgets/incentivioLoader';

const RewardsOrder = () => {
  const { ...dt } = useRewards();

  return (
    <>
      <div className='text-[21px] font-bold   py-6'>My Loyalty</div>
      {dt?.loader ? (
        <div className='flex h-40 justify-center items-center'>
          <IncentivioLoader size={6} />
        </div>
      ) : (
        <>
          <MyLoyaltyCard
            points={`${dt?.loyaltyData?.confirmedPoints} pts`}
            showHistory={dt.showHistory}
            setShowHistory={dt.setShowHistory}
          />
          {dt.showHistory ? (
            <RewardsOrderHistory data={dt.history} />
          ) : (
            <InboxLists title='Rewards' />
          )}
        </>
      )}
    </>
  );
};

export default RewardsOrder;
