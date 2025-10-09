import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';

import BackButton from '../common/BackButton';

import Button from '@/widgets/button';
import ControlledInput from '@/widgets/ControlledInput';
import { cardNumber } from '@/schema/cardNumber';
import { REST_LOCATION_ID } from '@/utils/constant';
import commonApi from '@/api/common';
import routes from '@/utils/routes';
import AppContext from '@/utils/appContext';
import { LocalStorage } from '@/utils/localStorage';

const defaultValues = { cardNumber: '' };

const AddExistingCard = ({ isTitle = false }) => {
  const { loginData, setModal } = useContext(AppContext);
  const router = useRouter();
  const isCheckoutPage = router.pathname.includes(routes.checkout);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(cardNumber),
  });
  const onSubmit = async (data) => {
    const lastFour = data.cardNumber.slice(-4);
    const restLocationIC = LocalStorage.get(REST_LOCATION_ID);
    const payload = {
      lastFour,
      locationId: restLocationIC,
      paymentToken: data.cardNumber,
      paymentType: 'CARD_NOT_PRESENT',
      sourceType: 'WEB',
      userId: loginData?.userId,
    };
    await commonApi({
      action: 'addExistingCard',
      data: payload,
    });
    if (isCheckoutPage) {
      setModal((prev) => ({ ...prev, addExistGift: false }));
    } else {
      router.back();
    }
  };
  return (
    <>
      {isTitle && (
        <>
          <div className='text-[21px] font-bold   mb-4'>Add Existing Card</div>
          <BackButton />
        </>
      )}
      <div className='mb-5'>
        <ControlledInput
          name='cardNumber'
          mandatory
          placeholder='Card Number'
          label='Card number'
          register={register}
          setValue={setValue}
          trigger={trigger}
          errors={errors}
          regex={/[^0-9]/g}
          maxLength={16}
        />
      </div>
      <Button title='SUBMIT' onClick={handleSubmit(onSubmit)} className='w-full' />
    </>
  );
};

export default AddExistingCard;
