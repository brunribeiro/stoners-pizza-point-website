import Link from 'next/link';
import React from 'react';

const Checkbox = ({
  title,
  name,
  href,
  register = () => {},
  labelClassName,
  className,
  checked,
  onChange,
}) => {
  const inputId = `checkbox-${name}`;

  return (
    <div className={`flex items-center gap-2 relative ${className}`}>
      <input
        id={inputId}
        type='checkbox'
        {...register(name)}
        checked={checked}
        aria-label={title}
        onChange={onChange}
        className='w-4 h-4 opacity-0 absolute'
      />

      <div
        className={`custom-checkbox w-4 h-4 mt-[2px] border rounded-lg ${checked ? '!bg-primary !border-primary' : 'border-gray-300'}`}
      ></div>

      {title && (
        <label
          htmlFor={inputId} // Connect the label with the checkbox
          className={`text-[14px] ml-1 inline-block text-gray-600 text-opacity-50 normal-case cursor-pointer ${labelClassName}`}
        >
          <span>{title}</span>
          {href && (
            <Link href={href} className='text-primary ml-1 underline underline-offset-4'>
              Terms and Conditions
            </Link>
          )}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
