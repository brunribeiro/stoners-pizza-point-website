import React from 'react';

import SelectedItem from '@/components/Menu/SelectedItem';
import { privateRoute } from '@/utils/handleAuth';

const SelectedItemIndex = () => {
  return <SelectedItem />;
};

export const getServerSideProps = privateRoute();

export default SelectedItemIndex;
