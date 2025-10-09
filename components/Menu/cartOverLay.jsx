import React, { useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';

import EmptyCart from '../common/EmptyCart';
import CartSkeletonLoader from '../common/CartSkeletonLoader';

import CartList from './cartList';

import { displayAmount } from '@/utils/helper';
import { DEFAULT_IMAGE } from '@/utils/constant';

const CartOverLay = ({
  cartItem,
  cartLoad,
  addSoftCart,
  removeItem,
  setOpenCart,
  dtuseModel,
  itemLoad,
  itemCount,
  getCart,
  buildOptionDataJSX,
}) => {
  const { t } = useTranslation('common');
  const cartData = useMemo(() => cartItem?.[0]?.products || [], [cartItem]);
  const subTotal = useMemo(() => cartItem?.[0]?.subTotal || 0, [cartItem]);
  const salesTax = useMemo(() => cartItem?.[0]?.salesTax || 0, [cartItem]);

  const renderContent = () => {
    if (cartLoad) {
      return <CartSkeletonLoader />;
    }

    if (itemCount > 0) {
      return (
        <div className='flex flex-col h-full'>
          <div className='flex-1 overflow-y-auto scrollbar-hide px-4 space-y-4'>
            {cartData?.length > 0 ? (
              cartData.map((item, index) => (
                <CartList
                  key={`${item.id}-${index}`}
                  dtuseModel={dtuseModel}
                  title={item.prodNm}
                  text={
                    item.option_groups
                      ?.flatMap((group) => group.modifiers.map((mod) => mod.modNm))
                      .join(', ') || ''
                  }
                  modGroupName={item.option_groups}
                  price={item.amt}
                  img={item.smallImg || DEFAULT_IMAGE}
                  qunt={item.qunt}
                  data={cartItem}
                  prodData={item}
                  addSoftCart={addSoftCart}
                  removeItem={removeItem}
                  setOpenCart={setOpenCart}
                  itemLoad={itemLoad}
                  getCart={getCart}
                  buildOptionDataJSX={buildOptionDataJSX}
                />
              ))
            ) : (
              <div className='text-center text-gray-500 py-10'>Your cart is empty</div>
            )}
          </div>

          <div className='sticky bottom-0 left-0 right-0 bg-white p-4  text-foreground '>
            <div className='flex items-center justify-between text-sm '>
              <span>{t`subTotal`}</span>
              <span>{displayAmount(subTotal)}</span>
            </div>
            <div className='flex items-center justify-between text-sm  mt-1'>
              <span>{t`taxable`}</span>
              <span>${salesTax.toFixed(2)}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className='flex flex-col gap-4 p-3'></div>
        <EmptyCart setOpenCart={setOpenCart} />
      </>
    );
  };

  return <>{renderContent()}</>;
};

export default CartOverLay;
