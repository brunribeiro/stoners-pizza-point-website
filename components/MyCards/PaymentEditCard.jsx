import React from 'react';

import BackButton from '../common/BackButton';

import Button from '@/widgets/button';
import CheckBox from '@/widgets/Checkbox';
import Input from '@/widgets/input';

const PaymentEditCard = () => {
  return (
    <>
      <div className='text-[21px] font-bold   mb-4'>Edit Card</div>
      <BackButton />
      <div className='mb-4'>
        <span className='text-lg mb-3 font-bold text-foreground block'>Nickname*</span>
        <Input placeholder='John Doe' />
      </div>
      <div className='mb-4'>
        <span className='text-lg mb-3 font-bold text-foreground block'>Card Number*</span>
        <Input placeholder='xxxx xxxxx xxxx 1111' />
      </div>
      <div className='mb-4'>
        <CheckBox label='Set as default?' />
      </div>
      <div className='grid grid-cols-2 gap-2'>
        <Button title='Delete' className='!  !bg-gray-100 w-full' />
        <Button title='Save' className='w-full' />
      </div>
    </>
  );
};

export default PaymentEditCard;
