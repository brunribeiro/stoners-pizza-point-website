import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

import PreferenceButton from './PreferenceButton';
import AllergySelector from './AllergySelector';
import DietarySelector from './DeitarySeletor';

import Input from '@/widgets/input';
import DrawerWrapper from '@/shared/drawer';
import { SPACE_REMOVE_REGEX } from '@/utils/constant';
import Button from '@/widgets/button';

const SettingsForm = ({ dt, className = '' }) => {
  const { t } = useTranslation('common');

  return (
    <form onSubmit={dt.handleSubmit(dt.onSubmit)} className='flex flex-col gap-y-4'>
      <div className='grid  sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-y-4 gap-x-5'>
        <Input
          className={className}
          ariaLabel={t`firstName`}
          placeholder={t`firstName`}
          label={t`firstName`}
          rest={dt.register('firstName', {
            onChange: (event) => {
              event.target.value = event.target.value.replaceAll(/[^ a-z]/gi, '');
              dt.setValue('firstName', event.target.value);
            },
          })}
          error={dt.errors.firstName?.message}
        />
        <Input
          className={className}
          ariaLabel={t`lastName`}
          label={t`lastName`}
          placeholder={t`lastName`}
          rest={dt.register('lastName', {
            onChange: (event) => {
              event.target.value = event.target.value.replaceAll(/[^ a-z]/gi, '');
              dt.setValue('lastName', event.target.value);
            },
          })}
          error={dt.errors.lastName?.message}
        />
        <Input
          className={className}
          ariaLabel={t`emailAddress`}
          label={t`emailAddress`}
          placeholder={t`emailAddress`}
          disabled
          rest={dt.register('email', {
            onChange: (event) => {
              dt.setValue(
                'email',
                event.target.value?.replace(SPACE_REMOVE_REGEX, '')?.toLowerCase(),
              );
            },
          })}
          error={dt.errors.email?.message}
        />
        <Input
          className={className}
          ariaLabel={t`phoneNumber`}
          label={t`phoneNumber`}
          placeholder={t`phoneNumber`}
          rest={dt.register('phoneNumber', {
            onChange: (event) => {
              event.target.value = event.target.value.replaceAll(/\D/gi, '');
              dt.setValue('phoneNumber', event.target.value);
            },
          })}
          error={dt.errors.phoneNumber?.message}
        />
        {/* <RHFDatePicker
          label={t`birthday`}
          control={dt.control}
          name='dateOfBirth'
          error={dt.errors.dateOfBirth}
          displayFormat='dd/MM/yyyy'
          placeholder={t`signUp.birthday`}
          maxDate={new Date()}
        /> */}

        {/* <Dropdown
        name='gender'
        control={dt.control}
        placeholder='Gender'
        options={staticGenderOptions} // Pass static options here
        error={dt.errors.gender?.message}
      /> */}
      </div>
      <PreferenceButton dt={dt} />
      <div className='flex items-center group group-hover:cursor-pointer  gap-2 mb-5'>
        <input
          type='checkbox'
          id='remember'
          name='remember'
          className='w-4 h-4 rounded-lg opacity-0 group-hover:cursor-pointer border-[#ccc] block peer'
        />
        <span className='custom-checkbox  mb-[2px] peer-checked:!bg-primary peer-checked:!border-primary'></span>
        <label className='text-sm' htmlFor='remember'>
          <span className='text-black text-opacity-40 group-hover:text-primary group-hover:cursor-pointer'>{t`iAgreeToThe`}</span>
          <Link
            href='/terms-and-condition'
            className='text-foreground group-hover:text-primary group-hover:cursor-pointer font-bold ml-1 underline underline-offset-2'
          >
            Terms of use
          </Link>
        </label>
      </div>

      <div className='pb-3 flex items-center justify-between'>
        <span className='font-bold'> </span>
        <Button title='Update' disabled={!dt.isDirty} type='submit' className='!py-1  !text-sm' />
      </div>

      <DrawerWrapper
        visible={dt.openPreferenceDetail}
        onVisible={dt.setOpenPreferenceDetail}
        BlackTheme={true}
        widthClass='w-full sm:w-[480px]'
        title='Allergy Preferences'
        arrow={false}
        modalFooter={
          <div className='flex justify-between gap-4 items-center px-2 -mt-1 w-full'>
            <Button
              className='text-xl w-full !py-2'
              title='Save Changes'
              onClick={() => {
                if (dt.saveAllergySelection) dt.saveAllergySelection();
                dt.setOpenPreferenceDetail(false);
              }}
            />
          </div>
        }
        onclose={() => {
          dt.setOpenPreferenceDetail(false);
          dt.setAllergySelected('');
        }}
      >
        <AllergySelector dt={dt} />
      </DrawerWrapper>

      <DrawerWrapper
        visible={dt.openDietDetail}
        onVisible={dt.setOpenDietDetail}
        BlackTheme={true}
        widthClass='w-full sm:w-[480px]'
        title='Dietary Preferences'
        arrow={false}
        modalFooter={
          <div className='flex justify-between gap-4 items-center px-2 -mt-1 w-full'>
            <Button
              className='text-xl w-full !py-2'
              title='Save Changes'
              onClick={() => {
                dt.saveDietarySelection();
                dt.setOpenDietDetail(false);
              }}
            />
          </div>
        }
        onclose={() => {
          dt.setOpenDietDetail(false);
          dt.setDietSelected('');
        }}
      >
        <DietarySelector dt={dt} />
      </DrawerWrapper>
    </form>
  );
};

export default SettingsForm;
