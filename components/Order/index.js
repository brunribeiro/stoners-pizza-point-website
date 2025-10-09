import React from 'react';

import OrderHistory from './OrderHistory';

import LayoutWrapper from '@/shared/layoutWrapper';

const OrderConFirmation = () => {
  return (
    <LayoutWrapper>
      <div className='max-w-[640px] mx-auto px-5 py-5'>
        <OrderHistory />
      </div>
    </LayoutWrapper>
  );
};

export default OrderConFirmation;
