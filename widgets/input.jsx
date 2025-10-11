import React, { useRef, useState } from 'react';

import SearchIcon from '@/icons/searchIcon';

const Input = ({
  optional = false,
  ariaLabel = 'label',
  type = 'text',
  placeholder,
  label = '',
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
  clearInput = () => {},
  showSearchIcon = false,
  loader = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef();

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  // const formatCardNumber = (value) => {
  //   if (value)
  //     return (
  //       value
  //         .replace(/\D/g, '')
  //         .match(/.{1,4}/g)
  //         ?.join(' - ') || ''
  //     );
  // };

  return (
    <div className='text-left'>
      {label && (
        <div className='flex justify-between'>
          <label className='mb-1 inline-block'>
            {label} {mandatory ? <span className='text-primary'>*</span> : ''}
          </label>
          {optional && <span className='text-sm text-foreground'>Optional</span>}
        </div>
      )}

      <div className='relative'>
        {showUrlTag && (
          <span className='border bg-gray-200 p-2 z-50 absolute left-0 top-0 flex justify-center items-center rounded-l-md font-medium text-xs h-9'>
            {tagInfoStart}
          </span>
        )}
        <input
          ref={inputRef}
          placeholder={placeholder}
          className={`focus:outline-none focus:placeholder:!text-black px-5  min-h-[50px] h-[50px] font-medium text-base rounded-lg items-center placeholder:font-normal placeholder:text-foreground w-full ${!error && 'focus:border-black'} text-black transition border-[3px] border-foreground ${error && 'border-primary !bg-[#ffe8e8]'} ${className} ${
            disabled ? 'bg-disabled-gray cursor-not-allowed' : 'bg-white'
          } ${capitalise && 'capitalize'}`}
          maxLength={maxLength}
          minLength={minLength}
          disabled={disabled}
          aria-label={ariaLabel}
          type={type}
          {...(value !== undefined ? { value } : { defaultValue })}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onInput={(event) => {
            if (event.target.value.trim() === '') event.target.value = '';
          }}
          {...rest}
        />
        {showUrlTag && (
          <span className='border bg-gray-200 p-2 absolute right-0 top-0 flex justify-center items-center rounded-r-md font-medium text-xs h-9'>
            {tagInfoEnd}
          </span>
        )}
        {loader ? (
          <div className='absolute right-4 top-1/2 transform -translate-y-1/2 pl-2 text-gray-700 font-extrabold hover:text-black bg-white'>
            {' '}
            <svg
              className='inline-block h-4 w-4 animate-spin mb-1 mr-2'
              xmlns='http://www.w3.org/2000/svg'
              width='12'
              height='12'
              viewBox='0 0 12 13'
            >
              <path
                fill='currentColor'
                d='M5.5,12a1,1,0,1,1,1,1A1,1,0,0,1,5.5,12ZM1.75,10.5A1.25,1.25,0,1,1,3,11.75,1.25,1.25,0,0,1,1.75,10.5Zm7.531.031a.75.75,0,1,1,.75.75A.75.75,0,0,1,9.281,10.531ZM0,7A1.5,1.5,0,1,1,1.5,8.5,1.5,1.5,0,0,1,0,7ZM11,7a.5.5,0,1,1,.5.5A.5.5,0,0,1,11,7ZM1.875,4.637a1.62,1.62,0,0,1,0-2.275,1.582,1.582,0,0,1,2.253,0,1.62,1.62,0,0,1,0,2.275,1.582,1.582,0,0,1-2.253,0ZM4.5,2a2,2,0,1,1,2,2A2,2,0,0,1,4.5,2ZM9.75,3.5a.25.25,0,1,1,.25.25A.25.25,0,0,1,9.75,3.5Z'
              />
            </svg>
          </div>
        ) : value ? (
          <button
            type='button'
            onClick={clearInput}
            className='absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-700 font-extrabold hover:text-black bg-white'
          >
            &#x2715;
          </button>
        ) : (
          !isFocused &&
          showSearchIcon && (
            <button
              type='button'
              onClick={handleFocusInput}
              className='absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-700 hover:text-black bg-white'
            >
              <SearchIcon />
            </button>
          )
        )}
      </div>
      {error && <p className='text-xs font-medium mt-1 text-red'>{error}</p>}
      {info && <p className='text-xs font-medium mt-1 text-black'>{info}</p>}
    </div>
  );
};

export default Input;
