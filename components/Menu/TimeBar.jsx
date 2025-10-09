import React, { useContext, useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import moment from 'moment-timezone';

import { DEFAULT_DATE_FORMAT, DINING_OPTION, KEYS, REST_LOCATION_ID } from '@/utils/constant';
import RestaurantScheduler from '@/shared/RestaurantScheduler';
import AppContext from '@/utils/appContext';
import useReorder from '@/hook/order/useReorder';
import useAddress from '@/hook/useAddress';
import { LocalStorage } from '@/utils/localStorage';

const TimeBar = ({ time, orderType, getAddress, changeLocation }) => {
  const { timeModal, setTimeModal, currentTab, setCurrentTab } = useContext(AppContext);
  const { name } = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
  const { t } = useTranslation('common');
  const { ...dt } = useReorder();
  const { ...dtAdd } = useAddress({
    currentTab,
    setCurrentTab,
  });
  const [isDelivery, setIsDelivery] = useState(false);
  const locationId = LocalStorage.get(REST_LOCATION_ID);

  useEffect(() => {
    if (currentTab === 0) setIsDelivery(false);
  }, [currentTab]);

  const parsedTime = moment(time);

  const getDisplayDate = () => {
    if (parsedTime.isSame(moment(), 'day')) {
      return t('today');
    } else if (parsedTime.isSame(moment().add(1, 'days'), 'day')) {
      return t('tomorrow');
    } else {
      return parsedTime.format(DEFAULT_DATE_FORMAT);
    }
  };

  const getDisplayTimeWithTimeZone = () => {
    return parsedTime.tz(moment.tz.guess()).format('h:mm A z');
  };
  const handleSchedular = () => {
    setTimeModal(true);
    dt.getAvailableTimes(locationId, isDelivery);
  };
  return (
    <>
      <div className='text-center w-full lg:text-base text-sm p-3 sticky top-[70px] bg-[#F3F4F6] z-10 underline-offset-4'>
        <button onClick={handleSchedular} className='underline   font-extrabold mr-1'>
          {orderType} {getDisplayTimeWithTimeZone()} ( {getDisplayDate()} )
        </button>
        <span className=' '>{orderType === DINING_OPTION.Delivery ? t('to') : t('from')}</span>
        <button
          onClick={() => changeLocation()}
          className='underline   font-extrabold ml-1 underline-offset-4'
        >
          {orderType === 'Pickup' ? name : getAddress()}
        </button>
      </div>
      <RestaurantScheduler open={timeModal} setOpen={setTimeModal} dt={dt} dtAdd={dtAdd} />
    </>
  );
};

export default TimeBar;
