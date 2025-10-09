import { useContext, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useTranslation from 'next-translate/useTranslation';

import { settingSchema } from '@/schema/setting';
import commonApi from '@/api/common';
import { API_SUCCESS_RESPONSE } from '@/utils/constant';
import Toast from '@/utils/toast';
import AppContext from '@/utils/appContext';
import { LocalStorage } from '@/utils/localStorage';

const defaultValues = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  dateOfBirth: '',
  extendedAttributes: {
    SMS_TXN_OPT_IN: false,
    SMS_MARKETING_OPT_IN: false,
    EMAIL_OPT_IN: false,
  },
};

const useSettingForm = () => {
  const [loader, setLoader] = useState({ userForm: false });
  const [profileData, setProfileData] = useState();
  const { loginData } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openPreferenceDetail, setOpenPreferenceDetail] = useState(false);
  const [openDietDetail, setOpenDietDetail] = useState(false);
  const [dietSelected, setDietSelected] = useState('');
  const [allergySelected, setAllergySelected] = useState('');
  const [masterList, setMasterList] = useState([]);
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    reset,
    formState: { errors = {}, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(settingSchema(t)),
  });

  const getProfile = async () => {
    setLoader({ userForm: true });

    try {
      const response = await commonApi({ action: 'profile' });

      if (response.code === API_SUCCESS_RESPONSE) {
        const profileData = response.data || {};
        setProfileData(profileData);

        // Set values using a loop, with safe access
        Object.entries(defaultValues).forEach(([key]) => {
          if (Object.hasOwn(profileData, key)) {
            setValue(key, profileData[key] || '');
          }
        });

        // Handle nested attributes
        Object.entries(profileData.extendedAttributes || {}).forEach(([key, value]) => {
          if (Object.hasOwn(defaultValues.extendedAttributes, key)) {
            const booleanValue = value === 'true';
            setValue(`extendedAttributes.${key}`, booleanValue);
          }
        });

        setSelectedDate(profileData.dateOfBirth || null);
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      Toast.error('Failed to fetch profile data. Please try again.'); // Inform the user
    } finally {
      setLoader({ userForm: false });
    }
  };

  const fetchMasters = async (code) => {
    setLoader({ master: true });

    try {
      const response = await commonApi({ action: 'getMasterList', data: { code } });

      if (response.code === API_SUCCESS_RESPONSE) {
        const masterList = response.data || [];
        setMasterList(masterList);
      }
    } catch (error) {
      console.error('Failed to fetch master list:', error);
      Toast.error('Failed to fetch master list. Please try again.'); // Inform the user
    } finally {
      setLoader({ master: false });
    }
  };

  // Add this function inside the hook
  const saveDietarySelection = () => {
    setValue('extendedAttributes.DIETARY_PREFERENCES', dietSelected, { shouldDirty: true });
  };

  const saveAllergySelection = () => {
    setValue('extendedAttributes.ALLERGIES', allergySelected, { shouldDirty: true });
  };

  useEffect(() => {
    if (loginData.token) {
      getProfile();
    }
  }, [loginData?.token]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      gender: data.gender?.value,
      // allergy: data.allergy?.value,
      // dietPreferences: data.dietPreferences?.value,
      howAcquired: profileData?.howAcquired,
      status: profileData?.status,
      baseLanguagePreference: profileData?.baseLanguagePreference,
      userId: profileData?.userId,
      accountAliasId: profileData?.accountAliasId,
      clientId: profileData?.clientId,
      dateOfBirth: selectedDate,
    };

    setLoader({ userForm: true });

    try {
      const { message } = await commonApi({
        action: 'updateProfile',
        data: payload,
      });

      Toast.success(message);
      LocalStorage.set('UserName', data.firstName);
      reset(data);
    } catch (error) {
      console.error('error', error);
      Toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoader({ userForm: false });
    }
  };

  return {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    trigger,
    onSubmit,
    loader,
    reset,
    defaultValues,
    selectedDate,
    setSelectedDate,
    isDirty,
    profileData,
    openPreferenceDetail,
    setOpenPreferenceDetail,
    openDietDetail,
    setOpenDietDetail,
    dietSelected,
    setDietSelected,
    saveDietarySelection,
    allergySelected,
    setAllergySelected,
    saveAllergySelection,
    masterList,
    fetchMasters,
    setMasterList,
  };
};

export default useSettingForm;
