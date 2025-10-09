import React from 'react';

const CloseIcon = ({ size = '20', className, props }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      {...props}
    >
      <path
        d='M4.66748 4.66724L19.0002 19'
        stroke='currentColor'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M19 4.66724L4.66726 19'
        stroke='currentColor'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default CloseIcon;
