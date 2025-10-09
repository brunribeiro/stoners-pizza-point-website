import React from 'react';
// import useTranslation from 'next-translate/useTranslation';

// import CustomModal from '../common/CustomModal';

import ChangePassword from './ChangePassword';

import useChangePassword from '@/hook/settings/useChangePassword';

const PasswordSettings = () => {
  const { ...dt } = useChangePassword();
  // const { t } = useTranslation('common');
  return (
    <div className='w-full'>
      <ChangePassword dt={dt} />
    </div>
  );
};

export default PasswordSettings;
