import React from 'react';

const MenuCard = ({ className = '', menu = '', classMenu = '', onClick }) => {
  // Function to truncate text if it exceeds 25 characters
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <button
      className={`py-3 cursor-pointer relative h-full flex flex-col justify-center w-full ${className}`}
      onClick={onClick}
    >
      {/* <img
        src={img}
        alt={menu}
        className='w-[80px] h-[80px] rounded-md object-cover mb-2 block mx-auto hover:scale-105 duration-300'
      /> */}
      <div className={`capitalize px-4  leading-none ${classMenu}`}>{truncateText(menu, 23)}</div>
    </button>
  );
};

export default MenuCard;
