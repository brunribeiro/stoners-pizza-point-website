import React from 'react';

import IncentivioLoader from '@/widgets/incentivioLoader';

const PageLoader = () => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='flex h-[85dvh] justify-center items-center'>
        <IncentivioLoader />
      </div>
    </div>
  );
};

export default PageLoader;
