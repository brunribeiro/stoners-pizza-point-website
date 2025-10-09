import React from 'react';

const EnterPromoCode = ({ dtPromo }) => {
  return (
    <div className='px-9 flex gap-4 flex-col mt-5'>
      <p>If you have a promo code, enter it here to redeem</p>
      <div className='relative'>
        <input
          onChange={(e) => {
            dtPromo?.setPromoCode(e.target.value);
          }}
          aria-label='Enter promo code'
          placeholder='Enter promo code'
          className='border-[3px] rounded-xl border-black  px-5 py-3 bg-white w-full'
        />
      </div>
    </div>
  );
};

export default EnterPromoCode;
