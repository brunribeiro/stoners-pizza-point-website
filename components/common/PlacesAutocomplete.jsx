import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Tooltip } from 'react-tooltip';

import SmallLoader from './SmallLoader';

import Input from '@/widgets/input';
import AppContext from '@/utils/appContext';
import LocationIcon from '@/icons/locationIcon';
import { KEYS } from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';
import { placesSessionKey, buildAddressDataFromGeoResults } from '@/utils/helper';
import { useRestaurantCtx } from '@/contexts/restaurantContext';
const PlacesAutocomplete = forwardRef(
  (
    {
      placeholder,
      rest,
      isPickUp = false,
      isDelivery = false,
      dt,
      dtAdd,
      error,
      isChange = false,
      setSelectedAddress = () => {},
      currentTab,
      setMyLocationTriggered = () => {},
      className,
      autoInitialize = false,
      loader = false,
      useMyLocationBtn = false,
    },
    ref,
  ) => {
    const { setSelectedLocation, setDeliveryAddress, setIsAutoComplete, deliveryAddress } =
      useContext(AppContext);
    const {
      setPickupCoord,
      setDeliveryCoord,
      loadSearchByPickup,
      loadSearchByDelivery,
      resetPickupSearch,
      resetDeliverySearch,
    } = useRestaurantCtx();

    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({ debounce: 300 });

    const [hasInteracted, setHasInteracted] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);

    const handleKeyDown = (e) => {
      if (!data?.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((prev) => (prev < data.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : data.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightIndex >= 0) {
          const selected = data[highlightIndex];
          handleSelect({
            description: `${selected.structured_formatting.main_text}, ${selected.structured_formatting.secondary_text}`,
          })();
        }
      } else {
        // nothing
      }
    };

    useEffect(() => {
      setHighlightIndex(-1);
    }, [data]);

    const sessionKey = useMemo(() => placesSessionKey(isPickUp), [isPickUp]);

    useEffect(() => {
      const initializeLocation = async () => {
        const savedAddress = sessionStorage.getItem(sessionKey);
        if ((isPickUp || autoInitialize) && savedAddress) {
          setValue(savedAddress, false);
          if (isPickUp && dt?.setPickupInputValue) {
            dt.setPickupInputValue(savedAddress);
            try {
              const { lat, lng } = await fetchCoordinates(savedAddress);
              saveLocationCoordinate({ lat, lng });
            } catch (error) {
              console.error('Geolocation error:', error);
            }
          } else {
            try {
              const { lat, lng } = await fetchCoordinates(savedAddress);
              saveLocationCoordinate({ lat, lng });
              saveLocationDetail({ description: savedAddress, lat, long: lng }, savedAddress);
            } catch {
              saveLocationDetail({ description: savedAddress }, savedAddress);
            }
          }
        } else if (autoInitialize) {
          await fetchLocationAndSaveToSession();
        } else {
          //nothing
        }
      };
      initializeLocation();
    }, [isPickUp, currentTab, autoInitialize, sessionKey]);

    useEffect(() => {
      if (hasInteracted) return;
      const saved = sessionStorage.getItem(sessionKey);
      const target = isPickUp
        ? saved || dt?.pickupInputValue || ''
        : deliveryAddress?.description || '';
      if (!target) return;
      if (target !== value) {
        setValue(target, false);
        clearSuggestions();
      }
    }, [
      currentTab,
      sessionKey,
      isPickUp,
      dt?.pickupInputValue,
      deliveryAddress?.description,
      clearSuggestions,
      setValue,
      value,
      hasInteracted,
    ]);

    useImperativeHandle(ref, () => ({
      clearInput,
      handleUseMyLocation,
      initializeFromSession,
    }));

    const initializeFromSession = async () => {
      const savedAddress = sessionStorage.getItem(sessionKey);
      if (savedAddress) {
        setValue(savedAddress, false);
        clearSuggestions();
        try {
          const { lat, lng } = await fetchCoordinates(savedAddress);
          saveLocationCoordinate({ lat, lng });
          saveLocationDetail({ description: savedAddress, lat, long: lng }, savedAddress);
        } catch {
          saveLocationDetail({ description: savedAddress }, savedAddress);
        }
        return true;
      }
      return await fetchLocationAndSaveToSession();
    };

    const fetchLocationAndSaveToSession = async () => {
      try {
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true }),
        );
        const { latitude: lat, longitude: lng } = position.coords;
        const geoResults = await getGeocode({ location: { lat, lng } });
        if (!geoResults.length) return false;

        const formattedAddress = geoResults[0].formatted_address;

        sessionStorage.setItem(sessionKey, formattedAddress);
        setValue(formattedAddress, false);
        saveLocationCoordinate({ lat, lng });

        const addressData = buildAddressDataFromGeoResults(geoResults, lat, lng);
        saveLocationDetail(addressData, formattedAddress);
        clearSuggestions();
        return true;
      } catch (error) {
        console.error('Geolocation error:', error);
        return false;
      }
    };

    const handleInput = (e) => {
      setHasInteracted(true);
      setValue(e.target.value);
      clearSuggestions();
      if (isPickUp) {
        dt.setPickupInputValue('');
        if (!dt.pickupInputValue) dt.setPickupLocation();
      }
    };

    const handleSelect =
      ({ description }) =>
      async () => {
        try {
          // mark that user explicitly selected a place so pickup search flow triggers
          setMyLocationTriggered(true);
          setValue(description, false);
          clearSuggestions();
          sessionStorage.setItem(sessionKey, description);

          const { lat, lng } = await fetchCoordinates(description);
          saveLocationCoordinate({ lat, lng });

          const addressData = await fetchAddressDetails(lat, lng);
          addressData.description = description;
          saveLocationDetail(addressData, description);
        } catch {
          sessionStorage.setItem(sessionKey, description);
          saveLocationDetail({ description }, description);
        }
      };

    const handleUseMyLocation = async () => {
      // Always use live geolocation for "Use My Location"
      setMyLocationTriggered(true);
      await fetchLocationAndSaveToSession();
    };

    const clearInput = () => {
      setHasInteracted(true);
      setValue('');
      setSelectedAddress(null);
      setSelectedLocation(null);
      sessionStorage.removeItem(sessionKey);

      if (isPickUp) {
        dt.setPickupInputValue('');
        dt.setPickupLocation();
        setPickupCoord(undefined);
        resetPickupSearch();
      } else if (isDelivery) {
        // Also clear stored delivery address so input doesn't repopulate
        LocalStorage.remove(KEYS.TEMP_DELIVERY_ADDRESS);
        setDeliveryAddress(undefined);
        dtAdd?.reset(dtAdd?.defaultValues);
        setDeliveryCoord(undefined);
        resetDeliverySearch();
      } else {
        //nothing
      }
    };

    const fetchCoordinates = async (address) => {
      const results = await getGeocode({ address });
      return getLatLng(results[0]);
    };

    const fetchAddressDetails = async (lat, lng) => {
      const geoResults = await getGeocode({ location: { lat, lng } });
      return buildAddressDataFromGeoResults(geoResults, lat, lng);
    };

    const saveLocationCoordinate = useCallback(
      (coordinate) => {
        if (isPickUp) {
          dt.setPickupLocation(coordinate);
          setPickupCoord(coordinate);
          // trigger debounced pickup search with latest coordinate
          loadSearchByPickup(coordinate);
        } else {
          setSelectedLocation(coordinate);
          setDeliveryCoord(coordinate);
          // trigger debounced delivery search with latest coordinate
          loadSearchByDelivery(coordinate);
        }
      },
      [
        dt,
        isPickUp,
        setSelectedLocation,
        setPickupCoord,
        setDeliveryCoord,
        loadSearchByPickup,
        loadSearchByDelivery,
      ],
    );

    const saveLocationDetail = useCallback(
      (addressData = {}, description = '') => {
        if (isPickUp) {
          dt.setPickupInputValue(description);
        } else {
          setDeliveryAddress(addressData);
          setIsAutoComplete({ lat: addressData?.lat, long: addressData?.long });
        }
      },
      [dt, isPickUp, setDeliveryAddress, setIsAutoComplete],
    );

    const renderSuggestions = () =>
      data.map(({ place_id, structured_formatting: { main_text, secondary_text } }, idx) => (
        <button
          key={place_id}
          onClick={handleSelect({ description: `${main_text}, ${secondary_text}` })}
          className={`w-full text-left p-2 cursor-pointer block ${
            highlightIndex === idx ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
          }`}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </button>
      ));

    const savedFromSession =
      typeof window !== 'undefined' ? sessionStorage.getItem(sessionKey) : '';
    const deliveryText = deliveryAddress?.description || deliveryAddress?.streetAddress || '';
    const inputValue = hasInteracted
      ? value
      : value && value.length > 0
        ? value
        : isPickUp
          ? savedFromSession || dt?.pickupInputValue || ''
          : deliveryText;

    return (
      <>
        <div className='relative' ref={ref}>
          <Input
            className={`!rounded-full bg-white border-light-border ${isChange ? '!h-[45px] min-h-[45px]' : ''} ${className}`}
            value={inputValue}
            error={error && 'Address is Required'}
            onChange={handleInput}
            disabled={!ready}
            clearInput={clearInput}
            placeholder={inputValue ? '' : placeholder}
            ariaLabel={placeholder}
            onKeyDown={handleKeyDown}
            {...rest}
          />

          {!inputValue && (
            <button
              onClick={handleUseMyLocation}
              data-tooltip-id='your-location'
              data-tooltip-content='Your Location'
              aria-label='Use your current location'
              className={`absolute text-black hover:text-primary bg-white duration-300 right-5 top-4 ${
                isChange ? '!top-[16px] !right-4' : ''
              }`}
            >
              <LocationIcon />
              <Tooltip id='your-location' />
            </button>
          )}

          {loader && (
            <div
              className={`absolute text-black hover:text-primary bg-white duration-300 right-[13px] top-[13px] ${isChange ? '!top-[12px] !right-3' : ''}`}
            >
              <SmallLoader />
            </div>
          )}

          {status === 'OK' && hasInteracted && (
            <ul className='p-2 border rounded-md mt-1 absolute w-full bg-white z-10'>
              {renderSuggestions()}
            </ul>
          )}
          {useMyLocationBtn && (
            <button
              className='ml-4 mt-2 text-primary underline text-sm cursor-pointer'
              onClick={handleUseMyLocation}
            >
              Use My Location
            </button>
          )}
        </div>
      </>
    );
  },
);

PlacesAutocomplete.displayName = 'PlacesAutocomplete';
export default PlacesAutocomplete;
