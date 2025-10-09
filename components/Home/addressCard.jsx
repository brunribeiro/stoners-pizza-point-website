import React, { useContext } from 'react';

import PersonalInfo from '../Settings/PersonalInfo';

import Input from '@/widgets/input';
import Button from '@/widgets/button';
import TextArea from '@/widgets/textarea';
import Checkbox from '@/widgets/Checkbox';
import { LocalStorage } from '@/utils/localStorage';
import { KEYS } from '@/utils/constant';
import AppContext from '@/utils/appContext';
import Toast from '@/utils/toast';
import PlacesAutocomplete from '@/components/common/PlacesAutocomplete';

const AddressCard = ({
  isEdit,
  dtAdd,
  setValue,
  errors,
  register,
  t,
  localDeliveryAddress,
  fromProfile = false,
  loginData = {},
  fromHome = false,
  isChange = false,
  sidebarRef,
  onAddressCommitted,
  forceShowForm = false,
  loader,
}) => {
  const { Controller, control, watch } = dtAdd;
  const saveLocationValue = watch('saveLocation');
  const { setUserCoordinates, selectedLocation } = useContext(AppContext);
  const hasDescription = !!watch('description');
  const showForm = forceShowForm || (!localDeliveryAddress && (selectedLocation || hasDescription));
  return (
    <div
      className={` w-full flex flex-col gap-8 sm:mb-4 px-3 sm:px-5 md:px-10 ${isChange ? '!px-6' : ''}`}
    >
      {showForm && (
        <div className='flex flex-col gap-6'>
          <PlacesAutocomplete
            placeholder={t`searchYourAddress`}
            isDelivery
            dtAdd={dtAdd}
            isChange={isChange}
            useMyLocationBtn={true}
            loader={loader}
          />

          {errors.label?.message && Toast.error(errors.label?.message)}

          <Input
            ariaLabel={t`apt`}
            placeholder={t`apt`}
            label='Apt/Unit/Suite'
            optional={true}
            rest={register('apt', {
              onChange: (event) => {
                setValue('apt', event.target.value);
              },
            })}
            clearInput={() => setValue('apt')}
            error={errors.apt?.message}
          />
          {loginData.email && saveLocationValue && (
            <Input
              label={t`nameThisAddress`}
              placeholder={t`nameThisAddress`}
              mandatory
              rest={register('label', {
                onChange: (event) => {
                  setValue('label', event.target.value);
                },
              })}
              error={errors.label?.message}
              clearInput={() => setValue('label')}
            />
          )}
          {loginData?.email && fromHome && (
            <Controller
              name='saveLocation'
              control={control}
              render={({ field }) => (
                <Checkbox
                  title='Save this Address'
                  className=''
                  labelClassName='!text-black'
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
          )}

          {!fromProfile && (
            <TextArea
              id='apt'
              label='Delivery Instruction'
              placeholder={'E.g. Please leave on the bench next to front door.'}
              inputName='instruction'
              form={{ register, formState: { errors } }}
            />
          )}

          {loginData?.email && (
            <div className='w-full flex flex-col justify-center gap-4'>
              <PersonalInfo isChange={isChange} fromHome={fromHome} />
            </div>
          )}

          {!fromProfile && (
            <div className='flex gap-2 '>
              {isEdit && (
                <Button
                  loading={dtAdd.loader.delete}
                  disabled={dtAdd.loader.delete}
                  title={t`delete`}
                  className='capitalize text-lg w-full  !font-bold'
                  onClick={dtAdd?.handleDelete}
                />
              )}
              <Button
                loading={dtAdd.loader.save}
                disabled={dtAdd.loader.save}
                title={'Use this address'}
                className='capitalize text-lg  w-full '
                onClick={() => {
                  if (sidebarRef?.current) {
                    sidebarRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                  if (dtAdd.selectedAddress) {
                    LocalStorage.setJSON(KEYS.TEMP_DELIVERY_ADDRESS, dtAdd.selectedAddress);
                    dtAdd.setSelectedLocation({
                      lat: dtAdd.selectedAddress.lat,
                      lng: dtAdd.selectedAddress.long,
                    });
                    dtAdd.setSelectedAddress();
                    setUserCoordinates({
                      lat: dtAdd.selectedAddress.lat,
                      lng: dtAdd.selectedAddress.long,
                    });
                  } else {
                    dtAdd.handleSubmit(dtAdd.onSubmit)();
                  }
                  if (typeof onAddressCommitted === 'function' && dtAdd.watch('zipcode')) {
                    onAddressCommitted();
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressCard;
