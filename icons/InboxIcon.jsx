import React from 'react';

const InboxIcon = ({ size = '30', className }) => {
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
        d='M5.29102 26.966C5.15447 27.0809 4.98797 27.1544 4.81109 27.1779C4.63421 27.2014 4.45428 27.174 4.29246 27.0988C4.13064 27.0236 3.99363 26.9038 3.89754 26.7535C3.80145 26.6031 3.75026 26.4284 3.75 26.25V7.5C3.75 7.25136 3.84877 7.0129 4.02459 6.83709C4.2004 6.66127 4.43886 6.5625 4.6875 6.5625H25.3125C25.5611 6.5625 25.7996 6.66127 25.9754 6.83709C26.1512 7.0129 26.25 7.25136 26.25 7.5V22.5C26.25 22.7486 26.1512 22.9871 25.9754 23.1629C25.7996 23.3387 25.5611 23.4375 25.3125 23.4375H9.66797C9.44713 23.4376 9.2334 23.5156 9.06445 23.6578L5.29102 26.966Z'
        stroke='#e30613'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M11.25 12.6562H18.75'
        stroke='#e30613'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M11.25 17.3438H18.75'
        stroke='#e30613'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default InboxIcon;
