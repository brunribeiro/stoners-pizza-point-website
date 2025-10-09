import moment from 'moment';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

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

  const getOfferList = async () => {
    const payload = {
      count: DEFAULT_COUNT,
      languageCode: DEFAULT_LNG,
      page: 1,
    };

    setLoader((prev) => ({ ...prev, list: true }));

    try {
      const response = await commonApi({
        action: 'offerList',
        data: payload,
      });

      if (response.code === API_SUCCESS_RESPONSE) {
        setOfferList(response.data?.offerList?.offers);
        setCustomOfferList(response.data?.customlist?.offers);
      }
    } catch (error) {
      console.error('Failed to fetch offer list:', error);
    } finally {
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
      localDateTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
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

  useEffect(() => {
    if (!isCheckOut && loginData.email && !loadOffer) {
      getMsgList();
      getOfferList();
    }

    if (!isCheckOut && loadOffer) {
      getOfferList();
    }
  }, [loginData]);

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
