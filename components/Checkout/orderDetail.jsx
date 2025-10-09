import React, { useContext, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import useDiningOption from '../Menu/hook/useDiningOption';
import CarDetailCard from '../common/ScheduleCard';

import { convertTo12Hour, handleValidation } from '@/utils/helper';
import useReorder from '@/hook/order/useReorder';
import AppContext from '@/utils/appContext';
import { LocalStorage } from '@/utils/localStorage';
import { KEYS, SIDEBAR_TABS } from '@/utils/constant';
import SideOverlay from '@/shared/drawer';
import Button from '@/widgets/button';
import { dateDisplay } from '@/utils/util';
import Toast from '@/utils/toast';

const OrderDetail = () => {
  const { orderType, time, formattedAddress } = useDiningOption();
  const { timeModal, setTimeModal, currentTab, setOpenChangeLocation } = useContext(AppContext);
  const locationId = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL)?.restId;
  const isDelivery = currentTab === SIDEBAR_TABS.delivery ? true : false;
  const [errors, setErrors] = useState({ date: '', time: '' });

  const [selectedTime, setSelectedTime] = useState();
  const [restDate, setRestDate] = useState(null);
  const { t } = useTranslation('common');

  // const { ...dtAdd } = useAddress({
  //   currentTab,
  //   setCurrentTab,
  // });

  const { ...dt } = useReorder();

  return (
    <div className='flex flex-col gap-5 w-full pb-5 sm:mb-5  border-b-2 border-gray-200 sm:flex-nowrap flex-wrap'>
      <div className=' font-stone uppercase sm:text-3xl text-xl xl:min-w-48 sm:min-w-40 sm:w-auto w-full'>
        Location and time
      </div>
      <div className='flex flex-col gap-1 w-full relative'>
        <div className='mb-2 flex justify-between primary-border !border-[3px] sm:rounded-3xl rounded-xl sm:p-5 p-3'>
          <div>
            <div className='font-bold'>{orderType} Location</div>
            <div className=' text-foreground text-sm'>{orderType && formattedAddress()}</div>
          </div>

          <button
            onClick={() => {
              // setTimeModal(true);
              // dt.getAvailableTimes(locationId, isDelivery);
              setOpenChangeLocation(true);
            }}
            className='text-primary hover:underline flex  text-sm'
          >
            Edit
          </button>
        </div>
        <div className='mb-2 flex justify-between primary-border !border-[3px] sm:rounded-3xl rounded-xl sm:p-5 p-3'>
          <div>
            <div className='font-bold'>{orderType} Date and Time</div>
            <div className='text-sm text-foreground'>
              {dateDisplay(time) + ' ' + convertTo12Hour(time)}
            </div>
          </div>
          <button
            onClick={() => {
              setTimeModal(true);
              dt.getAvailableTimes(locationId, isDelivery);
            }}
            className='text-primary hover:underline flex  text-sm'
          >
            Edit
          </button>
        </div>
      </div>
      {/* <RestaurantScheduler open={timeModal} setOpen={setTimeModal} dt={dt} dtAdd={dtAdd} /> */}
      {
        <SideOverlay
          visible={timeModal}
          onVisible={setTimeModal}
          widthClass='w-full sm:w-[480px]'
          title={'schedule Delivery'}
          arrow={false}
          onclose={() => setTimeModal(false)}
          modalFooter={
            <Button
              className='w-full'
              title='Confirm'
              onClick={() => {
                if (handleValidation(restDate, selectedTime).error) {
                  dt?.handleClickTimeCard(selectedTime, restDate);
                  setTimeModal(false);
                } else {
                  const errorObj = handleValidation();
                  if (errorObj.data) {
                    Toast.error(errorObj.data);
                  } else {
                    Toast.error(errorObj.time);
                  }
                }
              }}
            />
          }
        >
          <div className='h-[100dvh] sm:h-[calc(100dvh-218px)] overflow-y-scroll overflow-x-hidden'>
            <CarDetailCard
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              setRestDate={setRestDate}
              setErrors={setErrors}
              restDate={restDate}
              errors={errors}
              dt={dt}
              t={t}
              mandatoryFields={{ date: true, time: true }}
            />
          </div>
        </SideOverlay>
      }
    </div>
  );
};

export default OrderDetail;
