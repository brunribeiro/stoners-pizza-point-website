import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';

import BackButton from '../common/BackButton';
import SelectCard from '../Checkout/SelectCard';

import useMyCard from './hooks/useMyCard';

import Button from '@/widgets/button';
import EditInput from '@/widgets/EditInput';
import CheckRoundIcon from '@/icons/CheckRoundIcon';
import ControlledInput from '@/widgets/ControlledInput';
import { emailGiftSchema } from '@/schema/emailGift';
import TextArea from '@/widgets/textarea';
import { KEYS, PAYMENT_TYPE, REST_LOCATION_ID, SPACE_REMOVE_REGEX } from '@/utils/constant';
import commonApi from '@/services/api/common';
import Toast from '@/utils/toast';
import AppContext from '@/utils/appContext';
import { LocalStorage } from '@/utils/localStorage';

const defaultValues = {
  name: '',
  recipientName: '',
  email: '',
  verifyEmail: '',
  message: '',
};

const EmailGiftEditCard = () => {
  const options = [10, 20, 30, 40];
  const { loginData, selectedCard } = useContext(AppContext);
  const { ...dt } = useMyCard();
  const [giftData, setGiftData] = useState();

  const handleClick = (val) => {
    setValue('giftAmount', val);
    trigger('giftAmount');
  };
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(emailGiftSchema),
  });
  const recipientEmail = getValues('email');

  const onSubmit = () => {
    setShow((prev) => !prev);
  };
  const emailGiftCard = async () => {
    if (selectedCard) {
      dt.setLoader((prev) => ({ ...prev, purchase: true }));
      const restLocationIC = LocalStorage.get(REST_LOCATION_ID);

      try {
        const payload = {
          amount: getValues('giftAmount'),
          locationId: restLocationIC,
          isOneTimeTransaction: false,
          paymentToken: dt.selectedCard?.paymentToken,
          paymentType: PAYMENT_TYPE.CARD_NOT_PRESENT,
          sourceType: KEYS.WEB,
          recipient: {
            name: getValues('recipientName'),
            email: getValues('email'),
            message: getValues('message'),
          },
          sender: {
            firstName: loginData.firstName,
            lastName: loginData.lastName,
            email: loginData.email,
            phone: loginData.phoneNumber,
          },
          from: getValues('name'),
        };
        const { data, message } = await commonApi({
          action: 'purchaseGift',
          data: payload,
        });
        Toast.success(message);
        setGiftData(data);
        // dt.router.push(routes.giftCardConfirmation);
      } catch (error) {
        Toast.error(error);
      } finally {
        dt.setLoader((prev) => ({ ...prev, purchase: false }));
      }
    } else {
      dt.setError((prev) => ({ ...prev, selectedCard: true }));
    }
  };
  if (giftData) {
    return (
      <div className=' rounded shadow text-center'>
        <h2 className='bg-primary p-5 text-white text-xl font-bold '>
          Gift Card Purchase Complete!
        </h2>
        <p className='px-5 py-3'>
          Your digital gift card for <strong>$ {giftData?.cardAccountBalance} </strong>has been sent
          to <strong>{recipientEmail}</strong>. The gift card number is{' '}
          <strong>{giftData?.cardIdentifier}</strong>. Please retain this number in case you need to
          contact us.
        </p>
        <p className='px-5 pb-3'>Thank You!</p>
      </div>
    );
  }

  return (
    <>
      <div className='text-[21px] font-bold   mb-4'>Email A Gift Card</div>
      <BackButton />
      <div className='mb-6'>
        <div className='text-lg font-bold text-foreground flex items-center gap-2'>
          1. Customer <CheckRoundIcon />
        </div>
      </div>
      <div className='mb-6'>
        <div className='text-lg font-bold text-foreground flex items-center gap-2 mb-5'>
          2. Gift Card
          {show && (
            <button
              onClick={() => setShow((prev) => !prev)}
              className='text-primary underline underline-offset-4 text-base font-medium'
            >
              Edit
            </button>
          )}
        </div>
        {!show ? (
          <>
            <div className='mb-6 grid sm:grid-cols-2 grid-cols-1'>
              <div>
                <div className='text-foreground mb-2'>Choose Amount*</div>
                <div className={'flex gap-2'}>
                  {options?.map((option) => (
                    <button
                      key={option}
                      className={`w-full border-2 border-gray-200 sm:py-4 sm:rounded-2xl rounded-xl ${
                        watch('giftAmount') === option
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white'
                      }`}
                      onClick={() => handleClick(option)}
                    >
                      <div className='font-semibold'>{`$${option}`}</div>
                    </button>
                  ))}
                </div>

                <Controller
                  name='giftAmount'
                  control={control}
                  render={({ field }) => (
                    <EditInput
                      ariaLabel='Custom amount'
                      placeholder='Custom amount'
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                {errors.giftAmount && (
                  <p className='text-xs mt-1 text-red'>{errors.giftAmount.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className='text-lg font-bold text-foreground mb-3'>More Information</div>
              <div className='flex flex-col gap-4'>
                <ControlledInput
                  name='name'
                  placeholder='Your name*'
                  register={register}
                  setValue={setValue}
                  trigger={trigger}
                  errors={errors}
                />
                <ControlledInput
                  name='recipientName'
                  placeholder='Recipient name*'
                  register={register}
                  setValue={setValue}
                  trigger={trigger}
                  errors={errors}
                />
                <ControlledInput
                  name='email'
                  placeholder='Recipient email*'
                  register={register}
                  setValue={setValue}
                  trigger={trigger}
                  errors={errors}
                  regex={SPACE_REMOVE_REGEX}
                />
                <ControlledInput
                  name='verifyEmail'
                  placeholder='Verify recipient email*'
                  register={register}
                  setValue={setValue}
                  trigger={trigger}
                  errors={errors}
                  regex={SPACE_REMOVE_REGEX}
                />
                <TextArea
                  id='message'
                  placeholder='Send a message with email'
                  inputName='message'
                  form={{ register, formState: { errors } }}
                  isRequired={true}
                />
                {!show && (
                  <Button
                    title='CONTINUE TO PAYMENT'
                    onClick={handleSubmit(onSubmit)}
                    className='w-full'
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className='flex flex-col gap-4'>
            <div className='flex gap-3 '>
              <div className='border-2 bg-primary border-primary text-white px-5 sm:py-4 rounded-md '>
                <div className='font-semibold'>{`$${getValues('giftAmount')}`}</div>
              </div>
              <Image src='/images/gift.svg' width={100} height={100} alt='gift' />
            </div>
            <div>
              <div className='text-foreground'>From:</div>
              <div className='text-lg font-bold'>{getValues('name') || 'Your Name'}</div>{' '}
            </div>
            <div>
              <div className='text-foreground'>To:</div>
              <div className='text-lg font-bold'>
                {getValues('recipientName') || 'Recipient Name'}
              </div>{' '}
            </div>
            <div>
              <div className='text-foreground'>Email:</div>
              <div className='text-lg font-bold'>
                {getValues('email') || 'recipient@example.com'}
              </div>{' '}
            </div>
            <div>
              <div className='text-foreground'>Message:</div>
              <div className='text-lg font-bold'>
                {getValues('message') || 'No message provided'}
              </div>{' '}
            </div>
          </div>
        )}
      </div>
      {show && (
        <>
          <div className='mb-4'>
            <div className='text-lg mb-2 font-bold text-foreground block'>3. Payment</div>
          </div>
          <div className='mb-4'>
            <SelectCard dt={dt} />
          </div>
          <Button
            className='w-full'
            loading={dt.loader.purchase}
            disable={dt.loader.purchase}
            onClick={emailGiftCard}
            title='Purchase Gift Card'
          />
        </>
      )}
    </>
  );
};

export default EmailGiftEditCard;
