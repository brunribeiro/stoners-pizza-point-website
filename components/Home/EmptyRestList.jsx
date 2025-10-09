import React from 'react';

import { SENTENCES } from '@/utils/constant';
import SearchTomato from '@/icons/SearchTomato';

const EmptyRestList = ({ onClick, fromPickup = false, isChange }) => {
  return (
    <>
      {fromPickup ? (
        <div className=' max-w-[550px] w-full text-sm flex flex-col gap-1 mt-12'>
          <div className='sm:px-9 px-6'>
            <p className='text-primary text-center'>{SENTENCES.COULDNT_LOCATE}</p>
            <p className='text-center mt-4'>
              Please enter an address or enable location access in your browser to find a nearby
              location, or
              <button className='text-primary mx-1 hover:underline ' onClick={onClick}>
                click here
              </button>
              to browse all locations by state.
            </p>
          </div>
          <div className='mx-auto my-12'>
            <SearchTomato />
          </div>
        </div>
      ) : (
        <div
          className={` max-w-[550px] w-full text-sm flex flex-col gap-1 text-primary ${isChange && 'px-8'}`}
        >
          <p>
            The address you entered is not within the delivery range for any of our stores. Please
            either place an order for pickup or try having the food delivered to a different address
          </p>
        </div>
      )}
    </>
  );
};

export default EmptyRestList;
