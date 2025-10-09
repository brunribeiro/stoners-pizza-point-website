import Image from 'next/image';
import React, { useRef } from 'react';
import Select from 'react-select';

// Custom SingleValue component
const CustomSingleValue = ({ data }) => (
  <div className='flex px-4 py-3 items-center'>
    <Image src={data.image} alt={data.nickname} className='mr-3' width={40} height={40} />
    <div className='flex flex-col'>
      <span className='font-semibold'>{data.nickname}</span>
      <span className='text-gray-600'>{`xxxx xxxx xxxx ${data.lastFour}`}</span>
    </div>
  </div>
);

// Custom Option component
const CustomOption = (props) => {
  const { data, innerRef, innerProps } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className='flex items-center p-4 cursor-pointer hover:bg-gray-100 border-b'
    >
      <Image src={data.image} alt={data.nickname} className='mr-3' width={40} height={40} />

      <div className='flex flex-col'>
        <span className='font-semibold'>{data.nickname}</span>
        <span className='text-gray-600'>{`xxxx xxxx xxxx ${data.lastFour}`}</span>
      </div>
    </div>
  );
};

// Custom Select Component
const CustomSelect = ({
  options,
  value,
  onChange,
  isLoading,
  isClearable,
  onInputChange,
  isCountryCode,
  placeholder,
  // focus,
}) => {
  // Default styles
  const defaultStyles = {
    control: (provided, { isFocused }) => ({
      ...provided,
      minHeight: 75,
      border: isFocused ? '2px solid #e30613 !important' : '2px solid #dfdfdf !important',
      borderRadius: '20px',
      boxShadow: 'none',
    }),
    option: (provided, { isSelected }) => ({
      ...provided,
      fontSize: 16,
      fontWeight: 500,
      background: isSelected ? '#ebd8d8' : '#ffffff',
      color: isSelected ? '#9b3f3f' : 'rgba(0, 0, 0, 1)',
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
      borderRadius: '20px',
      '::-webkit-scrollbar': {
        display: 'none',
      },
      '-ms-overflow-style': 'none', // for Internet Explorer and Edge
      'scrollbar-width': 'none', // for Firefox
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      borderRadius: 20,
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '5px 15px',
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: '5px',
    }),
    singleValue: (provided, { isDisabled }) => ({
      ...provided,
      color: isDisabled ? 'black' : provided.color,
    }),
    input: (provided) => ({
      ...provided,
      display: value ? 'none' : 'inline-grid', // Hide input if a card is selected
    }),
  };

  // Styles for country code select
  const phoneStyle = {
    control: (provided, { isFocused }) => ({
      ...provided,
      minHeight: 45,
      height: 45,
      width: 100,
      padding: '0 6px 0 14px',
      textAlign: 'center',
      borderRadius: '30px',
      border: isFocused ? '2px solid #e30613 !important' : '2px solid #dfdfdf !important',
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
      zIndex: 20,
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

  const inputRef = useRef();

  // useEffect(() => {
  //   if (focus) {
  //     inputRef.current.focus();
  //   }
  // }, [focus]);

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      isLoading={isLoading}
      isClearable={isClearable}
      onInputChange={onInputChange}
      placeholder={placeholder}
      components={{
        Option: CustomOption,
        SingleValue: CustomSingleValue,
      }}
      styles={isCountryCode ? phoneStyle : defaultStyles}
      ref={inputRef}
    />
  );
};

export default CustomSelect;
