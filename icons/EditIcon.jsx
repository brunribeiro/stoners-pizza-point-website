import React from 'react';

const EditIcon = ({ size = 24 }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      fill='none'
      viewBox='0 0 24 25'
    >
      <path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='m15 6.672 3 3m-5 11h8m-16-4-1 4 4-1L19.586 8.086a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0z'
      ></path>
    </svg>
  );
};

export default EditIcon;
