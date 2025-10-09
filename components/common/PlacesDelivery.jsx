import React, { forwardRef } from 'react';

import PlacesAutocomplete from './PlacesAutocomplete';

const PlacesDelivery = forwardRef(
  (
    {
      dtAdd,
      placeholder,
      className = '',
      currentTab,
      setMyLocationTriggered,
      isLoaded,
      isChange = false,
      localDeliveryAddress,
      descValue,
      error,
      loader = false,
      tabIndex = '0',
      setSelectedAddress,
    },
    ref,
  ) => {
    return (
      <PlacesAutocomplete
        ref={ref}
        key={`delivery-${isLoaded}-${Boolean(localDeliveryAddress)}-${Boolean(descValue)}`}
        placeholder={placeholder}
        isDelivery
        dtAdd={dtAdd}
        error={error}
        descValue={descValue}
        localDeliveryAddress={localDeliveryAddress}
        isChange={isChange}
        setSelectedAddress={setSelectedAddress}
        isLoaded={isLoaded}
        useMyLocationBtn
        currentTab={currentTab}
        setMyLocationTriggered={setMyLocationTriggered}
        loader={loader}
        className={className}
        tabIndex={tabIndex}
      />
    );
  },
);

PlacesDelivery.displayName = 'PlacesDelivery';

export default PlacesDelivery;
