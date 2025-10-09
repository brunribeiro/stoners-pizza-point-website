import React from 'react';

import AddCardForm from '@/components/MyCards/AddCardForm';
import LayoutWrapper from '@/shared/layoutWrapper';
import { privateRoute } from '@/utils/handleAuth';

const addCard = () => {
  return (
    <LayoutWrapper>
      <div className='max-w-[680px] mx-auto px-5 py-10'>
        <AddCardForm isAddCard />
      </div>
    </LayoutWrapper>
  );
};

export default addCard;
export const getServerSideProps = privateRoute();
