import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';

import useCart from '../Menu/hook/useCart';
import useMyCard from '../MyCards/hooks/useMyCard';
import InboxModel from '../Inbox/InboxModel';
import CheckoutSkeleton from '../common/CheckoutSkeleton';
import useInbox from '../Inbox/hooks/useInbox';

import OrderDetail from './orderDetail';
import Payment from './payment';
import Summary from './summary';
import PeopleAlsoOrder from './peopleAlsoOrder';
import OrderSummary from './orderSummary';
import useUpsell from './hooks/useUpsell';
import { useSpreedlyScriptLoading } from './hooks/useSpreedlyScriptLoading';

import useItemModel from '@/hook/model/useItemModel';
import AppContext from '@/utils/appContext';
import LayoutWrapper from '@/shared/layoutWrapper';
import { LocalStorage } from '@/utils/localStorage';
import commonApi from '@/api/common';
import { DINING_OPTION, KEYS, RESTAURANT_TYPE } from '@/utils/constant';

const Checkout = () => {
  const [orderTrigger, setOrderTrigger] = useState(false);
  const [focus, setFocus] = useState(false);
  const { loginData, setIsPageLoad, guestInfo, initApiResponse, setInitApiResponse, itemCount } =
    useContext(AppContext);
  const { ...dtuseModel } = useItemModel();
  const { ...dtCart } = useCart();

  const { getUpsell, upsellData, restId, loading } = useUpsell();
  const [openCardList, setOpenCardList] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  let isCardSelected;
  const dtCard = useMyCard(setOpenCardList, isCardSelected);
  const router = useRouter();
  const isCart = router.pathname === '/cart';
  const isCheckout = router.pathname === '/checkout';

  const { ...dtInbox } = useInbox({
    isCheckOut: isCheckout,
  });
  const { loading1 } = useSpreedlyScriptLoading();
  useEffect(() => {
    if (isCart) {
      getUpsell();
      LocalStorage.remove('Tip');
    }
  }, [restId]);

  useEffect(() => {
    const fetchInitPayment = async () => {
      if (isCheckout) {
        try {
          dtCart.setCartLoad(true);
          const initResponse = await commonApi({
            action: 'paymentInit',
            data: { userId: loginData?.userId },
          });
          setInitApiResponse(initResponse?.data);

          let diningOption = LocalStorage.getJSON(DINING_OPTION);
          diningOption = diningOption === 0 ? RESTAURANT_TYPE.pickUp : RESTAURANT_TYPE.delivery;
          const data = initResponse.data.paymentConfigs.filter((i) => i.orderType === diningOption);
          setIsGuest(data[0].guestCheckoutSupported);
          LocalStorage.setJSON(KEYS.IS_GUEST, data[0].guestCheckoutSupported);
        } catch (error) {
          console.error('Failed to initialize payment:', error);
        }
      }
      dtCart.getCart();
    };

    fetchInitPayment();
  }, [isCheckout, loginData?.userId]);

  return (
    <LayoutWrapper>
      <div className='py-5'>
        {dtCart.cartLoad ? (
          <CheckoutSkeleton />
        ) : (
          <div className='w-[85%] mx-auto px-1 sm:px-5'>
            <div className='flex xl:gap-10 gap-5 justify-between lg:flex-nowrap flex-wrap'>
              <div className='lg:w-[60%] w-full'>
                <div className='w-full'>
                  {isCart ? (
                    <>
                      <Summary dtuseModel={dtuseModel} {...dtCart} setIsPageLoad={setIsPageLoad} />
                      <PeopleAlsoOrder
                        dtuseModel={dtuseModel}
                        getUpsell={getUpsell}
                        upsellData={upsellData}
                        restId={restId}
                        loading={loading}
                        router={router}
                      />
                    </>
                  ) : (
                    <div className='sm:p-5'>
                      <div className='sm:text-[48px] text-2xl xl:min-w-48 sm:min-w-40 sm:w-auto w-full font-stone uppercase tracking-wide sm:mb-10 my-2'>
                        <span>Checkout</span>
                      </div>
                      <OrderDetail dtCart={dtCart} />
                      {(loginData?.userId || (isGuest && guestInfo?.email)) && (
                        <Payment
                          focus={focus}
                          dt={dtCard}
                          orderTrigger={orderTrigger}
                          openList={openCardList}
                          setOpenList={setOpenCardList}
                          initApiResponse={initApiResponse}
                          loading={loading1}
                        />
                      )}
                      <InboxModel
                        open={dtuseModel.isOpen}
                        setOpen={dtuseModel.setIsOpen}
                      ></InboxModel>
                    </div>
                  )}
                </div>
              </div>
              <div className='lg:w-[35%] w-full'>
                <div className='w-full sticky top-[130px] '>
                  <OrderSummary
                    setFocus={setFocus}
                    cartData={dtCart.cartItem}
                    setOrderTrigger={setOrderTrigger}
                    selectedCard={dtCard.selectedCard}
                    selectedGiftCard={dtCard.selectedGiftCard}
                    isCheckout={isCheckout}
                    dtInbox={dtInbox}
                    isGuest={isGuest}
                    dtCard={dtCard}
                    isCardSelected={isCardSelected}
                    itemCount={itemCount}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
};

export default Checkout;
