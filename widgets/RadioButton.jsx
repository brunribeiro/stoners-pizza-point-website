import React from 'react';

const RadioButton = ({ title, id, name, onChange, labelClassName = '', icon: Icon }) => {
  return (
    <div className='flex p-4 rounded-3xl border items-center justify-between gap-3 bg-white'>
      <div className='flex items-start gap-2'>
        {' '}
        {Icon && <Icon />}
        {title && (
          <label
            className={`text-lg font-bold inline-block text-foreground normal-case cursor-pointer ${labelClassName}`}
            htmlFor={id}
          >
            {title}
          </label>
        )}
      </div>
      <div className='relative'>
        <label className='radio-button-container'>
          <input type='radio' id={id} name={name} className='w-5 h-5' onChange={onChange} />
          <span className='checkmark'></span>
        </label>
      </div>
    </div>
  );
};

export default RadioButton;
