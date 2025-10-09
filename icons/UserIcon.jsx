import React from 'react';

const UserIcon = ({ size = '42', className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      className={className}
      viewBox='0 0 42 43'
      fill='none'
    >
      <rect x='1.5' y='2' width='39' height='39' rx='19.5' fill='white' />
      <rect x='1.5' y='2' width='39' height='39' rx='19.5' stroke='#e30613' strokeWidth='3' />
      <rect x='7' y='6.5' width='28' height='30' rx='14' fill='#e30613' />
      <circle cx='21.0004' cy='16.7778' r='3.77778' stroke='white' strokeWidth='3' />
      <path
        d='M13.4443 30.0001V29.2778C13.4443 27.0687 15.2352 25.2778 17.4443 25.2778H24.5554C26.7646 25.2778 28.5554 27.0687 28.5554 29.2778V30.0001'
        stroke='white'
        strokeWidth='3'
        strokeLinecap='round'
      />
    </svg>
  );
};

export default UserIcon;
