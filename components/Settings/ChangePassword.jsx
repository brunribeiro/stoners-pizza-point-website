import React from 'react';
import useTranslation from 'next-translate/useTranslation';

import Button from '@/widgets/button';
import PasswordInput from '@/widgets/PasswordInput';

const ChangePassword = ({ dt }) => {
  const { t } = useTranslation('common');
  return (
    <div className='flex flex-col gap-5'>
      <form onSubmit={dt.handleSubmit(dt.onSubmit)} className='flex flex-col md:flex-row gap-5'>
        <PasswordInput
          label={t`currentPassword`}
          ariaLabel={t`currentPassword`}
          placeholder={`Enter ${t('currentPassword')}`}
          rest={dt.register('currentPassword', {
            onChange: (event) => {
              event.target.value = event.target.value.replaceAll(/\s/g, '');
              dt.setValue('currentPassword', event.target.value);
            },
          })}
          error={dt.errors.currentPassword?.message}
        />
        <PasswordInput
          label={t`newPassword`}
          ariaLabel={t`newPassword`}
          placeholder={`Enter ${t('newPassword')}`}
          rest={dt.register('newPassword', {
            onChange: (event) => {
              event.target.value = event.target.value.replaceAll(/\s/g, '');
              dt.setValue('newPassword', event.target.value);
            },
          })}
          error={dt.errors.newPassword?.message}
        />
        <PasswordInput
          label={t`confirmPassword`}
          ariaLabel={t`confirmPassword`}
          placeholder={`Enter ${t('confirmPassword')}`}
          rest={dt.register('confirmPassword', {
            onChange: (event) => {
              event.target.value = event.target.value.replaceAll(/\s/g, '');
              dt.setValue('confirmPassword', event.target.value);
            },
          })}
          error={dt.errors.confirmPassword?.message}
        />
      </form>
      <div className='pb-3 flex items-center justify-between'>
        <span className='font-bold'> </span>
        <Button
          title='Update'
          disabled={!dt.isDirty}
          type='submit'
          onClick={dt.handleSubmit(dt.onSubmit)}
          className='!py-1  !text-sm'
        />
      </div>
    </div>
  );
};

export default ChangePassword;
