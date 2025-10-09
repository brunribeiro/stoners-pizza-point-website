import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import Link from 'next/link';

import useGuestCheckout from './hooks/useGuestCheckout';

import Input from '@/widgets/input';
import Button from '@/widgets/button';

const GuestInfoForm = ({ setIsGuestFormOpen }) => {
  const { t } = useTranslation('common');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    onSubmit,
  } = useGuestCheckout(setIsGuestFormOpen);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full p-10 flex flex-col gap-9'>
      <div className='w-full flex flex-col gap-8'>
        <p className='mt-4'>Fill out the information below to complete your order.</p>
        <div className='flex flex-col gap-4'>
          <Input
            ariaLabel={t`signUp.firstName`}
            placeholder={t`signUp.firstName`}
            mandatory
            error={errors.firstName?.message}
            rest={register('firstName')}
          />

          <Input
            ariaLabel={t`signUp.lastName`}
            placeholder={t`signUp.lastName`}
            error={errors.lastName?.message}
            rest={register('lastName')}
          />

          <Input
            ariaLabel={t`signUp.email`}
            placeholder={t`signUp.email`}
            error={errors.email?.message}
            rest={register('email', {
              onChange: (e) => setValue('email', e.target.value?.replace(/\s/g, '')?.toLowerCase()),
            })}
          />

          <Input
            ariaLabel={t`signUp.phoneNumber`}
            placeholder={t`signUp.phoneNumber`}
            maxLength={10}
            error={errors.phoneNumber?.message}
            rest={register('phoneNumber')}
          />

          <div>
            <p className='text-foreground text-sm'>
              Your information above will not be stored or used for any marketing purposes.
            </p>
            <p className='text-foreground text-sm'>
              By selecting continue, I agree to the&nbsp;
              <Link
                href='/terms-and-condition'
                className='text-primary cursor-pointer font-bold hover:underline underline-offset-2'
              >
                Terms of Use
              </Link>
              &nbsp;and&nbsp;
              <Link
                href='/terms-and-condition'
                className='text-primary cursor-pointer font-bold hover:underline underline-offset-2'
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <Button className='text-lg w-full' title='Continue' type='submit' />
    </form>
  );
};

export default GuestInfoForm;
