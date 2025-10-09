import React, { useEffect } from 'react';
import Image from 'next/image';

import CustomSlider from '../common/CustomSlider';
import DeitarySkeleton from '../common/DeitarySkeleton';

import { displayAmount } from '@/utils/helper';

const RewardsList = ({
  handleOfferSelection,
  selectedOffer,
  applicableOffers,
  getOffers,
  loginData,
  pointsUsed,
  setPointsUsed,
  loader,
}) => {
  const handleSliderChange = (_, newValue) => {
    setPointsUsed(newValue);
  };

  useEffect(() => {
    if (loginData?.userId) {
      getOffers();
    }
    return () => {};
  }, [loginData]);
  return (
    <>
      {loader.listOffer ? (
        <div className='p-4 max-w-md mx-auto space-y-6'>
          <DeitarySkeleton rewards={true} />
        </div>
      ) : (
        <div className='p-4 max-w-md mx-auto space-y-6'>
          {selectedOffer?.variablePoints && (
            <>
              <div className='text-sm text-gray-600'>{pointsUsed} Points used</div>

              <CustomSlider
                pointsUsed={pointsUsed}
                handleSliderChange={handleSliderChange}
                max={selectedOffer?.availablePoints}
              />

              <div className='text-sm text-gray-600'>
                {displayAmount((pointsUsed * (selectedOffer?.pointsCost || 0)) / 10)} Saved
              </div>
            </>
          )}

          <div className='space-y-4'>
            {applicableOffers?.map((reward) => (
              <button
                key={reward.distributedOfferId}
                onClick={() => handleOfferSelection(reward)}
                className='flex items-center justify-between p-4 rounded-xl  hover:bg-gray-50 bg-primary-light cursor-pointer w-full gap-2'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full flex items-center justify-center bg-red-100'>
                    <Image src={reward.mediumImage} alt={reward.title} width={32} height={32} />
                  </div>
                  <div className='text-left'>
                    <div className='font-bold'>{reward.title}</div>
                    <div className='text-gray-500 text-sm'>{reward.shortDescription}</div>
                  </div>
                </div>

                <div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center  ${
                      selectedOffer?.distributedOfferId === reward.distributedOfferId
                        ? 'border-green'
                        : 'border-gray-400'
                    }`}
                  >
                    {selectedOffer?.distributedOfferId === reward.distributedOfferId && (
                      <div className='w-2.5 h-2.5 bg-green rounded-full' />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RewardsList;
