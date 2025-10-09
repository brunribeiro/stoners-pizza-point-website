import React, { useContext } from 'react';

import Map from '@/components/common/Map';
import AppContext from '@/utils/appContext';

const Location = ({
  dt,
  showControllers = true,
  restDetail,
  showMap,
  currentTab,
  address,
  fromAddress = false,
}) => {
  const { selectedLocation, userCoordinates, currentRestList } = useContext(AppContext);
  return (
    <Map
      className='!rounded-none'
      style={{ height: '100%', width: '100%' }}
      showMap={showMap}
      origin={{
        lat:
          Number(selectedLocation?.lat) ||
          address?.lat ||
          restDetail?.lat ||
          Number(userCoordinates?.lat) ||
          currentRestList?.[0]?.lat ||
          dt?.bySearchRestaturantList?.[0]?.restlist?.[0]?.lat ||
          dt?.restaturantList?.[0]?.restlist?.[0].lat ||
          39.6672,
        lng:
          Number(selectedLocation?.lng) ||
          address?.long ||
          restDetail?.long ||
          Number(userCoordinates?.lng) ||
          currentRestList?.[0]?.long ||
          dt?.bySearchRestaturantList?.[0]?.restlist?.[0]?.long ||
          dt?.restaturantList?.[0]?.restlist?.[0].long ||
          -104.91603,
      }}
      list={currentRestList}
      showControllers={showControllers}
      currentTab={currentTab}
      dt={dt}
      fromAddress={fromAddress}
      key={userCoordinates}
    />
  );
};

export default Location;
