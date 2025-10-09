import React from 'react';
import useTranslation from 'next-translate/useTranslation';

import { SPACE_REMOVE_REGEX } from '@/utils/constant';
import Button from '@/widgets/button';
import Checkbox from '@/widgets/Checkbox';
import Input from '@/widgets/input';
import PasswordInput from '@/widgets/PasswordInput';
import Logo from '@/icons/logo';

const SignUpcard = ({ dt }) => {
  const { t } = useTranslation('common');
  return (
    <form onSubmit={dt.handleSubmit(dt.onSubmit)} className='flex flex-col gap-4 px-7'>
      <div className='overflow-auto scrollbar-hide max-h-[85dvh] flex flex-col gap-4 sm:pb-0 pb-10'>
        <div className=' flex w-full justify-center items-center my-5'>
          <div>
            <Logo width='226' height='71' />
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <Input
            ariaLabel={t`signUp.firstName`}
            placeholder={t`signUp.firstName`}
            mandatory
            rest={dt.register('first_name', {
              onChange: (event) => {
                event.target.value = event.target.value.replaceAll(/[^ a-z]/gi, '');
                dt.setValue('first_name', event.target.value);
              },
            })}
            error={dt.errors.first_name?.message}
          />

          <Input
            ariaLabel={t`signUp.lastName`}
            placeholder={t`signUp.lastName`}
            rest={dt.register('last_name', {
              onChange: (event) => {
                event.target.value = event.target.value.replaceAll(/[^ a-z]/gi, '');
                dt.setValue('last_name', event.target.value);
              },
            })}
            error={dt.errors.last_name?.message}
          />

          <Input
            name={t`signUp.referralCode`}
            placeholder={t`signUp.referralCode`}
            rest={dt.register('referralCode', {
              onChange: (event) => {
                event.target.value = event.target.value.replaceAll(/\D/gi, '');
                dt.setValue('referralCode', event.target.value);
              },
            })}
          />

          <Input
            ariaLabel={t`signUp.email`}
            placeholder={t`signUp.email`}
            rest={dt.register('email', {
              onChange: (event) => {
                dt.setValue(
                  'email',
                  event.target.value?.replace(SPACE_REMOVE_REGEX, '')?.toLowerCase(),
                );
              },
            })}
            error={dt.errors.email?.message}
          />
          <Input
            ariaLabel={t`signUp.phoneNumber`}
            placeholder={t`signUp.phoneNumber`}
            maxLength={15}
            rest={dt.register('phone', {
              onChange: (event) => {
                event.target.value = event.target.value.replaceAll(/\D/gi, '');
                dt.setValue('phone', event.target.value);
              },
            })}
            error={dt.errors.phone?.message}
          />
          <PasswordInput
            ariaLabel={t`signUp.password`}
            placeholder={t`signUp.password`}
            onChange={(e) => {
              const newValue = e.target.value.replaceAll(/\s/g, '');
              dt.setValue('password', newValue);
              dt.trigger('password');
            }}
            error={dt.errors.password?.message}
          />

          <PasswordInput
            ariaLabel={t`signUp.confirmPassword`}
            placeholder={t`signUp.confirmPassword`}
            onChange={(e) => {
              const newValue = e.target.value;
              dt.setValue('confirmPassword', newValue);
              dt.trigger('confirmPassword');
            }}
            error={dt.errors.confirmPassword?.message}
          />

          <Checkbox
            title={t('signUp.promoCheckbox')}
            type='checkbox'
            className='items-baseline '
            checked={dt.watch('isInvite')}
            // checked={genderSlug?.includes(gender?.label)}
            // id={gender.value}
            // For={gender.label}
            onChange={(event) => {
              dt.setValue('isInvite', event.target.checked);
            }}
          />
          {/* <RHFDatePicker
            control={dt.control}
            name='dob'
            error={dt.errors.dob}
            displayFormat='dd/MM/yyyy'
            placeholder={t`signUp.birthday`}
            maxDate={new Date()}
          /> */}
        </div>
        <div className='flex flex-col gap-3'>
          {/* <Checkbox
            title={t('signUp.referralCheckbox')}
            checked={dt.watch('isReferral')}
            // checked={genderSlug?.includes(gender?.label)}
            // id={gender.value}
            // For={gender.label}
            onChange={(event) => {
              dt.setValue('isReferral', event.target.checked);
            }}
          />
          <p className='text-foreground text-lg text-opacity-50'>{t`signUp.privacyPolicyText`}</p>
          {dt.watch('isReferral') && (
            <Input
              name={t`signUp.referralCode`}
              placeholder={t`signUp.referralCode`}
              rest={dt.register('referralCode', {
                onChange: (event) => {
                  event.target.value = event.target.value.replaceAll(/\D/gi, '');
                  dt.setValue('referralCode', event.target.value);
                },
              })}
            />
          )} */}

          {/* <Checkbox
            title={t('signUp.agreeToTerms')}
            href='/terms-and-condition'
            // name='termsAndCondition'
            // register={dt.register}
          /> */}
        </div>
        <Button
          type='submit'
          title={t('signUp.createAccount')}
          className='uppercase mb-3'
          loading={dt.loader}
        />
        <div className='mx-auto'>
          <span> I have an account! </span>{' '}
          <button
            type='button'
            className='text-primary font-bold text-base hover:text-dark-primary underline ml-1 underline-offset-2'
            onClick={dt.handleLoginOpen}
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignUpcard;
