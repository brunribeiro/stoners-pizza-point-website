import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import CarDetailCard from '../carDetailCard';

import { KEYS, REST_LOCATION_ID } from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';
import { storeSessionData } from '@/utils/common';
import AppContext from '@/utils/appContext';
import routes from '@/utils/routes';

const useRestaurantList = ({ dt, currentTab, isCheckout, t }) => {
  const [openFutureTime, setOpenFutureTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState();
  const [restDate, setRestDate] = useState(null);
  const [errors, setErrors] = useState({ date: '', time: '' });
  const router = useRouter();
  const {
    isButtonLoad,
    selectedStore,
    setSelectedStore,
    openStoreDetail,
    setOpenStoreDetail,
    setIsButtonLoad,
    setOpenChangeLocation,
    setRestaurant,
  } = useContext(AppContext);

  const handleGetRestaurantTime = async ({
    restId,
    directRestId,
    rest,
    fromButton,
    orderAhead = false,
    getRestTime = false,
  }) => {
    setRestaurant(rest);
    if (!getRestTime) {
      setIsButtonLoad({ [rest?.id]: true, orderAhead });

      await storeSessionData({
        menuId: rest.menus?.[0]?.id,
        restId: rest.id,
      });
      dt.setSelectedRestaurantId(directRestId);
    }
    await dt.getRestaurantTime({ restId, currentTab, rest, fromButton });

    if (router.pathname !== routes.home && !orderAhead) {
      setIsButtonLoad({});
      setOpenChangeLocation(false);
      LocalStorage.setJSON(REST_LOCATION_ID, rest.restId);
    }
    const data = LocalStorage.getJSON(KEYS.TEMP_DELIVERY_ADDRESS);
    if (data) {
      LocalStorage.setJSON(KEYS.DELIVERY_ADDRESS, data);
    }
  };

  const getCard = () => {
    return (
      <CarDetailCard
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        setRestDate={setRestDate}
        setErrors={setErrors}
        restDate={restDate}
        errors={errors}
        dt={dt}
        t={t}
        mandatoryFields={{ date: true, time: true }}
      />
    );
  };

  useEffect(() => {
    if (isCheckout) {
      const rest = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
      dt.setSelectedRestaurantId(true);
      dt.getRestaurantTime({ restId: rest.restId, currentTab, rest });
    }

    return () => {};
  }, [currentTab]);

  return {
    openFutureTime,
    setOpenFutureTime,
    handleGetRestaurantTime,
    selectedTime,
    setSelectedTime,
    restDate,
    setRestDate,
    errors,
    setErrors,
    getCard,
    openStoreDetail,
    setOpenStoreDetail,
    selectedStore,
    setSelectedStore,
    isButtonLoad,
  };
};

export default useRestaurantList;
