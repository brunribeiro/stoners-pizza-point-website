import { useContext, useState, useTransition } from 'react';
import { useRouter } from 'next/router';

import AppContext from '@/utils/appContext';
import commonApi from '@/services/api/common';
import Toast from '@/utils/toast';
import { formatDateTime } from '@/utils/helper';
import routes from '@/utils/routes';
import { LocalStorage } from '@/utils/localStorage';
import { KEYS, SIDEBAR_TABS, DININGOPTION_TAB_CODES } from '@/utils/constant';

const useReorder = () => {
  const t = useTransition();
  const router = useRouter();

  const {
    loginData,
    setTimeModal,
    availableTimes,
    setAvailableTimes,
    currentTab,
    reOrderId,
    setReOrderId,
  } = useContext(AppContext);
  const [loader, setLoader] = useState(false);
  const isCheckoutPage = router.pathname.includes(routes.checkout);
  const isMenu = router.pathname.includes('menu');

  const isTimeClosed = (timeString) => {
    const currentTime = new Date();
    const targetTime = new Date(timeString);

    return currentTime > targetTime;
  };
  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, '');

  const handleClickTimeCard = async (time, date, currentTab, selectedStore) => {
    let dateAndTime;
    if (date) {
      dateAndTime = formatDateTime(date, time);
    } else {
      dateAndTime = formatDateTime(formattedDate, time);
    }
    LocalStorage.setJSON(KEYS.TIME, dateAndTime);
    if (isMenu) {
      createPosOrder(currentTab, dateAndTime, selectedStore.restId);
      router.push(routes.menu(DININGOPTION_TAB_CODES[currentTab], selectedStore.slug));
      setTimeModal(false);
    } else {
      try {
        const deliveryMode = currentTab === 0 ? 1 : 2;

        const payload = {
          deliveryMode,
          requestedFulfillTime: dateAndTime,
          userId: loginData?.userId,
          //   address: {},
        };
        // If checkoutOut is true, change the key to "newKey"
        if (isCheckoutPage) {
          // Remove the old key and assign the value to the new key
          payload.newTime = payload.requestedFulfillTime;
          payload.userId = loginData.userId;
          delete payload.requestedFulfillTime;
        }
        if (deliveryMode === 2) {
          payload.address = LocalStorage.getJSON(KEYS.DELIVERY_ADDRESS);
          payload.address.streetAddress = 'temp1';
          payload.address.apt = 'temp2';
          if (!payload.address.label) {
            delete payload.address.label;
          }
          delete payload.address.userId;
          delete payload.address.deviceId;
          delete payload.address.id;
        }

        await commonApi({
          action: isCheckoutPage ? 'updateTime' : 'reOrder',
          parameters: [reOrderId],
          data: payload,
        });

        if (deliveryMode === 2) {
          LocalStorage.setJSON(KEYS.DINING_OPTION, 1);
        } else LocalStorage.setJSON(KEYS.DINING_OPTION, 0);
        setTimeModal(false);
        router.push(routes.checkout);
      } catch (error) {
        console.error('Error in handleClickTimeCard:', error);
      }
    }
  };
  const createPosOrder = async (currentTab, dateAndTime, restId) => {
    let address = LocalStorage.getJSON(KEYS.DELIVERY_ADDRESS);
    if (!address) {
      address = LocalStorage.getJSON(KEYS.TEMP_DELIVERY_ADDRESS);
    }
    const payload = {
      platRestId: restId,
      deliveryMode: currentTab === SIDEBAR_TABS.delivery ? 2 : 1,
      requestedFulfillTime: dateAndTime,
      ...(currentTab === SIDEBAR_TABS.delivery && {
        address: {
          zip: address.zipcode,
          city: address.city,
          add1: address.description,
          add2: address.streetAddress,
          inst: address.instruction,
          state: address.state,
          country: address.country,
          lat: address.lat,
          long: address.long,
          apt: address.apt,
        },
      }),
    };

    if (loginData?.userId) {
      payload.userId = loginData.userId;
    }

    try {
      await commonApi({
        action: 'createPosOrder',
        data: payload,
      });
    } catch (error) {
      Toast.error(error?.response?.data?.data?.message, error?.response?.data?.data?.message);
    }
  };

  const handleReorder = async (order) => {
    setReOrderId(order?.id);
    setLoader({ loading: true, id: order?.id });
    const isDelivery = currentTab !== 0;

    try {
      // API call to copy the order
      const { data } = await commonApi({
        action: 'copyOrder',
        parameters: [order?.incentivioOrderId],
      });

      const isClosed = isTimeClosed(data?.closedTime);

      if (!isClosed) {
        Toast.warn('Restaurant is closed');
      } else {
        // Fetch available times (refactored to a new function)
        await getAvailableTimes(data.locationId, isDelivery);
      }
    } catch (e) {
      console.error('Error during reorder process:', e);
      Toast.error('An error occurred while reordering. Please try again.');
    } finally {
      setLoader(false);
    }
  };

  const getAvailableTimes = async (locationId, isDelivery) => {
    const address = LocalStorage.getJSON(KEYS.TEMP_DELIVERY_ADDRESS);

    let payload = {};

    if (isDelivery) {
      payload = {
        address: {
          zip: address.zipcode,
          city: address.city,
          add1: address.description,
          add2: address.fullAddress,
          inst: address.instruction,
          state: address.state,
          country: address.country,
          lat: address.lat,
          long: address.long,
          apt: address.apt,
          street1: address.street1,
        },
      };
    }

    try {
      const res = await commonApi({
        action: 'getRestaurantTimePickup',
        parameters: [locationId, isDelivery],
        data: payload,
      });
      if (res.data.availableTimes) {
        setTimeModal(true);
        setAvailableTimes(res.data.availableTimes);
      }
    } catch (e) {
      Toast.error('Failed to retrieve available times. Please try again.');
    }
  };

  return { loader, handleReorder, availableTimes, t, handleClickTimeCard, getAvailableTimes };
};

export default useReorder;
