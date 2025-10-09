/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

import DisabledEyeIcon from '@/icons/DisabledEyeIcon';
import EyeIcon from '@/icons/EyeIcon';

const PasswordInput = ({
  ariaLabel = 'password',
  placeholder,
  label,
  error,
  className,
  value,
  mandatory,
  defaultValue = '',
  disabled = false,
  maxLength = '',
  minLength = '',
  capitalise = false,
  onChange = () => false,
  onKeyDown = () => false,
  info = false,
  showUrlTag = false,
  rest,
  tagInfoStart = 'https://',
  tagInfoEnd = '.osc.id',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='text-left w-full'>
      {label && (
        <label className='mb-1 inline-block'>
          {label} {mandatory ? <span className='text-red'>*</span> : ''}
        </label>
      )}
      <div className='relative '>
        {showUrlTag && (
          <span className='border bg-gray-200 p-2 z-50 absolute left-0 top-0 flex justify-center items-center rounded-l-md font-medium text-xs h-9'>
            {tagInfoStart}
          </span>
        )}
        <input
          placeholder={placeholder}
          className={`focus:outline-none px-5 min-h-[50px] h-[50px] font-medium text-base rounded-lg placeholder:font-normal focus:placeholder:text-black placeholder:text-foreground w-full  ${!error && 'focus:border-black'} text-black transition border-[3px] border-foreground ${error && 'border-primary !bg-[#ffe8e8]'} ${className} ${
            disabled ? 'bg-disabled-gray' : 'bg-white'
          } ${capitalise && 'capitalize'}`}
          maxLength={maxLength}
          minLength={minLength}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          type={showPassword ? 'text' : 'password'}
          onKeyDown={onKeyDown}
          aria-label={ariaLabel}
          onInput={(event) => {
            // eslint-disable-next-line no-param-reassign
            if (event.target.value.trim() === '') event.target.value = '';
          }}
          {...rest}
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='absolute right-4 top-[13px] cursor-pointer text-primary font-semibold text-sm '
        >
          {showPassword ? <DisabledEyeIcon /> : <EyeIcon />}
        </button>
        {showUrlTag && (
          <span className='border bg-gray-200 p-2 absolute right-0 top-0 flex justify-center items-center rounded-r-md font-medium text-xs h-9 '>
            {tagInfoEnd}
          </span>
        )}
      </div>
      {error && <p className='text-xs font-medium mt-1 text-red'>{error}</p>}
      {info && <p className='text-xs font-medium mt-1 text-black'>{info}</p>}
    </div>
  );
};

export default PasswordInput;
