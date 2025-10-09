import * as yup from 'yup';

// Utility to compare expiry date only on month/year level
const isFutureDate = (value) => {
  if (!value) return false;
  const today = new Date();
  const selected = new Date(value);
  selected.setDate(1); // normalize day
  today.setDate(1);
  return selected >= today;
};

export const cardSchema = yup.object().shape({
  // Name on Card
  firstName: yup
    .string()
    .required('First Name is required')
    .matches(/^[a-zA-Z\s]*$/, 'First Name must contain only letters and spaces'),

  lastName: yup
    .string()
    .required('Surname is required')
    .matches(/^[a-zA-Z\s]*$/, 'Surname must contain only letters and spaces'),

  // Payment Details
  cardNumber: yup
    .string()
    .required('Card Number is required')
    .matches(/^[0-9]{16}$/, 'Card Number must be 16 digits'),

  cvv: yup
    .string()
    .required('CVV is required')
    .matches(/^[0-9]{3,4}$/, 'CVV must be 3 or 4 digits'),

  expiryDate: yup
    .date()
    .typeError('Expiry Date is required')
    .required('Expiry Date is required')
    .test('is-future-date', 'Expiry Date cannot be in the past', isFutureDate),

  // Billing Address
  streetAddress: yup.string().required('Street Address is required'),

  streetAddress2: yup.string().notRequired(),

  city: yup
    .string()
    .required('City is required')
    .matches(/^[a-zA-Z\s]*$/, 'City must contain only letters and spaces'),

  state: yup
    .string()
    .required('State is required')
    .matches(/^[a-zA-Z\s]*$/, 'State must contain only letters and spaces'),

  zipCode: yup
    .string()
    .required('Zip Code is required')
    .matches(/^[a-zA-Z0-9]{3,10}$/, 'Zip Code must be 3 to 10 characters'),
});
