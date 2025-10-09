import * as Yup from 'yup';

export const emailGiftSchema = Yup.object().shape({
  name: Yup.string()
    .required('Your name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot be longer than 50 characters'),

  giftAmount: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? null : value)) // Handle empty string by converting it to null
    .required('Gift amount is required')
    .typeError('Gift amount must be a number') // Ensures the error is clear if the input is not a valid number
    .min(5, 'Minimum amount is $5')
    .max(1000, 'Maximum amount is $1000'),

  recipientName: Yup.string()
    .required('Recipient name is required')
    .min(2, 'Recipient name must be at least 2 characters long')
    .max(50, 'Recipient name cannot be longer than 50 characters'),

  email: Yup.string().required('Recipient email is required').email('Must be a valid email format'),

  verifyEmail: Yup.string()
    .required('Please verify recipient email')
    .email('Must be a valid email format')
    .oneOf([Yup.ref('email'), null], 'Emails must match'),

  message: Yup.string()
    .min(5, 'Message must be at least 5 characters long')
    .max(200, 'Message cannot be longer than 200 characters'),
});
