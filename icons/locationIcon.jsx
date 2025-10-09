import React from 'react';

const LocationIcon = ({ size = '18', className }) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 16 16'
    >
      <g
        stroke='currentColor'
        strokeLinecap='round'
        strokeMiterlimit='10'
        strokeWidth='2'
        clipPath='url(#clip0_972_5632)'
      >
        <path d='M14.667 8h-1.482m0 0A5.184 5.184 0 0 1 8 13.185M13.185 8A5.186 5.186 0 0 0 8 2.815m0-1.482v1.482m0 0a5.185 5.185 0 1 0 0 10.37M1.333 8h1.482M8 14.667v-1.482'></path>
        <path d='M8 10.105a2.105 2.105 0 1 0 0-4.21 2.105 2.105 0 0 0 0 4.21Z'></path>
      </g>
      <defs>
        <clipPath id='clip0_972_5632'>
          <path fill='#fff' d='M0 0h16v16H0z'></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export default LocationIcon;
