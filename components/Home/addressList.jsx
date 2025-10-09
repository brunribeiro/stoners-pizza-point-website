import React, { useContext } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';

import { formatAddress } from '@/utils/common';
import AppContext from '@/utils/appContext';
import { LocalStorage } from '@/utils/localStorage';
import { KEYS } from '@/utils/constant';
import RightIcon from '@/icons/RightIcon';

const AddressList = ({ dtAdd, t }) => {
  const { setSelectedLocation } = useContext(AppContext);
  const ref = useOnclickOutside(() => {
    dtAdd.setOpen(false);
  });

  const handleAddAddress = () => {
    dtAdd.setIsAddNewAddress(true);
    dtAdd.setOpen(false);
  };

  const handleSelectAddress = (add) => {
    LocalStorage.setJSON(KEYS.DELIVERY_ADDRESS, add);
    dtAdd.setAddress(add);
    dtAdd.setOpen(false);
    dtAdd.setIsAddNewAddress(false);
    setSelectedLocation({ lat: add.lat, lng: add.long });
  };

  return (
    <div className=' rounded-3xl border bg-white top-0 w-full' ref={ref}>
      <div className=''>
        {dtAdd.addressList?.map((add, index) => {
          return (
            <button
              key={add.id}
              className={`p-5 flex items-center justify-between ${index === 0 && 'rounded-t-3xl'} border-b text-left  w-full cursor-pointer hover:bg-gray-200 ${
                add.id === dtAdd.address.id && 'bg-gray-200'
              }`}
              onClick={() => handleSelectAddress(add)}
            >
              <div>
                <h2 className=' text-lg font-bold'>{add.label}</h2>
                <span className='text-[15px] font-medium  opacity-50'>{formatAddress(add)}</span>
              </div>
              {index === 0 && <RightIcon className={'-rotate-90'} />}
            </button>
          );
        })}
      </div>
      <button
        className='flex min-h-20 gap-2 items-center p-5 cursor-pointer text-lg font-bold text-primary '
        onClick={handleAddAddress}
      >
        <h2>{t`addNewAddress`}</h2>
      </button>
    </div>
  );
};

export default AddressList;
