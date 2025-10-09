import * as yup from 'yup';

export const settingSchema = (t) =>
  yup.object().shape({
    firstName: yup.string(),
    lastName: yup.string(),
    email: yup.string().email(t`invalidEmail`),
    phoneNumber: yup.string(),
  });
