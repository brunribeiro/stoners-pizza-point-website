import React, { forwardRef } from 'react';

import PlacesAutocomplete from './PlacesAutocomplete';

const PlacesPickup = forwardRef(
  (
    {
      dt,
      placeholder,
      className = '',
      currentTab,
      setMyLocationTriggered,
      isLoaded,
      isChange = false,
      tabIndex = '0',
    },
    ref,
  ) => {
    return (
      <PlacesAutocomplete
        ref={ref}
        key={`pickup-${isLoaded}`}
        placeholder={placeholder}
        isPickUp
        dt={dt}
        tabIndex={tabIndex}
        className={className}
        isChange={isChange}
        isLoaded={isLoaded}
        useMyLocationBtn
        currentTab={currentTab}
        setMyLocationTriggered={setMyLocationTriggered}
      />
    );
  },
);

PlacesPickup.displayName = 'PlacesPickup';

export default PlacesPickup;
