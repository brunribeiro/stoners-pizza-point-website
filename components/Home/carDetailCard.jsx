import React, { useEffect } from 'react';
import Slider from 'react-slick';

import ScheduleTimeSkeleton from '../common/ScheduleTimeSkeleton';
import ScheduleDateSkeleton from '../common/ScheduleDateSkeleton';

import { formatTimeTo12Hour } from '@/utils/helper';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CarDetailCard = ({
  setSelectedTime,
  setRestDate,
  restDate,
  dt,
  t,
  errors,
  setErrors,
  selectedTime,
  mandatoryFields = { date: false, time: false },
}) => {
  const dateOptions = dt.restaurantTime?.availableTimes?.map((time) => {
    const date = dt.parseDateString(time.date);
    return {
      value: time.date,
      label: dt.getDateLabel(date),
      times: time.times,
    };
  });

  const timeOptions = restDate
    ? dateOptions
        ?.find((option) => option.value === restDate)
        ?.times.map((tm) => ({
          value: tm,
          label: formatTimeTo12Hour(tm),
        }))
    : [];

  const handleDateChange = (selectedOption) => {
    setRestDate(selectedOption.value);
    setSelectedTime(selectedOption?.times[0]);
    setErrors((prev) => ({ ...prev, date: '', time: '' }));
  };

  const handleTimeChange = (selectedOption) => {
    setSelectedTime(selectedOption?.value);
    setErrors((prev) => ({ ...prev, time: '' }));
  };
  useEffect(() => {
    if (dt.restaurantTime?.availableTimes?.length && !restDate && !selectedTime) {
      const firstDateObj = dt.restaurantTime?.availableTimes[0];
      const firstDate = firstDateObj.date;
      const firstTime = firstDateObj.times?.[0] || null;

      setRestDate(firstDate);
      if (firstTime) {
        setSelectedTime(firstTime);
      }

      setErrors((prev) => ({ ...prev, date: '', time: '' }));
    }
  }, [dt, restDate, selectedTime]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4.5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3.8,
        },
      },
      {
        breakpoint: 380,
        variableWidth: true,
        settings: {
          slidesToShow: 3.2,
        },
      },
      {
        breakpoint: 320,
        variableWidth: true,
        settings: {
          slidesToShow: 2.8,
        },
      },
    ],
  };

  return (
    <div className='sm:py-6'>
      <div className='flex flex-col gap-2'>
        {/* Date Selection as a Carousel */}
        <div className='flex sm:w-[92%] w-[85%] flex-col gap-2 mb-4 sm:ml-9 ml-5'>
          <label className='font-bold mb-1 text-black'>
            {t('scheduleDate')} {mandatoryFields.date && <span className='text-red'></span>}
          </label>

          {dateOptions?.length > 0 && !dt?.loader.getTime ? (
            <Slider {...settings}>
              {dateOptions?.map((item) => {
                const [day, date] = item.label.split(' - ');
                return (
                  <div key={item.value} className=''>
                    <button
                      className={`py-4 h-24 w-[90px] text-center rounded-xl duration-300 border-[3px] text-dark-gray hover:bg-primary hover:text-white hover:border-dark-primary whitespace-nowrap ${
                        restDate === item.value
                          ? 'bg-primary text-white border-dark-primary'
                          : 'bg-primary-light border-gray-300'
                      }`}
                      onClick={() => handleDateChange(item)}
                    >
                      <div className='font-medium'>{day}</div>
                      <div className='font-stone text-2xl '>
                        {day === 'Today'
                          ? new Date().getDate()
                          : day === 'Tomorrow'
                            ? new Date().getDate() + 1
                            : date}
                      </div>
                    </button>
                  </div>
                );
              })}
            </Slider>
          ) : (
            // Skeleton Loader when dateOptions is empty or loading
            <ScheduleDateSkeleton />
          )}

          {errors?.date && <p className='text-red text-sm mt-1'>{errors?.date}</p>}
        </div>

        {/* Time Selection */}
        {timeOptions?.length > 0 && !dt?.loader.getTime ? (
          <div className='flex w-full flex-col mb-4 px-5 sm:px-10 gap-2'>
            <label className='font-bold mb-1 text-black'>
              {t('scheduleTime')} {mandatoryFields.time && <span className='text-red'></span>}
            </label>
            <div className='grid grid-cols-3 gap-2.5'>
              {timeOptions?.map((item) => {
                return (
                  <div key={item.value} className=''>
                    <button
                      className={`p-1 px-1 sm:px-4 w-full text-center rounded-lg duration-300 border-[3px] hover:bg-primary hover:text-white hover:border-dark-primary ${
                        item.value === selectedTime
                          ? 'bg-primary text-white border-dark-primary'
                          : 'border-gray-300 bg-primary-light text-dark-gray'
                      }`}
                      onClick={() => handleTimeChange(item)}
                    >
                      <div className='font-medium'>{item.label}</div>
                    </button>
                  </div>
                );
              })}
            </div>

            {errors.time && <p className='text-red text-sm mt-1'>{errors.time}</p>}
          </div>
        ) : (
          <ScheduleTimeSkeleton />
        )}
      </div>
    </div>
  );
};

export default CarDetailCard;
