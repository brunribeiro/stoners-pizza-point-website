import React from 'react';

const CheckRoundIcon = ({ size = '24', className, green = false }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      color='currentColor'
    >
      <path
        d='M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z'
        fill={green ? '#52ae32' : '#e30613'}
        stroke={green ? '#52ae32' : '#e30613'}
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8.25 12.75L10.5 15L15.75 9.75'
        stroke='white'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default CheckRoundIcon;
