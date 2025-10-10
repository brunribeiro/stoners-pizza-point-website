import React, { useContext, useEffect, useRef } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import useTranslation from 'next-translate/useTranslation';

import AutocompleteSection from '@/shared/sidebar/AutocompleteSection';
import PickupPanel from '@/shared/sidebar/PickupPanel';
import DeliveryPanel from '@/shared/sidebar/DeliveryPanel';
import AppContext from '@/utils/appContext';
import { useRestaurantCtx } from '@/contexts/restaurantContext';
import { KEYS, SIDEBAR_TABS } from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';
import { getOrderTypeContainerClass } from '@/utils/helper';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';

const SideBar = ({
  dt,
  dtAdd,
  currentTab,
  setValue,
  register,
  errors,
  setCurrentTab,
  isCheckout = false,
  isChange = false,
  fromHome = false,
  fromHeader = false,
  sidebarRef,
  setMyLocationTriggered,
}) => {
  const autoCompleteRef = useRef();
  const { isLoadedMap, loginData, selectedAddress, setSelectedAddress } = useContext(AppContext);
  const { deliveryCoord, loadSearchByDelivery } = useRestaurantCtx();

  const { t } = useTranslation('common');

  const handleSwitchTabReset = () => {
    dt.setSelectedRestaurantId(false);
    if (currentTab === SIDEBAR_TABS.delivery) {
      dtAdd.setIsAddNewAddress(false);
    }
  };

  const handleClearFromEmptyList = () => {
    autoCompleteRef.current?.clearInput();
  };

  const localDeliveryAddress = LocalStorage.getJSON(KEYS.TEMP_DELIVERY_ADDRESS);
  const { isLoaded } = useGoogleMaps(); // Use shared Google Maps context
  // Load saved tab on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = LocalStorage.getJSON(KEYS.SELECTED_TAB);
      if (savedTab) {
        setCurrentTab(parseInt(savedTab, 10));
      } else {
        LocalStorage.setJSON(KEYS.SELECTED_TAB, 0)
        setCurrentTab(0);
      }
    }
  }, []);

  useEffect(() => {
    handleSwitchTabReset();
  }, [currentTab]);

  const renderTab = (index, label) => (
    <Tab
      disabled={dt.loader.list}
      className={`flex justify-center text-lg items-center w-[52%] h-full ${
        index === 0 ? '-ms-2' : 'me-0'
      } ${
        currentTab === index ? 'text-white text-lg z-20' : 'text-gray-600 hover:text-primary z-20'
      }`}
    >
      {t(label)}
    </Tab>
  );
  const renderAutocomplete = () => (
    <AutocompleteSection
      t={t}
      currentTab={currentTab}
      isLoaded={isLoaded}
      isChange={isChange}
      dt={dt}
      dtAdd={dtAdd}
      errors={errors}
      selectedAddress={selectedAddress}
      setSelectedAddress={setSelectedAddress}
      setMyLocationTriggered={setMyLocationTriggered}
      localDeliveryAddress={localDeliveryAddress}
      autoCompleteRef={autoCompleteRef}
    />
  );

  return (
    <div className='w-full lg:h-full h-auto scrollbar-hide'>
      <Tabs
        selectedIndex={currentTab}
        onSelect={(value) => {
          if (value === currentTab) return false;

          if (typeof window !== 'undefined') {
            LocalStorage.set(KEYS.SELECTED_TAB, value);
          }

          setCurrentTab(value);

          if (value === SIDEBAR_TABS.delivery) {
            loadSearchByDelivery(deliveryCoord);
          }
        }}
        className='flex flex-col'
      >
        <div className='w-full bg-white rounded-t-[20px]'>
          <TabList>
            <div className='flex w-full flex-col'>
              <div className='bg-primary-light px-3 md:px-6 sm:px-10 p-5 sm:py-8 rounded-t-[20px]'>
                {!isChange ? (
                  <h2 className='text-center font-stone text-[24px] leading-[1.2] sm:text-4xl mb-2 sm:mb-5 min-h-[29px] sm:min-h-[43px]'>
                    FIND A JOINT NEAR YOU
                  </h2>
                ) : (
                  <div className='min-h-[29px] sm:min-h-[43px]' />
                )}
                <div className='w-full flex flex-col items-center justify-center'>
                  {!isChange ? (
                    <p className='text-center font-bold mb-[8px] text-sm'>ORDER TYPE</p>
                  ) : (
                    ''
                  )}
                  <div className={getOrderTypeContainerClass(fromHeader)}>
                    <div
                      className='absolute -top-[5px] rounded-full py-[25px] bg-primary border-[3px] border-black z-10 transition-all duration-300 ease-out'
                      style={{
                        left: currentTab === 0 ? '-3px' : '48%',
                        width: '54%',
                      }}
                    />
                    {renderTab(0, 'pickup')}
                    {renderTab(1, 'delivery')}
                  </div>
                </div>
              </div>
              <div className={` px-3 sm:px-5 md:px-10 p-5 sm:pt-8 ${isChange ? '!px-6' : ''}`}>
                {currentTab === 1 && <h2 className='font-stone text-xl '>FIND A LOCATION</h2>}
                {currentTab === SIDEBAR_TABS.pickup ? renderAutocomplete() : null}
              </div>
            </div>
          </TabList>
        </div>
        <TabPanel>
          <PickupPanel
            dt={dt}
            currentTab={currentTab}
            dtAdd={dtAdd}
            isLoadedMap={isLoadedMap}
            setValue={setValue}
            register={register}
            isChange={isChange}
            errors={errors}
            onClear={handleClearFromEmptyList}
            t={t}
          />
        </TabPanel>
        <TabPanel>
          <DeliveryPanel
            dt={dt}
            currentTab={currentTab}
            dtAdd={dtAdd}
            isCheckout={isCheckout}
            isChange={isChange}
            t={t}
            localDeliveryAddress={localDeliveryAddress}
            loginData={loginData}
            fromHome={fromHome}
            sidebarRef={sidebarRef}
            selectedAddress={selectedAddress}
            isLoadedMap={isLoadedMap}
            setValue={setValue}
            register={register}
            errors={errors}
            onClear={handleClearFromEmptyList}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default SideBar;
