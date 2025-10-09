import React from 'react';

import OrderReceipt from '@/components/OrderReceipt';
import { privateRoute } from '@/utils/handleAuth';

const OrderReceiptIndex = () => {
  return <OrderReceipt />;
};

export default OrderReceiptIndex;
export const getServerSideProps = privateRoute();
