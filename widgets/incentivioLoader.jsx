import React from 'react';

const IncentivioLoader = ({ size = '10', color = 'border-blue-500', className = '' }) => {
  return (
    <div
      className={`inline-block h-${size} w-${size} animate-spin rounded-full border-primary border-4 ${color} border-t-transparent ${className}`}
      role='status'
    ></div>
  );
};

export default IncentivioLoader;
