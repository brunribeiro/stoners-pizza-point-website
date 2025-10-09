import React from 'react';

const PageChangeIcon = ({ size = '10', className }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    className={className}
    fill='currentColor'
    viewBox='0 0 10 10'
  >
    <path fill='currentColor' d='m0 10 7.083-5L0 0zM8.333 0v10H10V0z'></path>
  </svg>
);

export default PageChangeIcon;
