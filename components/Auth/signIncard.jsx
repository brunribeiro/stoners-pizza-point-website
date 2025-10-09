import React from 'react';
import useTranslation from 'next-translate/useTranslation';

import Button from '@/widgets/button';
import Input from '@/widgets/input';
import { SPACE_REMOVE_REGEX, USER_MESSAGES } from '@/utils/constant';
import PasswordInput from '@/widgets/PasswordInput';
import CountdownTimer from '@/widgets/countDownTimer';
import Logo from '@/icons/logo';

const SignIncard = ({ dt, dtReg, seconds, setSeconds, dtForget = {} }) => {
  const { t } = useTranslation('common');
  return (
    <form onSubmit={dt.handleSubmit(dt.onSubmit)} className='flex flex-col gap-10 pt-7 px-6'>
      <div className=' flex w-full justify-center items-center'>
        <div>
          <Logo width='226' height='71' />
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {(dtReg.registerData === USER_MESSAGES.USER_NOT_VARIFIED ||
          dt.isVerified === USER_MESSAGES.USER_NOT_VARIFIED) && (
          <h2 className='text-xs text-[#008000]'>{t`signIn.verifyAccount`}</h2>
        )}

        <Input
          ariaLabel={t`signIn.emailPlaceholder`}
          placeholder={t`signIn.emailPlaceholder`}
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
        <PasswordInput
          ariaLabel={t`signIn.passwordPlaceholder`}
          placeholder={t`signIn.passwordPlaceholder`}
          onChange={(e) => {
            const newValue = e.target.value.replaceAll(/\s/g, '');
            dt.setValue('password', newValue);
            dt.trigger('password');
          }}
          error={dt.errors.password?.message}
        />
        <div className=' flex justify-between '>
          <div className='flex items-center gap-3 hover:text-primary cursor-pointer text-dark-gray'>
            <input
              type='checkbox'
              id='remember'
              name='remember'
              value='remember'
              aria-label='remember'
              className='w-4 h-4 rounded-lg opacity-0 absolute peer '
            />
            <span className='custom-checkbox peer-checked:!bg-primary peer-checked:!border-primary'></span>
            <label className='text-sm font-medium mt-1 cursor-pointer' htmlFor='remember'>
              {t`signIn.rememberMe`}
            </label>
          </div>

          <div className='flex text-sm items-center  justify-between'>
            <button
              type='button'
              className='text-foreground hover:text-primary hover:underline'
              onClick={() => dtForget.setIsForgetPassword(true)}
            >
              {t`signIn.forgotPassword`}
            </button>
          </div>
        </div>
      </div>

      <div className='flex gap-4 justify-center items-center'>
        {(dtReg.registerData === USER_MESSAGES.USER_NOT_VARIFIED ||
          dt.isVerified === USER_MESSAGES.USER_NOT_VARIFIED) && (
          <>
            {seconds > 0 && <CountdownTimer seconds={seconds} setSeconds={setSeconds} />}
            <button
              className='underline text-primary underline-offset-4'
              disabled={dt.seconds && true}
              onClick={dt.handleResendVerificationEmail}
            >
              {t`signIn.resendCode`}
            </button>
          </>
        )}
      </div>
      <Button
        type='submit'
        title={'Confirm'}
        className='uppercase'
        loading={dt.loader}
        // onClick={dt.handleSubmit(dt.onSubmit)}
      />
      {/* <Button title='Sign In with Google' icon={<GIcon />} className="bg-transparent !text-black !border-black" /> */}
      {/* <Button title='Sign In with Apple' icon={<AppleIcon />} className="bg-transparent !text-black !border-black" /> */}
      <div className='text-center text-base text-dark-gray font-normal'>
        {t`signIn.dontHaveAccount`}
        <button
          href='#'
          className='text-primary font-bold underline ml-1 hover:text-dark-primary underline-offset-2'
          onClick={dt.handleSignUpOpen}
        >
          {t`signIn.createAccount`}
        </button>
      </div>
    </form>
  );
};

export default SignIncard;
