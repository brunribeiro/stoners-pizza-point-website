import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import commonApi from '@/api/common';
import AppContext from '@/utils/appContext';
import { LocalStorage } from '@/utils/localStorage';
import { KEYS } from '@/utils/constant';

const useUpsell = () => {
  const [restId, setRestId] = useState(null);
  const [upsellData, setUpsellData] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { loginData } = useContext(AppContext);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const restroDetail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
      if (restroDetail.id) {
        setRestId(restroDetail.id);
      }
    }
  }, []);

  const getUpsell = async () => {
    if (restId) {
      setLoading(true);
      try {
        const response = await commonApi({
          action: 'getUpsell',
          data: { userId: loginData?.userId, restaurantId: +restId },
        });
        setUpsellData(response);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching upSell list:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    getUpsell,
    setUpsellData,
    upsellData,
    restId,
    loading,
    setLoading,
    router,
  };
};

export default useUpsell;
