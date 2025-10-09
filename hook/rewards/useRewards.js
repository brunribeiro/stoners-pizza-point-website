import { useEffect, useState, useCallback, useContext } from 'react';

import commonApi from '@/services/api/common';
import AppContext from '@/utils/appContext';

const useRewards = (fromHeader = false) => {
  const [loader, setLoader] = useState(false);
  const [history, setHistory] = useState();
  const [showHistory, setShowHistory] = useState(false);
  const { loginData, loyaltyData, setLoyaltyData } = useContext(AppContext);

  const callLoyalty = useCallback(async () => {
    setLoader(true);
    try {
      const { data } = await commonApi({ action: 'getLoyalty' });
      setLoyaltyData(data);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      setLoyaltyData();
    } finally {
      setLoader(false);
    }
  }, []);
  const getRewardHistory = useCallback(async () => {
    setLoader(true);
    const payload = {
      count: 4,
      page: 0,
      transactionDate: 'transactionDate',
    };
    try {
      const { data } = await commonApi({ action: 'getRewardHistory', data: payload });
      setHistory(data);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      setHistory();
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    if (fromHeader) {
      callLoyalty();
    } else {
      getRewardHistory();
    }
  }, [callLoyalty, loginData]);

  return { loader, callLoyalty, loyaltyData, showHistory, setShowHistory, history };
};

export default useRewards;
