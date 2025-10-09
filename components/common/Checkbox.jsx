import Link from 'next/link';
import React from 'react';

const Checkbox = ({
  title,
  name,
  href,
  register = () => {},
  labelClassName,
  className,
  defaultChecked,
  onChange,
  disabled = false,
  error, // Optional, to display validation errors
}) => {
  const inputId = `checkbox-${name}`;

  return (
    <div>
      <div className={`flex items-center gap-2 relative ${className}`}>
        <input
          id={inputId}
          type='checkbox'
          {...register(name)} // React-hook-form register
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className='w-4 h-4 opacity-0 absolute bottom-0'
        />

        <div
          className={`custom-checkbox w-4 h-4 border rounded-lg ${
            defaultChecked ? '!bg-primary !border-primary' : 'border-gray-300'
          }`}
        ></div>

        {title && (
          <label
            htmlFor={inputId} // Connect the label with the checkbox
            className={`text-lg ml-1 inline-block text-opacity-50 normal-case cursor-pointer ${labelClassName}`}
          >
            <span className='text-sm '>{title}</span>
            {href && (
              <Link
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary ml-1 underline underline-offset-4'
              >
                Terms and Conditions
              </Link>
            )}
          </label>
        )}
      </div>
      {error && <p className='text-xs font-medium mt-1 text-red'>{error}</p>}
    </div>
  );
};

export default Checkbox;
