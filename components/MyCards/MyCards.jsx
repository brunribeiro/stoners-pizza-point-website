import React from 'react';

import PaymentWithCard from './PaymentWithCard';
import GiftCard from './GiftCard';

import LayoutWrapper from '@/shared/layoutWrapper';

const MyCards = () => {
  return (
    <LayoutWrapper childClassName='container mx-auto'>
      <PaymentWithCard />
      <GiftCard />
    </LayoutWrapper>
  );
};

export default MyCards;
