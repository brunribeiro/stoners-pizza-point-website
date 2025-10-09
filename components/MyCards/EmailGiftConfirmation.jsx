import React from 'react';

import Button from '@/widgets/button';

const EmailGiftConfirmation = () => {
  return (
    <>
      <div className='text-[21px] font-bold   mb-4'>Gift Card Purchase Complete</div>
      <p className='text-foreground mb-4'>
        Your digital gift card for $5.00 has been sent to test@test.com. The gift card number is
        5288005211235727. Please retain this number in case you need to contact us. Thank You!
      </p>
      <Button title='BACK TO PAYMENTS' className='w-full' />
    </>
  );
};

export default EmailGiftConfirmation;
