import * as React from 'react';

const FilledcheckIcon = ({ size = '24' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    fill='none'
    viewBox='0 0 24 25'
  >
    <rect width='24' height='24' y='0.5' fill='#52AE32' rx='12'></rect>
    <path
      stroke='#fff'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2.7'
      d='m5.313 13.625 3.937 3.938 9-9'
    ></path>
  </svg>
);

export default FilledcheckIcon;
