import React from 'react';
const PercentageButton = ({
  options = [],
  className = '',
  textClass = '',
  value,
  setValue,
  getTip,
}) => {
  const handleClick = (clickedValue) => {
    setValue(clickedValue);
    getTip(clickedValue);
  };

  return (
    <div className={`flex ${className}`}>
      {options.map((option) => (
        <button
          key={option}
          className={`w-full lg:w-[85px]  rounded-full p-2 text-dark-gray sm:px-4 text-sm font-normal hover:bg-primary hover:text-white duration-200 whitespace-nowrap ${textClass} ${
            value === option
              ? 'bg-primary primary-border !border-dark-primary text-white'
              : 'bg-white primary-border !border-white'
          }`}
          onClick={() => handleClick(option)}
        >
          <div className=''>{option === 'custom' ? 'Custom' : `${option}%`}</div>
        </button>
      ))}
    </div>
  );
};
export default PercentageButton;
