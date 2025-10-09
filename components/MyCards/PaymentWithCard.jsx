import React from 'react';

import MyCard from './MyCard';
import AddCardForm from './AddCardForm';
import useMyCard from './hooks/useMyCard';

import IncentivioLoader from '@/widgets/incentivioLoader';
import DrawerWrapper from '@/shared/drawer';
import Button from '@/widgets/button';

const PaymentWithCard = ({
  setSelectedCard,
  selectedCard,
  fromSettings = false,
  setOpenList = () => {},
}) => {
  const {
    handleSubmit,
    onSubmitCard,
    register,
    setValue,
    control,
    errors,
    trigger,
    selectedDate,
    setSelectedDate,
    fetchCardData,
    editCard,
    open,
    setOpen,
    onEdit,
    creditCardList,
    reset,
    loader,
  } = useMyCard(setOpenList);

  if (loader.list) {
    return (
      <div className='flex justify-center items-center h-[70dvh] w-full'>
        <IncentivioLoader />
      </div>
    );
  }
  const hasCards = creditCardList?.length > 0;

  return (
    <div className={`w-full ${fromSettings ? '' : 'pb-8 mb-8 '}`}>
      {hasCards ? (
        <div className={`flex flex-col gap-2 ${!fromSettings ? 'mx-6' : ''}`}>
          <div
            className={`gap-3 ${fromSettings ? 'grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'}`}
          >
            {creditCardList.map((card) => (
              <MyCard
                key={card.paymentInstrumentId}
                id={card.paymentInstrumentId}
                fromSettings={fromSettings}
                src={card.image}
                name={card.nickname}
                card={card}
                lastFour={`**** **** **** ${card.lastFour}`}
                setSelectedCard={setSelectedCard}
                selectedCard={selectedCard}
                fetchCardData={fetchCardData}
                onEdit={onEdit}
              />
            ))}
          </div>

          <div className='flex'>
            <button
              className='text-primary hover:text-dark-primary flex items-center gap-1'
              onClick={() => {
                reset();
                // router.push(routes.add);
                setOpen(true);
              }}
            >
              <span className='text-xl mb-1'>+</span>
              <span className='text-[14px] underline underline-offset-2'>
                Add new payment method
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-2 p-4'>
          <div>You don&apos;t have any cards added to your account.</div>
          <div className='flex'>
            <button
              className='text-primary hover:!text-dark-primary flex items-center gap-1'
              onClick={() => {
                reset();
                // router.push(routes.add);
                setOpen(true);
              }}
            >
              <span className='text-xl mb-1'>+</span>
              <span className='text-[14px] underline underline-offset-2'>
                Add new payment method
              </span>
            </button>
          </div>
        </div>
      )}

      <DrawerWrapper
        visible={open}
        onVisible={setOpen}
        widthClass='w-full sm:w-[480px]'
        title={`${editCard ? 'Edit' : 'Add'} Card`}
        arrow={false}
        modalFooter={
          <div className='flex justify-between gap-4 items-center px-2 mt-4 w-full'>
            <Button
              type='submit'
              form='addCardForm'
              title='Save'
              disabled={loader?.saveCard}
              loading={loader?.saveCard}
              className='w-full  '
            />{' '}
          </div>
        }
        onclose={() => {
          onEdit(null, true);
        }}
      >
        <form id='addCardForm' onSubmit={handleSubmit(onSubmitCard)}>
          <AddCardForm
            register={register}
            setValue={setValue}
            trigger={trigger}
            control={control}
            errors={errors}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            editCard={editCard}
          />
        </form>
      </DrawerWrapper>
    </div>
  );
};

export default PaymentWithCard;
