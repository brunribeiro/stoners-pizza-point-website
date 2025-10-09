import * as yup from 'yup';

const loginSchema = yup
  .object({
    email: yup.string().email('Must be a valid email').required('Email is required'),

    password: yup
      .string()
      .required('Password is required')
      .transform((value, originalValue) => (originalValue ? originalValue.trim() : '')),
  })
  .noUnknown(false);

export default loginSchema;
