import React from 'react';

import SelectCard from '../Checkout/SelectCard';

import useMyCard from './hooks/useMyCard';

import EditInput from '@/widgets/EditInput';
import Button from '@/widgets/button';

const PurchaseGiftCard = ({ id, setOpen, isTitle = false }) => {
  const { ...dt } = useMyCard();
  const options = [10, 20, 30, 40];
  const handleClick = (val) => {
    dt?.setGiftAmount(val);
  };
  return (
    <>
      <div className='mb-6'>
        {isTitle && (
          <div className='text-lg mb-1 font-bold text-foreground block'>Purchase Gift Card</div>
        )}
        <p className='text-foreground'>
          Select or enter an amount to load on to your card (minimum $5 and maximum $1000)
        </p>
      </div>
      <div className='sm:mb-6 grid sm:grid-cols-2 grid-cols-1'>
        <div>
          <div className='text-foreground mb-2'>Choose Amount*</div>
          <div className={'flex gap-2'}>
            {options.map((option) => (
              <button
                key={option}
                className={`w-full border-2 border-gray-200 p-4  sm:rounded-2xl rounded-xl   ${
                  dt?.giftAmount === option ? 'bg-primary border-primary text-white' : 'bg-white'
                }`}
                onClick={() => handleClick(option)}
              >
                <div className='font-semibold'>{`$${option}`}</div>
              </button>
            ))}
          </div>
          <EditInput
            placeholder='Custom amount'
            value={dt?.giftAmount}
            onChange={(e) => {
              dt?.setGiftAmount(e.target.value);
            }}
          />
          {!dt?.giftAmount && dt.error.giftAmount && (
            <p className='text-red'>Please choose or enter amount</p>
          )}
        </div>
      </div>
      <div className='sm:mb-4'>
        <div className='text-lg mb-2 font-bold text-foreground block'>Payment</div>
      </div>
      <div className='sm:mb-4'>
        <SelectCard dt={dt} />
      </div>
      <div className='grid grid-cols-2 gap-2'>
        <Button title='Cancel' onClick={dt.router.back} className='w-full !bg-[#F3F4F6] ! ' />
        <Button title='PAY NOW' onClick={() => dt.handlePayGift(id, setOpen)} className='w-full' />
      </div>
    </>
  );
};

export default PurchaseGiftCard;
