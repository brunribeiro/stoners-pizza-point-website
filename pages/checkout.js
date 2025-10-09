// pages/checkout.js
import React from 'react';
import Script from 'next/script';

import Checkout from '@/components/Checkout';
import { privateRoute } from '@/utils/handleAuth';

const CheckoutPage = () => {
  return (
    <>
      <Script src='https://core.spreedly.com/iframe/iframe-v1.min.js' strategy='afterInteractive' />
      <Checkout />
    </>
  );
};

export default CheckoutPage;
export const getServerSideProps = privateRoute();
