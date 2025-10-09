import React from 'react';

import Checkout from '@/components/Checkout';
import { privateRoute } from '@/utils/handleAuth';

const cartIndex = () => {
  return <Checkout />;
};

export default cartIndex;
export const getServerSideProps = privateRoute();
