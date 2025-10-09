import React from 'react';

import LayoutWrapper from '@/shared/layoutWrapper';
import { privateRoute } from '@/utils/handleAuth';
import AddExistingCard from '@/components/MyCards/AddExistingCard';

const addGiftCard = () => {
  return (
    <LayoutWrapper>
      <div className='max-w-[680px] mx-auto px-5 py-10'>
        <AddExistingCard isTitle />
      </div>
    </LayoutWrapper>
  );
};

export default addGiftCard;
export const getServerSideProps = privateRoute();
