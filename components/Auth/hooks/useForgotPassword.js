import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import commonApi from '@/api/common';
import { getToastMessage } from '@/utils/common';
import forgotPasswordSchema from '@/schema/forgotPassword';
import { API_SUCCESS_RESPONSE } from '@/utils/constant';

const defaultValues = {
  email: '',
};

const useForgotPassword = () => {
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isMailSent, setIsMailSent] = useState(false);
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
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoader(true);

    try {
      const response = await commonApi({
        action: 'forgotPassword',
        parameters: [data.email],
      });

      getToastMessage({
        status: response.status,
        message: response.message,
        code: response.code,
      });

      if (response.code === API_SUCCESS_RESPONSE) {
        setIsMailSent(true);
      }
    } catch (e) {
      console.error('Forgot password error', e);
    } finally {
      setLoader(false);
    }
  };

  return {
    onSubmit,
    isForgetPassword,
    setIsForgetPassword,
    register,
    setValue,
    getValues,
    trigger,
    watch,
    reset,
    errors,
    handleSubmit,
    loader,
    isMailSent,
  };
};

export default useForgotPassword;
