import * as yup from 'yup';

const forgotPasswordSchema = yup
  .object({
    email: yup.string().email('Must be a valid email').required('Email is required'),
  })
  .noUnknown(false);

export default forgotPasswordSchema;
