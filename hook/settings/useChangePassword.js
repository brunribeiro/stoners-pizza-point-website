import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import commonApi from '@/api/common';
import { getToastMessage } from '@/utils/common';
import { API_SUCCESS_RESPONSE } from '@/utils/constant';
import changePasswordSchema from '@/schema/changePassword';

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const useChangePassword = () => {
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    watch,
    reset,
    formState: { errors = {}, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    const payload = {
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
    setLoader(true);

    try {
      const response = await commonApi({
        action: 'changePassword',
        data: payload,
      });

      getToastMessage({
        status: response.status,
        message: response.message,
        code: response.code,
      });

      if (response.code === API_SUCCESS_RESPONSE) {
        reset(); // Reset the form after successful submission
      }
    } catch (error) {
      getToastMessage({
        status: 'error',
        message: error.message || 'Something went wrong',
      });
    } finally {
      setOpen(false);
      setLoader(false);
    }
  };

  return {
    open,
    setOpen,
    onSubmit,
    register,
    setValue,
    getValues,
    trigger,
    watch,
    reset,
    errors,
    handleSubmit,
    loader,
    isDirty,
  };
};

export default useChangePassword;
