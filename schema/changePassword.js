import * as yup from 'yup';

import { AUTH } from '@/utils/messages';

const changePasswordSchema = yup
  .object({
    currentPassword: yup
      .string()
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{6,}$/, AUTH.PASSWORD_VALIDATION)
      .required('Password is required')
      .transform((value, originalValue) => (originalValue ? originalValue.trim() : '')),
    newPassword: yup
      .string()
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{6,}$/, AUTH.PASSWORD_VALIDATION)
      .required('Password is required')
      .transform((value, originalValue) => (originalValue ? originalValue.trim() : '')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'Password does not match')
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{6,}$/, AUTH.PASSWORD_VALIDATION)
      .required('Confirm Password is required')
      .transform((value, originalValue) => (originalValue ? originalValue.trim() : '')),
  })
  .noUnknown(false);

export default changePasswordSchema;
