import React from 'react';

import PlacesPickup from '@/components/common/PlacesPickup';
import PlacesDelivery from '@/components/common/PlacesDelivery';

const AutocompleteSection = ({
  t,
  currentTab,
  isLoaded,
  isChange,
  dt,
  dtAdd,
  errors,
  selectedAddress,
  setSelectedAddress,
  setMyLocationTriggered,
  localDeliveryAddress,
  autoCompleteRef,
}) => {
  if (currentTab === 0) {
    return (
      <PlacesPickup
        ref={autoCompleteRef}
        placeholder={t('placesAutocomplete')}
        dt={dt}
        tabIndex='0'
        className='pe-10 placeholder:line-clamp-3'
        isChange={isChange}
        isLoaded={isLoaded}
        currentTab={currentTab}
        setMyLocationTriggered={setMyLocationTriggered}
      />
    );
  }
  if (currentTab === 1 && (isLoaded || isChange)) {
    return (
      <PlacesDelivery
        ref={autoCompleteRef}
        placeholder={t`searchYourAddress`}
        dtAdd={dtAdd}
        error={errors.country?.message}
        descValue={dtAdd.watch('description')}
        localDeliveryAddress={localDeliveryAddress || selectedAddress}
        isChange={isChange}
        setSelectedAddress={setSelectedAddress}
        isLoaded={isLoaded}
        currentTab={currentTab}
        setMyLocationTriggered={setMyLocationTriggered}
        loader={dt.loader.list}
      />
    );
  }
  return null;
};

export default AutocompleteSection;
