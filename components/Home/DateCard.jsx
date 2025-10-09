import React from 'react';

const DateCard = ({
  day = '',
  date = '',
  className = '',
  classDay = '',
  classDate = '',
  onclick = () => {},
}) => {
  return (
    <button
      className={`bg-white border py-2 px-2 rounded-xl text-center ${className}`}
      onClick={onclick}
    >
      <div className={`text-black text-xs leading-none ${classDay}`}>{day}</div>
      <div className={`text-xl font-bold ${classDate}`}>{date}</div>
    </button>
  );
};

export default DateCard;
