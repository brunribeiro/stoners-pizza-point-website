import React from 'react';
import Script from 'next/script';

import SpreedlyMobile from '@/components/Checkout/SpreedlyMobile';
import { publicRoute } from '@/utils/handleAuth';

const checkoutIndex = () => {
  return (
    <div>
      <Script src='https://core.spreedly.com/iframe/iframe-v1.min.js' strategy='afterInteractive' />
      <SpreedlyMobile />;
    </div>
  );
};
export default checkoutIndex;
export const getServerSideProps = publicRoute();
