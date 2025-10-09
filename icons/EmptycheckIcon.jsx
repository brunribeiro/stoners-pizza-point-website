import * as React from 'react';

const EmptycheckIcon = ({ size = '24' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    fill='none'
    viewBox='0 0 24 25'
  >
    <rect
      width='21'
      height='21'
      x='1.5'
      y='2'
      stroke='#9D9D9C'
      strokeWidth='3'
      opacity='0.3'
      rx='10.5'
    ></rect>
  </svg>
);

export default EmptycheckIcon;
