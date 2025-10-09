import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState, useContext } from 'react';
import useTranslation from 'next-translate/useTranslation';

import SkeletonLoader from '../common/SkeletonLoader';

import CategoryList from './categoryList';
import InitialCatCard from './InitialCatCard';
import AdsSlider from './AdsSlider';
import useMenu from './hook/useMenu';

import CarDetailCard from '@/components/common/ScheduleCard';
import routes from '@/utils/routes';
import LayoutWrapper from '@/shared/layoutWrapper';
import { LocalStorage } from '@/utils/localStorage';
import { KEYS } from '@/utils/constant';
import { posthogTrack } from '@/utils/analytics';
import AppContext from '@/utils/appContext';
import SideOverlay from '@/shared/drawer';
import Button from '@/widgets/button';
import { handleValidation } from '@/utils/helper';
import Toast from '@/utils/toast';
import useReorder from '@/hook/order/useReorder';

const CategoriesWithItems = () => {
  const router = useRouter();
  const headerRef = useRef();
  const CategoryListRef = useRef();
  const { t } = useTranslation('common');
  const [searchLoader, setSearchLoader] = useState(false);
  const {
    idHandler,
    categoryId,
    isPageLoad,
    setCategory,
    getCategoryList,
    categoryList,
    errors,
    setErrors,
    selectedTime,
    setSelectedTime,
    restDate,
    setRestDate,
  } = useMenu();
  const { itemCount, timeModal, setTimeModal, restaurant, currentTab } = useContext(AppContext);
  const dt = useReorder();

  useEffect(() => {
    const handleBackButton = () => {
      window.location.href = '/';
    };
    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [router.query]);

  useEffect(() => {
    console.log(
      'LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL): ',
      LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL),
    );
    if (LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL) && !router.query.id) {
      getCategoryList();
    }
  }, [LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL)?.id]);

  const handleScroll = (categoryId) => {
    const { diningOption, rest } = router.query;
    router.replace(
      routes.items(diningOption, rest, categoryId) + `?itemId=${categoryId}`,
      routes.items(diningOption, rest, categoryId) + `?itemId=${categoryId}`,
      { shallow: true },
    );
  };

  const setCategoryHandler = (value) => {
    setCategory(value.name);
    handleScroll(value.id);
  };

  const hasCategories = !isPageLoad && categoryList.length;

  const handleConfirmTime = () => {
    if (handleValidation(restDate, selectedTime).error) {
      dt.handleClickTimeCard(selectedTime, restDate, currentTab, restaurant);
      setTimeModal(false);
    } else {
      const errorObj = handleValidation();
      Toast.error(errorObj.data || errorObj.time);
    }
  };

  return (
    <LayoutWrapper
      meta={{
        title: '3Pepper Burrito, Menu | Order Online',
        description: 'Order online from 3Pepper Burrito.',
      }}
      ref={headerRef}
    >
      {hasCategories ? (
        <div className='sm:grid grid-cols-12 mx-auto px-3 w-[100%] sm:w-[85%]'>
          {/* Sidebar */}
          <div className='hidden xl:block col-span-3 2xl:col-span-2'>
            <CategoryList
              ref={CategoryListRef}
              idHandler={idHandler}
              categoryList={categoryList}
              categoryId={categoryId}
              setSearchLoader={setSearchLoader}
              searchLoader={searchLoader}
              selectedCategoryId={router.query.itemId}
              handleScroll={handleScroll}
              setCategoryHandler={setCategoryHandler}
            />
          </div>

          {/* Main Content */}
          <div
            className='w-full col-span-12 xl:col-span-9 container mx-auto 2xl:col-span-10 overflow-x-visible pb-2 sm:pb-8 flex flex-col scrollbar-hide !mt-4'
            role='region'
            aria-label='Category List'
          >
            <AdsSlider />

            <h2 className='text-[40px] font-stone uppercase mt-3 mb-5'>Categories</h2>

            <div className='grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-5'>
              <InitialCatCard
                data={categoryList}
                onClick={(itemId, name) => {
                  posthogTrack({
                    name: 'category_viewed',
                    trackData: {
                      category_id: String(itemId),
                      category_name: name,
                      items_count: itemCount,
                      source_screen: router.asPath,
                      session_id: '',
                    },
                  });
                  const { diningOption, rest } = router.query;
                  LocalStorage.set('selectedCat', JSON.stringify({ itemId, name }));
                  router.push(routes.items(diningOption, rest, itemId));
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className='sm:grid grid-cols-12 mx-auto w-[85%] pt-8'>
          <div className='hidden xl:block col-span-3 2xl:col-span-2 h-[calc(100dvh-229px)] bg-gray-200 rounded-[20px] mb-4 shimmer'></div>
          <div className='col-span-12 xl:col-span-9 container mx-auto 2xl:col-span-10'>
            <div className='overflow-hidden w-full container !ml-0'>
              <div className='keen-slider w-full gap-5'>
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div key={index}>
                    <div className='relative rounded-xl bg-gray-200 shimmer min-w-[232px] h-[130px]' />
                  </div>
                ))}
              </div>
            </div>
            <SkeletonLoader noOfBoxes={6} wrapperClass='xl:!grid-cols-3 mt-6 mb-5' />
          </div>
        </div>
      )}

      {/* Time Selection Modal */}
      <SideOverlay
        visible={timeModal}
        onVisible={setTimeModal}
        widthClass='w-full sm:w-[480px]'
        title='Schedule Time'
        arrow={false}
        onclose={() => {
          if (!LocalStorage.getJSON(KEYS.TIME)) {
            setTimeModal(true);
          } else {
            setTimeModal(false);
          }
        }}
        modalFooter={<Button className='w-full' title='Confirm' onClick={handleConfirmTime} />}
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
    </LayoutWrapper>
  );
};

export default CategoriesWithItems;
