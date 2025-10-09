import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { setCookie } from 'cookies-next';
import getConfig from 'next/config';

import commonApi from '@/services/api/common';
import Toast from '@/utils/toast';
import { getToastMessage } from '@/utils/common';
import loginSchema from '@/schema/login';
import { DEFAULT_NEXT_API_HEADER, KEYS, USER_MESSAGES } from '@/utils/constant';
// import { LocalStorage } from '@/utils/localStorage';
import AppContext from '@/utils/appContext';
import { LocalStorage } from '@/utils/localStorage';
import { trackLoginEvent, identifyUser } from '@/utils/analytics';

const { publicRuntimeConfig } = getConfig();

const defaultValues = {
  password: '',
  email: '',
};

const useLogin = ({
  setOpenRegister = () => {},
  seconds,
  setSeconds,
  setOpenSignInModal = () => {},
  getCartCount = () => {},
}) => {
  const [loader, setLoader] = useState(false);
  const { setLoginData } = useContext(AppContext);
  const [isVerified, setIsVerified] = useState(false);
  // const [isForgetPassword, setIsForgetPassword] = useState(false);

  const {
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
    resolver: yupResolver(loginSchema),
  });

  const handleSignUpOpen = () => {
    setOpenRegister(true);
  };
  const storeSessionData = async (token, data) => {
    await fetch('/api/login', {
      method: 'POST',
      headers: DEFAULT_NEXT_API_HEADER,
      body: JSON.stringify({
        token: token,
        user: {
          firstName: data.firstName,
          lastName: data.lastName,
          userId: data.userId,
          accountAliasId: data.accountAliasId,
          clientId: data.clientId,
          email: data.email,
          phoneNumber: data.phoneNumber,
          baseLanguagePrefrerence: data.baseLanguagePrefrerence,
          status: data.status,
          howAcquired: data.howAcquired,
          extendedAttributes: data.extendedAttributes,
          isLogin: true,
        },
      }),
    }).then(({ ok }) => {
      if (ok) {
        // setRedirection(data);
        const userData = { token, data };
        // LocalStorage.setJSON('userData', userData);
        window.sessionStorage.setItem('userData', JSON.stringify(userData));
      }
      return setLoader(false);
    });
  };

  const onSubmit = async (loginData) => {
    setLoader(true);
    let token;
    if (publicRuntimeConfig.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY) {
      token = await window.grecaptcha.execute(publicRuntimeConfig.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY, {
        action: 'login',
      });
    }

    try {
      const response = await commonApi({
        action: 'signInUser',
        data: loginData,
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
      if (response.message === USER_MESSAGES.USER_NOT_VARIFIED) {
        setIsVerified(response.message);
      }
      if (response.code === 'SUCCESS') {
        const expiry = Math.floor(Date.now() / 1000 + response.data.expires_in);
        setCookie(KEYS.REFRESHTOKEN, response.data.refresh_token);
        setCookie(KEYS.TOKEN, response.data.access_token);
        setCookie(KEYS.EXPIRES, expiry);
        const result = await commonApi({
          action: 'profile',
        });
        if (result.code === 'SUCCESS') {
          const userData = {
            ...result.data,
            token: response?.data?.access_token,
            refresh_token: response?.data?.refresh_token,
            expires_in: expiry,
          };
          setLoginData(userData);

          // Track successful login
          const data = {
            userId: result.data.userId,
            name: `${result.data.firstName || ''} ${result.data.lastName || ''}`.trim(),
            email: result.data.email,
            phone: result.data.phoneNumber,
            login_method: 'email',
            // session_id: response.data.access_token,
            login_status: 'success',
          };
          identifyUser(data);
          trackLoginEvent(data);

          LocalStorage.setJSON(KEYS.USER_ID, result.data.id);
          await storeSessionData(userData.token, result.data);
          reset(defaultValues);
          getCartCount();
          setOpenSignInModal(false);
        }
      } else {
        Toast(response.message, 'error');
      }
    } catch (err) {
      console.error('Error:', err);
      // Toast.error("An error occurred. Please try again.", "error");
      trackLoginEvent({
        email: loginData.email,
        login_method: 'email',
        login_status: 'failure',
        failure_reason: err?.message || 'Unknown error occurred',
      });
    } finally {
      setLoader(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    setSeconds(30);
    await commonApi({
      action: 'resendverificationmail',
      parameters: [getValues('email')],
    })
      .then((data) => {
        getToastMessage({
          status: data.status,
          message: data.message,
          code: data.code,
        });
        // if(data.code === "SUCCESS"){

        // }
        // setAboutUs(data?.[0])
        return setLoader(false);
      })
      .finally(() => setLoader(false));
  };

  return {
    handleSignUpOpen,
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    watch,
    onSubmit,
    errors,
    loader,
    handleResendVerificationEmail,
    seconds,
    setSeconds,
    isVerified,
    reset,
    defaultValues,
  };
};

export default useLogin;
