import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import CartList from '../Menu/cartList';
import EmptyCart from '../common/EmptyCart';

import PlusIcon from '@/icons/PlusIcon';
import IncentivioLoader from '@/widgets/incentivioLoader';
import routes from '@/utils/routes';
import { LocalStorage } from '@/utils/localStorage';
import { KEYS, DININGOPTION_TAB_CODES, DEFAULT_IMAGE } from '@/utils/constant';

const Summary = (props) => {
  const router = useRouter();
  const {
    dtuseModel,
    removeItem,
    addSoftCart,
    cartLoad,
    cartItem,
    setIsPageLoad,
    setOpenCart,
    buildOptionDataJSX,
  } = props ?? {};

  useEffect(() => {
    setIsPageLoad(false);
    // if (typeof window !== 'undefined') {
    //   localStorage.getItem('restId');
    // }
  }, []);

  const cartData = useMemo(() => cartItem?.[0]?.products || [], [cartItem]);

  return (
    <div className='flex flex-col gap-5 w-full pb-5 mb-5 border-gray-300 sm:flex-nowrap'>
      <div className='w-full'>
        <div className='text-[48px] hidden sm:block xl:min-w-48 sm:min-w-40 sm:w-auto w-full font-stone uppercase tracking-wide'>
          <span>CART</span>
        </div>
        <div className='flex flex-col'>
          {cartLoad ? (
            <div className='flex h-80 justify-center items-center'>
              <IncentivioLoader size='5' />
            </div>
          ) : cartData.length > 0 ? (
            cartData.map((item) => (
              <CartList
                key={item.platProdUniqId}
                title={item.prodNm}
                modGroupName={item.option_groups.flatMap((group) => group)}
                price={item.amt}
                img={item.smallImg || DEFAULT_IMAGE}
                qunt={item.qunt}
                data={cartItem}
                prodData={item}
                dtuseModel={dtuseModel}
                addSoftCart={addSoftCart}
                removeItem={removeItem}
                cartLoad={cartLoad}
                buildOptionDataJSX={buildOptionDataJSX}
              />
            ))
          ) : (
            <>
              <div className='flex flex-col gap-4 p-3'></div>
              <EmptyCart setOpenCart={setOpenCart} />
            </>
          )}
        </div>

        {!cartLoad && cartData.length > 0 && (
          <div className=' flex justify-end mt-6'>
            <button
              type='button'
              onClick={() => {
                setIsPageLoad(true);
                const rest = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
                const diningOption =
                  DININGOPTION_TAB_CODES[LocalStorage.getJSON(KEYS.DINING_OPTION)];
                const restSlug = rest?.slug;
                if (restSlug) {
                  router.push(routes.menu(diningOption, restSlug));
                } else {
                  router.push('/');
                }
              }}
              className='text-primary gap-1 flex items-center mb-7'
            >
              <PlusIcon className='w-3 text-primary' />
              <span className='underline underline-offset-4 hover:shadow-sm duration-300'>
                Add more Items
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
