import React from 'react';
import { useRouter } from 'next/router';

import OrderDetail from '@/components/Order/OrderDetail';

const FinalOrderReceipt = () => {
  const router = useRouter();
  const orderId = { id: router.query.orderId };
  return <OrderDetail orderId={orderId} />;
};

export default FinalOrderReceipt;
