import React from 'react';

const LoyaltyCardIcon = ({ size = '30', className }) => {
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
        d='M11.25 4.6875C8.79436 4.6875 8.75326 4.6875 5.625 4.6875C5.10723 4.6875 4.6875 5.10723 4.6875 5.625C4.6875 8.75326 4.6875 8.79436 4.6875 11.25M18.75 4.6875C21.2056 4.6875 21.2467 4.6875 24.375 4.6875C24.8928 4.6875 25.3125 5.10723 25.3125 5.625V11.25M4.6875 18.75C4.6875 21.2056 4.6875 21.2467 4.6875 24.375C4.6875 24.8928 5.10723 25.3125 5.625 25.3125H11.25M25.3125 18.75V24.375C25.3125 24.8928 24.8928 25.3125 24.375 25.3125H18.75'
        stroke='#e30613'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M18.4091 11.25H11.5909C11.4026 11.25 11.25 11.4026 11.25 11.5909V18.4091C11.25 18.5974 11.4026 18.75 11.5909 18.75H18.4091C18.5974 18.75 18.75 18.5974 18.75 18.4091V11.5909C18.75 11.4026 18.5974 11.25 18.4091 11.25Z'
        stroke='#e30613'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default LoyaltyCardIcon;
