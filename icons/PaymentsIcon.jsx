import React from 'react';

const PaymentsIcon = ({ size = '30', className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      className={className}
      viewBox='0 0 30 30'
      fill='none'
    >
      <path
        d='M26.25 6.5625H3.75C3.23223 6.5625 2.8125 6.98223 2.8125 7.5V22.5C2.8125 23.0178 3.23223 23.4375 3.75 23.4375H26.25C26.7678 23.4375 27.1875 23.0178 27.1875 22.5V7.5C27.1875 6.98223 26.7678 6.5625 26.25 6.5625Z'
        stroke='#e30613'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M19.2188 17.9688H22.9688'
        stroke='#e30613'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M13.5938 17.9688H15'
        stroke='#e30613'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M2.8125 11.7188H27.1875'
        stroke='#e30613'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default PaymentsIcon;
