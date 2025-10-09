import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback, useContext } from 'react';
import { useForm } from 'react-hook-form';

import commonApi from '@/api/common';
import { cardSchema } from '@/schema/card';
import { editCardSchema } from '@/schema/editCreditCard';
import AppContext from '@/utils/appContext';
import {
  API_SUCCESS_RESPONSE,
  KEYS,
  PAYMENT_TYPE,
  REST_LOCATION_ID,
  SUCCESS,
} from '@/utils/constant';
import { formatDate } from '@/utils/helper';
import routes from '@/utils/routes';
import Toast from '@/utils/toast';
import { LocalStorage } from '@/utils/localStorage';

const defaultValues = {
  firstName: '',
  lastName: '',
  cardNumber: '',
  expiryDate: null, // use null instead of undefined for date field (for Yup compatibility)
  cvv: '',
  zipCode: '',
  streetAddress: '', // added based on form and validation
  streetAddress2: '', // optional, but included in form
  city: '', // added based on form and validation
  state: '', // added based on form and validation
  isDefault: false, // should be boolean, not string
};

const useMyCard = (setOpenList) => {
  const router = useRouter();
  const isCheckoutPage = router.pathname.includes(routes.checkout);

  const [loader, setLoader] = useState({
    list: false,
    openCardModal: false,
    editCard: false,
    deleteCard: false,
    saveCard: false,
    purchase: false,
  });
  const [paymentList, setPaymentList] = useState([]);
  const [cardListOption, setCardListOption] = useState();
  const [giftCardListOption, setGiftCardListOption] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [editCard, setEditCard] = useState(false);
  const [creditCardList, setCreditCardList] = useState(null);
  const [giftCardList, setGiftCardList] = useState(null);
  const [giftAmount, setGiftAmount] = useState(null);
  const [spreedlyToken, setSpreedlyToken] = useState(null);
  const [open, setOpen] = useState(false);
  const {
    selectedCard,
    setSelectedCard,
    selectedGiftCard,
    setSelectedGiftCard,
    loginData,
    // modal,
    setModal,
  } = useContext(AppContext);

  const [error, setError] = useState({
    giftAmount: false,
    selectCard: false,
    selectGiftCard: false,
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit-card');

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: cardData ? yupResolver(editCardSchema) : yupResolver(cardSchema),
  });

  const fetchCardData = async (id) => {
    setEditCard(true);
    setLoader((prev) => ({ ...prev, editCard: true }));
    try {
      const { data } = await commonApi({
        action: 'getCard',
        parameters: [id],
      });
      setCardData(data[0]);

      if (data[0]) {
        setValue('nickName', data[0]?.nickname);
        setValue('cardNumber', `xxxx-xxxx-xxxx-${data[0]?.lastFour}`);
        setValue('isDefault', data[0].isDefault);
      }
    } catch (error) {
      console.error('Error fetching card data: ', error);
    } finally {
      setLoader((prev) => ({ ...prev, editCard: false }));
    }
  };

  const onEdit = (id, clear) => {
    if (clear) {
      setOpen(false);
      setEditCard(false);
      setCardData(null);
      reset();
    } else {
      fetchCardData(id);
      setOpen(true);
    }
  };

  const getCardList = useCallback(async () => {
    setLoader((prev) => ({ ...prev, list: true }));
    try {
      const response = await commonApi({
        action: 'getPaymentList',
      });

      if (response.code === API_SUCCESS_RESPONSE) {
        setPaymentList(response.data?.paymentInstruments || []);

        setCreditCardList(
          response.data.paymentInstruments.filter(
            (payment) => payment.paymentType === PAYMENT_TYPE.CARD,
          ),
        );
        setGiftCardList(
          response.data.paymentInstruments.filter(
            (payment) => payment.paymentType === PAYMENT_TYPE.GIFT__CARD,
          ),
        );
        const transformedList =
          response.data?.paymentInstruments.map((payment) => ({
            label: `xxx xxxx xxxx ${payment?.lastFour}`,
            value: payment?.paymentInstrumentId,
            ...payment,
          })) || [];

        setCardListOption(() => {
          return transformedList.filter((payment) => payment.paymentType === PAYMENT_TYPE.CARD);
        });
        setGiftCardListOption(() => {
          return transformedList.filter(
            (payment) => payment.paymentType === PAYMENT_TYPE.GIFT__CARD,
          );
        });
        const defaultCreditCard = creditCardList.filter((payment) => payment.isDefault);
        isCheckoutPage && setSelectedCard(defaultCreditCard);
      }
    } catch (error) {
      console.error('Error fetching payment list:', error);
    } finally {
      setLoader((prev) => ({ ...prev, list: false }));
    }
  }, []);

  const onSubmitCard = useCallback(
    async (data) => {
      // setLoader((prev) => ({ ...prev, saveCard: true }));
      let payload;

      if (cardData) {
        // If editing card
        payload = {
          isDefault: data.isDefault,
          nickname: data.nickName,
        };
      } else {
        // If adding new card
        const firstName = data.firstName.split(' ')[0];
        const lastName = data.firstName.split(' ')[1] || '';
        const restLocationIC = LocalStorage.get(REST_LOCATION_ID);

        payload = {
          payment_method: {
            credit_card: {
              address1: data?.streetAddress,
              city: data?.city,
              state: data?.state,
              // country: data.cardNumber,
              number: data?.cardNumber,
              verification_value: data?.cvv,
              first_name: firstName,
              last_name: lastName,
              month: formatDate(data?.expiryDate, 'MM'),
              year: formatDate(data?.expiryDate, 'yyyy'),
              zip: data?.zipCode,
            },
          },
          locationId: restLocationIC,
        };
      }
      setSelectedCard(payload.payment_method);
      setOpen(false);
      setOpenList(false);
      // try {
      //   await commonApi({
      //     action: cardData ? 'editCard' : 'addCard',
      //     ...(cardData && { parameters: [cardData.paymentInstrumentId] }),
      //     data: payload,
      //   });
      //   if (modal.addCard) {
      //     setModal((prev) => ({ ...prev, addCard: false }));
      //   } else {
      //     // !isCheckoutPage && router.back();
      //     setOpen(false);
      //   }
      //   setLoader((prev) => ({
      //     ...prev,
      //     openCardModal: false,
      //     saveCard: false,
      //   }));
      //   getCardList();
      // } catch (error) {
      //   console.error('Error during card action:', error);
      // } finally {
      //   reset(); // Reset form fields
      //   setEditCard(false);
      //   setSelectedDate(null); // Reset date picker
      //   setCardData(null);
      //   setLoader((prev) => ({
      //     ...prev,
      //     loader: false,
      //     saveCard: false,
      //   }));
      //   setModal((prev) => ({ ...prev, addCard: false }));
      // }
    },
    [cardData, getCardList, reset],
  );

  const handleEdit = (id) => {
    router.push(routes.editCard(id));
  };
  const handleDelete = async (id) => {
    setLoader((prev) => ({ ...prev, deleteCard: true }));
    try {
      const { code, message } = await commonApi({
        action: 'deleteCard',
        parameters: [id],
      });
      if (code === SUCCESS) Toast.success(message || 'Card Deleted');
      else Toast.warn(message || 'something went wrong');
      router.back();
    } catch (error) {
      console.error('Delete card', error);
      setLoader((prev) => ({ ...prev, deleteCard: false }));
    } finally {
      setLoader((prev) => ({ ...prev, deleteCard: true }));
    }
  };

  useEffect(() => {
    if (loginData.token) {
      getCardList();
    }
    return () => {};
  }, [loginData?.token]);

  const handlePurchase = () => {
    setSelectedCard(null);
    router.push(routes.purchaseGiftCard);
  };
  const handleExistingCard = () => {
    setSelectedCard(null);
    router.push(routes.addExistingCard);
  };
  const handlePayGift = async (id, setOpen) => {
    if (selectedCard && giftAmount) {
      setLoader((prev) => ({ ...prev, purchase: true }));
      const restLocationIC = LocalStorage.get(REST_LOCATION_ID);
      try {
        const payload = {
          ...(id && { cardIdentifier: id }),
          amount: giftAmount,
          clientId: loginData?.clientId,
          firstName: loginData?.firstName,
          lastName: loginData?.lastName,
          email: loginData?.email,
          locationId: restLocationIC,
          // paymentMode: null,
          paymentToken: selectedCard?.paymentToken,
          paymentType: PAYMENT_TYPE.CARD_NOT_PRESENT,
          phone: loginData?.phoneNumber,
          sourceType: KEYS.WEB,
          userId: loginData?.userId,
        };

        const res = await commonApi({
          action: id ? 'addValue' : 'purchaseGift',
          data: payload,
        });
        if (id) {
          setOpen(false);
        } else {
          Toast.success(res?.message || KEYS.CUSTOM_MESSAGE);
          if (isCheckoutPage) {
            setModal((prev) => ({ ...prev, addGift: false }));
          } else {
            router.back();
          }
        }
        getCardList();
      } catch (error) {
        Toast.error(error);
      } finally {
        setLoader((prev) => ({ ...prev, purchase: false }));
        setModal((prev) => ({ ...prev, addGift: false }));
      }
    } else {
      setError((prev) => ({ ...prev, selectedCard: true, giftAmount: true }));
    }
  };

  return {
    loader,
    setLoader,
    openCardModal: loader.openCardModal,
    setOpenCardModal: (open) => setLoader((prev) => ({ ...prev, openCardModal: open })),
    paymentList,
    creditCardList,
    giftCardList,
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    errors,
    onSubmitCard,
    selectedDate,
    setSelectedDate,
    handleEdit,
    handleDelete,
    cardData,
    setCardData,
    cardListOption,
    giftCardListOption,
    selectedCard,
    setSelectedCard,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    router,
    handlePurchase,
    handleExistingCard,
    handlePayGift,
    giftAmount,
    setGiftAmount,
    error,
    setError,
    selectedGiftCard,
    setSelectedGiftCard,
    fetchCardData,
    open,
    setOpen,
    onEdit,
    editCard,
    watch,
    spreedlyToken,
    setSpreedlyToken,
  };
};

export default useMyCard;
