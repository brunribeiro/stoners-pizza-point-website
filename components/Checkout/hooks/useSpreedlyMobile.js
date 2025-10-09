import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import commonApi from '@/services/api/common';

const useSpreedlyMobile = () => {
  const [loading, setLoading] = useState(false);
  const [initData, setInitData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { userId, deviceId } = router.query;
      if (userId || deviceId) {
        initApi();
      }
    }
  }, [router.isReady]);

  const initApi = async () => {
    const { userId, accessToken, deviceId } = router.query;

    setLoading(true);
    try {
      const initResponse = await commonApi({
        action: 'paymentInit',
        data: { userId },
        config: {
          customDeviceId: deviceId,
          accesstoken: accessToken,
        },
      });
      setInitData(initResponse?.data);
    } catch (error) {
      console.error('Failed to initialize payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToken = (data) => {
    window.location.href = `${window.location.pathname}?token=${data.token}`;
  };

  const handleBack = () => {
    window.location.href = `${window.location.pathname}?isBacked=true`;
  };

  return {
    handleBack,
    loading,
    setLoading,
    router,
    initData,
    handleToken,
  };
};

export default useSpreedlyMobile;
