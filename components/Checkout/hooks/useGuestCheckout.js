import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import AppContext from '@/utils/appContext';

const schema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string(),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10,15}$/, 'Enter a valid phone number')
    .required('Phone number is required'),
});

const useGuestCheckout = (setIsGuestFormOpen) => {
  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
  });

  const { setGuestInfo } = useContext(AppContext);

  const onSubmit = (data) => {
    setGuestInfo(data);
    setIsGuestFormOpen(false);
  };

  return {
    ...form,
    onSubmit,
  };
};

export default useGuestCheckout;
