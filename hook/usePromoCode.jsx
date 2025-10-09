import { useState } from 'react';

import commonApi from '@/services/api/common';
import { API_SUCCESS_RESPONSE, DEFAULT_LNG } from '@/utils/constant';
import { localDateTime } from '@/utils/helper';

const usePromoCode = () => {
  const [loader, setLoader] = useState(false);
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
    setLoader(true);
    await commonApi({
      action: 'submitPromoCode',
      data: payload,
    })
      .then(async (response = {}) => {
        if (response.code === API_SUCCESS_RESPONSE) {
          //   setOfferList(response.data?.offerList?.offers);
        }

        return setLoader(false);
      })
      .finally(() => {
        setLoader(false);
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
