import React, { useContext } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

import PaperTag from '@/icons/PaperTag';
import Button from '@/widgets/button';
import routes from '@/utils/routes';
import AppContext from '@/utils/appContext';

const EmptyCart = ({ setOpenCart }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { menuRestId } = useContext(AppContext);
  return (
    <div className='flex justify-center items-center min-h-96'>
      <div className='font-extrabold text-xl'></div>
      <div className='flex flex-col gap-2 justify-center items-center h-[60dvh]'>
        <PaperTag className='cursor-default' />
        <p className='text-lg text-[#0B121580] mb-6'>{t`emptyCard`}</p>
        <Button
          title='Add item'
          onClick={() => {
            if (menuRestId?.restId && menuRestId?.menuId) {
              router.push(routes.menu);
            } else {
              router.push('/');
            }
            setOpenCart((prev) => !prev);
          }}
        />
      </div>
    </div>
  );
};

export default EmptyCart;
