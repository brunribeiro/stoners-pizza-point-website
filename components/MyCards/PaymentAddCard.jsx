import React from 'react';

import BackButton from '../common/BackButton';

import Button from '@/widgets/button';
import Input from '@/widgets/input';

const PaymentAddCard = () => {
  return (
    <>
      <div className='text-[21px] font-bold   mb-4'>Add Card</div>
      <BackButton />
      <div className='mb-5 pb-5 border-b-2'>
        <span className='text-lg mb-3 font-bold text-foreground block'>Name</span>
        <div className='grid sm:grid-cols-2 grid-cols-1 gap-2'>
          <Input placeholder='First Name' ariaLabel='First Name' />
          <Input placeholder='last Name' />
        </div>
      </div>
      <div className=''>
        <span className='text-lg mb-3 font-bold text-foreground block'>Billing Address</span>
        <div className='flex flex-col gap-4'>
          <Input placeholder='Street Address' ariaLabel='Street Address' />
          <Input
            placeholder='Street Address 2 (Optional)'
            ariaLabel='Street Address 2 (Optional)'
          />
          <div className='grid sm:grid-cols-2 grid-cols-1 gap-2'>
            <Input placeholder='City' ariaLabel='City' />
            <div className='grid sm:grid-cols-2 grid-cols-1 gap-2'>
              <Input placeholder='State' ariaLabel='State' />
              <Input placeholder='Zip Code' />
            </div>
          </div>
          <Input placeholder='Country' ariaLabel='Country' />
          <Button title='ADD PAYMENT METHOD' className='w-full' />
        </div>
      </div>
    </>
  );
};

export default PaymentAddCard;
