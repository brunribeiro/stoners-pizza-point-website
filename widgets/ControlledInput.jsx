import React from 'react';

import Input from './input';

const ControlledInput = ({
  label,
  name,
  placeholder,
  register,
  setValue,
  trigger,
  errors,
  regex,
  disabled,
  mandatory = false,
  ...other
}) => {
  return (
    <Input
      label={label}
      placeholder={placeholder}
      mandatory={mandatory}
      rest={register(name, {
        onChange: (event) => {
          const value = event.target.value.replace(regex || /[^ a-z]/gi, '');
          setValue(name, value);
          trigger(name);
        },
      })}
      error={errors?.[name]?.message}
      disabled={disabled}
      {...other}
    />
  );
};

export default ControlledInput;
