import React from 'react';

const RightArrowIcon = ({ width = '25', height = '25', className, ...other }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 14 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      {...other}
    >
      <path
        d='M2.25 1.625L11.625 11L2.25 20.375'
        stroke='currentColor'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default RightArrowIcon;
