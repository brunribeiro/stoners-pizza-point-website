import React from 'react';
import { useRouter } from 'next/router';
import { Tooltip } from 'react-tooltip';

import MinusIcon from '@/icons/MinusIcon';
import PlusIcon from '@/icons/PlusIcon';
import useOrderPlace from '@/hook/payment/useOrderPlace';
import DeleteIcon from '@/icons/DeleteIcon';
import routes from '@/utils/routes';

const PlusMinusCart = ({
  tooltip = false,
  className = '',
  iconClassName = '',
  iconClass = '',
  minCount = 1,
  qunt,
  setQunt = () => {},
  callback = () => {},
  maxQuantity = 0,
  addSoftCart = () => {},
  removeItem = () => {},
  prodData = {},
  data = [],
  itemLoad,
  deleteIcon = true,
  disabled = false,
  disabled2 = false,
}) => {
  const { removeOffer, appliedOffer } = useOrderPlace(() => {});
  const router = useRouter();
  const addQunt = () => {
    if (disabled2) {
      return;
    }
    if (appliedOffer && router.pathname === routes.cart) {
      removeOffer();
    }
    if (qunt < maxQuantity || maxQuantity === 0) {
      setQunt((prev) => prev + 1);
      callback(false);
    }
    addSoftCart(data, prodData);
  };
  const removeQunt = () => {
    if (disabled) {
      return;
    }
    if (appliedOffer && router.pathname === routes.cart) {
      removeOffer();
    }
    if (qunt > minCount) {
      setQunt((prev) => prev - 1);
      callback(true);
    }
    let prodDel = false;
    let cartDel = false;

    if (prodData.qunt > 1) {
      prodDel = false;
    } else {
      prodDel = true;
    }

    if (data[0]?.products.length === 1 && prodDel.qunt > 1) {
      cartDel = true;
    } else {
      cartDel = false;
    }

    removeItem(prodData, prodDel, cartDel);
  };

  return (
    <div
      className={`inline-flex items-center space-x-2  p-1 rounded-full ${className} ${
        itemLoad ? 'pointer-events-none ' : ''
      }`}
    >
      <button
        onClick={() => removeQunt()}
        className={`w-[30px] h-[30px] flex items-center justify-center  rounded-full hover:!border-dark-primary border-black text-xl font-semibold focus:outline-none leading-none  hover:bg-dark-primary  border-2 ${iconClassName} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${qunt === 1 && deleteIcon ? '!border-foreground !text-foreground' : ''}`}
      >
        {qunt === 1 && deleteIcon ? (
          <DeleteIcon className={`${iconClass}  ${disabled ? 'cursor-not-allowed' : ''}`} />
        ) : (
          <MinusIcon className={`${iconClass} ${disabled ? 'cursor-not-allowed' : ''}`} />
        )}
      </button>
      <span className='text-lg font-semibold leading-none'>{qunt}</span>
      <button
        data-tooltip-id='add-tooltip'
        data-tooltip-content='Repeat'
        onClick={() => addQunt()}
        className={`w-[30px] h-[30px] flex items-center justify-center  rounded-full hover:border-dark-primary border-black text-xl font-semibold focus:outline-none leading-none  hover:bg-dark-primary  border-2 ${iconClassName} ${disabled2 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <PlusIcon className={`${iconClass} ${disabled2 ? 'cursor-not-allowed' : ''}`} />
        {tooltip && (
          <Tooltip id='add-tooltip' place='top-start' className='!text-sm !font-normal' />
        )}
      </button>
    </div>
  );
};

export default PlusMinusCart;
