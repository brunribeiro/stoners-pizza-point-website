import React from 'react';

import { privateRoute } from '@/utils/handleAuth';
import Setting from '@/components/Settings';

const MenuIndex = () => {
  return <Setting />;
};

export default MenuIndex;
export const getServerSideProps = privateRoute();
