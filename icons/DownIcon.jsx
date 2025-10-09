import React from 'react';

const DownIcon = ({ size, className }) => {
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
        d='M19.5 9L12 16.5L4.5 9'
        stroke='currentColor'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      />
    </svg>
  );
};

export default DownIcon;
