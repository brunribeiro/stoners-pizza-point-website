import React, { useContext, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import useTranslation from 'next-translate/useTranslation';

import IncentivioLoader from '@/widgets/incentivioLoader';
import commonApi from '@/api/common';
import AppContext from '@/utils/appContext';

const LoyaltyCard = () => {
  const { loginData } = useContext(AppContext);
  const { t } = useTranslation('common');
  const [loyaltyData, setLoyaltyData] = useState();
  const callLoyalty = async () => {
    const res = await commonApi({ action: 'getLoyalty' });
    setLoyaltyData(res);
  };

  useEffect(() => {
    callLoyalty();
  }, []);
  return (
    <div>
      <div className='grid gap-5  text-center'>
        <p className='text-xl font'>{t`incentivioRewards`}</p>

        <div style={{ height: 'auto', margin: '0 auto', maxWidth: 250, width: '100%' }}>
          {loyaltyData?.data?.externalId ? (
            <QRCode
              size={100}
              style={{ height: 'auto', width: '100%' }}
              value={loyaltyData?.data?.externalId}
              viewBox='0 0 50 50'
            />
          ) : (
            <div className='flex h-4 p-4 justify-center items-center'>
              <IncentivioLoader size='6' />
            </div>
          )}
        </div>
        <p className=' font-semibold text-xl capitalize'>{`${loginData?.firstName} ${loginData?.lastName}`}</p>
        <p className=' font-semibold text-xl capitalize'>{loyaltyData?.data?.externalId}</p>
        <p>{t`loyaltyText`}</p>
      </div>
    </div>
  );
};

export default LoyaltyCard;
