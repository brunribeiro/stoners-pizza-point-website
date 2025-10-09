import React, { useContext, useState } from 'react';

import SettingsForm from '../Settings/SettingsForm';

import AppContext from '@/utils/appContext';
import Button from '@/widgets/button';
import useSettingForm from '@/hook/settings/useSettingForm';

const ContactInfo = ({ loginData, orderTrigger }) => {
  const { setOpenSignInModal, setOpenRegister } = useContext(AppContext);
  const { ...dtSetting } = useSettingForm();
  const [isOpen, setIsOpen] = useState(false);
  const openClose = (open) => {
    setIsOpen(open);
  };

  return (
    <div className='flex gap-5 w-full pb-5 mb-5 border-b border-gray-300 sm:flex-nowrap flex-wrap'>
      <div className='font-extrabold text-[21px] xl:min-w-48 sm:min-w-40 sm:w-auto w-full'>
        Contact Info
      </div>
      {!isOpen ? (
        <div className='flex flex-col w-full gap-5'>
          {loginData?.userId ? (
            <div className='relative'>
              <div className='absolute right-0 top-0'>
                <button
                  className='text-primary hover:scale-[1.02] hover:shadow-sm'
                  onClick={() => openClose(true)}
                >
                  Change
                </button>
              </div>
              <div className='flex flex-col mb-5'>
                <div className='text-foreground'>Name:</div>
                <div className='text-lg text-foreground font-bold'>{loginData.firstName}</div>
              </div>
              <div className='flex flex-col mb-5'>
                <div className='text-foreground'>Phone:</div>
                <div className='text-lg text-foreground font-bold'>{loginData.phoneNumber}</div>
              </div>
              <div className='flex flex-col mb-5'>
                <div className='text-foreground'>Email:</div>
                <div className='text-lg text-foreground font-bold'>{loginData.email}</div>
              </div>
            </div>
          ) : (
            <div className='w-full sm:pt-5 md:pt-10 mb-7'>
              <div className='mb-4'>
                <Button
                  title='Login'
                  onClick={() => setOpenSignInModal((prev) => !prev)}
                  className='w-full !text-xl'
                />
              </div>
              <div className='flex '>
                <p className='mx-auto'>
                  Don’t have an account?{' '}
                  <button
                    className='text-primary underline '
                    onClick={() => {
                      setOpenRegister((prev) => !prev);
                      setOpenSignInModal((prev) => !prev);
                    }}
                  >
                    Sign up
                  </button>{' '}
                </p>
              </div>
              {orderTrigger && !loginData.token && (
                <div className='flex'>
                  <p className='text-red text-sm mx-auto'>
                    Please provide your contact information.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className='flex flex-col w-full gap-5'>
          <form onSubmit={dtSetting.handleSubmit(dtSetting.onSubmit)}>
            <SettingsForm disabled={dtSetting.isSubmitting} dt={dtSetting} />
            <div className='grid sm:grid-cols-2 gap-2 w-full mt-5'>
              <Button
                className='w-full text-lg bg-slate-50 text-zinc-800 !font-extrabold hover:bg-zinc-700'
                title='Cancel'
                onClick={() => openClose(false)}
              />
              <Button type='submit' className='w-full text-lg !font-bold' title='Save' />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
