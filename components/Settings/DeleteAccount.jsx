import React, { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import DrawerWrapper from '@/shared/drawer';
import Button from '@/widgets/button';
import useDeleteAccount from '@/hook/settings/useDeleteAccount';

const DeleteAccount = () => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const { deleteHandler } = useDeleteAccount();

  return (
    <div>
      <div className='font-extrabold mb-2 text-lg'>Delete Account</div>
      <div className='font-normal text-foreground'>
        By deleting this account, you will permanently lose your
        <span className='text-primary font-extrabold'> Profile</span>,
        <span className='text-primary font-extrabold'> Points</span> and
        <span className='text-primary font-extrabold'> Rewards</span>.
      </div>

      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className='text-primary hover:text-dark-primary mt-4'
      >
        <span className='text-[14px] underline underline-offset-2'>
          {t`iWantToDeleteMyAccount`}
        </span>
      </button>

      <DrawerWrapper
        visible={isOpen}
        onVisible={setIsOpen}
        widthClass='w-full sm:w-[480px]'
        title='Are you sure ?'
        arrow={false}
        modalFooter={
          <div className='flex flex-col justify-between gap-5 items-center px-2 -mt-1 w-full'>
            <Button
              className='w-full'
              title={'Delete Account'}
              onClick={() => {
                deleteHandler();
              }}
            ></Button>
            <Button
              className='w-full'
              onClick={() => setIsOpen(false)}
              title='Cancel'
              primary={false}
            ></Button>
          </div>
        }
        onclose={() => setIsOpen(false)}
      >
        <div className=' p-8 mt-5'>
          <p className='mb-4'>
            You are about to delete your account. By deleting this account you will{' '}
            <span className='font-bold'>permanently</span> lose your:
          </p>
          <ul className='text-primary font-bold  mb-6'>
            <li>Profile</li>
            <li>Points</li>
            <li>Rewards</li>
          </ul>
        </div>
      </DrawerWrapper>
    </div>
  );
};

export default DeleteAccount;
