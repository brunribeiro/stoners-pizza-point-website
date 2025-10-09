import React, { useState } from 'react';

import MyCards from '../MyCards';

// import PaymentForm from './PaymentForm';
import SpreedlyForm from './SpreedlyForm';

import SideOverlay from '@/shared/drawer';
import Button from '@/widgets/button';

const Payment = ({ dt, openList, setOpenList, initApiResponse }) => {
  const { setSelectedCard, selectedCard, setSelectedGiftCard, setSpreedlyToken } = dt || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const handleToken = (data) => {
    setSpreedlyToken(data.token);
  };

  return (
    <div className='flex flex-col sm:gap-5 gap-4 w-full pb-5 sm:my-8 mt-5 border-gray-300 sm:flex-nowrap flex-wrap'>
      <div className=' font-stone uppercase sm:text-3xl text-xl xl:min-w-48 sm:min-w-40 sm:w-auto w-full'>
        Payment Method
      </div>

      {/* <SpreedlyForm
        htmlContent={initApiResponse?.attributes?.hostedPaymentPageHtml}
        initApiResponse={initApiResponse}
      /> */}
      <div className='border-[3px] border-gray-200 sm:p-6 py-6 my-4 rounded-[30px] flex flex-col'>
        <SpreedlyForm
          htmlContent={initApiResponse?.attributes?.hostedPaymentPageHtml}
          onTokenReceived={handleToken}
        />
      </div>

      {/* <button
        onClick={() => window.submitSpreedlyPaymentForm?.()}
        className='mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700'
      >
        Submit Card
      </button> */}

      {/* <PaymentForm
        register={register}
        setValue={setValue}
        trigger={trigger}
        control={control}
        errors={errors}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        editCard={editCard}
        handleSubmit={handleSubmit}
        onSubmitCard={onSubmitCard}
      /> */}

      {/* <div className='mb-2 flex justify-between primary-border !border-[3px] sm:rounded-3xl rounded-xl sm:p-5 p-3'>
        <div className='flex gap-2'>
          <div className='flex items-center'>
            {selectedCard.image ? (
              <Image src={selectedCard.image} alt='card' width={50} height={50} />
            ) : (
              <PaymentIcon />
            )}
          </div>
          <div className='mt-1'>
            <div className='font-extrabold'>
              {' '}
              {selectedCard?.credit_card?.first_name
                ? selectedCard?.credit_card?.first_name
                : 'Add payment method'}
            </div>
            <div className='text-foreground text-sm'>
              {selectedCard?.credit_card?.verification_value
                ? `**** **** **** ${selectedCard?.credit_card?.verification_value}`
                : 'Add payment method'}
            </div>
          </div>
        </div>
        <div className='mt-2'>

          <button
            className='text-primary hover:underline  text-sm'
            onClick={() => setOpenList(true)}
          >
            Change
          </button>
        </div>
      </div>
      <Link
        href={routes.menu}
        className='hidden  text-primary gap-1 sm:flex items-center mb-7 justify-end'
      >
        <PlusIcon className='w-3 text-primary' />
        <span className='underline text-sm underline-offset-4 hover:shadow-sm duration-300'>
          Add more Items
        </span>
      </Link> */}
      {/* <div className='w-full'>
        <div className='flex gap-2 mb-3 overflow-scroll scrollbar-hide'>
          {cardType.map((method) => (
            <button
              key={method}
              className={`${
                selectedPaymentMethod === method
                  ? 'bg-primary text-white border-transparent'
                  : 'bg-transparent text-foreground border-gray-300'
              } rounded-2xl p-2 font-semibold border-2 w-full sm:text-[18px] text-sm`}
              onClick={() => setSelectedPaymentMethod(method)}
            >
              {method.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
        {renderPaymentForm()}
      </div> */}
      <SideOverlay
        visible={openList}
        onVisible={setOpenList}
        widthClass='w-full sm:w-[480px]'
        title={'Change Payment Method'}
        arrow={false}
        onclose={() => {
          if (!selectedCard) {
            setSelectedPaymentMethod(null);
          }
          setOpenList(false);
        }}
        modalFooter={
          <Button
            className='w-full'
            title='start my order'
            onClick={() => {
              if (selectedPaymentMethod) {
                setSelectedCard(selectedPaymentMethod);
              }
              setOpenList(false);
            }}
          />
        }
      >
        <MyCards
          setSelectedGiftCard={setSelectedGiftCard}
          setSelectedCard={setSelectedPaymentMethod}
          selectedCard={selectedPaymentMethod}
          setOpenList={setOpenList}
        />
      </SideOverlay>
    </div>
  );
};

export default Payment;
