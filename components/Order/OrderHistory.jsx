import React, { useContext, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import OrderHistoryCard from '../Settings/OrderHistoryCard';
import StoreDetail from '../Home/StoreDetail';
import Pagination from '../common/Pagination';
import CarDetailCard from '../common/ScheduleCard';
import OrderHistorySkeleton from '../common/OrderHistorySkeleton';
import NoData from '../common/NoData';

import OrderDetailHistory from './OrderDetailHistory';

import useOrderList from '@/hook/order/useOrderList';
import useReorder from '@/hook/order/useReorder';
import useAddress from '@/hook/useAddress';
import AppContext from '@/utils/appContext';
import DrawerWrapper from '@/shared/drawer';
import Button from '@/widgets/button';
import { handleValidation } from '@/utils/helper';
import Toast from '@/utils/toast';

const OrderList = ({ list, setOpenOrderDetail, setOrderId, dtReorder }) => {
  return (
    <div className='flex flex-col gap-4 min-h-[77.5dvh]'>
      {list?.length ? (
        <>
          <div
            className='text-2xl font-stone uppercase sm:text-[48px] mb-5'
            aria-label='Order History'
            role='region'
          >
            Past orders ({list?.length})
          </div>
          {/* <PendingOrderCard order={list[0]} /> */}
          {/* <div
            className='text-3xl font-stone uppercase mt-5'
            aria-label='Completed Orders'
            role='region'
          >
            Completed
          </div> */}
          <div
            className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            role='region'
            aria-label='Order history'
          >
            {list?.map((order) => (
              <OrderHistoryCard
                key={order.id}
                order={order}
                items={order.items}
                price={order.total}
                handleClick={() => {
                  setOrderId(order);
                  setOpenOrderDetail(true);
                }}
                dt={order}
                dtReorder={dtReorder}
              />
            ))}
          </div>
        </>
      ) : (
        <NoData title={'Past orders'} desc={'YOU HAVE NO PREVIOUS ORDERS'} showButton={true} />
      )}
    </div>
  );
};

const OrderHistory = () => {
  const { t } = useTranslation('common');
  const [orderId, setOrderId] = useState('');
  const [selectedTime, setSelectedTime] = useState();
  const [restDate, setRestDate] = useState(null);
  const [errors, setErrors] = useState({ date: '', time: '' });

  const { timeModal, setTimeModal, currentTab, setCurrentTab } = useContext(AppContext);

  const dtReorder = useReorder();
  const dtAdd = useAddress({ currentTab, setCurrentTab });
  const dt = useReorder(dtAdd.address);

  const {
    list,
    loading,
    handleDetail,
    openOrderDetail,
    setOpenOrderDetail,
    getRestDetail,
    restDetail,
    openStoreDetail,
    setOpenStoreDetail,
    currentPage,
    setCurrentPage,
  } = useOrderList();

  return (
    <>
      {loading ? (
        <OrderHistorySkeleton />
      ) : (
        <>
          <OrderList
            list={list?.data}
            dtReorder={dtReorder}
            handleDetail={handleDetail}
            t={t}
            setOpenOrderDetail={setOpenOrderDetail}
            setOrderId={setOrderId}
          />
          {list?.pagination?.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={list.pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <DrawerWrapper
        visible={openOrderDetail}
        onVisible={setOpenOrderDetail}
        widthClass='w-full sm:w-[480px]'
        arrow={false}
        onclose={() => setOpenOrderDetail(false)}
        modalFooter={
          <div className='w-full flex gap-2 justify-between'>
            <Button
              title='View Store'
              onClick={() => {
                getRestDetail();
                setOpenStoreDetail(true);
              }}
              primary={false}
              className='text-base sm:text-xl bg-white !text-black hover:bg-white hover:text-black w-full !px-4 !py-[10px]'
            />
            <Button
              title='Reorder'
              className='text-base sm:text-xl !px-4 !py-[10px] w-full'
              onClick={() => {
                dtReorder?.handleReorder(orderId);
              }}
              loading={dtReorder?.loader?.id === orderId.id}
              disabled={dtReorder?.loader?.id === orderId.id}
            />
          </div>
        }
      >
        <OrderDetailHistory orderId={orderId} isHistory={true} />
      </DrawerWrapper>

      <DrawerWrapper
        visible={openStoreDetail}
        onVisible={setOpenStoreDetail}
        widthClass='w-full sm:w-[480px]'
        title='Location Details'
        arrow={false}
        footerClassname='!py-4 px-0 sm:px-7 sm:py-7'
        onclose={() => setOpenStoreDetail(false)}
        modalFooter={
          <div className='flex justify-between gap-4 items-center px-2 mt-4 w-full'>
            <Button
              className='text-sm px-1 whitespace-nowrap sm:text-lg bg-white !text-black hover:bg-white hover:text-black w-full'
              title='Order Ahead'
              primary={false}
              onClick={() => {}}
            />
            <Button
              className='text-sm px-1 whitespace-nowrap sm:text-lg w-full'
              title='Order Now'
              loading={dt.isPageLoad}
              onClick={() => {}}
            />
          </div>
        }
      >
        {restDetail && <StoreDetail rest={restDetail} />}
      </DrawerWrapper>

      <DrawerWrapper
        visible={timeModal}
        onVisible={setTimeModal}
        widthClass='w-full sm:w-[480px]'
        title='Schedule Delivery'
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
      </DrawerWrapper>
    </>
  );
};

export default OrderHistory;
