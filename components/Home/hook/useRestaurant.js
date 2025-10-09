import { useRouter } from 'next/router';
import { useContext, useEffect, useState, useCallback } from 'react';
import useTranslation from 'next-translate/useTranslation';

import commonApi from '@/services/api/common';
import AppContext from '@/utils/appContext';
import {
  API_SUCCESS_RESPONSE,
  CARD_TYPE,
  KEYS,
  SIDEBAR_TABS,
  DININGOPTION_TAB_CODES,
  REST_LOCATION_ID,
} from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';
import routes from '@/utils/routes';
import { extractDay, getDayNames, formatDateTime, placesSessionKey } from '@/utils/helper';
import Toast from '@/utils/toast';
import { useRestaurantCtx } from '@/contexts/restaurantContext';

const useRestaurant = ({ isCheckout = false }) => {
  const [loader, setLoader] = useState({ list: true, getTime: false });
  const [restaurantTime, setRestaurantTime] = useState([]);
  const [cardType, setCardType] = useState();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = useState();
  const [deliveryLocation, setDeliveryLocation] = useState();
  const [pickupInputValue, setPickupInputValue] = useState('');
  const [myLocationTriggered, setMyLocationTriggered] = useState(false);

  // Restaurant context (single source of truth)
  const {
    loader: rLoader,
    defaultList,
    pickupSearchList,
    deliverySearchList,
    pickupCoord,
    deliveryCoord,
    setPickupCoord,
    setDeliveryCoord,
    loadDefaultList,
    loadSearchByPickup,
    loadSearchByDelivery,
  } = useRestaurantCtx();

  const { loginData, setPageLoad, setIsPageLoad, isPageLoad } = useContext(AppContext);

  const { t } = useTranslation('common');

  // Delegate fetchers to RestaurantContext
  const getNearByRestaurant = useCallback(
    async ({ currentTab = SIDEBAR_TABS.pickup } = {}) => {
      await loadDefaultList({ currentTab });
    },
    [loadDefaultList],
  );

  const getNearByRestaurantBySearch = useCallback(
    async ({ currentTab = SIDEBAR_TABS.pickup } = {}) => {
      if (currentTab === SIDEBAR_TABS.pickup) await loadSearchByPickup();
      else await loadSearchByDelivery();
    },
    [loadSearchByPickup, loadSearchByDelivery],
  );

  const getCardType = (data) => {
    let cardType;

    if (data?.available) {
      cardType = CARD_TYPE.TIME_CARD;
    } else if (data?.false) {
      cardType = CARD_TYPE.SCHEDULE_CARD;
    } else {
      cardType = CARD_TYPE.THIRD_OPT;
    }
    setCardType(cardType);
  };
  const getRestaurantTime = async ({ restId, currentTab, rest, fromButton }) => {
    LocalStorage.setJSON(REST_LOCATION_ID, restId);

    const isDelivery = currentTab === SIDEBAR_TABS.delivery ? true : false;
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

    setLoader((prev) => ({ ...prev, getTime: true }));
    try {
      const response = await commonApi({
        action: 'getRestaurantTimePickup',
        parameters: [restId, isDelivery],
        data: payload,
      });
      if (response.code === API_SUCCESS_RESPONSE) {
        LocalStorage.setJSON(KEYS.RESTAURANT_DETAIL, rest);
        LocalStorage.setJSON(KEYS.DINING_OPTION, currentTab);
        setRestaurantTime(response?.data);
        getCardType(response?.data);
        if (fromButton) {
          orderNow(response?.data, currentTab, rest);
        }
      } else {
        // non-success response; no-op
      }
    } catch (e) {
      Toast.error('Failed to fetch restaurant time');
    } finally {
      setLoader((prev) => ({ ...prev, getTime: false }));
    }
  };

  // using shared helper formatDateTime

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
    if (!isCheckout) {
      createPosOrder(currentTab, dateAndTime, selectedStore.restId);
      router.push(routes.menu(DININGOPTION_TAB_CODES[currentTab], selectedStore.slug));

      setPageLoad(true);
    }
    // if (globleCartItem?.products?.[0]) {
    //   removeItem(globleCartItem?.products?.[0], true, true);
    // }
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

  useEffect(() => {
    setPickupLocation(pickupCoord);
  }, [pickupCoord]);

  useEffect(() => {
    setDeliveryLocation(deliveryCoord);
  }, [deliveryCoord]);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const parseDateString = (dateString) => {
    const year = parseInt(dateString?.substring(0, 4), 10);
    const month = parseInt(dateString?.substring(4, 6), 10) - 1;
    const day = parseInt(dateString?.substring(6, 8), 10);
    return new Date(year, month, day);
  };

  const getDateLabel = (date) => {
    if (date.toDateString() === today.toDateString()) {
      return t('today');
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return t('tomorrow');
    } else {
      return `${getDayNames(date)} - ${extractDay(date)}`;
    }
  };

  const orderNow = (data, currentTab, selectedStore) => {
    const date = data?.availableTimes?.[0]?.date;
    const time = data?.availableTimes?.[0]?.times?.[0];
    if (time) handleClickTimeCard(time, date, currentTab, selectedStore);
  };

  useEffect(() => {
    setIsPageLoad(false);
  }, []);

  // Initial: avoid flicker by skipping default load if a pickup session exists
  useEffect(() => {
    if (isCheckout) return;
    try {
      const hasPickupSession =
        typeof window !== 'undefined' && !!sessionStorage.getItem(placesSessionKey(true));
      if (!pickupCoord && !hasPickupSession) {
        loadDefaultList({ currentTab: SIDEBAR_TABS.pickup });
      }
    } catch {
      if (!pickupCoord) loadDefaultList({ currentTab: SIDEBAR_TABS.pickup });
    }
  }, [isCheckout, pickupCoord, loadDefaultList]);

  return {
    isPageLoad,
    getNearByRestaurant,
    getNearByRestaurantBySearch,
    restaturantList: defaultList,
    bySearchRestaturantList: pickupSearchList, // backward compat if used elsewhere
    pickupSearchList,
    deliverySearchList,
    loader: { ...loader, list: rLoader?.list },
    getRestaurantTime,
    cardType,
    restaurantTime,
    handleClickTimeCard,
    selectedRestaurantId,
    setSelectedRestaurantId,
    pickupLocation,
    setPickupLocation: setPickupCoord,
    deliveryLocation,
    setDeliveryLocation: setDeliveryCoord,
    pickupInputValue,
    setPickupInputValue,
    orderNow,
    getDateLabel,
    parseDateString,
    myLocationTriggered,
    setMyLocationTriggered,
  };
};

export default useRestaurant;
