import React from 'react';

import { formatDate } from '@/utils/helper';
import Button from '@/widgets/button';
import PickupIcon from '@/icons/PickupIcon';
import DeliveryIcon from '@/icons/DeliveryIcon';

const OrderHistoryCard = ({ items = '', order = {}, handleClick, dtReorder, dt }) => {
  return (
    <div className='w-full primary-border border-gray-200 rounded-3xl p-5 flex flex-col sm:gap-5 gap-4 items-center justify-between md:flex-nowrap flex-wrap'>
      <div className='w-full flex items-start gap-5'>
        <div className='mt-3'>
          {order?.orderType === 'PICKUP' ? (
            <PickupIcon />
          ) : order?.orderType === 'DELIVERY' ? (
            <DeliveryIcon />
          ) : order?.orderType === 'FAILED' ? (
            <DeliveryIcon />
          ) : null}
        </div>
        <div className='w-full'>
          <div className='text-black font-extrabold mb-1'>
            {formatDate(order.requestedFullfillTime, 'DD/MM/YY')}
            {/* {' - '}
            {timeDisplayUTC(order.requestedFullfillTime)} */}
          </div>
          <span className='text-gray-400 '></span>
          <span className='   text-gray-400 mb-3'>
            {items.map((name, index) => {
              return <div key={index}> {name}</div>;
            })}
          </span>
        </div>
      </div>
      <div className='w-full flex gap-2 justify-between'>
        <Button
          title='Details'
          onClick={() => {
            handleClick();
          }}
          primary={false}
          className='text-base sm:text-xl bg-white !text-black hover:bg-white hover:text-black w-full !px-4 !py-[10px] '
        />
        <Button
          title='Reorder'
          onClick={() => dtReorder?.handleReorder(dt)}
          loading={dtReorder?.loader?.id === order?.id}
          disabled={dtReorder?.loader?.id === order?.id}
          className='text-base sm:text-xl !px-4 !py-[10px] w-full'
        />
      </div>
    </div>
  );
};

export default OrderHistoryCard;
