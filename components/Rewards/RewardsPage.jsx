import React, { useContext } from 'react';
import Image from 'next/image';

import useInbox from '../Inbox/hooks/useInbox';
import InboxDetail from '../Inbox/inboxDetail';
import RewardSkeleton from '../common/RewardSkeleton';

import RewardsCard from './RewardsCard';

import DrawerWrapper from '@/shared/drawer';
import LayoutWrapper from '@/shared/layoutWrapper';
import AppContext from '@/utils/appContext';
import Button from '@/widgets/button';
import RewardPointsIcon from '@/icons/RewardPointsIcon';
import useRewards from '@/hook/rewards/useRewards';
import RedRightIcon from '@/icons/RedRightIcon';
import { steps } from '@/utils/util';

export default function RewardsPage() {
  const { open, setOpen, loader, setMessageDetail, ...dt } = useInbox({});
  const { offerList } = useContext(AppContext);
  const { ...dtRewards } = useRewards();

  return (
    <LayoutWrapper>
      {loader.list || !offerList ? (
        <RewardSkeleton />
      ) : (
        <div className='bg-white p-4 md:p-12 max-w-[85%] mx-auto text-center flex flex-col gap-5'>
          <div className='bg-primary-light sm:p-8 p-6 pb-20'>
            <div className='mb-8 text-left'>
              <h1 className='text-2xl md:text-5xl font-stone text-primary'>ENJOY PIZZA</h1>
              <h2 className='text-2xl md:text-5xl font-stone text-green'>
                GET REWARDED AT STONER&apos;S!
              </h2>
            </div>
            <h4 className='text-xl font-stone uppercase text-left md:mt-14 mb-1'>
              4 Quick Steps to Get Started
            </h4>
            <div className='flex flex-col gap-4 sm:grid grid-cols-11 mb-8 items-center text-sm md:text-base'>
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className='col-span-2 flex flex-col items-center text-center'>
                    <Image
                      src={step.icon}
                      alt={step.alt}
                      width={120}
                      height={120}
                      className='mb-2'
                    />
                    <p className='font-extrabold'>{step.title}</p>
                    <p className='text-gray-500 text-xs'>{step.subtitle}</p>
                  </div>

                  {/* Add arrow unless it's the last step */}
                  {index < steps.length - 1 && (
                    <div className='rotate-90 sm:rotate-0 col-span-1 flex justify-center'>
                      <RedRightIcon />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className='bg-white rounded-2xl p-4 md:flex justify-between items-center mb-8 -mt-20 sm:w-[80%] w-full mx-auto primary-border'>
            <div className='mb-4 md:mb-0 text-center md:text-left font-stone text-xl flex gap-2 sm:gap-4 items-center'>
              <RewardPointsIcon className='w-16 h-16 sm:h-auto sm:w-auto' />
              <div className='text-left'>
                <p>$1 = 1 POINT</p>
                <p>10 POINTS = $1 OFF</p>
              </div>
            </div>
            <div className='bg-[#ae0f0a] text-white py-4 pl-5 sm:pl-7 relative  rounded-lg text-xl text-left  flex justify-between md:gap-7 items-center'>
              <div>
                <p className='text-lg'>You have</p>
                <div className='mt-2'>
                  <span className='text-5xl uppercase font-stone'>
                    {dtRewards.loyaltyData?.confirmedPoints || 0}
                  </span>
                  <span className='font-stone ml-1'>PTS</span>
                </div>
                <p
                  className='text-xs font-thin sm:tracking-widest mt-1'
                  style={{ wordSpacing: '0.1rem' }}
                >
                  Get $10 off on your next order
                </p>
              </div>
              <Image
                src='/icons/Star.svg'
                alt='Star'
                height={100}
                width={170}
                className='w-24 h-24 absolute sm:static right-0 sm:w-auto sm:h-auto'
              />
            </div>
          </div>

          <div className='text-left'>
            <h3 className='text-3xl font-stone mb-4'>AVAILABLE REWARDS</h3>
            {offerList?.length > 0 ? (
              <RewardsCard
                offerList={offerList}
                setOpen={setOpen}
                setMessageDetail={setMessageDetail}
              />
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                <p>No rewards available</p>
              </div>
            )}
          </div>
        </div>
      )}

      <DrawerWrapper
        visible={open}
        onVisible={setOpen}
        widthClass='w-full w-[480px]'
        title='Loyalty Offer'
        arrow={false}
        onclose={() => setOpen(false)}
        modalFooter={
          <Button
            className='w-full'
            title='Delete'
            loading={loader.delete}
            onClick={() => dt.handleDelete(dt.messageDetail?.distributedOfferId)}
          />
        }
      >
        <InboxDetail
          setOpen={setOpen}
          data={dt.messageDetail}
          handleDelete={dt.handleDelete}
          loader={loader}
        />
      </DrawerWrapper>
    </LayoutWrapper>
  );
}
