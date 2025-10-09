import React from 'react';

import AlertIcon from '@/icons/AlertIcon';
import Button from '@/widgets/button';

const MaintenanceScreen = ({ loading, checkMaintence }) => {
  return (
    <div className='bg-white h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center text-center px-6'>
        <div className='mb-6'>
          <AlertIcon />
        </div>

        <h1 className='text-3xl font-stone uppercase text-black mb-4'>UNDER MAINTENANCE</h1>

        <p className='text-foreground text-lg mb-8'>
          We&apos;re working hard to improve the user experience. Stay tuned!
        </p>

        <Button title={'RETRY'} loading={loading} onClick={() => checkMaintence()}></Button>
      </div>
    </div>
  );
};

export default MaintenanceScreen;
