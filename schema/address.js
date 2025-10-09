import * as yup from 'yup';

const addressSchema = (t) =>
  yup
    .object({
      zipcode: yup.string().required(t`zipReq`),
      state: yup.string().required(t`stateReq`),
      saveLocation: yup.boolean(),
      label: yup.string().when('saveLocation', {
        is: true,
        then: (schema) => schema.required(t`label`),
        otherwise: (schema) => schema.notRequired(),
      }),
    })
    .noUnknown(false);

export default addressSchema;
