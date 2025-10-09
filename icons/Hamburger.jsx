import * as React from 'react';
const Hamburger = (props) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M3 6H20'
      stroke='#0B1215'
      strokeWidth='1.5'
      strokeMiterlimit='10'
      strokeLinecap='round'
    />
    <path
      d='M3 11.5H20'
      stroke='#0B1215'
      strokeWidth='1.5'
      strokeMiterlimit='10'
      strokeLinecap='round'
    />
    <path
      d='M3 17H20'
      stroke='#0B1215'
      strokeWidth='1.5'
      strokeMiterlimit='10'
      strokeLinecap='round'
    />
  </svg>
);
export default Hamburger;
