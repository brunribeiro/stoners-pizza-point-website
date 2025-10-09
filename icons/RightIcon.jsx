import React from 'react';

const RightIcon = ({ size = '24', className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      className={className}
      viewBox='0 0 24 24'
      fill='none'
    >
      <path
        d='M9 4.5L16.5 12L9 19.5'
        stroke='currentColor'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default RightIcon;
