import React from 'react';

import { formatDate, timeDisplayUTC } from '@/utils/helper';
import Button from '@/widgets/button';
import DeliveryIcon from '@/icons/DeliveryIcon';
import PickupIcon from '@/icons/PickupIcon';

const PendingOrderCard = ({ order = {} }) => {
  return (
    <div className='w-[50%] my-5'>
      <div className='text-3xl font-stone uppercase pb-4' aria-label='Order History' role='region'>
        Ongoing
      </div>
      <div className='w-full primary-border border-gray-200 rounded-3xl py-6 pl-2 pr-6 flex  sm:gap-5 gap-2 items-start  md:flex-nowrap flex-wrap'>
        <div className='flex items-center w-full'>
          {order?.orderType === 'PICKUP' ? (
            <div className='mx-5'>
              <PickupIcon />
            </div>
          ) : order?.orderType === 'DELIVERY' ? (
            <div className='mx-5'>
              <DeliveryIcon />
            </div>
          ) : order?.orderType === 'FAILED' ? (
            <div className='mx-5'>
              <DeliveryIcon />
            </div>
          ) : null}
          <div className='w-full'>
            <div
              className={`font-extrabold mb-1 ${
                order?.status?.toLowerCase() === 'closed' ? 'text-red' : 'text-green'
              }`}
            >
              {order?.status?.charAt(0) + order?.status?.slice(1).toLowerCase()}
            </div>

            <span className='text-gray-400 '>
              {formatDate(order.requestedFullfillTime, 'DD/MM/YY')}
              {' - '}
              {timeDisplayUTC(order.requestedFullfillTime)}
            </span>
            <span className='   text-gray-400 mb-3'>
              {order?.items?.map((name, index) => {
                return <div key={index}> {name}</div>;
              })}
            </span>
          </div>
        </div>
        <div className='w-full flex gap-2 justify-between'>
          <Button
            title='Track Order'
            onClick={() => {
              //   handleClick();
            }}
            primary={true}
            className='text-xl  w-full !px-4 !py-[10px] '
          />
        </div>
      </div>
    </div>
  );
};

export default PendingOrderCard;
