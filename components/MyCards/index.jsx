import React from 'react';

import PaymentWithCard from './PaymentWithCard';
// import GiftCard from './GiftCard';

const MyCards = ({
  setSelectedCard,
  selectedCard,
  fromSettings = false,
  setOpenList = () => {},
}) => {
  return (
    <div className=''>
      <PaymentWithCard
        setSelectedCard={setSelectedCard}
        selectedCard={selectedCard}
        fromSettings={fromSettings}
        setOpenList={setOpenList}
      />

      {/* <GiftCard
        handleEdit={handleEdit}
        giftCardList={giftCardList}
        handlePurchase={handlePurchase}
        handleExistingCard={handleExistingCard}
      /> */}
    </div>
  );
};

export default MyCards;
