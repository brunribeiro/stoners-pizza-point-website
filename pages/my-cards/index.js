import React from 'react';

import MyCards from '@/components/MyCards';
import { privateRoute } from '@/utils/handleAuth';

const MyCardsIndex = () => {
  return <MyCards />;
};

export default MyCardsIndex;
export const getServerSideProps = privateRoute();
