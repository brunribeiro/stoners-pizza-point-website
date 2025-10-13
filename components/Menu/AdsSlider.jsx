import React, { useEffect } from 'react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';

import useInbox from '../Inbox/hooks/useInbox';

import { DEFAULT_IMAGE } from '@/utils/constant';
import RightArrowIcon from '@/icons/rightArrowIcon';

const AdsSlider = ({ showList = false }) => {
  const { offerList, loader, customOfferList, handleCustomRewards } = useInbox({
    loadOffer: true,
  });

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    mode: 'snap',
    slides: {
      perView: 4.7,
      spacing: 13,
    },
    breakpoints: {
      '(max-width: 1024px)': {
        slides: { perView: 2.5, spacing: 10 },
      },
      '(max-width: 768px)': {
        slides: { perView: 1.5, spacing: 10 },
      },
      '(max-width: 640px)': {
        slides: { perView: 1, spacing: 5 },
      },
    },
    duration: 2000,
    drag: true,
  });

  useEffect(() => {
    if (!instanceRef.current || offerList?.length === 0) return;

    const interval = setInterval(() => {
      const slider = instanceRef.current;
      if (!slider) return;

      const currentSlide = slider.track.details.rel;
      const totalSlides = slider.track.details.slides.length;
      const slidesPerView = slider.options.slides?.perView || 1;

      const lastSlideIndex = totalSlides - slidesPerView;

      if (currentSlide < lastSlideIndex) {
        slider.next();
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [instanceRef, offerList?.length]);

  if (loader.list) {
    return (
      <div className='w-full sm:pt-4 mb-2 px-4 md:px-0'>
        <div className='flex gap-3 overflow-x-auto no-scrollbar'>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className='flex-shrink-0'>
              <div className='relative rounded-2xl bg-gray-200 shimmer w-[232px] h-[130px]' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (customOfferList?.length > 0 || offerList?.length > 0) ? (
    <div className='w-full sm:pt-4 mb-2 px-4 md:px-0'>
      <div className='flex items-center relative max-w-full'>
        <div ref={sliderRef} className='keen-slider flex-1 max-w-full overflow-hidden'>
          {customOfferList.map((ad) => (
            <div key={ad.id} className='keen-slider__slide px-1'>
              <button onClick={() => handleCustomRewards(ad)} className='block w-full'>
                <div className='relative rounded-2xl overflow-hidden duration-300 bg-primary-light w-[232px] h-[130px]'>
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
          {offerList?.map((ad) => (
            <div key={ad.id} className='keen-slider__slide px-1'>
              <div className='relative rounded-2xl overflow-hidden duration-300 bg-primary-light w-[232px] h-[130px]'>
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

        {customOfferList.length + offerList.length >= 5 && (
          <>
            <button
              onClick={() => instanceRef.current?.next()}
              className='absolute -right-2 md:-right-4 shadow-lg flex items-center justify-center bg-white p-2.5 rounded-full text-stone-black hover:bg-gray-100 transition z-10'
              aria-label='Next slide'
            >
              <RightArrowIcon width='14' height='12' />
            </button>

            <button
              onClick={() => instanceRef.current?.prev()}
              className='absolute -left-2 md:-left-4 rotate-180 shadow-lg flex items-center justify-center bg-white p-2.5 rounded-full text-stone-black hover:bg-gray-100 transition z-10'
              aria-label='Previous slide'
            >
              <RightArrowIcon width='14' height='12' />
            </button>
          </>
        )}
      </div>
    </div>
  ) : null;
};

export default AdsSlider;
