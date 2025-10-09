import React from 'react';

const TextArea = ({
  id,
  inputName,
  className = '',
  label = '',
  rows = 4,
  form = null,
  disabled = false,
  isRequired = false,
  containerClass = '',
  placeholder,
  ...other
}) => {
  return (
    <div className={`w-full text-left ${containerClass}`}>
      {label && (
        <div className=' flex justify-between'>
          <label className=' mb-1 inline-block   '>
            {label} {isRequired ? <span className='text-red'>*</span> : ''}
          </label>
          {/* <div>{optional && <span className='text-sm opacity-50'>Optional</span>}</div> */}
        </div>
      )}
      <div className='relative group overflow-auto'>
        <textarea
          id={id}
          rows={rows}
          name={inputName}
          disabled={disabled}
          placeholder={`${placeholder}}`}
          className={`focus:outline-none px-5 py-3 font-medium text-base rounded-lg placeholder:font-normal placeholder:text-black w-full 
            ${!form?.formState?.errors?.[inputName] && 'focus:border-black'} placeholder:opacity-50 text-black transition border-[3px] border-foreground 
            ${form?.formState?.errors?.[inputName] && 'border-primary bg-[#faf0f0]'} ${className} ${
              disabled ? 'bg-disabled-gray cursor-not-allowed' : 'bg-white'
            }`}
          {...(form ? form.register(inputName) : {})}
          {...other}
        />
      </div>

      {/* Display validation errors if any */}
      {form?.formState?.errors?.[inputName] && (
        <p className='text-xs text-red '>{form.formState.errors[inputName]?.message}</p>
      )}
    </div>
  );
};

export default TextArea;
