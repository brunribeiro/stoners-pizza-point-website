import React from 'react';

import OrderConFirmation from '@/components/Order';
import { privateRoute } from '@/utils/handleAuth';

const OrderConFirmationIndex = () => {
  return <OrderConFirmation />;
};

export default OrderConFirmationIndex;
export const getServerSideProps = privateRoute();
