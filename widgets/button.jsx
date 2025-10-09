import React from 'react';

const Button = ({
  className = '',
  title,
  icon,
  primary = true,
  labelFirst = false,
  loading = false,
  onClick,
  disabled = false,
  onMouseLeave = () => {},
  ...other
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`font-stone text-[18px] xl:text-xl tracking-[0.06em] h-[55px] py-1 sm:py-[9px] ${primary ? 'button-primary' : 'button-secondary'} ${className} ${loading || disabled ? 'button-disabled' : ''}`}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
      {...other}
    >
      {!labelFirst && icon}
      {loading && (
        <svg
          className='inline-block h-4 w-4 animate-spin mb-1 mr-2'
          xmlns='http://www.w3.org/2000/svg'
          width='12'
          height='12'
          viewBox='0 0 12 13'
        >
          <path
            fill='currentColor'
            d='M5.5,12a1,1,0,1,1,1,1A1,1,0,0,1,5.5,12ZM1.75,10.5A1.25,1.25,0,1,1,3,11.75,1.25,1.25,0,0,1,1.75,10.5Zm7.531.031a.75.75,0,1,1,.75.75A.75.75,0,0,1,9.281,10.531ZM0,7A1.5,1.5,0,1,1,1.5,8.5,1.5,1.5,0,0,1,0,7ZM11,7a.5.5,0,1,1,.5.5A.5.5,0,0,1,11,7ZM1.875,4.637a1.62,1.62,0,0,1,0-2.275,1.582,1.582,0,0,1,2.253,0,1.62,1.62,0,0,1,0,2.275,1.582,1.582,0,0,1-2.253,0ZM4.5,2a2,2,0,1,1,2,2A2,2,0,0,1,4.5,2ZM9.75,3.5a.25.25,0,1,1,.25.25A.25.25,0,0,1,9.75,3.5Z'
          />
        </svg>
      )}
      {title}
      {labelFirst && icon}
    </button>
  );
};

export default Button;
