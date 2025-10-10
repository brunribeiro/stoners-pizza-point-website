import dayjs from 'dayjs';
import { useState } from 'react';

import commonApi from '@/services/api/common';
import { API_SUCCESS_RESPONSE, DEFAULT_LNG } from '@/utils/constant';

const usePromoCode = () => {
  const [loader, setLoader] = useState(false);
  const [promocode, setPromocode] = useState('');
  const submitPromocode = async () => {
    const payload = {
      events: {
        'check-in': [promocode],
      },
      languagecode: DEFAULT_LNG,
      latitude: 0,
      localDateTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      longitude: 0,
    };
    setLoader({ list: true });
    await commonApi({
      action: 'submitPromocode',
      data: payload,
    })
      .then(async (response = {}) => {
        if (response.code === API_SUCCESS_RESPONSE) {
          //   setOfferList(response.data?.offerList?.offers);
        }

        return setLoader({ list: false });
      })
      .finally(() => setLoader({ list: false }));
  };
  return {
    loader,
    submitPromocode,
    setPromocode,
    promocode,
  };
};

export default usePromoCode;
