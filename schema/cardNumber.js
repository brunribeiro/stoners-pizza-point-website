import * as yup from 'yup';

export const cardNumber = yup.object().shape({
  cardNumber: yup
    .string()
    .required('Card Number is required')
    .matches(/^[0-9]{16}$/, 'Card Number must be 16 digits'),
});
