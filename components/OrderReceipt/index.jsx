import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import LayoutWrapper from '@/shared/layoutWrapper';
import Button from '@/widgets/button';
import AppContext from '@/utils/appContext';
import { API_SUCCESS_RESPONSE } from '@/utils/constant';
import routes from '@/utils/routes';

const OrderReceipt = () => {
  const { orderReceipt, setItemCount } = useContext(AppContext);
  const router = useRouter();
  const { code, data = {}, message } = orderReceipt || {};
  const timestamp = data?.requestedFullfillTime;
  const date = timestamp ? new Date(timestamp) : null;

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate = date ? date.toLocaleString('en-US', options) : 'N/A';

  if (code === API_SUCCESS_RESPONSE) {
    return (
      <LayoutWrapper>
        <div className='max-w-[680px] mx-auto px-5 py-10'>
          <Image src='/images/logo.svg' className='mx-auto mb-5' alt='logo' fill />
          <div className='mb-5 pb-5 border-b'>
            <div className='text-xl font-bold   mb-5'>Order Receipt</div>
            <div className='text-black'>{message}</div>
          </div>
          <div className='flex gap-5 flex-col mb-8'>
            <div>
              <div>Order Number:</div>
              <div className='text-lg font-bold'>{data?.orderNumber || 'N/A'}</div>
            </div>
            <div>
              <div>Scheduled Pickup:</div>
              <div className='text-lg font-bold'>{formattedDate}</div>
            </div>
            <div>
              <div>Pickup Location:</div>
              <div className='text-lg font-bold'>20 North San Pedro Street</div>
              <div className='text-lg font-bold'>San Jose, CA 95331</div>
            </div>
          </div>
          <Button
            title='Done'
            onClick={() => {
              router.push(routes.home);
              setItemCount(0);
            }}
            className='w-full'
          />
        </div>
      </LayoutWrapper>
    );
  } else {
    return (
      <LayoutWrapper>
        <div className=' flex rounded-2xl shadow-lg mt-10 flex-col h-96 max-w-3xl mx-auto  justify-center items-center p-5'>
          <p className='text-lg mb-2'>{message ?? 'Something went wrong'}</p>
          <Button
            className='w-1/2 mt-8 '
            title='Go to home'
            onClick={() => router.push(routes.home)}
          />
        </div>
      </LayoutWrapper>
    );
  }
};

export default OrderReceipt;
