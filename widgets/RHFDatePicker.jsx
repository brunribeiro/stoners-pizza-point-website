import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';

import 'react-datepicker/dist/react-datepicker.css';
import CalenderIcon from '@/icons/CalenderIcon';

const RHFDatePicker = ({
  control,
  name,
  label,
  error,
  className,
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
  const datePickerRef = useRef(null);

  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus(true);
    }
  };

  return (
    <div className='text-left relative'>
      {label && (
        <label className=' font-medium mb-1 inline-block  capitalize'>
          {label} {mandatory && <span className='text-red'>*</span>}
        </label>
      )}
      <div className='relative w-full'>
        {showUrlTag && (
          <span className='border bg-gray-200 p-2 z-50 absolute left-0 top-0 flex justify-center items-center rounded-l-md font-medium text-xs h-9'>
            {tagInfoStart}
          </span>
        )}

        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <DatePicker
              ref={datePickerRef}
              selected={field.value ? dayjs(field.value, submissionFormat).toDate() : null}
              ariaLabelledBy={placeholder}
              onChange={(date) => {
                if (date && dayjs(date).isValid()) {
                  field.onChange(dayjs(date).format(submissionFormat));
                } else {
                  field.onChange(null);
                }
              }}
              dateFormat={displayFormat}
              placeholderText={placeholder || displayFormat}
              className={`focus:outline-none px-5 w-full min-h-[50px] h-[45px] font-medium text-base rounded-lg placeholder:font-normal placeholder:text-black  focus:border-black placeholder:opacity-50 text-black transition border-[3px] border-foreground ${className} ${
                disabled ? 'bg-disabled-gray' : 'bg-white'
              }`}
              disabled={disabled}
              {...rest}
              showMonthYearPicker={displayFormat === 'MM/yyyy'}
            />
          )}
        />

        {icon && (
          <button
            type='button'
            className='absolute top-3 right-3 cursor-pointer'
            onClick={openDatePicker}
          >
            <CalenderIcon />
          </button>
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

export default RHFDatePicker;
