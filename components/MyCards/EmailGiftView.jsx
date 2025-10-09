import React from 'react';
import Link from 'next/link';

import SelectCard from '../Checkout/SelectCard';

import Button from '@/widgets/button';
import CheckRoundIcon from '@/icons/CheckRoundIcon';

const EmailGiftView = () => {
  return (
    <>
      <div className='text-[21px] font-bold   mb-6'>Email A Gift Card</div>
      <div className='mb-6'>
        <div className='text-lg font-bold text-foreground flex items-center gap-2'>
          1. Customer <CheckRoundIcon />
        </div>
      </div>
      <div className='mb-6'>
        <div className='text-lg font-bold text-foreground flex items-center gap-2 mb-5'>
          2. Gift Card <CheckRoundIcon />{' '}
          <Link href='' className='text-primary underline underline-offset-4 text-base font-medium'>
            Edit
          </Link>
        </div>
        <div className='flex flex-col gap-4'>
          <div>
            <div className='text-foreground'>From:</div>
            <div className='text-lg font-bold'>John Doe</div>
          </div>
          <div>
            <div className='text-foreground'>To:</div>
            <div className='text-lg font-bold'>John Doe</div>
          </div>
          <div>
            <div className='text-foreground'>Email:</div>
            <div className='text-lg font-bold'>test@test.com</div>
          </div>
        </div>
      </div>
      <div className='mb-6'>
        <div className='text-lg font-bold text-foreground mb-3'>3. Payment</div>
        <div className='mb-4'>
          <Button title='Credit Card' className='rounded-lg capitalize' />
        </div>
        <div className='mb-4'>
          <SelectCard />
        </div>
        <Button title='PURCHASE GIFT CARD' className='w-full' />
      </div>
    </>
  );
};

export default EmailGiftView;
