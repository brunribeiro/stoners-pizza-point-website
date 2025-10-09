import React from 'react';
import useTranslation from 'next-translate/useTranslation';

import TogleButton from '@/widgets/TogleButton';

const OrderSMS = ({ dt }) => {
  const { t } = useTranslation('common');
  const watchSMSOptIn = dt.watch('extendedAttributes.SMS_TXN_OPT_IN');
  const watchMarketingOptIn = dt.watch('extendedAttributes.SMS_MARKETING_OPT_IN');
  const watchEmailOptIn = dt.watch('extendedAttributes.EMAIL_OPT_IN');

  return (
    <div className='max-w-[350px]'>
      <div className='flex items-center justify-between mb-5 pb-2 border-b-2'>
        <span
          className={`text-black  ${watchSMSOptIn === true || watchSMSOptIn === 'true' ? '' : 'text-opacity-50'}`}
        >
          {t`smsOrderNotifications`}
        </span>
        <TogleButton name='extendedAttributes.SMS_TXN_OPT_IN' register={dt.register} />
      </div>
      <div className='flex items-center justify-between mb-5 pb-2 border-b-2'>
        <span
          className={`text-black  ${watchMarketingOptIn === true || watchMarketingOptIn === 'true' ? '' : 'text-opacity-50'}`}
        >
          {t`smsMarketingNotifications`}
        </span>
        <TogleButton name='extendedAttributes.SMS_MARKETING_OPT_IN' register={dt.register} />
      </div>
      <div className='flex items-center justify-between mb-5 pb-2 border-b-2'>
        <span
          className={`text-black  ${watchEmailOptIn === true || watchEmailOptIn === 'true' ? '' : 'text-opacity-50'}`}
        >
          {t`emailMarketingNotifications`}
        </span>
        <TogleButton name='extendedAttributes.EMAIL_OPT_IN' register={dt.register} />
      </div>
    </div>
  );
};

export default OrderSMS;
