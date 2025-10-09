import React from 'react';

import PurchaseGiftCard from '@/components/MyCards/PurchaseGiftCard';
import LayoutWrapper from '@/shared/layoutWrapper';
import { privateRoute } from '@/utils/handleAuth';
import BackButton from '@/components/common/BackButton';

const purchaseGiftCard = () => {
  return (
    <LayoutWrapper>
      <div className='max-w-[680px] mx-auto px-5 py-10'>
        <div className='text-[21px] font-bold   mb-4'>Purchase a Gift Card</div>
        <BackButton />
        <PurchaseGiftCard isTitle />
      </div>
    </LayoutWrapper>
  );
};

export default purchaseGiftCard;
export const getServerSideProps = privateRoute();
