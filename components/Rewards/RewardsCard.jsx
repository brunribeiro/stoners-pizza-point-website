import React from 'react';
import Image from 'next/image';

import { DEFAULT_IMAGE } from '@/utils/constant';

const RewardsCard = ({ offerList, setOpen, setMessageDetail }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      {offerList?.map((reward, index) => (
        <button
          key={index}
          className={`primary-border rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-center  hover:shadow-lg transition-all ${
            reward.eligible ? 'bg-white' : 'bg-gray-100 grayscale'
          }`}
          onClick={() => {
            setOpen(true);
            setMessageDetail(reward);
          }}
        >
          <div className='text-left w-full sm:w-3/5 flex flex-col gap-6'>
            <h4 className='font-extrabold text-lg'>{reward.title}</h4>
            <p className='text-sm text-foreground mb-2 line-clamp-2'>{reward.longDescription}</p>
            {/* <Button
                      title={reward.eligible ? 'REDEEM' : <LockIcon />}
                      disabled={!reward.eligible}
                      className='!py-2 !text-xl w-full '
                    /> */}
          </div>

          <div className='w-full sm:w-2/5 flex justify-center sm:justify-end'>
            <div className={`relative w-28 h-28 ${!reward.eligible && 'opacity-50 '}`}>
              <Image
                src={reward.mediumImage || DEFAULT_IMAGE}
                alt={reward.title}
                layout='fill'
                objectFit='contain'
              />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default RewardsCard;
