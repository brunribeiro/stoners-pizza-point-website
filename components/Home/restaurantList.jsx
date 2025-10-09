import React, { useContext, useEffect, useState } from 'react';

import ModalContent from '../common/ModalContent';
import CustomModal from '../common/CustomModal';

import useRestaurantList from './hook/useRestaurantList';
import StoreDetail from './StoreDetail';
import RestaurantCard from './RestaurantCard';

import Button from '@/widgets/button';
import DrawerWrapper from '@/shared/drawer';
import PlusIcon from '@/icons/PlusIcon';
import MinusIcon from '@/icons/MinusIcon';
import AppContext from '@/utils/appContext';
import { LocalStorage } from '@/utils/localStorage';
import Toast from '@/utils/toast';
import { handleValidation } from '@/utils/helper';
import { KEYS, SIDEBAR_TABS, DINING_OPTION } from '@/utils/constant';

const RestaurantList = ({ dt, currentTab, isCheckout, isChange, t, list }) => {
  const {
    openFutureTime,
    setOpenFutureTime,
    handleGetRestaurantTime,
    selectedTime,
    restDate,
    getCard,
    openStoreDetail,
    setOpenStoreDetail,
    isButtonLoad,
    selectedStore,
    setSelectedStore,
  } = useRestaurantList({ dt, currentTab, isCheckout, t });
  const notFromSearch = list?.[0]?.restlist?.length > 0;
  const [showList, setShowList] = useState({});
  const [orderAhead, setOrderAhead] = useState(false);
  const {
    setCurrentRestList,
    setUserCoordinates,
    setIsButtonLoad,
    setOpenChangeLocation,
    itemCount,
    openSwapMenu,
    setOpenSwapMenu,
    setItemCount,
  } = useContext(AppContext);

  const handleButtonCLick = () => {
    setOpenSwapMenu(false);
    if (orderAhead) {
      handleGetRestaurantTime({
        restId: selectedStore.restId,
        directRestId: selectedStore.id,
        currentTab,
        rest: selectedStore,
        getRestTime: true,
        orderAhead: true,
      });
      setOpenFutureTime(true);
    } else {
      handleGetRestaurantTime({
        restId: selectedStore.restId,
        directRestId: selectedStore.id,
        currentTab,
        rest: selectedStore,
        fromButton: true,
      });
    }
    setOrderAhead(false);
  };

  const restroDetail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
  const localRestId = +restroDetail.id;
  const firstRest = list?.length > 0 ? list[0]?.restlist?.[0] : null;

  useEffect(() => {
    if (dt.cardType) getCard();
  }, [dt.cardType]);

  if (isCheckout) return getCard();

  return (
    <div className='w-full'>
      {notFromSearch ? (
        list.map((item) => {
          const isOpen = showList[item.state];

          return (
            <div key={item?.state}>
              {notFromSearch && (
                <button
                  className={`w-full text-left py-4 hover:bg-foreground/10 duration-150 font-extrabold px-4 sm:px-8 flex gap-2 items-center ${!isOpen && 'border-b'} bg-white`}
                  onClick={() => {
                    setShowList((prev) => ({
                      ...prev,
                      [item.state]: !prev[item.state],
                    }));
                    setCurrentRestList(item?.restlist);
                  }}
                >
                  <span className='mb-[3px]'>{isOpen ? <MinusIcon /> : <PlusIcon />}</span>
                  {item.state}
                </button>
              )}

              <div
                className={`w-full flex flex-col transition-all duration-200 ease-in-out overflow-scroll 
    sm:px-6 px-4 
    ${isChange ? '!px-4 ' : ''} 
    ${isOpen || !notFromSearch ? 'opacity-100 scale-100' : 'opacity-0 scale-95 max-h-0'}`}
                style={{
                  transition:
                    'opacity 0.2s ease-in-out, transform 0.2s ease-in-out, max-height 0.2s ease-in-out',
                }}
              >
                <RestaurantCard
                  list={item?.restlist}
                  currentTab={currentTab}
                  isButtonLoad={isButtonLoad}
                  handleGetRestaurantTime={handleGetRestaurantTime}
                  setOpenFutureTime={setOpenFutureTime}
                  setOpenStoreDetail={setOpenStoreDetail}
                  setSelectedStore={setSelectedStore}
                  setUserCoordinates={setUserCoordinates}
                  itemCount={itemCount}
                  openSwapMenu={openSwapMenu}
                  setOpenSwapMenu={setOpenSwapMenu}
                  setOrderAhead={setOrderAhead}
                  localRestId={localRestId}
                  isChange={isChange}
                  firstRest={firstRest}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div
          className={`px-4 xl:px-8 flex flex-col transition-all duration-200 ease-in-out overflow-scroll ${
            isChange ? '!px-5 ' : ''
          }`}
          style={{
            transition:
              'opacity 0.2s ease-in-out, transform 0.2s ease-in-out, max-height 0.2s ease-in-out',
          }}
        >
          <RestaurantCard
            list={list}
            currentTab={currentTab}
            isButtonLoad={isButtonLoad}
            handleGetRestaurantTime={handleGetRestaurantTime}
            setOpenFutureTime={setOpenFutureTime}
            setOpenStoreDetail={setOpenStoreDetail}
            setSelectedStore={setSelectedStore}
            setUserCoordinates={setUserCoordinates}
            itemCount={itemCount}
            openSwapMenu={openSwapMenu}
            setOpenSwapMenu={setOpenSwapMenu}
            setOrderAhead={setOrderAhead}
            localRestId={localRestId}
            isChange={isChange}
            firstRest={firstRest}
          />
        </div>
      )}

      <CustomModal open={openSwapMenu} titleClass='justify-center' setOpen={setOpenSwapMenu}>
        <ModalContent
          title='Item to be replaced'
          btn1Text='PROCEED ANYWAY'
          btn2Text='Change Location'
          desc='You are attempting to order from a diffrent location. Would you like to discard your existing cart items and add new ones'
          handleConfirm={() => {
            handleButtonCLick();
            setItemCount(0);
          }}
          handleClose={() => setOpenSwapMenu(false)}
          className='border-none p-0'
        />
      </CustomModal>

      {/* Store Detail Drawer */}
      <DrawerWrapper
        visible={openStoreDetail}
        onVisible={setOpenStoreDetail}
        widthClass='w-full sm:w-[480px]'
        title='Location Details'
        arrow={false}
        modalFooter={
          <div className='flex justify-between sm:flex-nowrap gap-4 items-center w-full'>
            <Button
              className='text-base sm:text-xl !px-2 !py-2 bg-white !text-black hover:bg-white hover:text-black w-full'
              title='Order Ahead'
              primary={false}
              onClick={() => {
                setOpenFutureTime(true);
                setOpenStoreDetail(false);
              }}
            />
            <Button
              className='text-base sm:text-xl !px-2 w-full'
              title='Order Now'
              loading={dt.isPageLoad}
              onClick={() => {
                setOpenStoreDetail(false);
                handleGetRestaurantTime({
                  restId: selectedStore.restId,
                  directRestId: selectedStore.id,
                  currentTab,
                  rest: selectedStore,
                  fromButton: true,
                });
              }}
            />
          </div>
        }
        onclose={() => setOpenStoreDetail(false)}
      >
        <StoreDetail rest={selectedStore} />
      </DrawerWrapper>

      {/* Future Time Drawer */}
      <DrawerWrapper
        visible={openFutureTime}
        onVisible={setOpenFutureTime}
        widthClass='w-full sm:w-[480px]'
        title={`Schedule ${currentTab === SIDEBAR_TABS.pickup ? DINING_OPTION.pickup : DINING_OPTION.Delivery}`}
        arrow={false}
        onclose={() => setOpenFutureTime(false)}
        modalFooter={
          <Button
            className='w-full'
            title='Confirm'
            onClick={() => {
              if (handleValidation(restDate, selectedTime).error) {
                dt?.handleClickTimeCard(selectedTime, restDate, currentTab, selectedStore);
                // handleGetRestaurantTime({
                //   restId: selectedStore.restId,
                //   directRestId: selectedStore.id,
                //   currentTab,
                //   rest: selectedStore,
                //   fromButton: true,
                //   orderAhead: true,
                // });
                setOpenFutureTime(false);
                setIsButtonLoad({});
                setOpenChangeLocation(false);
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
          {getCard()}
        </div>
      </DrawerWrapper>
    </div>
  );
};

export default RestaurantList;
