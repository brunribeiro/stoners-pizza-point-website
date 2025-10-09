import React, { useEffect } from 'react';

const Timer = ({ seconds, setSeconds }) => {
  useEffect(() => {
    if (seconds === 0) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  // Calculate the strokeDashoffset to create the filling effect
  const radius = 45;
  const strokeWidth = 8; // Adjust the stroke width to make the color more visible
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = -strokeDasharray * (1 - seconds / 30);

  return (
    <div className='relative w-10 h-10'>
      <svg
        className='absolute top-0 left-0 w-full h-full'
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'
      >
        {/* Background Circle */}
        <circle
          cx='50'
          cy='50'
          r={radius}
          stroke='#e30613'
          strokeWidth={strokeWidth}
          fill='none'
          strokeDashoffset={0}
        />
        {/* Progress Circle */}
        <circle
          cx='50'
          cy='50'
          r={radius}
          stroke='white'
          strokeWidth={strokeWidth}
          fill='none'
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1s linear',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center text-primary text-xs font-bold'>
        {seconds}s
      </div>
    </div>
  );
};

export default Timer;
