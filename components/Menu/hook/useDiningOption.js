import { useState, useEffect } from 'react';

import { formatAddress, getAddressLabel } from '@/utils/common';
import { DINING_OPTION, KEYS, REST_LOCATION_ID } from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';

const useDiningOption = () => {
  const [orderType, setOrderType] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [time, setTime] = useState(null);
  const [pickUpAddress, setPickUpAddress] = useState(null);
  const locationId = LocalStorage.get(REST_LOCATION_ID);
  useEffect(() => {
    // This code will only run on the client
    const storedOrderType =
      LocalStorage.getJSON(KEYS.DINING_OPTION) === 1
        ? DINING_OPTION.Delivery
        : DINING_OPTION.pickup;
    const storedDeliveryAddress = LocalStorage.getJSON(KEYS.DELIVERY_ADDRESS);
    const storedTime = LocalStorage.getJSON(KEYS.TIME);
    const storedPickUpAddress = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);

    setOrderType(storedOrderType);
    setDeliveryAddress(storedDeliveryAddress);
    setTime(storedTime);
    setPickUpAddress(storedPickUpAddress);
  }, [LocalStorage.getJSON(KEYS.TIME), LocalStorage.getJSON(KEYS.DINING_OPTION)]);

  const getAddress = () => {
    if (orderType === DINING_OPTION.Delivery) {
      return deliveryAddress ? getAddressLabel(deliveryAddress) : 'Select Delivery Address';
    } else {
      return pickUpAddress ? getAddressLabel(pickUpAddress) : 'Select Pickup Restaurant';
    }
  };
  const formattedAddress = () => {
    if (orderType === DINING_OPTION.Delivery) {
      return deliveryAddress ? formatAddress(deliveryAddress) : 'Select Delivery Address';
    } else {
      return pickUpAddress ? formatAddress(pickUpAddress) : 'Select Pickup Restaurant';
    }
  };

  return {
    orderType,
    time,
    formattedAddress,
    getAddress,
    locationId,
  };
};

export default useDiningOption;
