import * as React from 'react';
const ThreeLineIcon = (props) => (
  <svg
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
  </svg>
);
export default ThreeLineIcon;
