import React from 'react';

// import RewardsOrderConfirmation from '@/components/Rewards';
import { privateRoute } from '@/utils/handleAuth';
import RewardsPage from '@/components/Rewards/RewardsPage';

const RewardsIndex = () => {
  return <RewardsPage />;
};

export default RewardsIndex;
export const getServerSideProps = privateRoute();
