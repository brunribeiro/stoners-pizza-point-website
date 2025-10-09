import React, { useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

import InfoIcon from '@/icons/InfoIcon';
import Button from '@/widgets/button';
import { formatTime, todaysDay } from '@/hook/model/helper';
import { formatPhoneNumber2 } from '@/utils/helper';

const RestaurantCard = ({
  list,
  currentTab,
  isButtonLoad,
  handleGetRestaurantTime,
  setOpenFutureTime,
  setOpenStoreDetail,
  setSelectedStore,
  setUserCoordinates,
  itemCount,
  setOpenSwapMenu,
  setOrderAhead,
  localRestId,
  isChange,
  firstRest,
}) => {
  const handleSelectStore = (rest) => {
    setSelectedStore(rest);
    setUserCoordinates({ lat: rest.lat, lng: rest.long });
  };
  const handleStoreAddress = (rest) => {
    const address = `${rest.streetAddress}, ${rest.city}, ${rest.state}, ${rest.country}, ${rest.zip}`;
    sessionStorage.setItem('userAddress', address);
  };

  useEffect(() => {
    if (firstRest) {
      setSelectedStore(firstRest);
      setUserCoordinates({ lat: firstRest?.lat, lng: firstRest?.long });
    } else {
      // Default florida if nothing exists
      const florida = { lat: 27.994402, lng: -81.760254 };
      setUserCoordinates(florida);
    }
  }, [firstRest]);

  // removed latestRestId (no longer used after selection border change)

  const orderButtons = (rest) => {
    return (
      <div className='flex justify-between gap-2 items-center mt-4 flex-wrap xs:flex-nowrap'>
        <Button
          className={`w-full text-sm bg-white !text-black hover:bg-white hover:text-black !px-1 sm:!px-2 
      ${isChange && '!px-2 text-sm md:!text-base'}`}
          title='Order Ahead'
          loading={(isButtonLoad?.[rest?.id] && isButtonLoad?.orderAhead) || false}
          primary={false}
          onClick={() => {
            handleStoreAddress(rest);
            setOrderAhead(true);
            if (itemCount > 0 && rest.id !== localRestId) {
              setOpenSwapMenu(true);
              return;
            }
            handleGetRestaurantTime({
              restId: rest.restId,
              directRestId: rest.id,
              currentTab,
              rest,
              getRestTime: true,
              orderAhead: true,
            });
            setOpenFutureTime(true);
          }}
        />
        {rest.currOpen && (
          <Button
            className={`w-full text-sm !px-1 sm:!px-2 
            ${isChange && '!px-2 text-sm md:!text-base'}`}
            title='Order Now'
            loading={(isButtonLoad?.[rest?.id] && !isButtonLoad?.orderAhead) || false}
            onClick={() => {
              handleStoreAddress(rest);
              if (itemCount > 0 && rest.id !== localRestId) {
                setOpenSwapMenu(true);
                return;
              }
              handleGetRestaurantTime({
                restId: rest.restId,
                directRestId: rest.id,
                currentTab,
                rest,
                fromButton: true,
              });
            }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {list.map((rest, index) => {
        return (
          <div
            className={` w-full flex flex-col rounded-[22px] border-[3px] mx-0 hover:shadow-lg duration-300 ${
              rest.id === localRestId || isChange ? 'border-primary' : 'border-light-border'
            } cursor-pointer mb-4 p-3 px-[19px] pb-5 xl:px-7 bg-white ${index === 0 && 'mt-[10px]'}`}
            key={rest.id}
          >
            <button className='w-full text-left' onClick={() => handleSelectStore(rest)}>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                  <div className='flex justify-between items-center'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStore(rest);
                        setOpenStoreDetail(true);
                      }}
                      className='text-black text-lg sm:text-xl font-stone uppercase hover:text-primary duration-300 line-clamp-1'
                    >
                      {rest?.name}
                    </button>
                    <button
                      className='text-foreground hover:text-black duration-300'
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStore(rest);
                        setOpenStoreDetail(true);
                      }}
                      data-tooltip-id='str-detail'
                      data-tooltip-content='Store Detail'
                    >
                      <InfoIcon />
                      <Tooltip id='str-detail' />
                    </button>
                  </div>

                  <div className=' bg-white rounded-lg'>
                    {rest?.hours?.map((hour, index) => {
                      const startTime = formatTime(hour.start);
                      const endTime = formatTime(hour.end);

                      const days =
                        hour.day === 'mon-sun'
                          ? [
                              'Monday',
                              'Tuesday',
                              'Wednesday',
                              'Thursday',
                              'Friday',
                              'Saturday',
                              'Sunday',
                            ]
                          : [hour.day];

                      // Check if today's day matches any of the defined days
                      const isToday = days.some((day) => {
                        return day.toLowerCase().includes(todaysDay.toLowerCase().slice(0, 3));
                      });

                      if (!isToday) return null;

                      return (
                        <div
                          key={`today-${index}`}
                          className='flex items-center gap-2 text-sm py-1 capitalize'
                        >
                          <span
                            className={`font-bold ${rest.currOpen ? 'text-green' : 'text-stone-black'}`}
                          >
                            {rest.currOpen ? 'OPEN' : 'CLOSED'}
                          </span>
                          {rest.currOpen && (
                            <span
                              className={`font-medium ${rest.currOpen ? 'text-green' : 'text-stone-black'}`}
                            >{`${startTime} - ${endTime}`}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className='flex items-center justify-between gap-6'>
                    <button
                      onClick={() => {
                        if (rest?.lat && rest?.long) {
                          const mapsUrl = `https://www.google.com/maps?q=${rest.lat},${rest.long}`;
                          window.open(mapsUrl, '_blank');
                        }
                      }}
                      className='text-foreground text-sm hover:text-primary transition-all !text-left'
                    >
                      {`${rest?.streetAddress}, ${rest?.city}, ${rest?.state}, ${rest?.country}, ${rest?.zip}`}
                    </button>
                    {rest?.distance ? (
                      <p className='text-nowrap font-semibold'>{rest?.distance} Mi</p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div>
                    <a
                      href={`tel:${rest?.telephone}`}
                      className='text-foreground text-sm hover:text-primary border-b border-foreground hover:border-primary'
                    >
                      {formatPhoneNumber2(rest?.telephone)}
                    </a>
                  </div>
                  {rest?.desc && <p className='text-sm'>{rest?.desc}</p>}
                </div>
              </div>
              {orderButtons(rest)}
            </button>
          </div>
        );
      })}
    </>
  );
};

export default RestaurantCard;
