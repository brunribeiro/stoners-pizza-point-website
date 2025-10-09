import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { API_SUCCESS_RESPONSE, DEFAULT_LIMIT, SIDEBAR_TABS } from '@/utils/constant';
import { buildRestaurantPayload, restaurantCoordKey, debounce } from '@/utils/helper';
import { fetchNearbyDefault, fetchNearbySearch } from '@/services/restaurantService';
import AppContext from '@/utils/appContext';

const RestaurantContext = createContext(null);

export const RestaurantProvider = ({ children }) => {
  // Shared lists and loader
  const [loader, setLoader] = useState({ list: false });
  const [defaultList, setDefaultList] = useState([]);
  const [pickupSearchList, setPickupSearchList] = useState([]);
  const [deliverySearchList, setDeliverySearchList] = useState([]);

  // Coordinates selected by user
  const [pickupCoord, setPickupCoord] = useState();
  const [deliveryCoord, setDeliveryCoord] = useState();

  // For stale guard
  const lastPickupKeyRef = useRef(null);
  const lastDeliveryKeyRef = useRef(null);
  const lastDefaultKeyRef = useRef(null);

  // Optionally use loginData for userId
  const { loginData } = useContext(AppContext);
  const userId = loginData?.user?.userId || loginData?.userId;

  const buildPayloadFor = useCallback(
    (currentTab, coordOverride) => {
      const pickupLocation =
        currentTab === SIDEBAR_TABS.pickup ? (coordOverride ?? pickupCoord) : undefined;
      const selectedLocation =
        currentTab === SIDEBAR_TABS.delivery ? (coordOverride ?? deliveryCoord) : undefined;
      return buildRestaurantPayload({
        currentTab,
        pickupLocation,
        selectedLocation,
        userId,
        page: 1,
        limit: DEFAULT_LIMIT,
      });
    },
    [pickupCoord, deliveryCoord, userId],
  );

  const withLoader = async (fn) => {
    setLoader((p) => ({ ...p, list: true }));
    try {
      return await fn();
    } finally {
      setLoader((p) => ({ ...p, list: false }));
    }
  };

  const loadDefaultList = useCallback(
    async ({ currentTab = SIDEBAR_TABS.pickup } = {}) => {
      const coordsKey =
        currentTab === SIDEBAR_TABS.pickup
          ? restaurantCoordKey(pickupCoord)
          : restaurantCoordKey(deliveryCoord);

      // Do not load default list for delivery without coordinates
      if (currentTab === SIDEBAR_TABS.delivery && !deliveryCoord) {
        return;
      }

      // If we already have default data for the same key, skip to avoid flicker
      const hasData = Array.isArray(defaultList) && defaultList.length > 0;
      if (coordsKey && lastDefaultKeyRef.current === coordsKey && hasData) {
        return;
      }

      return withLoader(async () => {
        const payload = buildPayloadFor(currentTab);
        const res = await fetchNearbyDefault({ payload, currentTab, coordsKey, userId });
        if (res?.code === API_SUCCESS_RESPONSE) {
          setDefaultList(res.data || []);
          lastDefaultKeyRef.current = coordsKey;
        }
        return res;
      });
    },
    [buildPayloadFor, pickupCoord, deliveryCoord, defaultList, userId],
  );

  const doPickupSearch = useCallback(
    async (coord) => {
      const currentTab = SIDEBAR_TABS.pickup;
      const effectiveCoord = coord ?? pickupCoord;
      const payload = buildPayloadFor(currentTab, effectiveCoord);
      const coordsKey = restaurantCoordKey(effectiveCoord);
      const hasData =
        Array.isArray(pickupSearchList) &&
        pickupSearchList[0] !== false &&
        pickupSearchList.length > 0;
      if (coordsKey && lastPickupKeyRef.current === coordsKey && hasData) return;
      const res = await fetchNearbySearch({ payload, currentTab, coordsKey, userId });
      if (res?.code === API_SUCCESS_RESPONSE) {
        setPickupSearchList(res.data || []);
        lastPickupKeyRef.current = coordsKey;
      }
      return res;
    },
    [buildPayloadFor, pickupCoord, pickupSearchList, userId],
  );

  const doDeliverySearch = useCallback(
    async (coord) => {
      const currentTab = SIDEBAR_TABS.delivery;
      const effectiveCoord = coord ?? deliveryCoord;
      const payload = buildPayloadFor(currentTab, effectiveCoord);
      const coordsKey = restaurantCoordKey(effectiveCoord);
      const hasData =
        Array.isArray(deliverySearchList) &&
        deliverySearchList[0] !== false &&
        deliverySearchList.length > 0;
      if (coordsKey && lastDeliveryKeyRef.current === coordsKey && hasData) return;
      const res = await fetchNearbySearch({ payload, currentTab, coordsKey, userId });
      if (res?.code === API_SUCCESS_RESPONSE) {
        setDeliverySearchList(res.data || []);
        lastDeliveryKeyRef.current = coordsKey;
      }
      return res;
    },
    [buildPayloadFor, deliveryCoord, deliverySearchList, userId],
  );

  // Debounced executors (300ms)
  const debouncedPickupExec = useMemo(
    () => debounce((coord) => withLoader(() => doPickupSearch(coord)), 300),
    [doPickupSearch],
  );
  const debouncedDeliveryExec = useMemo(
    () => debounce((coord) => withLoader(() => doDeliverySearch(coord)), 300),
    [doDeliverySearch],
  );

  // Public triggers: mark list as loading immediately to avoid flicker, then debounce
  const loadSearchByPickup = useCallback(
    (coord) => {
      const effectiveCoord = coord ?? pickupCoord;
      if (!effectiveCoord) {
        setPickupSearchList([]);
        setLoader((p) => ({ ...p, list: false }));
        return;
      }
      const key = restaurantCoordKey(effectiveCoord);
      const hasData =
        Array.isArray(pickupSearchList) &&
        pickupSearchList[0] !== false &&
        pickupSearchList.length > 0;
      if (key && lastPickupKeyRef.current === key && hasData) {
        setLoader((p) => ({ ...p, list: false }));
        return;
      }
      setPickupSearchList([false]);
      debouncedPickupExec(effectiveCoord);
    },
    [debouncedPickupExec, pickupCoord, pickupSearchList],
  );

  const loadSearchByDelivery = useCallback(
    (coord) => {
      const effectiveCoord = coord ?? deliveryCoord;
      if (!effectiveCoord) {
        setDeliverySearchList([]);
        setLoader((p) => ({ ...p, list: false }));
        return;
      }
      const key = restaurantCoordKey(effectiveCoord);
      const hasData =
        Array.isArray(deliverySearchList) &&
        deliverySearchList[0] !== false &&
        deliverySearchList.length > 0;
      if (key && lastDeliveryKeyRef.current === key && hasData) {
        setLoader((p) => ({ ...p, list: false }));
        return;
      }
      // Mark loading immediately to avoid blank UI before debounce executes
      setLoader((p) => ({ ...p, list: true }));
      setDeliverySearchList([false]);
      debouncedDeliveryExec(effectiveCoord);
    },
    [debouncedDeliveryExec, deliveryCoord, deliverySearchList],
  );

  const value = {
    loader,
    defaultList,
    pickupSearchList,
    deliverySearchList,
    pickupCoord,
    deliveryCoord,

    setPickupCoord,
    setDeliveryCoord,
    setPickupSearchList,
    setDeliverySearchList,
    setDefaultList,

    loadDefaultList,
    loadSearchByPickup,
    loadSearchByDelivery,
    resetPickupSearch: () => {
      lastPickupKeyRef.current = null;
      setPickupSearchList([]);
      setLoader((p) => ({ ...p, list: false }));
    },
    resetDeliverySearch: () => {
      lastDeliveryKeyRef.current = null;
      setDeliverySearchList([]);
      setLoader((p) => ({ ...p, list: false }));
    },
  };

  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>;
};

export const useRestaurantCtx = () => useContext(RestaurantContext);
export default RestaurantContext;
