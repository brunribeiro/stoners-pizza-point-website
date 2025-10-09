import React from 'react';

import Home from '@/components/Home';
import { privateRoute } from '@/utils/handleAuth';

export default function Page() {
  return <Home />;
}
export const getServerSideProps = privateRoute();
