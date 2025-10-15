import { useEffect, useState, useCallback, useContext } from 'react';

import commonApi from '@/services/api/common';
import AppContext from '@/utils/appContext';

// Global deduplication state for loyalty API
const loyaltyLoadState = {
  loading: false,
  lastCall: 0,
};

const DEBOUNCE_DELAY = 500; // ms

const useRewards = (fromHeader = false) => {
  const [loader, setLoader] = useState(false);
  const [history, setHistory] = useState();
  const [showHistory, setShowHistory] = useState(false);
  const { loginData, loyaltyData, setLoyaltyData } = useContext(AppContext);

  const callLoyalty = useCallback(async () => {
    const now = Date.now();

    // Debounce: if called within 500ms of last call, skip
    if (now - loyaltyLoadState.lastCall < DEBOUNCE_DELAY) {
      return;
    }

    // Deduplication: if already loading, skip
    if (loyaltyLoadState.loading) {
      return;
    }

    loyaltyLoadState.loading = true;
    loyaltyLoadState.lastCall = now;
    setLoader(true);

    try {
      const { data } = await commonApi({ action: 'getLoyalty' });
      setLoyaltyData(data);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      // Don't clear loyaltyData on error - preserve last known value
    } finally {
      loyaltyLoadState.loading = false;
      setLoader(false);
    }
  }, [setLoyaltyData]);

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
      console.error('Error fetching reward history:', error);
      // Don't clear history on error - preserve last known value
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    if (!loginData?.userId) return;

    if (fromHeader) {
      callLoyalty();
    } else {
      getRewardHistory();
    }
  }, [loginData?.userId, fromHeader, callLoyalty, getRewardHistory]);

  return { loader, callLoyalty, loyaltyData, showHistory, setShowHistory, history };
};

export default useRewards;
