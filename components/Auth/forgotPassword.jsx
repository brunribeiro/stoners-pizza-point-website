import React from 'react';
import useTranslation from 'next-translate/useTranslation';

import { SPACE_REMOVE_REGEX } from '@/utils/constant';
import Button from '@/widgets/button';
import Input from '@/widgets/input';
import Logo from '@/icons/logo';

const ForgotPassword = ({ dt, setOpenRegister }) => {
  const handleBack = () => {
    setOpenRegister(false);
    dt.setIsForgetPassword(false);
    dt.setValue('email', '');
  };
  const { t } = useTranslation('common');
  return (
    <div className='flex flex-col gap-4 p-7'>
      <div className=' flex w-full justify-center items-center my-5'>
        <div>
          <Logo width='226' height='71' />
        </div>
      </div>
      <button
        className='text-primary text-left font-bold text-base underline ml-1 underline-offset-2'
        onClick={handleBack}
      >
        {t`back`}
      </button>
      {!dt.isMailSent ? (
        <>
          {' '}
          <div className='text-lg text-[#333] font-bold'>{t`forgotPassword.resetTitle`}</div>
          <Input
            ariaLabel={t`forgotPassword.emailPlaceholder`}
            placeholder={t`forgotPassword.emailPlaceholder`}
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
          <Button
            title={t`submit`}
            className='uppercase'
            onClick={dt.handleSubmit(dt.onSubmit)}
            loading={dt.loader}
          />
          <div className='mx-auto mt-4'>
            <button
              className='text-primary font-bold text-base hover:text-dark-primary underline ml-1 underline-offset-2'
              onClick={handleBack}
            >
              {t`forgotPassword.backToLogin`}
            </button>
          </div>
        </>
      ) : (
        <div className='mx-auto mt-4'>
          <div className='flex flex-col  justify-center items-center gap-2 '>
            <p className='mx-auto text-xs text-center w-full '>{t`forgotPassword.emailSentMessage`}</p>
            <button className='underline text-xs underline-offset-4' onClick={handleBack}>
              {t`forgotPassword.backToLogin`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
