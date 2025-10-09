import React from 'react';

const ClockIcon = ({ size = '30', className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      className={className}
      viewBox='0 0 30 30'
      fill='none'
    >
      <path
        d='M15 26.25C21.2132 26.25 26.25 21.2132 26.25 15C26.25 8.7868 21.2132 3.75 15 3.75C8.7868 3.75 3.75 8.7868 3.75 15C3.75 21.2132 8.7868 26.25 15 26.25Z'
        stroke='white'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16.5001 8.75001C16.5001 7.92158 15.8286 7.25001 15.0001 7.25C14.1717 7.24999 13.5001 7.92156 13.5001 8.74999L13.5001 15C13.5001 15.0486 13.5024 15.0967 13.5069 15.1441C13.4601 15.6307 13.6517 16.1307 14.0615 16.4594L16.9866 18.8059C17.6328 19.3243 18.5769 19.2206 19.0953 18.5744C19.6136 17.9282 19.51 16.9841 18.8638 16.4658L16.5001 14.5696L16.5001 8.75001Z'
        fill='white'
      />
    </svg>
  );
};

export default ClockIcon;
