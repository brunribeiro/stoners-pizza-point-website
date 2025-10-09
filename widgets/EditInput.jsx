/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import EditIcon from '@/icons/EditIcon';

const EditInput = ({
  ariaLabel = 'label',
  type = 'text',
  placeholder,
  label,
  error,
  className = '',
  value,
  mandatory,
  defaultValue = '',
  disabled = false,
  maxLength = '',
  capitalise = false,
  onChange = () => {},
  onKeyDown = () => {},
  nonNegative = false,
  showUrlTag = false,
  rest,
  tagInfoStart = 'https://',
  tagInfoEnd = '.osc.id',
}) => {
  const handleInputChange = (e) => {
    let val = e.target.value;

    if (type === 'number' || rest.inputMode === 'numeric') {
      val = val.replace(/[^0-9.-]/g, '');
      if (nonNegative) {
        val = val.replace(/-/g, '');
      }
    }

    if (maxLength && val.length > maxLength) {
      val = val.slice(0, maxLength);
    }

    e.target.value = val;
    onChange(e);
  };

  return (
    <div className='text-left mt-4'>
      {label && (
        <label className='text-base mb-2 inline-block text-foreground capitalize'>
          {label} {mandatory && <span className='text-red'>*</span>}
        </label>
      )}
      <div className='relative'>
        {showUrlTag && (
          <span className='border bg-gray-200 p-2 z-50 absolute left-0 top-0 flex justify-center items-center rounded-l-md font-medium text-xs h-9'>
            {tagInfoStart}
          </span>
        )}
        <input
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={`focus:outline-none px-6 min-h-[50px] h-[50px] font-medium text-base rounded-xl placeholder:font-normal placeholder:text-black w-full focus:border-black placeholder:opacity-50 text-black transition primary-border ${className} ${
            disabled ? 'bg-disabled-gray' : 'bg-white'
          } ${capitalise && 'capitalize'}`}
          type='text'
          inputMode={type === 'number' ? 'numeric' : undefined}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (nonNegative && e.key === '-') e.preventDefault();
            onKeyDown(e);
          }}
          {...rest}
        />
        <button className='absolute right-5 top-3'>
          <EditIcon className='w-6 h-6' />
        </button>{' '}
        {showUrlTag && (
          <span className='border bg-gray-200 p-2 absolute right-0 top-0 flex justify-center items-center rounded-r-md font-medium text-xs h-9'>
            {tagInfoEnd}
          </span>
        )}
      </div>
      {error && <p className='text-xs font-medium mt-1 text-red'>{error}</p>}
    </div>
  );
};

export default EditInput;
