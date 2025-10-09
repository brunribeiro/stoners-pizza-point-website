import React from 'react';

const AddIcon = ({ size = '40', className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      className={className}
      viewBox='0 0 40 40'
    >
      <rect y='0.780518' width='39' height='39' rx='20' fill='#e30613' />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M21.5 11.843C21.5 11.0146 20.8284 10.343 20 10.343C19.1716 10.343 18.5 11.0146 18.5 11.843V19.2805H11.0625C10.2341 19.2805 9.5625 19.9521 9.5625 20.7805C9.5625 21.6089 10.2341 22.2805 11.0625 22.2805H18.5V29.718C18.5 30.5464 19.1716 31.218 20 31.218C20.8284 31.218 21.5 30.5464 21.5 29.718V22.2805H28.9375C29.7659 22.2805 30.4375 21.6089 30.4375 20.7805C30.4375 19.9521 29.7659 19.2805 28.9375 19.2805H21.5V11.843Z'
        fill='white'
      />
    </svg>
  );
};

export default AddIcon;
