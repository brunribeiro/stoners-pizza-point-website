import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { useContext, useEffect, useState } from 'react';

import commonApi from '@/api/common';
import AppContext from '@/utils/appContext';
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from '@/utils/helper';
import routes from '@/utils/routes';
import Toast from '@/utils/toast';
import { DINING_OPTION, KEYS, PAYMENT_TYPE, REST_LOCATION_ID } from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';

const { publicRuntimeConfig } = getConfig();

const useOrderPlace = ({ setFocus, cartData, spreedlyToken, setSpreedlyToken }) => {
  const [loader, setLoader] = useState({
    orderPlace: false,
    listOffer: false,
    useOffer: false,
    removeOffer: false,
  });
  const localOrderSummary = getLocalStorageItem('orderSummary');
  const {
    loginData,
    selectedGiftCard,
    setOrderReceipt,
    appliedOffer,
    setAppliedOffer,
    applicableOffers,
    setApplicableOffers,
    guestInfo,
  } = useContext(AppContext);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [openPromoModal, setOpenPromoModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedReward, setSelectedReward] = useState(1);
  const [openRewards, setOpenRewards] = useState(false);
  const [pointsUsed, setPointsUsed] = useState(0);

  const [orderSummary, setOrderSummary] = useState(localOrderSummary);
  const [selectedTipsInPercentage, setSelectedTipsInPercentage] = useState(0);
  const [tip, setTip] = useState('0.00');
  const [total, setTotal] = useState(orderSummary?.orderTotal?.displayTotal);

  const router = useRouter();

  useEffect(() => {
    if (router.asPath === routes.checkout) {
      if (appliedOffer) {
        setLocalStorageItem('appliedOffer', appliedOffer);
      } else {
        removeLocalStorageItem('appliedOffer');
      }
    }
  }, [appliedOffer, router.asPath]);
  useEffect(() => {
    if (router.asPath === routes.checkout) {
      if (orderSummary) {
        setLocalStorageItem('orderSummary', orderSummary);
      } else {
        removeLocalStorageItem('orderSummary');
      }
    }
  }, [orderSummary, router.asPath]);

  const getSummary = async () => {
    try {
      const { data } = await commonApi({
        action: 'orderPriceDetail',
        data: { userId: loginData?.userId },
      });
      setOpenRewards(false);
      setOrderSummary(data);
      setTotal(data?.orderTotal?.displayTotal);
    } catch (error) {
      console.error('getSummary error: ', error);
    }
  };

  const orderPlace = async () => {
    setFocus(false);
    setLoader((prev) => ({ ...prev, orderPlace: true }));
    const isGuest = LocalStorage.getJSON(KEYS.IS_GUEST);

    try {
      // 1. Initialize payment
      const initResponse = await commonApi({
        action: 'paymentInit',
        data: { userId: loginData?.userId },
      });

      const attributes = initResponse?.data?.attributes;
      if (!attributes || !attributes?.SPREEDLY_ENV_KEY || !attributes?.nonce) {
        throw new Error('Missing payment init attributes');
      }

      const paymentConfigs = initResponse?.data?.paymentConfigs || [];
      let currentDiningOption = LocalStorage.get(DINING_OPTION);
      currentDiningOption = currentDiningOption === 0 ? 'PICKUP' : 'DELIVERY';

      const selectedConfig = paymentConfigs.find((cfg) => cfg.orderType === currentDiningOption);
      const paymentMode = selectedConfig?.paymentModes?.[0];

      if (!paymentMode) {
        throw new Error(`No payment mode found for dining option: ${currentDiningOption}`);
      }

      // 2. Create Spreedly Payment Method
      // const spreedlyPayload = {
      //   environment_key: attributes.SPREEDLY_ENV_KEY,
      //   nonce: attributes.nonce,
      //   timestamp: attributes.timestamp,
      //   certificate_token: attributes.certificate_token,
      //   signature: attributes.signature,
      //   payment_method: selectedCard,
      // };

      // const spreedlyResponse = await commonApi({
      //   action: 'spreedlyAPI',
      //   data: spreedlyPayload,
      // });

      // const spreedlyResponse = await axios.post(
      //   'https://core.spreedly.com/v1/payment_methods/restricted.json?from=iframe&v=1.166',
      //   spreedlyPayload,
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'spreedly-environment-key': attributes.SPREEDLY_ENV_KEY,
      //     },
      //   },
      // );

      // const spreedlyToken = spreedlyResponse?.data?.transaction?.payment_method?.token;
      // if (!spreedlyToken) {
      //   throw new Error('Spreedly token generation failed');
      // }

      // 3. Build payment payload
      const localTip = LocalStorage.get('Tip');
      const paymentPayload = {
        userId: loginData?.userId,
        email: loginData?.email || guestInfo.email,
        firstName: loginData?.firstName || guestInfo.firstName || 'NA',
        lastName: loginData?.lastName || guestInfo.lastName || 'NA',
        gratuity: Number(localTip ?? 0),
        orderOptionInfo: { optionName: KEYS.DINE_IN },
        isOneTimeTransaction: true,
        phone: loginData?.phoneNumber || guestInfo.phoneNumber,
        sourceType: KEYS.WEB,
        paymentMode,
        paymentType: selectedGiftCard?.paymentType
          ? PAYMENT_TYPE.GIFT_CARD
          : PAYMENT_TYPE.CARD_NOT_PRESENT,
        cardType: selectedGiftCard?.cardType,
        paymentToken: spreedlyToken,
        savePaymentInstrument: 'false',
        guestCheckout: loginData?.userId ? false : isGuest,
        // ...(paymentType !== PAYMENT_TYPE.GIFT_CARD && {
        //   expirationMonth: selectedCard?.expirationMonth,
        //   expirationYear: selectedCard?.expirationYear,
        // }),
      };

      // 4. Captcha token
      let captchaToken;
      if (publicRuntimeConfig.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY) {
        captchaToken = await window.grecaptcha.execute(
          publicRuntimeConfig.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY,
          { action: 'payment' },
        );
      }

      // 5. Make final payment
      const finalPayment = await commonApi({
        action: 'makePayment',
        data: paymentPayload,
        ...(captchaToken && {
          config: {
            captchaToken,
          },
        }),
      });

      setOrderReceipt(finalPayment);
      setSpreedlyToken(null);
      if (finalPayment?.status) {
        router.push(routes.order(finalPayment?.data?.orderNumber));
      } else {
        Toast.error(finalPayment?.message);
      }
    } catch (error) {
      console.error('[Order Placement Error]:', error);
      setFocus(true);
    } finally {
      setLoader((prev) => ({ ...prev, orderPlace: false }));
      LocalStorage.remove('Tip');
    }
  };

  const getOffers = async () => {
    setLoader((prev) => ({ ...prev, listOffer: true }));
    const LocationId = LocalStorage.get(REST_LOCATION_ID);
    try {
      const payload = {
        languageCode: 'EN',
        latitude: 0,
        localDateTime: new Date(),
        longitude: 0,
        locationId: LocationId,
        userId: loginData?.userId,
      };
      const response = await commonApi({
        action: 'orderOffers',
        data: payload,
      });
      setApplicableOffers(response?.data?.applicableOffers || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoader((prev) => ({ ...prev, removeOffer: false, listOffer: false }));
    }
  };

  const onSubmitOffer = async () => {
    setLoader((prev) => ({ ...prev, useOffer: true }));
    try {
      const payload = {
        distributedOfferId: selectedOffer?.distributedOfferId,
        offerId: selectedOffer?.offerId,
        languageCode: 'EN',
        localDateTime: new Date(),
        latitude: 0,
        longitude: 0,
        userId: loginData?.userId,
        ...(selectedOffer?.variablePoints && {
          pointsToSpend: pointsUsed * (selectedOffer?.pointsCost || 0),
        }),
      };
      const response = await commonApi({
        action: 'applyDiscount',
        data: payload,
      });
      Toast.success(response?.message);
      updateOfferList(selectedOffer?.distributedOfferId);
      response?.data && setAppliedOffer(response);
      setOpenOfferModal((prev) => !prev);
      setTip('0.00');
      setSelectedTipsInPercentage(0);
      getSummary();
    } catch (error) {
      setOpenRewards(false);
      console.error('Error submitting offer:', error);
    } finally {
      setLoader((prev) => ({ ...prev, useOffer: false }));
    }
  };
  const updateOfferList = (distributedOfferId) => {
    const updatedOffers = applicableOffers.filter(
      (offer) => offer.distributedOfferId !== distributedOfferId,
    );
    setApplicableOffers(updatedOffers);
  };

  const removeOffer = async (id) => {
    setLoader((prev) => ({ ...prev, removeOffer: true }));
    try {
      const payload = {
        // offerId: appliedOffer?.data?.orderDiscounts[0]?.discountId,
        offerId: id,
        userId: loginData?.userId,
      };
      const { message } = await commonApi({
        action: 'removeDiscount',
        data: payload,
      });
      Toast.success(message);
      setTip('0.00');
      setSelectedTipsInPercentage(0);
      getOffers();
      setAppliedOffer(null);
      getSummary();
      setSelectedOffer(null);
      setPointsUsed(0);
    } catch (error) {
      console.error('Error removing offer:', error);
      setLoader((prev) => ({ ...prev, removeOffer: false }));
    }
  };
  const getTip = (value) => {
    const tipPercentage = value || 0;
    const tipAmount =
      ((parseFloat(cartData?.[0]?.subTotal) + parseFloat(cartData?.[0]?.salesTax)) *
        tipPercentage) /
      100;

    setTip(tipAmount?.toFixed(2));
    getTotal(tipAmount);
  };

  const getTotal = (tipAmount) => {
    const total = parseFloat(cartData?.[0]?.total) + (tipAmount || 0);
    setTotal(total ? total.toFixed(2) : 0);
    LocalStorage.set('Tip', tipAmount?.toFixed(2));
    LocalStorage.set('Total', total ? total.toFixed(2) : 0);
  };

  // useEffect(() => {
  //   if (router.asPath === routes.checkout) {
  //     getTotal();
  //   }
  // }, [router.asPath]);
  // useEffect(() => {
  //   if (loginData?.userId && router.asPath === routes.checkout) {
  //     getOffers();
  //   }
  //   return () => {};
  // }, [loginData, router.asPath]);

  return {
    loader,
    openPromoModal,
    setOpenPromoModal,
    openOfferModal,
    setOpenOfferModal,
    orderPlace,
    getOffers,
    applicableOffers,
    onSubmitOffer,
    selectedOffer,
    setSelectedOffer,
    appliedOffer,
    removeOffer,
    orderSummary,
    selectedTipsInPercentage,
    setSelectedTipsInPercentage,
    getTip,
    tip,
    setTip,
    total,
    getTotal,
    getSummary,
    selectedReward,
    setSelectedReward,
    openRewards,
    setOpenRewards,
    pointsUsed,
    setPointsUsed,
  };
};

export default useOrderPlace;
