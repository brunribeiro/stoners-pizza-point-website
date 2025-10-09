import React from 'react';
import { Controller } from 'react-hook-form';

import DateInput from '@/widgets/DateInput';
import ControlledInput from '@/widgets/ControlledInput';

const AddCardForm = ({
  register,
  setValue,
  trigger,
  control,
  errors,
  selectedDate,
  setSelectedDate,
  editCard,
}) => {
  return (
    <>
      {!editCard ? (
        <div className='p-8  mx-auto space-y-6'>
          <div>
            <ControlledInput
              mandatory={true}
              label={'Name on Card'}
              id='firstName'
              name='firstName'
              placeholder='Enter name on the card'
              register={register}
              setValue={setValue}
              trigger={trigger}
              errors={errors}
              regex={/[^a-zA-Z0-9 ]/g}
              maxLength={20}
              className='w-full border  px-4 py-2 placeholder-gray-400'
            />
          </div>

          <div>
            <ControlledInput
              mandatory={true}
              label={'Card Number'}
              id='cardNumber'
              name='cardNumber'
              placeholder='XXXX - XXXX - XXXX - XXXX'
              register={register}
              setValue={setValue}
              trigger={trigger}
              errors={errors}
              regex={/[^0-9]/g}
              maxLength={16}
              className='w-full border  px-4 py-2 placeholder-gray-400'
              card={true}
            />
          </div>

          <div className='flex gap-4'>
            <div className='w-1/2'>
              <ControlledInput
                mandatory={true}
                label={'CVV'}
                id='cvv'
                name='cvv'
                placeholder='E.g. 123'
                register={register}
                setValue={setValue}
                trigger={trigger}
                errors={errors}
                regex={/[^0-9]/g}
                maxLength={4}
                className='w-full border px-4 py-2 placeholder-gray-400'
              />
            </div>

            <div className='w-1/2'>
              <Controller
                name='expiryDate'
                control={control}
                render={({ field }) => (
                  <DateInput
                    mandatory={true}
                    label={'Expiration'}
                    id='expiryDate'
                    selectedDate={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      field.onChange(date);
                      trigger('expiryDate');
                    }}
                    error={errors.expiryDate?.message}
                    displayFormat='MM/yyyy'
                    submissionFormat='YYYY-MM'
                    placeholder='MM/YYYY'
                    className='w-full border px-4 py-2 placeholder-gray-400'
                  />
                )}
              />
            </div>
          </div>
          <ControlledInput
            mandatory={true}
            name='zipCode'
            label='Zip Code'
            placeholder='Zip Code'
            register={register}
            setValue={setValue}
            trigger={trigger}
            errors={errors}
            maxLength={10}
            regex={/[^a-zA-Z0-9]/g}
          />
        </div>
      ) : (
        <div className='p-8  mx-auto space-y-6'>
          <ControlledInput
            mandatory
            name='nickName'
            placeholder='Nick Name'
            label='Nick name'
            register={register}
            setValue={setValue}
            trigger={trigger}
            errors={errors}
            regex={/[^ a-z]/gi}
          />
        </div>
      )}
    </>
  );
};

export default AddCardForm;
