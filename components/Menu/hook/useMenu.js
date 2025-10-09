import { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { useRouter } from 'next/router';

import routes from '@/utils/routes';
import AppContext from '@/utils/appContext';
import { LocalStorage } from '@/utils/localStorage';
import { KEYS, SIDEBAR_TABS, DINING_OPTION, REST_LOCATION_ID } from '@/utils/constant';
import { getRestaurantDetail } from '@/utils/common';
import useReorder from '@/hook/order/useReorder';
import { useMenuCtx } from '@/contexts/menuContext';

const useMenu = () => {
  const router = useRouter();
  const isManualScroll = useRef(false);
  const dt = useReorder();

  const [categoryId, setCategoryId] = useState(router.query.id || null);
  const [category, setCategory] = useState();
  const [isItemListCalled, setIsItemListCalled] = useState(false);

  // for Time selection used the following states
  const [errors, setErrors] = useState({ date: '', time: '' });
  const [selectedTime, setSelectedTime] = useState();
  const [restDate, setRestDate] = useState(null);

  const {
    itemLoad,
    setItemLoad,
    setRestaurant,
    currentTab,
    setCurrentTab,
    openChangeLocation,
    setOpenChangeLocation,
    setTimeModal,
  } = useContext(AppContext);

  // Centralized menu data
  const menuCtx = useMenuCtx();

  const isDelivery = currentTab === SIDEBAR_TABS.delivery;

  const idHandler = useCallback(
    (id) => {
      const { diningOption, rest } = router.query;
      setCategoryId(id);
      router.replace(`${routes.items(diningOption, rest, id)}`, undefined, {
        shallow: true,
        scroll: false,
      });

      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const elementPosition = el.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - 80;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 80);
    },
    [router],
  );

  const scrollItems = (currentId) => {
    isManualScroll.current = true;

    if (currentId) {
      const el = document.getElementById(currentId);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }

    setTimeout(() => {
      isManualScroll.current = false;
    }, 800);
  };

  const getItemList = useCallback(async () => {
    const restroDetail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
    if (!restroDetail?.id) return;
    await menuCtx.loadItems();
    scrollItems(router.query.id);
  }, [router.query.id, menuCtx]);

  const getCategoryList = async () => {
    const restroDetail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
    if (!restroDetail?.id) return;
    await menuCtx.loadCategories();
  };

  // This open Time Modal if time is not set
  useEffect(() => {
    (async () => {
      if (
        !LocalStorage.getJSON(KEYS.TIME) &&
        LocalStorage.getJSON(REST_LOCATION_ID) &&
        !openChangeLocation
      ) {
        await dt.getAvailableTimes(LocalStorage.getJSON(REST_LOCATION_ID), isDelivery);
        setTimeModal(true);
      }
    })();
  }, [LocalStorage.getJSON(REST_LOCATION_ID), openChangeLocation]);

  // Handle initial setup and restaurant detail
  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.rest) {
      getRestaurantDetail({ slug: router.query.rest, setRestaurant });
    }

    if (
      router.query.diningOption &&
      router.query.diningOption !== 'null' &&
      router.query.diningOption !== 'undefined'
    ) {
      LocalStorage.set(KEYS.SELECTED_TAB, SIDEBAR_TABS[router.query.diningOption]);
      LocalStorage.setJSON(KEYS.DINING_OPTION, SIDEBAR_TABS[router.query.diningOption]);
    }

    if (router.query.id) {
      setCategoryId(router.query.id);
      scrollItems(router.query.id);
    }
  }, [router.isReady, router.query]);

  // Fetch items when id changes
  useEffect(() => {
    if (router.isReady && router.query.id && !isItemListCalled) {
      getItemList();
      setIsItemListCalled(true);
    }
  }, [router.isReady, router.query.id, getItemList, isItemListCalled]);

  useEffect(() => {
    if (
      router.asPath.includes(DINING_OPTION.Delivery.toLocaleLowerCase()) &&
      !LocalStorage.getJSON(KEYS.DELIVERY_ADDRESS)
    ) {
      setCurrentTab(SIDEBAR_TABS.delivery);
      setOpenChangeLocation(true);
    }
  }, []);

  return {
    categoryId,
    categoryList: menuCtx.categoryList,
    idHandler,
    itemList: menuCtx.itemList,
    // Prefer context item loader if present, fallback to legacy itemLoad
    itemLoad: menuCtx.loader.items ?? itemLoad,
    category,
    setCategory,
    setItemLoad,
    setCategoryId,
    isManualScroll,
    getCategoryList,
    errors,
    setErrors,
    selectedTime,
    setSelectedTime,
    restDate,
    setRestDate,
  };
};

export default useMenu;
