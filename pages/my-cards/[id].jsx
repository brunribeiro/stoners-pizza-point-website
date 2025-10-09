import React from 'react';

import EditCardForm from '@/components/MyCards/EditCardForm';
import { privateRoute } from '@/utils/handleAuth';

const editCard = () => {
  return <EditCardForm />;
};

export default editCard;
export const getServerSideProps = privateRoute();
