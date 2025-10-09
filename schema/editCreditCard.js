import * as yup from 'yup';

export const editCardSchema = yup.object().shape({
  nickName: yup.string().required('Nick name is required'),

  // .matches(/^[a-zA-Z\s]*$/, 'Nick name must contain only letters and spaces'),
});
