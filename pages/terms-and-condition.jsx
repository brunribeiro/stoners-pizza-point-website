import React from 'react';

import TermsAndCondition from '@/components/TermsAndCondition';
import { privateRoute } from '@/utils/handleAuth';

const termsAndCondition = () => {
  return <TermsAndCondition />;
};

export default termsAndCondition;
export const getServerSideProps = privateRoute();
