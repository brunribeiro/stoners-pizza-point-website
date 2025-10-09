import React from 'react';

const LockIcon = () => {
  return (
    <div className='w-full flex items-center justify-center'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='25'
        height='24'
        fill='none'
        viewBox='0 0 25 24'
      >
        <path
          fill='#DADADA'
          d='M8.5 10h-2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-10'
        ></path>
        <path
          stroke='#DADADA'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M8.5 10h-2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2m-8 0V7a4 4 0 0 1 8 0v3m-8 0h8'
        ></path>
        <path
          stroke='#9D9D9C'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M12.5 14v3'
        ></path>
      </svg>
    </div>
  );
};

export default LockIcon;
