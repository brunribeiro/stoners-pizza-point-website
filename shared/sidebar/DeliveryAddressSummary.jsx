import React from 'react';

const DeliveryAddressSummary = ({ address, onChange, className = '', isChange }) => {
  const line1 = address?.description || address?.streetAddress || '';
  const city = address?.city || address?.town || '';
  const state = address?.state || '';
  const zip = address?.zip || address?.postalCode || '';
  const line2 = [city, state, zip].filter(Boolean).join(', ');

  return (
    <div
      className={`w-full flex items-start justify-between p-3 border-y rounded bg-white ${className}  gap-8 sm:mb-4 sm:px-10 px-6 ${isChange ? '!px-6' : ''}`}
    >
      <div className='flex flex-col'>
        <div className='font-semibold text-black'>{line1 || 'Selected address'}</div>
        {line2 && <div className='text-sm text-gray-600'>{line2}</div>}
      </div>
      <button
        type='button'
        className='text-primary underline text-sm'
        onClick={onChange}
        aria-label='Change address'
      >
        Change
      </button>
    </div>
  );
};

export default DeliveryAddressSummary;
