import React, { useRef } from 'react';
import Image from 'next/image';

import useInbox from '../Inbox/hooks/useInbox';

import { DEFAULT_IMAGE, KEYS } from '@/utils/constant';
import RightArrowIcon from '@/icons/rightArrowIcon';
import { LocalStorage } from '@/utils/localStorage';

const AdsSlider = ({ vertical = false }) => {
  const { offerList, loader, customOfferList, handleCustomRewards } = useInbox({
    loadOffer: true,
  });

  const scrollContainerRef = useRef(null);

  // Filter customOfferList to only include items with valid restaurant mappings
  const getFilteredCustomOffers = () => {
    const restDetail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
    if (!restDetail?.id) return [];

    return customOfferList.filter((ad) => {
      // Check if the offer has items and at least one matches the current restaurant
      return ad.item?.some((item) => item.restId === restDetail.id);
    });
  };

  const filteredCustomOfferList = getFilteredCustomOffers();
  const allOffers = [...filteredCustomOfferList, ...(offerList || [])];
  const hasOffers = allOffers.length > 0;

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250; // Adjust scroll distance
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll =
        direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  // Loading skeleton
  if (loader.list) {
    return (
      <div className={`w-full ${vertical ? 'p-4' : 'sm:pt-4 mb-2 px-4 md:px-0'}`}>
        <div className={`flex gap-3 ${vertical ? 'flex-col' : 'overflow-x-auto'} no-scrollbar`}>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className={vertical ? 'w-full' : 'flex-shrink-0'}>
              <div className={`relative rounded-2xl bg-gray-200 shimmer ${vertical ? 'w-full h-[130px]' : 'w-[232px] h-[130px]'}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasOffers) return null;

  return (
    <div className={`w-full ${vertical ? 'p-4' : 'sm:pt-4 mb-2 px-4 md:px-0'}`}>
      <div className='relative group'>
        {/* Scroll container - horizontal or vertical */}
        <div
          ref={scrollContainerRef}
          className={`flex gap-3 ${
            vertical 
              ? 'flex-col' 
              : 'overflow-x-auto scrollbar-hide scroll-smooth'
          }`}
          style={
            vertical
              ? {}
              : {
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                }
          }
        >
          {/* Custom offers */}
          {filteredCustomOfferList.map((ad) => (
            <div key={ad.id} className={vertical ? 'w-full' : 'flex-shrink-0'}>
              <button onClick={() => handleCustomRewards(ad)} className='block w-full'>
                <div className={`relative rounded-2xl overflow-hidden duration-300 bg-primary-light hover:scale-105 transition-transform ${
                  vertical ? 'w-full h-[130px]' : 'w-[232px] h-[130px]'
                }`}>
                  <Image
                    src={ad.img}
                    alt={ad.title}
                    title={ad.title}
                    fill
                    className='object-cover bg-gray-200'
                  />
                </div>
              </button>
            </div>
          ))}

          {/* Regular offers */}
          {offerList?.map((ad) => (
            <div key={ad.id} className={vertical ? 'w-full' : 'flex-shrink-0'}>
              <div className={`relative rounded-2xl overflow-hidden duration-300 bg-primary-light hover:scale-105 transition-transform ${
                vertical ? 'w-full h-[130px]' : 'w-[232px] h-[130px]'
              }`}>
                <Image
                  src={ad.mediumImage || DEFAULT_IMAGE}
                  alt={ad.title}
                  title={ad.title}
                  fill
                  className='object-cover bg-gray-200'
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows - show only in horizontal mode and if there are enough items */}
        {!vertical && allOffers.length >= 3 && (
          <>
            <button
              onClick={() => scroll('right')}
              className='absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 shadow-lg flex items-center justify-center bg-white p-2.5 rounded-full text-stone-black hover:bg-gray-100 transition z-10 opacity-0 group-hover:opacity-100'
              aria-label='Scroll right'
            >
              <RightArrowIcon width='14' height='12' />
            </button>

            <button
              onClick={() => scroll('left')}
              className='absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 rotate-180 shadow-lg flex items-center justify-center bg-white p-2.5 rounded-full text-stone-black hover:bg-gray-100 transition z-10 opacity-0 group-hover:opacity-100'
              aria-label='Scroll left'
            >
              <RightArrowIcon width='14' height='12' />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdsSlider;
