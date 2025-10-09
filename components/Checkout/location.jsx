import React, { useEffect, useState } from 'react';

import Map from '../common/Map';

import { formatAddress } from '@/utils/common';
import { KEYS } from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';

const Location = () => {
  const [restDetail, setRestDetail] = useState(null);

  useEffect(() => {
    // Access LocalStorage on the client side after component is mounted
    const restaurantData = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
    setRestDetail(restaurantData);
  }, []);

  // If restDetail is not yet loaded, return null or a loader to prevent mismatches
  if (!restDetail) {
    return <div>Loading...</div>;
  }
  const locationList = [{ lat: restDetail.lat, lng: restDetail.long }];
  return (
    <div className='flex gap-5 w-full pb-5 mb-5 border-b border-gray-300 sm:flex-nowrap flex-wrap'>
      <div className='  font-extrabold text-[21px] xl:min-w-48 sm:min-w-40 sm:w-auto w-full'>
        Location
      </div>
      <div className='flex flex-col gap-4 w-full'>
        <div className=''>
          <div className='text-lg text-foreground font-bold'>{restDetail?.name}</div>
          <div className=' text-foreground'>{formatAddress(restDetail)}</div>
        </div>
        <div className='h-[200px]'>
          <Map
            className='!rounded-none'
            style={{ height: '100%', width: '100%' }}
            showMap
            origin={{
              lat: Number(restDetail?.lat + 5) ?? 39.6672,
              lng: Number(restDetail?.long + 5) ?? -104.91603,
            }}
            options={
              {
                disableDefaultUI: true, // Disables all default UI controls
                zoomControl: false, // Hides the zoom control
                streetViewControl: false, // Hides Street View control
                mapTypeControl: false, // Hides map type options
                fullscreenControl: false,
              } // Hides fullscreen control
            }
            // origin={{
            //   lat: 28.70406,
            //   lng: 77.102493,
            // }}
            list={locationList}
          />
        </div>
      </div>
    </div>
  );
};

export default Location;
