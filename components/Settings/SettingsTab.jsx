import React from 'react';
import useTranslation from 'next-translate/useTranslation';

import MyCards from '../MyCards';

import SettingsForm from './SettingsForm';
import PersonalInfo from './PersonalInfo';
import PasswordSettings from './PasswordSettings';
import DeleteAccount from './DeleteAccount';
// import OrderSMS from './OrderSMS';

const Section = ({ id, title, children, last }) => (
  <div
    id={id}
    className={`w-full pb-10 mb-7 scroll-mt-24 ${last ? '' : 'border-b-2 border-gray-200'}`}
  >
    {title && <div className='uppercase font-stone text-xl mb-4'>{title}</div>}
    {children}
  </div>
);

const SettingsTab = ({ dtSetting }) => {
  const { t } = useTranslation('common');

  return (
    <div className='w-full'>
      <Section id='general' title={t`customerInfo`}>
        <SettingsForm dt={dtSetting} />
      </Section>

      <Section id='change-password' title={'change password'}>
        <PasswordSettings />
      </Section>

      <Section id='addresses' title={t`addresses`}>
        <PersonalInfo fromSettings />
      </Section>

      {/* <Section>
        <OrderSMS dt={dtSetting} />
      </Section> */}

      <Section id='payment-method' title={t`paymentMethod`}>
        <MyCards fromSettings />
      </Section>

      <Section id='delete-account' last={true}>
        <DeleteAccount />
      </Section>
    </div>
  );
};

export default SettingsTab;
