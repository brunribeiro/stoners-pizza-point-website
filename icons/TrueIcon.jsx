import React from 'react';

const TrueIcon = ({ size = '14', className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      className={className}
      viewBox='0 0 14 14'
      fill='none'
    >
      <g clipPath='url(#clip0_1644_61928)'>
        <path
          d='M7 12.25C9.8995 12.25 12.25 9.8995 12.25 7C12.25 4.10051 9.8995 1.75 7 1.75C4.10051 1.75 1.75 4.10051 1.75 7C1.75 9.8995 4.10051 12.25 7 12.25Z'
          stroke='#e30613'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M4.8125 7.4375L6.125 8.75L9.1875 5.6875'
          stroke='#e30613'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_1644_61928'>
          <rect width='14' height='14' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
};

export default TrueIcon;
