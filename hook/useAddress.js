import { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useTranslation from 'next-translate/useTranslation';
import { yupResolver } from '@hookform/resolvers/yup';

import commonApi from '@/services/api/common';
import AppContext from '@/utils/appContext';
import { getToastMessage } from '@/utils/common';
import { API_SUCCESS_RESPONSE, KEYS, SENTENCES } from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';
import addressSchema from '@/schema/address';
import Toast from '@/utils/toast';

// Global deduplication state for address list API
const addressLoadState = {
  loading: false,
  lastCall: 0,
};

const DEBOUNCE_DELAY = 500; // ms

const useAddress = ({ fromSettings }) => {
  const { deliveryAddress, loginData, setSelectedLocation, selectedAddress, setSelectedAddress } =
    useContext(AppContext);
  const [loader, setLoader] = useState({ list: false, delete: false, save: false });
  const [addressList, setAddressList] = useState([]);
  const [address, setAddress] = useState();
  const [isAddNewAddress, setIsAddNewAddress] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { t } = useTranslation('common');

  const defaultValues = {
    // houseNumber: '',
    // streetAddress: '',
    zipcode: '',
    state: '',
    country: '',
    city: '',
    label: '',
    apt: '',
    description: '',
    instruction: '',
    fullAddress: '_',
    street1: '',
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    watch,
    reset,
    control,
    formState: { errors = {} },
  } = useForm({
    defaultValues,
    resolver: yupResolver(addressSchema(t, loginData)),
  });

  // Function to handle error messages
  const handleErrorMessage = (error, defaultMessage = 'Something went wrong') => {
    const message = error?.response?.data?.message || error.message || defaultMessage;
    getToastMessage({
      status: 'error',
      message,
      code: error?.code || 'API_ERROR',
    });
    console.error('Error:', error);
  };

  const onSubmit = async (data) => {
    const { saveLocation, ...rest } = data || {};

    // Always save to both temporary and permanent storage
    LocalStorage.setJSON(KEYS.TEMP_DELIVERY_ADDRESS, data);
    LocalStorage.setJSON(KEYS.DELIVERY_ADDRESS, data);

    // Update coordinates immediately
    if (rest.lat && rest.long) {
      setSelectedLocation({
        lat: rest.lat,
        lng: rest.long,
      });
    }

    // If not saving permanently, we're done
    if (!fromSettings && !saveLocation) {
      return;
    }

    if (rest.apt === '') delete rest.apt;
    const payload = {
      ...rest,
      ...(loginData?.userId && { userId: loginData?.userId }),
    };
    payload.inst = rest.instruction || '';
    if (isEdit) {
      delete payload.fullAddress;
    }
    delete payload.instruction;
    delete payload.description;
    setLoader((prev) => ({ ...prev, save: true }));

    try {
      const response = await commonApi({
        action: isEdit ? 'editAddress' : 'addAddress',
        data: payload,
      });

      getToastMessage({
        status: response.status,
        message: response.message,
        code: response.code,
      });

      if (response.code === API_SUCCESS_RESPONSE) {
        reset(defaultValues);
        setIsAddNewAddress(false);
        setOpen(false);
        await getAddressList();
      }
    } catch (error) {
      handleErrorMessage(error, 'Failed to submit address');
    } finally {
      setLoader((prev) => ({ ...prev, save: false }));
    }
  };

  const getAddressList = async () => {
    const now = Date.now();

    // Debounce: if called within 500ms of last call, skip
    if (now - addressLoadState.lastCall < DEBOUNCE_DELAY) {
      return;
    }

    // Deduplication: if already loading, skip
    if (addressLoadState.loading) {
      return;
    }

    addressLoadState.loading = true;
    addressLoadState.lastCall = now;

    const payload = {
      ...(loginData?.userId ? { userId: loginData?.userId } : {}),
    };
    setLoader((prev) => ({ ...prev, list: true }));

    try {
      const response = await commonApi({
        action: 'addressList',
        data: payload,
      });

      if (response.code === API_SUCCESS_RESPONSE) {
        const fetchedAddressList = response.data || [];
        setAddressList(fetchedAddressList);

        const recentAddress = fetchedAddressList[fetchedAddressList.length - 1];
        if (recentAddress?.lat) {
          setAddress(recentAddress);
          // LocalStorage.setJSON(KEYS.DELIVERY_ADDRESS, recentAddress);
        }
      }
    } catch (error) {
      handleErrorMessage(error, 'Failed to fetch address list');
    } finally {
      addressLoadState.loading = false;
      setLoader((prev) => ({ ...prev, list: false }));
    }
  };

  const handleEdit = ({ id, clear = false, data }) => {
    setIsEdit(!clear);
    setSelectedAddress(data);
    try {
      if (clear) {
        Object.keys(getValues()).forEach((key) => {
          setValue(key, '');
        });
        setOpen(false);
        return;
      }

      const editAddress = addressList.find((address) => address.id === id);
      if (!editAddress) throw new Error('Address not found');

      Object.entries(editAddress).forEach(([key, value]) => {
        if (value !== null && key !== 'id' && key !== 'deviceId') {
          setValue(key, value);
        }
      });
      setOpen(true);
    } catch (error) {
      handleErrorMessage(error, 'Failed to edit address');
    }
  };

  const handleDelete = async () => {
    setLoader((prev) => ({ ...prev, delete: true }));
    const label = getValues('label');
    const data = {
      label,
      userId: loginData?.userId,
    };
    try {
      await commonApi({ action: 'deleteAddress', data });
      await getAddressList();
      setOpen(false);
    } catch (error) {
      handleErrorMessage(error, 'Failed to delete address');
    } finally {
      setLoader((prev) => ({ ...prev, delete: false }));
    }
  };

  useEffect(() => {
    if (deliveryAddress) {
      const fieldsToUpdate = {
        city: deliveryAddress?.city,
        houseNumber: deliveryAddress?.houseNumber,
        streetAddress: deliveryAddress?.formattedAddress,
        state: deliveryAddress?.state,
        country: deliveryAddress?.country,
        zipcode: deliveryAddress?.zipcode,
        lat: deliveryAddress?.lat,
        long: deliveryAddress?.long,
        description: deliveryAddress?.description,
        fullAddress: deliveryAddress?.formattedAddress,
        street1: deliveryAddress?.street1,
      };

      Object.entries(fieldsToUpdate).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [deliveryAddress]);

  useEffect(() => {
    if (loginData?.userId) getAddressList();
  }, [loginData?.userId]);

  useEffect(() => {
    if (errors.zipcode) {
      Toast.error(SENTENCES.ADDRESS_REQUIRES);
    }
  }, [errors]);

  // useEffect(() => {
  //   if (address && currentTab === SIDEBAR_TABS.delivery) {
  //     setSelectedLocation({ lat: address.lat, lng: address.long });
  //   }
  // }, [currentTab]);

  return {
    selectedAddress,
    setSelectedAddress,
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    watch,
    reset,
    errors,
    onSubmit,
    loader,
    addressList,
    address,
    setAddress,
    isAddNewAddress,
    setIsAddNewAddress,
    open,
    setOpen,
    defaultValues,
    handleEdit,
    isEdit,
    handleDelete,
    setIsEdit,
    Controller,
    control,
    setSelectedLocation,
  };
};

export default useAddress;
