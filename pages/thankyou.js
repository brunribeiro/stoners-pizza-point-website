import React from 'react';

import OrderReceipt from '@/components/OrderReceipt';
import { privateRoute } from '@/utils/handleAuth';

const thankyou = () => {
  return <OrderReceipt />;
};

export default thankyou;
export const getServerSideProps = privateRoute();
