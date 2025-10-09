import React, { useContext, useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

import StoreDetail from '../Home/StoreDetail';
import useRestaurantList from '../Home/hook/useRestaurantList';

import DrawerWrapper from '@/shared/drawer';
import '@reach/combobox/styles.css';
import AppContext from '@/utils/appContext';
import Button from '@/widgets/button';

function Map({
  origin,
  style = {},
  showMap = false,
  list = [],
  options = {},
  currentTab,
  dt,
  fromAddress,
  allowGeolocation = true,
}) {
  const [openStoreDetail1, setOpenStoreDetail1] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry'],
  });

  const mapRef = useRef(null); // To store map instance
  const [centerCoordinates, setCenterCoordinates] = useState({});

  const {
    setIsLoadedMap,
    setUserCoordinates,
    isAutoComplete,
    setSelectedStore,
    selectedStore,
    userCoordinates,
  } = useContext(AppContext);

  const { setOpenFutureTime, handleGetRestaurantTime } = useRestaurantList({
    dt,
    currentTab,
    isCheckout: false,
  });

  const mapStyles = [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ff0000' }], // Makes all text red
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }], // Removes road/highway icons
    },
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }], // Hides points of interest
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'off' }], // Hides transit lines
    },
    {
      featureType: 'administrative',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }], // Removes administrative icons
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [
        { saturation: -100 }, // Removes green from forests and parks
        { lightness: 50 }, // Adjusts brightness to make it look faded
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#c5d9ff' }],
    },
  ];

  useEffect(() => {
    setIsLoadedMap(isLoaded);

    if (isLoaded && allowGeolocation && dt?.myLocationTriggered) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            setUserCoordinates({ lat: latitude, lng: longitude });
          },
          (error) => console.error('Error getting location:', error),
          { enableHighAccuracy: true },
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
      }
    }
  }, [isLoaded, setIsLoadedMap, setUserCoordinates, allowGeolocation, dt?.myLocationTriggered]);

  useEffect(() => {
    if (mapRef.current) {
      if (isAutoComplete?.lat) {
        mapRef.current.panTo({
          lat: isAutoComplete.lat + 0.0002,
          lng: isAutoComplete.long - 0.0001,
        });
      }
    }
  }, [isAutoComplete?.lat]);

  useEffect(() => {
    const getCenterCoordinated = {
      lat: origin?.lat,
      lng: origin?.lng,
    };

    if (isAutoComplete?.lat) {
      getCenterCoordinated.lat = isAutoComplete.lat;
      getCenterCoordinated.lng = isAutoComplete.long;
    }

    setCenterCoordinates(getCenterCoordinated);
  }, [userCoordinates]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        borderRadius: '0',
        height: style.height ?? '500px',
        width: style.width ?? '500px',
      }}
      center={fromAddress ? origin : currentTab === 1 ? centerCoordinates || origin : origin}
      zoom={14}
      options={{
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        ...options,
      }}
      onLoad={(map) => (mapRef.current = map)} // Set the map reference here
    >
      {showMap &&
        list.map((rest) =>
          rest?.lat && rest?.long ? (
            <Marker
              key={`${rest.lat}-${rest.long}`}
              position={{ lat: Number(rest.lat), lng: Number(rest.long) }}
              icon={{ url: '/images/location.svg' }}
              onClick={() => {
                setSelectedStore(rest);
                setOpenStoreDetail1(true);
                //NOT WORKING
              }}
            />
          ) : null,
        )}
      {origin?.lat && origin?.lng && (
        <Marker
          position={origin}
          key={`${origin.lat}-${origin.lng} ${isAutoComplete?.lat}`}
          icon={{ url: '/images/location.svg' }}
          onClick={() => {
            // setSelectedStore(rest);
            setOpenStoreDetail1(true);
          }}
        />
      )}

      <DrawerWrapper
        visible={openStoreDetail1}
        onVisible={setOpenStoreDetail1}
        widthClass='w-full sm:w-[480px]'
        title='Location Details'
        arrow={false}
        modalFooter={
          <div className='flex justify-between gap-4 items-center px-2 mt-4 w-full'>
            <Button
              className='text-base sm:text-xl !px-2 !py-2 bg-white !text-black hover:bg-white hover:text-black w-full'
              title='Order Ahead'
              primary={false}
              onClick={() => {
                setOpenFutureTime(true);
                setOpenStoreDetail1(false);
              }}
            />
            <Button
              className='text-base sm:text-xl !px-2 w-full'
              title='Order Now'
              onClick={() => {
                setOpenStoreDetail1(false);
                handleGetRestaurantTime({
                  restId: selectedStore.restId,
                  directRestId: selectedStore.id,
                  currentTab,
                  rest: selectedStore,
                  fromButton: true,
                });
              }}
            />
          </div>
        }
        onclose={() => setOpenStoreDetail1(false)}
      >
        <StoreDetail rest={selectedStore} />
      </DrawerWrapper>
    </GoogleMap>
  ) : null;
}

export default Map;
