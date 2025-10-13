import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState, useRef } from 'react';

import commonApi from '@/services/api/common';
import AppContext from '@/utils/appContext';
import {
  API_SUCCESS_RESPONSE,
  DEFAULT_COUNT,
  DEFAULT_LNG,
  INBOX_STATUS,
  KEYS,
  NAV_DROPDOWN,
} from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';
import routes from '@/utils/routes';

// Cache for offer list - 5 minutes TTL
const OFFER_CACHE_TTL = 5 * 60 * 1000;
let offerListCache = null;
let offerListCacheTime = 0;
let ongoingOfferRequest = null;

// Export function to clear cache (useful for logout or manual refresh)
export const clearOfferCache = () => {
  offerListCache = null;
  offerListCacheTime = 0;
  ongoingOfferRequest = null;
};

const useInbox = ({
  setOpenPopup = () => {},
  getOffers = () => {},
  isCheckOut = false,
  loadOffer = false,
}) => {
  const { offerList, setOfferList, setPromoProps, loginData } = useContext(AppContext);
  const [msgList, setMsgList] = useState([]);
  const [customOfferList, setCustomOfferList] = useState([]);
  const [open, setOpen] = useState(false);
  const [pointsUsed, setPointsUsed] = useState(27);
  const [loader, setLoader] = useState({
    list: false,
    delete: false,
    submitPromo: false,
  });
  const [messageDetail, setMessageDetail] = useState({});
  const [promoCode, setPromoCode] = useState('');

  const router = useRouter();

  const getOfferList = async (forceRefresh = false) => {
    const now = Date.now();

    // Return cached data if available and not expired
    if (!forceRefresh && offerListCache && now - offerListCacheTime < OFFER_CACHE_TTL) {
      setOfferList(offerListCache.offers);
      setCustomOfferList(offerListCache.customOffers);
      return;
    }

    // If there's an ongoing request, wait for it instead of creating a new one
    if (ongoingOfferRequest) {
      try {
        await ongoingOfferRequest;
      } catch (error) {
        console.error('Failed to fetch offer list from ongoing request:', error);
      }
      return;
    }

    const payload = {
      count: DEFAULT_COUNT,
      languageCode: DEFAULT_LNG,
      page: 1,
    };

    setLoader((prev) => ({ ...prev, list: true }));

    // Create the request promise and store it
    ongoingOfferRequest = commonApi({
      action: 'offerList',
      data: payload,
    });

    try {
      const response = await ongoingOfferRequest;

      if (response.code === API_SUCCESS_RESPONSE) {
        const offers = response.data?.offerList?.offers || [];
        const customOffers = response.data?.customlist?.offers || [];

        // Update cache
        offerListCache = { offers, customOffers };
        offerListCacheTime = Date.now();

        setOfferList(offers);
        setCustomOfferList(customOffers);
      }
    } catch (error) {
      console.error('Failed to fetch offer list:', error);
    } finally {
      ongoingOfferRequest = null;
      setTimeout(() => {
        setLoader((prev) => ({ ...prev, list: false }));
      }, 200);
    }
  };

  const getMsgList = async () => {
    const payload = {
      count: 100,
      languageCode: DEFAULT_LNG,
      page: 1,
    };

    setLoader((prev) => ({ ...prev, list: true }));

    try {
      const response = await commonApi({
        action: 'msgList',
        data: payload,
      });

      if (response.code === API_SUCCESS_RESPONSE) {
        setMsgList(response.data?.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch offer list:', error);
    } finally {
      setLoader((prev) => ({ ...prev, list: false }));
    }
  };

  const handleDelete = async (offerId) => {
    const payload = {
      distributedOfferId: offerId,
      redeemStatus: INBOX_STATUS.DELETED,
    };

    setLoader((prev) => ({ ...prev, delete: true }));

    try {
      const response = await commonApi({
        action: 'changeDistributedOfferstatus',
        data: payload,
      });

      if (response.code === API_SUCCESS_RESPONSE) {
        await getOfferList();
        setOpen(false);
      }
    } catch (error) {
      console.error('Failed to delete offer:', error);
    } finally {
      setLoader((prev) => ({ ...prev, delete: false }));
    }
  };

  const submitPromoCode = async () => {
    const payload = {
      events: {
        'check-in': [promoCode],
      },
      languagecode: DEFAULT_LNG,
      latitude: 0,
      localDateTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      longitude: 0,
    };

    setLoader((prev) => ({ ...prev, submitPromo: true }));

    try {
      const response = await commonApi({
        action: 'submitPromoCode',
        data: payload,
      });

      if (response.code === API_SUCCESS_RESPONSE) {
        getOfferList();
        getOffers();

        setOpenPopup(false);
        setMessageDetail(response?.data?.offerList?.offers);
        setPromoProps(response?.data?.offerList?.offers);
        setOpenPopup(NAV_DROPDOWN.PROMO_CONTENT);

        if (!response?.data?.offerList?.offers.length) {
          setOpenPopup(NAV_DROPDOWN.NO_PROMO_CONTENT);
        }
      }
    } catch (error) {
      console.error('Failed to submit promocode:', error);
    } finally {
      setLoader((prev) => ({ ...prev, submitPromo: false }));
    }
  };

  const handleCustomRewards = (ad) => {
    const restDetail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);

    const itemId = ad.item.filter((item) => {
      return item.restId === restDetail.id;
    });
    const { diningOption, rest } = router.query;
    if (itemId[0]?.itemId) {
      router.push(routes.selectedItem(diningOption, rest, itemId[0].itemId));
    }
  };

  const hasInitializedRef = useRef(false);
  const prevLoginEmailRef = useRef(loginData.email);

  useEffect(() => {
    // Only fetch if user is logged in and we haven't initialized yet
    // or if the user email has changed (different user logged in)
    const userChanged = prevLoginEmailRef.current !== loginData.email;

    if (!isCheckOut && loginData.email) {
      if (!loadOffer && (!hasInitializedRef.current || userChanged)) {
        getMsgList();
        getOfferList();
        hasInitializedRef.current = true;
      }

      if (loadOffer && (!hasInitializedRef.current || userChanged)) {
        getOfferList();
        hasInitializedRef.current = true;
      }
    }

    prevLoginEmailRef.current = loginData.email;
  }, [loginData.email, isCheckOut, loadOffer]);

  return {
    offerList,
    loader,
    messageDetail,
    setMessageDetail,
    handleDelete,
    open,
    setOpen,
    submitPromoCode,
    promoCode,
    setPromoCode,
    getMsgList,
    msgList,
    pointsUsed,
    setPointsUsed,
    getOfferList,
    loginData,
    customOfferList,
    setCustomOfferList,
    handleCustomRewards,
  };
};

export default useInbox;
