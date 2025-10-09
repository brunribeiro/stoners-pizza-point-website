import React from 'react';

import LayoutWrapper from '@/shared/layoutWrapper';
import { privateRoute } from '@/utils/handleAuth';
import EmailGiftEditCard from '@/components/MyCards/EmailGiftEditCard';

const emailGiftCard = () => {
  return (
    <LayoutWrapper>
      <div className='max-w-[680px] mx-auto px-5 py-10'>
        <EmailGiftEditCard />
      </div>
    </LayoutWrapper>
  );
};

export default emailGiftCard;
export const getServerSideProps = privateRoute();
