import React, { useContext } from 'react';

import BackButton from '../common/BackButton';

import useMyCard from './hooks/useMyCard';

import Button from '@/widgets/button';
import ControlledInput from '@/widgets/ControlledInput';
import AppContext from '@/utils/appContext';
import Checkbox from '@/widgets/Checkbox';
import LayoutWrapper from '@/shared/layoutWrapper';
import IncentivioLoader from '@/widgets/incentivioLoader';

const EditCardForm = () => {
  const {
    loader,
    handleSubmit,
    onSubmitCard,
    register,
    setValue,
    errors,
    trigger,
    handleDelete,
    cardData,
  } = useMyCard();

  const { loginData } = useContext(AppContext);

  return (
    <LayoutWrapper>
      <div className='max-w-[680px] mx-auto px-5 py-10'>
        <h2 className='text-[21px] font-bold   mb-4'>Edit Card</h2>
        <BackButton />
        {loader?.editCard ? (
          <div className='flex justify-center items-center h-[50dvh] w-full mx-auto'>
            <IncentivioLoader />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmitCard)} className='flex flex-col gap-3'>
            <ControlledInput
              mandatory
              name='nickName'
              placeholder='Nick Name'
              label='Nick name'
              register={register}
              setValue={setValue}
              trigger={trigger}
              errors={errors}
              regex={/[^ a-z]/gi}
            />
            <div className='col-span-2'>
              <ControlledInput
                name='cardNumber'
                mandatory
                placeholder='Card Number'
                label='Card number'
                register={register}
                setValue={setValue}
                trigger={trigger}
                errors={errors}
                disabled={true} // card number should not be editable
              />
            </div>
            <Checkbox name='isDefault' register={register} title='Set as default' />
            {loginData?.token && (
              <div className='grid grid-cols-2 gap-2'>
                <Button
                  type='button'
                  title='Delete'
                  loading={loader?.deleteCard}
                  disabled={loader.deleteCard}
                  onClick={() => handleDelete(cardData?.paymentInstrumentId)}
                  className='!px-6 !py-3 hover:shadow-md !text-foreground !bg-white capitalize text-lg !font-bold'
                />
                <Button
                  type='submit'
                  title='SAVE'
                  loading={loader?.saveCard}
                  disabled={loader?.saveCard}
                  className='text-xl !font-bold'
                />
              </div>
            )}
          </form>
        )}
      </div>
    </LayoutWrapper>
  );
};

export default EditCardForm;
