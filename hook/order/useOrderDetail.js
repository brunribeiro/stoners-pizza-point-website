// hooks/useOrderDetail.js
import { useEffect, useState } from 'react';

import commonApi from '@/services/api/common';
import { API_SUCCESS_RESPONSE } from '@/utils/constant';

const useOrderDetail = (orderId) => {
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrderDetail = async () => {
    setLoading(true);

    try {
      const response = await commonApi({
        action: 'orderDetail',
        parameters: [orderId],
      });
      if (response.code === API_SUCCESS_RESPONSE) {
        setOrderDetail(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch order detail', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  return { orderDetail, loading, fetchOrderDetail };
};

export default useOrderDetail;
