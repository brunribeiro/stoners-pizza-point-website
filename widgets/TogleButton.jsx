import React from 'react';

const TogleButton = ({ name, register }) => {
  return (
    <input
      type='checkbox'
      className='toggle-checkbox before:absolute before:left-1 before:top-1 before:w-4 h-4 before:bg-white before:rounded-full before:transition-transform before:transform'
      {...register(name)}
    />
  );
};

export default TogleButton;
