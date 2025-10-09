import React from 'react';
import AsyncSelect from 'react-select/async';
import { Controller } from 'react-hook-form';

import DownIcon from '@/icons/DownIcon';

const Dropdown = ({
  label = '',
  className,
  id,
  placeholder,
  options = [], // Static options
  loadOptions, // Dynamic loading function
  isCountryCode,
  isSearch = true,
  shouldSearch = false,
  onInputChange = () => {},
  error,
  isLoading = false,
  isClearable = false,
  isMulti = false,
  isDisabled = false,
  control,
  name,
  mandatory = false,
  ...other
}) => {
  const customStyles = {
    control: (provided, { isFocused }) => ({
      ...provided,
      minHeight: 45,
      paddingLeft: '11px',
      border: isFocused ? '1px solid #9b3f3f !important' : '1px solid #dfdfdf !important',
      borderRadius: '30px',
      boxShadow: 'none',
    }),
    option: (provided, { isSelected }) => ({
      ...provided,
      fontSize: 16,
      fontWeight: 500,
      background: isSelected ? '#e30613' : '#ffffff',
      color: isSelected ? '#ffff' : 'rgba(0, 0, 0, 1)',
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 16,
      fontWeight: 500,
      color: '#000000',
    }),
    valueContainer: (provided, { isFocused }) => ({
      ...provided,
      fontSize: 16,
      fontWeight: isFocused ? 500 : 400,
      color: '#000000',
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '250px',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: '9999',
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '5px 15px',
      display: isSearch ? 'none' : 'block',
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: '5px',
    }),
    singleValue: (provided, { isDisabled }) => ({
      ...provided,
      color: isDisabled ? 'black' : provided.color,
    }),
  };

  const phoneStyle = {
    control: (provided, { isFocused }) => ({
      ...provided,
      minHeight: 45,
      height: 45,
      width: 100,
      padding: '0 6px 0 14px',
      textAlign: 'center',
      borderRadius: '30px',
      border: isFocused ? '1px solid #9b3f3f !important' : '1px solid #dfdfdf !important',
      boxShadow: 'none',
    }),
    option: (provided, { data, selectProps }) => {
      const isSelected = data?.code === selectProps?.value?.code;
      return {
        ...provided,
        fontSize: 16,
        fontWeight: 500,
        background: isSelected ? '#ebd8d8' : '#ffffff',
        color: isSelected ? '#9b3f3f' : 'rgba(0, 0, 0, 1)',
      };
    },
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 16,
      fontWeight: 500,
      color: '#000000',
    }),
    valueContainer: (provided, { isFocused }) => ({
      ...provided,
      fontSize: 16,
      padding: '0',
      textAlign: 'center',
      fontWeight: isFocused ? 500 : 400,
      color: '#000000',
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '250px',
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: '160px',
      zIndex: '20',
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: 'none',
    }),
    singleValue: (provided, { isDisabled }) => ({
      ...provided,
      color: isDisabled ? 'black !important' : provided.color,
    }),
  };

  // Decide which options to use
  const getOptions = loadOptions ? loadOptions : () => Promise.resolve(options);

  return (
    <div className={className}>
      {label && (
        <label className='text-sm mb-1 inline-block font-medium text-dark'>
          {label} {mandatory ? <span className='text-red'>*</span> : ''}
        </label>
      )}
      <div className='relative'>
        {isSearch && (
          <div className='absolute top-4 right-3 z-10 text-gray-300'>
            <DownIcon className='w-4 h-4' />
          </div>
        )}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <AsyncSelect
              {...field}
              isMulti={isMulti}
              styles={isCountryCode ? phoneStyle : customStyles}
              isSearchable={isSearch || shouldSearch}
              id={id}
              placeholder={placeholder}
              onInputChange={onInputChange}
              loadOptions={getOptions}
              defaultOptions={options}
              isClearable={isClearable}
              isDisabled={isDisabled}
              closeMenuOnSelect={!isMulti}
              isLoading={isLoading}
              {...other}
            />
          )}
        />
      </div>
      {error && <p className='text-xs font-normal mt-1 text-red'>{error}</p>}
    </div>
  );
};

export default Dropdown;
