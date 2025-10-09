import React, { useMemo } from 'react';

import RightArrowIcon from '@/icons/rightArrowIcon';
import PageChangeIcon from '@/icons/PageChangeIcon';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = useMemo(() => {
    const maxVisiblePages = window.innerWidth < 640 ? 5 : 7; // Adjust for small screens

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [currentPage, totalPages]);

  const PageButton = ({ page, isCurrent = false }) => (
    <button
      key={page}
      onClick={() => typeof page === 'number' && onPageChange(page)}
      className={`w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-primary hover:text-white text-xs ${
        isCurrent ? 'bg-primary text-white' : 'bg-white'
      }`}
      disabled={page === '...'}
    >
      {page}
    </button>
  );

  return (
    <div className='flex justify-center items-center space-x-1 sm:space-x-2 py-5 bg-white w-full'>
      <button
        className='w-8 h-8 sm:w-8 sm:h-8 flex items-center  justify-center rounded-lg disabled:opacity-50 hover:bg-primary hover:text-white'
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <PageChangeIcon className='rotate-180' />
      </button>
      <button
        className='w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg disabled:opacity-50  hover:bg-primary hover:text-white'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <RightArrowIcon width='10' height='10' className='rotate-180' />
      </button>

      {getPageNumbers.map((page, index) => (
        <PageButton key={index} page={page} isCurrent={currentPage === page} />
      ))}

      <button
        className='w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg disabled:opacity-50 hover:bg-primary hover:text-white'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <RightArrowIcon width='10' height='10' />
      </button>
      <button
        className='w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg disabled:opacity-50 hover:bg-primary hover:text-white'
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <PageChangeIcon />
      </button>
    </div>
  );
};

export default Pagination;
