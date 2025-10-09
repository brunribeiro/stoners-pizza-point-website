import React, { useEffect, useState } from 'react';

const Ping = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4'>
      {/* Animated Checkmark */}
      <div
        className={`relative transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
      >
        <svg
          className='checkmark'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 52 52'
          width='120'
          height='120'
        >
          <circle
            className='checkmark-circle fill-current text-emerald-500'
            cx='26'
            cy='26'
            r='25'
          />
          <path
            className='checkmark-check stroke-current text-white'
            fill='none'
            strokeWidth='5'
            d='M14.1 27.2l7.1 7.2 16.7-16.8'
            strokeDasharray='48'
            strokeDashoffset='48'
            style={{ animation: 'draw 0.8s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards' }}
          />
        </svg>

        {/* Pulsing effect */}
        <div className='absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75 -z-10'></div>
      </div>

      {/* Animated Text */}
      <h1
        className={`mt-8 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      >
        SUCCESS..!
      </h1>

      {/* Decorative elements */}
      <div className='mt-12 grid grid-cols-3 gap-6'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className='w-4 h-4 rounded-full bg-cyan-300 opacity-70'
            style={{
              animation: `pulse 2s infinite ${i * 0.2}s`,
              boxShadow: '0 0 20px rgba(103, 232, 249, 0.8)',
            }}
          ></div>
        ))}
      </div>

      {/* CSS Animations */}
      {/* eslint-disable-next-line react/no-unknown-property*/}
      <style jsx>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.3;
          }
        }
        .checkmark-check {
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>
    </div>
  );
};

export default Ping;
