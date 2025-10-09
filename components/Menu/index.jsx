import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

import CustomModal from '../common/CustomModal';
import SkeletonLoader from '../common/SkeletonLoader';

import CategoryList from './categoryList';
import CategoryItems from './categoryItems';
import useMenu from './hook/useMenu';
import AdsSlider from './AdsSlider';
import CategoryCard from './CategoryCard';

import LayoutWrapper from '@/shared/layoutWrapper';
import AppContext from '@/utils/appContext';
import Button from '@/widgets/button';
import { LocalStorage } from '@/utils/localStorage';
import SearchInput from '@/widgets/SearchInput';
import SearchIcon from '@/icons/searchIcon';
import { useMenuCtx } from '@/contexts/menuContext';
import routes from '@/utils/routes';
import { KEYS } from '@/utils/constant';
import SideOverlay from '@/shared/drawer';
import CarDetailCard from '@/components/common/ScheduleCard';
import { handleValidation } from '@/utils/helper';
import Toast from '@/utils/toast';
import useReorder from '@/hook/order/useReorder';

const Menu = () => {
  const { t } = useTranslation('common');
  const { setPageLoad, timeModal, setTimeModal, currentTab, restaurant } = useContext(AppContext);
  const router = useRouter();
  const [serachLoader, setSearchLoader] = useState(false);
  const [isSearchExpand, setIsSearchExpand] = useState(false);
  const searchInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const searchWrapperRef = useRef(null);
  const menuCtx = useMenuCtx();
  const handleSearchChange = (v) => {
    menuCtx.setSearchQuery(v);
    menuCtx.searchItems(v);
  };
  const {
    categoryList,
    itemList,
    idHandler,
    categoryId,
    isLoad,
    setCategoryId,
    getCategoryList,
    isManualScroll,
    errors,
    setErrors,
    selectedTime,
    setSelectedTime,
    restDate,
    setRestDate,
  } = useMenu();
  const dt = useReorder();
  const itemimg =
    'https://incentivio.s3.amazonaws.com/73c9bdfa-2447-4d04-a4f0-f5c7cf7eb090/default_tile.png';

  useEffect(() => {
    setPageLoad(false);
  }, [setPageLoad]);
  const handleSearchIconClick = () => {
    setIsSearchExpand(!isSearchExpand);
    // Focus the input when expanded
    if (!isSearchExpand && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 0);
    }
  };

  useEffect(() => {
    if (LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL)?.id && !categoryList?.length)
      getCategoryList();
  }, [LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL)?.id]);

  // Reflect context search loader in local "serachLoader" prop used by children
  useEffect(() => {
    setSearchLoader(!!menuCtx.loader.search);
  }, [menuCtx.loader.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setIsSearchExpand(false);
        menuCtx.clearSearch(); // optionally clear search
      }
    };

    if (isSearchExpand) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpand, menuCtx.clearSearch]);

  const changeLocation = () => {
    setIsOpen(true);
  };

  const onItemClick = (value) => {
    idHandler(value.id);
    setCategoryId(value.name);
  };

  const handleItemClick = (item) => {
    const { diningOption, rest } = router.query;
    router.push(routes.selectedItem(diningOption, rest, item.id));
  };

  const shouldShowSearchResults = menuCtx.searchResults?.length > 0 && !!menuCtx.searchQuery;

  const anyLoading = Boolean(menuCtx.loader.items || menuCtx.loader.categories);
  const isSearching = Boolean(menuCtx.loader.search);

  return (
    <LayoutWrapper id={itemList?.[0]?.id} changeLocation={changeLocation}>
      {!anyLoading ? (
        <div className='xl:grid grid-cols-12 relative w-full xl:w-[85%] mx-auto '>
          <div className='sticky top-[72px] z-[42] xl:hidden block w-full'>
            <div className='flex border-t-[4px] before:absolute before:bottom-0 before:left-0 before:w-full before:border-b-[4px] before:border-[#dadada] before:z-[5] px-5 no-scrollbar gap-4 bg-primary-light py-2 overflow-x-auto'>
              <div className='flex items-center' ref={searchWrapperRef}>
                <button onClick={handleSearchIconClick} className='mr-2'>
                  {!isSearchExpand && <SearchIcon size='24' />}
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isSearchExpand ? 'w-64 opacity-100 ml-2' : 'w-0 opacity-0'
                  }`}
                >
                  <SearchInput
                    searchValue={menuCtx.searchQuery}
                    handleSearchChange={handleSearchChange}
                    handleClear={() => menuCtx.clearSearch()}
                    setSearchLoader={setSearchLoader}
                    ref={searchInputRef}
                    onBlur={() => setIsSearchExpand(false)}
                  />
                </div>
              </div>

              {categoryList?.length &&
                categoryList?.map((value) => (
                  <button
                    onClick={() => {
                      LocalStorage.set(
                        'selectedCat',
                        JSON.stringify({ itemId: value.id, name: value.name }),
                      );
                      onItemClick(value);
                    }}
                    className={`transition-all whitespace-nowrap duration-200 ${
                      +categoryId === value.id ? 'selected-category' : 'text-foreground'
                    }`}
                    key={value.id}
                  >
                    {value.name}
                  </button>
                ))}
            </div>
          </div>
          <div className='col-span-3 relative hidden xl:block 2xl:col-span-2'>
            {categoryList?.length > 0 ? (
              <CategoryList
                idHandler={idHandler}
                categoryList={categoryList}
                categoryId={categoryId}
                setCategoryHandler={setCategoryId}
                showSearch={true}
                setSearchLoader={setSearchLoader}
                serachLoader={serachLoader}
              />
            ) : (
              <></>
            )}
          </div>

          <main
            className='w-full col-span-12 xl:col-span-9 container !mx-auto 2xl:col-span-10 overflow-x-visible pb-2 sm:pb-8 pl-3 md:pl-0 flex flex-col scrollbar-hide !pt-4'
            role='region'
            aria-label='Category Items'
          >
            <div className='w-full mb-2'>
              <AdsSlider />
            </div>
            {itemList?.map((item, index) => (
              <CategoryItems
                key={item.id ?? index}
                index={index}
                id={item.id}
                showSearch={true}
                setSearchLoader={setSearchLoader}
                itemList={item?.items}
                itemLoad={anyLoading}
                isLoad={isLoad}
                category={item?.name}
                searchData={menuCtx.searchResults}
                categoryName={menuCtx.searchQuery}
                handleItemClick={handleItemClick}
                itemimg={itemimg}
                shouldShowSearchResults={shouldShowSearchResults}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                isManualScroll={isManualScroll}
                searchValue={menuCtx.searchQuery}
                handleSearchChange={handleSearchChange}
                handleClear={() => menuCtx.clearSearch()}
                debouncedValue={menuCtx.searchQuery}
                isSearching={isSearching}
              />
            ))}
            {isSearching && (
              <div className='w-full'>
                <SkeletonLoader noOfBoxes={6} wrapperClass='xl:!grid-cols-3 mt-2' />
              </div>
            )}

            {shouldShowSearchResults && !isSearching && (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-[2rem] mt-3'>
                {menuCtx.searchResults.map((item) => (
                  <CategoryCard
                    key={item.id}
                    img={item.mediumImg || item.smallImg || itemimg}
                    price={item.cost}
                    name={item.name}
                    content={item.longDesc || item.shortDesc}
                    onClick={() => handleItemClick(item)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      ) : (
        <div className='sm:grid grid-cols-12 mx-auto w-[85%] pt-8'>
          <div className='hidden xl:block col-span-3 2xl:col-span-2 h-[calc(100dvh-229px)] bg-gray-200 rounded-[20px] mb-4 shimmer'></div>
          <div className='col-span-12 xl:col-span-9 container mx-auto 2xl:col-span-10'>
            <div className='overflow-hidden w-full !ml-0'>
              <div className='keen-slider gap-4'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className='keen-slider__slide px-2'>
                    <div className='relative rounded-xl overflow-hidden bg-gray-200 shimmer min-w-[232px] h-[130px]' />
                  </div>
                ))}
              </div>
            </div>
            <SkeletonLoader noOfBoxes={6} wrapperClass='xl:!grid-cols-3 mt-8' />
          </div>
        </div>
      )}
      {isOpen && (
        <CustomModal
          title={t('location')}
          open={isOpen}
          setOpen={setIsOpen}
          className='sm:px-5 px-3 py-3 sm:py-5 rounded-[30px] bg-[#ecedf0]'
          className2='sm:max-w-[580px]'
        >
          <div className='space-y-4'>
            <span className='text-xs font-semibold'>{t('wouldYouLikeToChangeLocation')}</span>
            <div className='px-14 py-6 border-2 border-[#e7d8da] rounded-3xl bg-[#f9eaec] flex items-center space-x-3'>
              <Image src='/IMPicon.svg' alt='Important Icon' width={20} height={20} />
              <div>
                <span className='font-semibold'>{t('important')} </span>
                <span className='font-semibold'>{t('changingLocationWillChangeTheMenu')}</span>
              </div>
            </div>
            <div className='flex flex-col md:flex-row justify-center gap-4'>
              <Button
                title={t('cancel')}
                className='uppercase bg-white text-zinc-950 hover:bg-slate-600 w-60 h-[68px] text-xl font-extrabold'
                onClick={() => setIsOpen(false)}
              />
              <Button
                title={t('continue')}
                className='uppercase w-60 text-xl font-bold h-[68px] bg-blue-600 text-white hover:bg-blue-700'
                onClick={() => router.push('/')}
              />
            </div>
          </div>
        </CustomModal>
      )}

      {/* Time Selection Modal */}
      <SideOverlay
        visible={timeModal}
        onVisible={setTimeModal}
        widthClass='w-full sm:w-[480px]'
        title='Schedule Delivery'
        arrow={false}
        onclose={() => {
          if (!LocalStorage.getJSON(KEYS.TIME)) {
            setTimeModal(true);
          } else {
            setTimeModal(false);
          }
        }}
        modalFooter={
          <Button
            className='w-full'
            title='Confirm'
            onClick={() => {
              if (handleValidation(restDate, selectedTime).error) {
                dt.handleClickTimeCard(selectedTime, restDate, currentTab, restaurant);
                setTimeModal(false);
              } else {
                const errorObj = handleValidation();
                Toast.error(errorObj.data || errorObj.time);
              }
            }}
          />
        }
      >
        {/* Time Selection Modal */}
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

export default Menu;
