import React from 'react';
// import Link from 'next/link';

import AddCard from './AddCard';
import MyGiftCard from './MyGiftCard';

// import routes from '@/utils/routes';

const GiftCard = ({ giftCardList, handleEdit, handlePurchase, handleExistingCard }) => {
  return (
    <div className='mb-8 mt-8'>
      <div className=' w-full'>
        <div className='w-full flex flex-col gap-3'>
          {/* <div className=''>
            <div className='text-lg text-foreground font-bold '>
              My Gift Card
              <Link
                href={routes.emailGiftCard}
                className='text-primary ml-2 underline underline-offset-4 font-normal'
              >
                Email a Gift Card
              </Link>
            </div>
          </div> */}
          {giftCardList?.length >= 1 &&
            giftCardList?.map((card) => {
              return (
                <MyGiftCard
                  key={card.paymentInstrumentId}
                  id={card.paymentInstrumentId}
                  src={card.image}
                  name={card.nickname}
                  handleEdit={handleEdit}
                  lastFour={`Gift card ending in ${card.lastFour}`}
                />
              );
            })}
          <AddCard name='Purchase Card' handlePurchase={handlePurchase} />
          <AddCard name='Add Existing Card' handlePurchase={handleExistingCard} />
        </div>
      </div>
    </div>
  );
};

export default GiftCard;
