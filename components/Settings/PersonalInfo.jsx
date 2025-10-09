import React, { useContext, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import AddressCard from '../Home/addressCard';
import PlacesAutocomplete from '../common/PlacesAutocomplete';

import DrawerWrapper from '@/shared/drawer';
import EditIcon from '@/icons/EditIcon';
import useAddress from '@/hook/useAddress';
import Location from '@/shared/location';
import AppContext from '@/utils/appContext';
import Button from '@/widgets/button';
import CheckRoundIcon from '@/icons/CheckRoundIcon';
import { SENTENCES } from '@/utils/constant';

const PersonalInfo = ({ fromSettings = false, fromHome = false }) => {
  const [currentTab, setCurrentTab] = useState(1);

  const { isLoadedMap } = useContext(AppContext);
  const { t } = useTranslation('common');

  const {
    open,
    setOpen,
    setValue,
    register,
    errors,
    addressList,
    handleEdit,
    selectedAddress,
    setSelectedAddress,
    setSelectedLocation,
    isEdit,
    ...dtAdd
  } = useAddress({
    currentTab,
    setCurrentTab,
    fromSettings: fromSettings,
    fromHome: fromHome,
  });

  const containerClasses = fromSettings
    ? 'max-w-full grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-y-4 gap-x-5'
    : 'w-full';

  return (
    <>
      {addressList?.length > 0 ? (
        <div>
          <h2 className='text-xl font-stone uppercase'>Or, Choose Saved Addresses</h2>
        </div>
      ) : (
        <></>
      )}
      <div className={`${!fromSettings && 'w-full flex flex-col items-end'}`}>
        <div className={containerClasses}>
          {addressList?.map((address, index) => (
            <button
              key={address.id + index}
              className={`primary-border cursor-default !border-light-gray rounded-xl py-3 px-4 w-full flex items-center justify-between ${!fromSettings && 'mb-4'}`}
              onClick={() => {
                if (!fromSettings) {
                  setSelectedAddress(address);
                  // LocalStorage.setJSON(KEYS.DELIVERY_ADDRESS, address);
                }
              }}
            >
              <div className='flex flex-col'>
                <span className='font-bold text-left'>{address.label}</span>
                {fromSettings && (
                  <span className='text-sm text-gray-700 line-clamp-2 text-left'>
                    {[address.houseNumber, address.apt, address.city, address.zipCode]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                )}
              </div>
              {fromSettings ? (
                <button
                  type='button'
                  className='hover:text-gray-700 text-primary'
                  onClick={() => {
                    handleEdit({ id: address.id, data: address });
                  }}
                >
                  <EditIcon />
                </button>
              ) : selectedAddress?.id === address.id ? (
                <CheckRoundIcon size='28' green />
              ) : (
                <div
                  className={
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center border-gray-400  m-[2px]'
                  }
                ></div>
              )}
            </button>
          ))}
        </div>

        {fromSettings &&
          (addressList.length ? (
            <button
              onClick={() => setOpen(true)}
              className={` text-primary hover:text-dark-primary mt-2 ${!fromSettings && 'text-right w-36 !mt-0'}`}
            >
              <span className='mr-1 font-medium text-xl'>+</span>
              <span className='text-[14px] underline  underline-offset-2'>{t`addNewAddress`}</span>
            </button>
          ) : (
            <div className='flex flex-col items-center  p-4'>
              <div>{SENTENCES.NO_ADDRESS}</div>
              <div className='flex'>
                <button
                  onClick={() => setOpen(true)}
                  className={` text-primary hover:text-dark-primary mt-2 ${!fromSettings && 'text-right w-36 !mt-0'}`}
                >
                  <span className='mr-1 font-medium text-xl'>+</span>
                  <span className='text-[14px] underline  underline-offset-2'>{t`addNewAddress`}</span>
                </button>
              </div>
            </div>
          ))}

        <DrawerWrapper
          visible={open}
          onVisible={setOpen}
          widthClass='w-full sm:w-[480px]'
          title='Add Address'
          arrow={false}
          modalFooter={
            <div className='flex gap-2 w-full'>
              {isEdit && (
                <Button
                  loading={dtAdd.loader.delete}
                  disabled={dtAdd.loader.delete}
                  title={t`delete`}
                  className='capitalize text-lg  w-full !px-4 '
                  onClick={() => {
                    dtAdd?.handleDelete();
                    setSelectedLocation(null);
                  }}
                />
              )}
              <Button
                loading={dtAdd.loader.save}
                disabled={dtAdd.loader.save}
                title={'Save address'}
                className='capitalize text-lg  w-full !px-4 '
                onClick={() => {
                  dtAdd.handleSubmit(dtAdd.onSubmit)();
                  setSelectedLocation(null);
                }}
              />
            </div>
          }
          onclose={() => {
            setSelectedLocation(null);
            handleEdit({ id: null, clear: true });
          }}
        >
          <div className='h-[300px] '>
            <Location showMap={true} currentTab={1} address={selectedAddress} fromAddress={true} />
          </div>
          <div className='mx-7 mt-5'>
            <PlacesAutocomplete
              key={isLoadedMap}
              placeholder={t`searchYourAddress`}
              isDelivery={true}
              dtAdd={dtAdd}
              error={errors.country?.message}
              descValue={dtAdd.watch('description')}
            />
          </div>
          <AddressCard
            dtAdd={dtAdd}
            setValue={setValue}
            register={register}
            errors={errors}
            isLoadedMap
            t={t}
            isEdit={isEdit}
            fromProfile={true}
          />
        </DrawerWrapper>
      </div>
    </>
  );
};

export default PersonalInfo;
