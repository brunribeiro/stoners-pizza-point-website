import React from 'react';
import { useRouter } from 'next/router';

import ProfileIcon from '@/icons/ProfileIcon';
import RewardsIcon from '@/icons/RewardsIcon';
import PizzaIcon from '@/icons/PizzaIcon';
import routes from '@/utils/routes';

const AccountHead = ({ dtSetting }) => {
  const profile = dtSetting?.profileData;
  const router = useRouter();

  const actionButtonStyle =
    'flex gap-1 items-center h-[80%] justify-start p-1 px-2 w-52 rounded-xl border-[4px] border-solid border-[#d9d9da] hover:scale-105 transition-all';

  return (
    <div className='w-full flex flex-col xl:flex-row flex-wrap justify-between items-start md:items-center bg-primary-light p-4 rounded-xl gap-4'>
      <div className='flex gap-3 items-center w-full md:w-auto '>
        <div>
          <ProfileIcon width='70' />
        </div>
        <div className='flex flex-col '>
          <span className='uppercase font-stone text-2xl md:text-3xl '>
            {profile?.firstName} {profile?.lastName}
          </span>
          <span className='text-gray-400 text-sm  sm:text-base md:text-base'>{profile?.email}</span>
        </div>
      </div>

      <div className='flex flex-row gap-3 w-full md:w-auto'>
        <button
          className={actionButtonStyle}
          style={{ boxShadow: '0 0 8px rgba(0, 0, 0, 0.10)' }}
          onClick={() => {
            router.push(routes.inbox);
          }}
        >
          <div className='h-10 w-10 flex items-center justify-center'>
            <RewardsIcon />
          </div>
          <span className='uppercase font-stone text-sm sm:text-base md:text-[18px]'>Rewards</span>
        </button>

        <button
          className={actionButtonStyle}
          style={{ boxShadow: '0 0 8px rgba(0, 0, 0, 0.15)' }}
          onClick={() => {
            router.push(routes.orderHistory);
          }}
        >
          <div className='h-10 w-10 flex items-center justify-center'>
            <PizzaIcon />
          </div>
          <span className='uppercase font-stone text-base md:text-[18px]'>Past Orders</span>
        </button>
      </div>
    </div>
  );
};

export default AccountHead;
