// hooks/useOrderList.js
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import commonApi from '@/services/api/common';
import AppContext from '@/utils/appContext';
import { API_SUCCESS_RESPONSE, DEFAULT_LIMIT, KEYS } from '@/utils/constant';
import routes from '@/utils/routes';
import { LocalStorage } from '@/utils/localStorage';

const useOrderList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loginData } = useContext(AppContext);
  const [openOrderDetail, setOpenOrderDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openStoreDetail, setOpenStoreDetail] = useState(false);
  const [restDetail, setRestDetail] = useState(null);

  const router = useRouter();

  const getOrderList = async () => {
    const payload = {
      userId: loginData.userId,
      page: currentPage,
      limit: DEFAULT_LIMIT,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    setLoading(true);
    try {
      const response = await commonApi({
        action: 'orderHistory',
        data: payload,
      });
      if (response.code === API_SUCCESS_RESPONSE) {
        setList(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch order list', error);
    } finally {
      setLoading(false);
    }
  };

  const getRestDetail = async () => {
    const restroDetail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
    const restId = restroDetail.id;
    try {
      const response = await commonApi({
        action: 'getRestDetail',
        parameters: [restId],
      });
      if (response.code === API_SUCCESS_RESPONSE) {
        setRestDetail(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch rest detail', error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (loginData.userId) {
      getOrderList();
    }
  }, [loginData.userId, currentPage]);

  const handleDetail = async (id) => {
    router.push(`${routes.orderHistory}/${id}`);
  };

  return {
    list,
    loading,
    handleDetail,
    setOpenOrderDetail,
    openOrderDetail,
    getRestDetail,
    restDetail,
    openStoreDetail,
    setOpenStoreDetail,
    currentPage,
    setCurrentPage,
  };
};

export default useOrderList;
