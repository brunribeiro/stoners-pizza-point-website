import React from 'react';

import PaymentFormSkeleton from '../common/PaymentFormSkeleton';

import SpreedlyForm from './SpreedlyForm';
import useSpreedlyMobile from './hooks/useSpreedlyMobile';

import Button from '@/widgets/button';
import RightArrowIcon from '@/icons/rightArrowIcon';

const SpreedlyMobile = () => {
  const { loading, initData, handleToken, handleBack } = useSpreedlyMobile();

  return (
    <>
      {loading ? (
        <PaymentFormSkeleton />
      ) : (
        <div className='sm:p-10 p-4'>
          <div className='flex gap-3 items-center '>
            <button
              onClick={handleBack}
              className='rotate-180 mt-1 hover:scale-90 duration-300 hover:text-primary'
            >
              {' '}
              <RightArrowIcon width='20' height='20' />
            </button>
            <div className=' font-stone uppercase  text-3xl w-full text-center -ml-4'>
              Payment Method
            </div>
          </div>

          <div className='border-[3px] border-gray-200 sm:p-4 py-6 my-4 rounded-[30px] flex flex-col'>
            <SpreedlyForm
              htmlContent={initData?.attributes?.hostedPaymentPageHtml}
              onTokenReceived={handleToken}
              submitButton={false}
            />
            <Button
              title={'place order'}
              className=' mx-4 mt-3'
              type={'submit'}
              onClick={() => {
                setTimeout(() => {
                  window.submitSpreedlyPaymentForm();
                }, 10);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SpreedlyMobile;
