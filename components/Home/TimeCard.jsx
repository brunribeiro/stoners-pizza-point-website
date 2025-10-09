import React from 'react';

const TimeCard = ({ time = '', className = '', isFirst = false, onClick = () => {} }) => {
  const displayTime = isFirst ? 'ASAP (15 mins)' : time;

  return (
    <button
      className={`border w-auto py-3 px-2 rounded-xl  text-center ${isFirst ? 'col-span-2' : ''} ${className}`}
      onClick={onClick}
    >
      <div>{displayTime}</div>
    </button>
  );
};

export default TimeCard;
