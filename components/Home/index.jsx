import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import useRestaurant from './hook/useRestaurant';

import LayoutWrapper from '@/shared/layoutWrapper';
import Location from '@/shared/location';
import SideBar from '@/shared/sideBar';
import AppContext from '@/utils/appContext';
import useAddress from '@/hook/useAddress';
import LoginRightContent from '@/icons/LoginRightContent';
import Button from '@/widgets/button';
import routes from '@/utils/routes';
import { LocalStorage } from '@/utils/localStorage';
import { KEYS } from '@/utils/constant';

const Home = () => {
  const { currentTab, setCurrentTab } = useContext(AppContext);
  const [mapView, setMapView] = useState(false);
  const router = useRouter();
  const { setValue, register, errors, ...dtAdd } = useAddress({
    currentTab,
    setCurrentTab,
    path: router.pathname,
  });

  const { ...dt } = useRestaurant({ tab: currentTab, dtAdd: { ...dtAdd } });
  const sidebarRef = useRef(null);

  useEffect(() => {
    const mode = LocalStorage.getJSON(KEYS.SELECTED_TAB);

    if (mode === 0) {
      window.history.replaceState(null, '', routes.diningOption('pickup'));
    }

    if (mode === 1) {
      window.history.replaceState(null, '', routes.diningOption('delivery'));
    }
  }, [currentTab]);

  // Hide body scrollbar on this page while keeping scroll enabled
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.add('scrollbar-hide');
      document.documentElement.classList.add('scrollbar-hide');
      return () => {
        document.body.classList.remove('scrollbar-hide');
        document.documentElement.classList.remove('scrollbar-hide');
      };
    }
  }, []);
  return (
    <LayoutWrapper>
      <div className='-mt-[4px] md:py-[40px] lg:px-[24px]'>
        <div className='flex items-center lg:items-start justify-center lg:flex-row flex-col relative container lg:pr-0'>
          <div className='relative z-[5] w-full lg:w-[50%] max-w-[672px]'>
            <div
              className='bg-white pb-6 min-h-[calc(100dvh-176px)] rounded-[20px] sidebar-container'
              ref={sidebarRef}
            >
              <SideBar
                dt={dt}
                dtAdd={dtAdd}
                setValue={setValue}
                register={register}
                errors={errors}
                setCurrentTab={setCurrentTab}
                currentTab={currentTab}
                fromHome={true}
                sidebarRef={sidebarRef}
                setMyLocationTriggered={dt.setMyLocationTriggered}
              />
            </div>
          </div>

          <div className='w-[50%] hidden lg:block !h-[calc(100dvh-176px)] overflow-hidden sticky !top-[125px] -ml-3 rounded-r-[20px] max-w-[672px]'>
            {mapView ? (
              <Location dt={dt} showMap={true} currentTab={currentTab} />
            ) : (
              <div className='flex items-center w-full h-full'>
                <LoginRightContent className='w-full h-full rounded-r-[20px]' />
                <div className='absolute top-[75%] left-1/2 -translate-x-[50%]'>
                  <Button
                    primary={false}
                    title='Click To View Map'
                    className='scale-[1.07] !px-6 md:text-base'
                    onClick={() => setMapView(true)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default Home;
