import React, { useEffect } from 'react';
import Slider from 'react-slick';

import { extractDay, formatTimeTo12Hour, getDayNames } from '@/utils/helper';
import { KEYS } from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';

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
  const parseDateString = (dateString) => {
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1;
    const day = parseInt(dateString.substring(6, 8), 10);
    return new Date(year, month, day);
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const getDateLabel = (date) => {
    if (date.toDateString() === today.toDateString()) {
      return t('today');
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return t('tomorrow');
    } else {
      return `${getDayNames(date)} - ${extractDay(date)}`;
    }
  };

  const dateOptions = dt?.availableTimes?.map((time) => {
    const date = parseDateString(time.date);
    return {
      value: time.date,
      label: getDateLabel(date),
      times: time.times,
    };
  });

  const timeOptions = restDate
    ? dateOptions
        .find((option) => option.value === restDate)
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
    setSelectedTime(selectedOption.value);

    setErrors((prev) => ({ ...prev, time: '' }));
  };

  useEffect(() => {
    if (dt?.availableTimes?.length && !restDate && !selectedTime) {
      const availableTimes = dt.availableTimes;
      const rawTime = LocalStorage.get(KEYS.TIME);

      const completeTime = rawTime?.slice(1, 17);

      let selectedDate = null;
      let selectedTimeValue = null;

      if (completeTime) {
        const date = new Date(completeTime);

        if (!isNaN(date.getTime())) {
          const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
          const formattedTime = date.toTimeString().split(' ')[0];

          const matchedDateObj = availableTimes.find((item) => item.date === formattedDate);
          if (matchedDateObj) {
            const matchedTime = matchedDateObj.times?.find((time) => time === formattedTime);
            if (matchedTime) {
              selectedDate = formattedDate;
              selectedTimeValue = matchedTime;
            }
          }
        }
      }

      if (!selectedDate || !selectedTimeValue) {
        const firstDateObj = availableTimes[0];
        selectedDate = firstDateObj.date;
        selectedTimeValue = firstDateObj.times?.[0] || null;
      }

      setRestDate(selectedDate);
      if (selectedTimeValue) {
        setSelectedTime(selectedTimeValue);
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
    ],
  };

  return (
    <div className='py-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex sm:w-[92%] w-[85%] flex-col gap-2 mb-4 sm:ml-9 ml-5'>
          <label className='font-bold mb-1 text-black'>
            {t('scheduleDate')} {mandatoryFields.date && <span className='text-red'></span>}
          </label>

          {dateOptions?.length > 0 ? (
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
            <div className='flex gap-3'>
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className='w-[90px] h-24 bg-gray-300 animate-pulse rounded-xl'
                ></div>
              ))}
            </div>
          )}
          {errors?.date && <p className='text-red text-sm mt-1'>{errors?.date}</p>}
        </div>

        {timeOptions?.length > 0 && (
          <div className='flex w-full flex-col mb-4 px-5 sm:px-10 gap-2'>
            <label className='font-bold mb-1 text-black'>
              {t('scheduleTime')} {mandatoryFields.time && <span className='text-red'></span>}
            </label>
            <div className='grid grid-cols-3 gap-2.5'>
              {timeOptions?.map((item) => {
                return (
                  <div key={item.value} className=''>
                    <button
                      className={`p-1 px-4 w-full text-center rounded-lg duration-300 border-[3px] hover:bg-primary hover:text-white hover:border-dark-primary ${
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
        )}
      </div>
    </div>
  );
};

export default CarDetailCard;
