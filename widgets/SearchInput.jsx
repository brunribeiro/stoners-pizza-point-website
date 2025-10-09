import React, { useState, useRef, useEffect } from 'react';

import SearchIcon from '@/icons/searchIcon';
import CloseIcon from '@/icons/CloseIcon';

const SearchInput = ({ searchValue, handleSearchChange, handleClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showClearIcon, setShowClearIcon] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchValue || isExpanded) {
      // this will use when making it responsinve
      //   const timer = setTimeout(() => {
      //     setShowClearIcon(true);
      //   }, 200);
      //   return () => clearTimeout(timer);
      setShowClearIcon(true);
    } else {
      const timer = setTimeout(() => {
        setShowClearIcon(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchValue, isExpanded]);

  const handleIconClick = () => {
    setIsExpanded(true);
    // setTimeout(() => {
    //   inputRef.current?.focus();
    //   setIsExpanded(true);
    // }, 200);
    inputRef.current?.focus();
    setIsExpanded(true);
  };

  const handleInputBlur = () => {
    if (!searchValue) {
      setIsExpanded(false);
    }
  };

  return (
    <div className='relative mb-0.5'>
      <input
        ref={inputRef}
        className={
          'transition-all text-sm outline-none duration-300 ease-in-out rounded-full focus:border-gray-400 py-2 pt-[10px]  pl-4 sm:w-full w-40 border-[3px] pr-11 '
        }
        type='text'
        placeholder={'Search Menu'}
        // placeholder={isExpanded ? 'Search' : ''}
        value={searchValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        onBlur={handleInputBlur}
        aria-label='Search Items'
      />
      <button
        className='absolute inset-y-0 right-4  flex items-center  hover:text-red-500 duration-200 '
        onClick={() => {
          handleClear();
          setIsExpanded(false);
        }}
        aria-label='Clear Search'
      >
        {showClearIcon && <CloseIcon className='hover:text-dark-primary text-black' size='17' />}
        {!showClearIcon && (
          <button
            className='absolute inset-y-0 right-0  top-0 hover:text-dark-primary  items-center duration-200 text-black cursor-pointer'
            onClick={handleIconClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleIconClick();
              }
            }}
            aria-label='Expand Search'
          >
            <SearchIcon size='24' />
          </button>
        )}
      </button>
    </div>
  );
};

export default SearchInput;
