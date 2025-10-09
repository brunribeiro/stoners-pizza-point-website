import React from 'react';

const SearchIcon = ({ size = '18', className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      fill='none'
      viewBox='0 0 24 24'
      className={className}
    >
      <path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='3'
        d='M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15M15.803 15.803 21 21'
      ></path>
    </svg>
  );
};

export default SearchIcon;
