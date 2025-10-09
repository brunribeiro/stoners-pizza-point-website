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
      <div className={`overflow-hidden w-full mb-2 ${!showList ? 'sm:pt-4 !mx-0' : 'p-1 mx-auto'}`}>
        <div className={`overflow-hidden w-full ${!showList && '!ml-0'} `}>
          <div className={`${!showList ? 'keen-slider gap-4' : 'flex flex-col gap-5 w-full'}`}>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className='px-1'>
                <div className='relative rounded-xl bg-gray-200 shimmer min-w-[232px] h-[130px]' />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return customOfferList?.length > 0 && !showList ? (
    <div className='!mx-0 container !max-w-full w-full sm:pt-4 mb-2'>
      <div className='flex items-center relative'>
        <div ref={sliderRef} className='keen-slider flex-1'>
          {customOfferList.map((ad) => (
            <div
              key={ad.id}
              className='keen-slider__slide px-1 !min-w-[240px] !max-w-[240px] !w-auto'
            >
              <button onClick={() => handleCustomRewards(ad)}>
                <div className='relative rounded-2xl overflow-hidden duration-300 bg-primary-light w-[232px] h-[130px] max-w-full'>
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
            <div key={ad.id} className='keen-slider__slide px-1 !min-w-[240px] !max-w-[240px]'>
              <div className='relative rounded-2xl overflow-hidden duration-300 bg-primary-light w-[232px] h-[130px] max-w-full'>
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
              className='absolute -right-4 shadow-lg flex items-center justify-center bg-white p-2.5 rounded-full text-stone-black hover:bg-gray-100 transition'
            >
              <RightArrowIcon width='14' height='12' />
            </button>

            <button
              onClick={() => instanceRef.current?.prev()}
              className='absolute -left-4 rotate-180 shadow-lg flex items-center justify-center bg-white p-2.5 rounded-full text-stone-black hover:bg-gray-100 transition'
            >
              <RightArrowIcon width='14' height='12' />
            </button>
          </>
        )}
      </div>
    </div>
  ) : (
    <div className='mx-7'>
      {customOfferList.map((ad) => (
        <div key={ad.id} className=' px-1'>
          <button onClick={() => handleCustomRewards(ad)}>
            <div className='relative rounded-2xl overflow-hidden duration-300 bg-primary-light w-[400px] h-[150px] max-w-full mb-8'>
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
      {offerList.map((ad) => (
        <div key={ad.id} className='px-1'>
          <div className='relative rounded-2xl overflow-hidden duration-300 bg-primary-light w-[400px] h-[150px] max-w-full mb-8'>
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
  );
};

export default AdsSlider;
