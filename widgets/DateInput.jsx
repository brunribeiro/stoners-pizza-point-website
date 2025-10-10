import React from 'react';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';

import 'react-datepicker/dist/react-datepicker.css';
import CalenderIcon from '@/icons/CalenderIcon';

const DateInput = ({
  label,
  error,
  className,
  selectedDate,
  onChange,
  mandatory,
  disabled = false,
  placeholder,
  displayFormat,
  submissionFormat = 'YYYY-MM-DD',
  showUrlTag = false,
  tagInfoStart = 'https://',
  tagInfoEnd = '.osc.id',
  info = false,
  icon = true,
  ...rest
}) => {
  const handleDateChange = (date) => {
    if (date && dayjs(date).isValid()) {
      const formattedDate = dayjs(date).format(submissionFormat);
      onChange(formattedDate);
    } else {
      onChange(null);
    }
  };

  return (
    <div className='text-left relative'>
      {label && (
        <label className='font-medium mb-1 inline-block  capitalize'>
          {label} {mandatory ? <span className='text-red'>*</span> : ''}
        </label>
      )}
      <div className='relative w-full'>
        {showUrlTag && (
          <span className='border bg-gray-200 p-2 z-50 absolute left-0 top-0 flex justify-center items-center rounded-l-md font-medium text-xs h-9'>
            {tagInfoStart}
          </span>
        )}
        <DatePicker
          selected={selectedDate ? dayjs(selectedDate, submissionFormat).toDate() : null}
          onChange={handleDateChange}
          dateFormat={displayFormat}
          placeholderText={placeholder || displayFormat}
          className={`focus:outline-none px-5 w-full min-h-[50px] h-[50px] font-medium text-base rounded-lg placeholder:font-normal placeholder:text-black focus:border-[3px]  ${!error && 'focus:border-black'} placeholder:opacity-50 text-black transition border-[3px] border-foreground ${error ? 'border-[3px] border-primary !bg-[#ffe8e8]' : ''} ${className} ${
            disabled ? 'bg-disabled-gray' : 'bg-white'
          }`}
          disabled={disabled}
          type='number'
          onKeyDown={(e) => {
            const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '/'];
            const isNumber = /^[0-9]$/.test(e.key);

            if (!isNumber && !allowedKeys.includes(e.key)) {
              e.preventDefault();
            }
          }}
          inputProps={{ maxLength: 10 }}
          {...rest}
          showMonthYearPicker={displayFormat === 'MM/yyyy'}
        />
        {icon && (
          <span className='absolute top-3 right-3'>
            <CalenderIcon />
          </span>
        )}

        {showUrlTag && (
          <span className='border bg-gray-200 p-2 absolute right-0 top-0 flex justify-center items-center rounded-r-md font-medium text-xs h-9'>
            {tagInfoEnd}
          </span>
        )}
      </div>
      {error && <p className='text-xs font-medium mt-1 text-red'>{error}</p>}
      {info && <p className='text-xs font-medium mt-1 text-black'>{info}</p>}
    </div>
  );
};

export default DateInput;
