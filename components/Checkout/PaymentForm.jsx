import React from 'react';
import { Controller } from 'react-hook-form';

import DateInput from '@/widgets/DateInput';
import ControlledInput from '@/widgets/ControlledInput';

const PaymentForm = ({
  register,
  setValue,
  trigger,
  control,
  errors,
  selectedDate,
  setSelectedDate,
  editCard,
  handleSubmit,
  onSubmitCard,
}) => {
  return (
    <form
      className='p-7 primary-border rounded-3xl'
      id='addCardForm'
      onSubmit={handleSubmit(onSubmitCard)}
    >
      {!editCard ? (
        <div className='space-y-3 -mt-1'>
          {/* Name on Card Section */}
          <div>
            <h3 className='font-[800] mb-2'>Name on Card</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <ControlledInput
                mandatory={true}
                label='First Name'
                id='firstName'
                name='firstName'
                placeholder='Enter first name on the card'
                register={register}
                setValue={setValue}
                trigger={trigger}
                errors={errors}
                regex={/[^a-zA-Z ]/g}
                maxLength={20}
              />
              <ControlledInput
                mandatory={true}
                label='Surname'
                id='lastName'
                name='lastName'
                placeholder='Enter surname on the card'
                register={register}
                setValue={setValue}
                trigger={trigger}
                errors={errors}
                regex={/[^a-zA-Z ]/g}
                maxLength={20}
              />
            </div>
          </div>

          {/* Payment Details Section */}
          <div>
            <h3 className='font-[800] mb-2'>Payment Details</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <ControlledInput
                mandatory
                label='Card Number'
                id='cardNumber'
                name='cardNumber'
                placeholder='XXXX - XXXX - XXXX - XXXX'
                register={register}
                setValue={setValue}
                trigger={trigger}
                errors={errors}
                regex={/[^0-9]/g}
                maxLength={16}
                card={true}
              />
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <ControlledInput
                  mandatory
                  label='CVV'
                  id='cvv'
                  name='cvv'
                  placeholder='E.g. 123'
                  register={register}
                  setValue={setValue}
                  trigger={trigger}
                  errors={errors}
                  regex={/[^0-9]/g}
                  maxLength={4}
                />
                <Controller
                  name='expiryDate'
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      mandatory
                      label='Expiration'
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
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Billing Address Section */}
          <div>
            <h3 className='font-[800] mb-2'>Billing Address</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <ControlledInput
                mandatory
                label='Street Address'
                id='streetAddress'
                name='streetAddress'
                placeholder='Enter billing address'
                register={register}
                setValue={setValue}
                trigger={trigger}
                errors={errors}
              />
              <ControlledInput
                mandatory={false}
                label='Street Address 2 (Optional)'
                id='streetAddress2'
                name='streetAddress2'
                placeholder='Enter apartment/suite (Optional)'
                register={register}
                setValue={setValue}
                trigger={trigger}
                errors={errors}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-3'>
              <ControlledInput
                mandatory
                label='City'
                id='city'
                name='city'
                placeholder='City'
                register={register}
                setValue={setValue}
                trigger={trigger}
                errors={errors}
              />
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <ControlledInput
                  mandatory
                  label='State'
                  id='state'
                  name='state'
                  placeholder='State'
                  register={register}
                  setValue={setValue}
                  trigger={trigger}
                  errors={errors}
                />
                <ControlledInput
                  mandatory
                  label='Zipcode'
                  id='zipCode'
                  name='zipCode'
                  placeholder='Zipcode'
                  register={register}
                  setValue={setValue}
                  trigger={trigger}
                  errors={errors}
                  maxLength={10}
                  regex={/[^a-zA-Z0-9]/g}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
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
    </form>
  );
};

export default PaymentForm;
