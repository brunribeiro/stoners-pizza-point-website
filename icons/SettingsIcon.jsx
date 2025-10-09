import React from 'react';

const SettingsIcon = ({ size = '30', className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      className={className}
      viewBox='0 0 30 30'
      fill='none'
    >
      <circle cx='15.0001' cy='9.09722' r='4.72222' stroke='#e30613' strokeWidth='3' />
      <path
        d='M5.55566 25.6249V23.7222C5.55566 21.513 7.34653 19.7222 9.55566 19.7222H20.4446C22.6537 19.7222 24.4446 21.513 24.4446 23.7222V25.6249'
        stroke='#e30613'
        strokeWidth='3'
        strokeLinecap='round'
      />
    </svg>
  );
};

export default SettingsIcon;
