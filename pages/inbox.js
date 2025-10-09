import React from 'react';

// import InboxLists from '@/components/Inbox';
import { privateRoute } from '@/utils/handleAuth';
import RewardsPage from '@/components/Rewards/RewardsPage';

const InboxIndex = () => {
  // return <InboxLists title='Rewards' />;
  return <RewardsPage />;
};

export default InboxIndex;
export const getServerSideProps = privateRoute();
