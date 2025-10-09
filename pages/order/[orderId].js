import React from 'react';

import { privateRoute } from '@/utils/handleAuth';
import FinalOrderReceipt from '@/components/Order/FinalOrderReceipt';

const OrderDetailIndex = () => {
  return <FinalOrderReceipt />;
};

export default OrderDetailIndex;
export const getServerSideProps = privateRoute();
