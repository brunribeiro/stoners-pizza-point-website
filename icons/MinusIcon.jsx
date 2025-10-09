import React from 'react';

const MinusIcon = (props) => {
  return (
    <div className='rounded-full'>
      <svg xmlns='http://www.w3.org/2000/svg' width={18} height={18} viewBox='0 0 16 16' {...props}>
        <path
          d='M2.5 8.89746H13.5'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  );
};

export default MinusIcon;
