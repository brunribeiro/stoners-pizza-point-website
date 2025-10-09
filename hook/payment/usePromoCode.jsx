import { useState } from 'react';

import commonApi from '@/api/common';
import { API_SUCCESS_RESPONSE, DEFAULT_LNG } from '@/utils/constant';
import { localDateTime } from '@/utils/helper';

const usePromoCode = ({ getOffers }) => {
  const [loader, setLoader] = useState({ submitPromo: false });
  const [openPromoModal, setOpenPromoModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const submitPromoCode = async () => {
    const payload = {
      events: {
        'check-in': [promoCode],
      },
      languagecode: DEFAULT_LNG,
      latitude: 0,
      localDateTime: localDateTime(),
      longitude: 0,
    };
    setLoader((prev) => ({ ...prev, submitPromo: true }));
    await commonApi({
      action: 'submitPromoCode',
      data: payload,
    })
      .then(async (response = {}) => {
        if (response.code === API_SUCCESS_RESPONSE) {
          getOffers();
        }

        return setLoader(false);
      })
      .finally(() => {
        setLoader((prev) => ({ ...prev, submitPromo: false }));
        setOpenPromoModal(false);
      });
  };
  return {
    loader,
    openPromoModal,
    setOpenPromoModal,
    submitPromoCode,
    setPromoCode,
    promoCode,
  };
};

export default usePromoCode;
