import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useTranslation from 'next-translate/useTranslation';

import signupSchema from '@/schema/signUp';
import commonApi from '@/services/api/common';
import { getToastMessage } from '@/utils/common';
import { USER_MESSAGES } from '@/utils/constant';
import { trackSignupEvent, identifyUser } from '@/utils/analytics';
import { useRecaptcha } from '@/hooks/useRecaptcha';

const defaultValues = {
  first_name: '',
  last_name: '',
  phone: '',
  dob: '',
  password: '',
  email: '',
  howAcquired: 'THROUGH_WEB',
  // isSendEmail: false,
  // isSendText: false,
  isInvite: false,
  isReferral: false,
  referralCode: undefined,
};

const useRegister = ({ setOpenRegister = () => {}, setSeconds = () => {} }) => {
  const [loader, setLoader] = useState(false);
  const [registerData, setRegisterData] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const { t } = useTranslation('common');
  const { executeRecaptcha } = useRecaptcha();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    watch,
    reset,
    formState: { errors = {} },
  } = useForm({
    defaultValues,
    resolver: yupResolver(signupSchema(t)),
  });

  const handleLoginOpen = () => {
    setOpenRegister(false);
  };

  const addInviteEmailAndTextKeys = (registerData) => {
    const { isInvite, isReferral } = registerData;
    if (isInvite) {
      registerData.isSendEmail = true;
      registerData.isSendText = true;
    }
    delete registerData.isInvite;
    delete registerData.confirmPassword;
    delete registerData.isReferral;
    if (!isReferral) {
      delete registerData.referralCode;
    }
  };

  const onSubmit = async (registerData) => {
    addInviteEmailAndTextKeys(registerData);
    setLoader(true);
    const token = await executeRecaptcha('createAccount');
    try {
      const response = await commonApi({
        action: 'registerUser',
        data: registerData,
        ...(token && {
          config: {
            captchaToken: token,
          },
        }),
      });

      getToastMessage({
        status: response.status,
        message: response.message,
        code: response.code,
      });

      if (response.code === 'SUCCESS') {
        const data = {
          userId: response.data.userId,
          name: `${registerData.first_name || ''} ${registerData.last_name || ''}`.trim(),
          email: registerData.email,
          phone: registerData.phone,
          signup_method: 'email',
        };
        identifyUser(data);
        trackSignupEvent(data);

        reset(defaultValues);
        setOpenRegister(false);
        setSeconds(30);
        setRegisterData(USER_MESSAGES.USER_NOT_VARIFIED);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      getToastMessage({
        status: 'error',
        message: 'Registration failed, please try again.',
      });
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (watch('confirmPassword')) {
      setValue('confirmPassword', watch('confirmPassword'), {
        shouldValidate: true,
      });
    }
  }, [watch('password')]);

  return {
    handleLoginOpen,
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    errors,
    trigger,
    onSubmit,
    loader,
    registerData,
    setRegisterData,
    reset,
    defaultValues,
    selectedDate,
    setSelectedDate,
  };
};

export default useRegister;
