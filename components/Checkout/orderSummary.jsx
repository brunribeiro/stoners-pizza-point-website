import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import ChooseAmount from './ChooseAmount';
import RewardsList from './RewardsList';
import GuestInfoForm from './GuestInfoForm';

// import CoupanIcon from '@/icons/CoupanIcon';
import EditInput from '@/widgets/EditInput';
import Button from '@/widgets/button';
import useOrderPlace from '@/hook/payment/useOrderPlace';
import AppContext from '@/utils/appContext';
import { NO_REWARDS, PERCENTAGE_TIPS, REWARDS_PRESENT } from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';
import PizzaIcon2 from '@/icons/PizzaIcon2';
import RightArrowIcon from '@/icons/rightArrowIcon';
import DrawerWrapper from '@/shared/drawer';
import Input from '@/widgets/input';
import { displayAmount } from '@/utils/helper';
import { posthogTrack } from '@/utils/analytics';

const OrderSummary = ({ setFocus, cartData, isCheckout, isGuest, dtCard, itemCount }) => {
  const {
    loader,
    orderPlace,
    selectedOffer,
    setSelectedOffer,
    onSubmitOffer,
    removeOffer,
    orderSummary,
    selectedTipsInPercentage,
    setSelectedTipsInPercentage,
    getTip,
    tip,
    setTip,
    getTotal,
    getSummary,
    getOffers,
    applicableOffers,
    setOpenRewards,
    openRewards,
    pointsUsed,
    setPointsUsed,
  } = useOrderPlace({
    setFocus,
    cartData,
    spreedlyToken: dtCard.spreedlyToken,
    setSpreedlyToken: dtCard.setSpreedlyToken,
  });

  const { loginData, setOpenSignInModal, setOpenRegister, guestInfo } = useContext(AppContext);
  const [isMounted, setIsMounted] = useState(false);
  const [isGuestFormOpen, setIsGuestFormOpen] = useState(false);
  const router = useRouter();

  if (cartData?.length > 0 && isCheckout) {
    posthogTrack({
      name: 'checkout_started',
      trackData: {
        cart_id: String(cartData?.[0]?.id),
        total_items: itemCount,
        subTotal: cartData?.[0]?.subtotal,
        total_amount: String(cartData?.[0]?.total),
        taxes: String(cartData?.[0]?.salesTax),
      },
    });
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (dtCard.spreedlyToken !== null) {
      orderPlace();
    }
  }, [dtCard.spreedlyToken]);

  useEffect(() => {
    if (loginData?.userId) {
      getSummary();
      setTip('0.00');
      setSelectedTipsInPercentage(0);
    }
  }, [cartData]);

  const handleButtonClick = () => {
    if (!isCheckout) {
      router.push('/checkout');
      return;
    }

    if (!loginData?.email && !isGuest) {
      setOpenSignInModal((prev) => !prev);
      return;
    }

    // Wait a short delay before submitting the form to ensure state changes are processed
    setTimeout(() => {
      window.submitSpreedlyPaymentForm();
    }, 10);

    // if (!selectedCard && !selectedGiftCard) {
    // if (!selectedCard) {
    //   // setOrderTrigger(true);

    //   Toast.error('please select Paymethod');
    //   return;
    // } else {
    //   // orderPlace();
    // }

    // if (!dtPayment1.selectedCard) {
    //   Toast.error('Please Select Payment Method.');
    //   return;
    // }

    // dtPayment1.placeOrder({ tip: parseFloat(dtCart.tipAmount || 0).toFixed(2) });

    // if (
    //   !deliveryInstructions &&
    //   LocalStorage.getJSON(KEYS.DINING_OPTION) === HANDOFF_MODE.DELIVERY
    // ) {
    //   setModal((prev) => ({ ...prev, deliveryInstruction: true }));
    //   setError(true);
    //   return;
    // } else {
    //   // If payment method is selected and it's not the checkout page
    // }
  };

  const { orderTotal = {} } = orderSummary || {};

  const handleOfferSelection = (offer) => {
    setPointsUsed(0);
    setSelectedOffer(offer);
  };

  if (!isMounted) return null;
  return (
    <div className='gap-5 flex flex-col w-full'>
      <div className='bg-primary-light rounded-[35px] sm:p-8 p-4'>
        {!isCheckout && (
          <>
            <div className='mb-4 border-b-[2px] border-gray-100 pb-6'>
              {loginData?.userId ? (
                <>
                  {/* {loader.listOffer && (
            <div className='flex rounded-3xl hover:shadow-md cursor-pointer border-2 border-primary text-center p-5 bg-primary bg-opacity-20 gap-1 justify-center'>
              <div className='flex h-10 justify-center items-center'>
                <IncentivioLoader size='5' />
              </div>
            </div>
          )} */}
                  {/* {!loader.listOffer && (
            <button
              onClick={() => {
                if (applicableOffers?.length > 0) {
                  setOpenOfferModal(true);
                } else {
                  Toast.warn('Please add promo code');
                }
              }}
              className='flex rounded-3xl hover:shadow-md cursor-pointer border-2 border-primary text-center py-7 px-3 bg-primary bg-opacity-20 gap-1 justify-center'
            >
              <CoupanIcon />
              <span>
                {applicableOffers?.length > 0 ? (
                  <span className='underline underline-offset-4 font-bold'>{`Apply Available Offers (${applicableOffers?.length})`}</span>
                ) : (
                  <span>No Offers Available</span>
                )}
              </span>
            </button>
          )} */}

                  {/* <CustomModal title='Apply Offer' open={openOfferModal} setOpen={setOpenOfferModal}>
            {loader?.listOffer ? (
              <div className='flex h-10 justify-center items-center'>
                <IncentivioLoader />
              </div>
            ) : (
              <>
                {applicableOffers?.length > 0 ? (
                  <>
                    {applicableOffers.map((item) => (
                      <RadioButton
                        name='offerId'
                        title={item.title}
                        key={item.offerId}
                        id={`offer-${item.distributedOfferId}`}
                        checked={selectedOffer?.distributedOfferId === item.distributedOfferId}
                        onChange={() => handleOfferSelection(item)}
                        icon={CoupanIcon}
                      />
                    ))}
                    <div className='grid grid-cols-2 gap-2'>
                      <Button
                        title='Cancel'
                        className='uppercase bg-white !  hover:!text-white !font-bold text-xl'
                        onClick={() => {
                          setOpenOfferModal((prev) => !prev);
                        }}
                      />
                      <Button
                        title='Use'
                        className='uppercase !font-bold text-xl'
                        loading={loader?.useOffer}
                        disabled={loader?.useOffer}
                        onClick={() => {
                          onSubmitOffer();
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <p>No offer yet</p>
                )}
              </>
            )}
          </CustomModal> */}
                  <div className='bg-[#1c1c1c] rounded-3xl p-4 sm:px-5 primary-border mb-5'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center  gap-3'>
                        <PizzaIcon2 />

                        <Image src='/images/Rewards.svg' alt='Rewards' width={122} height={50} />
                      </div>
                      <button
                        className={`primary-border text-light-gray !border-white bg-foreground rounded-3xl p-2 mr-2 hover:bg-primary hover:text-white duration-300 ${orderSummary?.orderDiscounts?.[0]?.description && 'bg-primary text-white'}`}
                        onClick={() => {
                          setOpenRewards(true);
                        }}
                      >
                        <RightArrowIcon width={17} height={17} />
                      </button>
                    </div>
                    <div className='mx-2'>
                      {orderSummary?.orderDiscounts?.[0]?.description ? (
                        <div className='mt-5'>
                          <p className='text-sm  sm:mt-2 text-light-gray p-2 '>{REWARDS_PRESENT}</p>
                          <Input
                            className='border-2 !border-dark-primary !rounded-full pb-1'
                            loader={loader?.removeOffer}
                            value={orderSummary?.orderDiscounts?.[0]?.description}
                            clearInput={() => {
                              removeOffer(orderSummary?.orderDiscounts?.[0]?.discountId);
                            }}
                          />
                        </div>
                      ) : (
                        <p className='text-sm  sm:mt-2 text-light-gray p-2'>{NO_REWARDS}</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <></>
                // <div className='border-2 border-primary rounded-3xl py-7 px-3 bg-primary bg-opacity-20 w-full mb-6'>
                //   <div className='flex items-center justify-center gap-3 '>
                //     <CoupanIcon />
                //     <span className='text-sm xl:text-base '>
                //       <button
                //         className='capitalize underline font-bold underline-offset-4 '
                //         onClick={() => {
                //           setOpenSignInModal((prev) => !prev);
                //         }}
                //       >
                //         Sign up / Login
                //       </button>{' '}
                //       to view available offers
                //     </span>
                //   </div>
                // </div>
              )}
              <div className='font-stone uppercase text-xl mb-3'>Choose Tip</div>
              <ChooseAmount
                options={PERCENTAGE_TIPS}
                value={selectedTipsInPercentage}
                setValue={setSelectedTipsInPercentage}
                getTip={getTip}
              />
              <div className='flex justify-between gap-5 my-4'>
                <div className='text-[#141414]  font-bold'>Tip Amount</div>
                <div className='text-foreground text-sm '>{displayAmount(tip || 0)}</div>
              </div>

              {selectedTipsInPercentage === 'custom' && (
                <EditInput
                  type='number'
                  ariaLabel='Enter Tip'
                  placeholder='Enter Tip'
                  value={isNaN(tip) ? '' : tip}
                  nonNegative={true}
                  maxLength={10}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setTip(inputValue);

                    const tipValue = parseFloat(inputValue) || 0;

                    getTotal(tipValue);
                  }}
                />
              )}
            </div>
          </>
        )}
        <div className='flex gap-1 flex-col border-b-[2px] border-gray-100 pb-4 mb-4 '>
          <div className='text-xl font-stone uppercase  mb-4'>Total Order</div>
          <div className='flex justify-between gap-5'>
            <div className='text-foreground'>Subtotal</div>
            <div className='text-foreground'>
              {isMounted
                ? `${displayAmount(
                    orderTotal?.displayPreDiscountSubtotal || cartData?.[0]?.subTotal || 0,
                  )}`
                : '$0.00'}
            </div>
          </div>
          {orderSummary?.orderDiscounts?.length > 0 && (
            <div className='flex justify-between gap-5'>
              <div className='text-green'>Reward</div>
              <div className='text-green'>
                {isMounted ? `-${displayAmount(orderTotal?.displayTotalDiscountApplied)}` : '$0.00'}
              </div>
            </div>
          )}
          <div className='flex justify-between gap-5'>
            <div className='text-foreground'>Tip Amount</div>
            <div className='text-foreground'>
              {(() => {
                const storedTip = LocalStorage.get('Tip');
                const tipValue =
                  !isNaN(storedTip) && storedTip !== null ? parseFloat(storedTip) : 0;
                return displayAmount(tipValue);
              })()}
            </div>
          </div>
          <div className='flex justify-between gap-5'>
            <div className='text-foreground flex gap-2'>Estimated Tax</div>
            <div className='text-foreground'>
              {isMounted
                ? `${displayAmount(
                    orderTotal?.taxSummary?.displayTotalTaxes || cartData?.[0]?.salesTax || 0,
                  )}`
                : '$0.00'}
            </div>
          </div>
          {/* <div className='flex justify-between gap-5 mb-2'>
            <div className='text-foreground flex gap-2'>Discounts</div>
            <button
              className='text-foreground underline font-medium underline-offset-4 tracking-widest-[0.01em] hover:shadow-sm'
              onClick={() => {
                setOpenPopup('Enter Code');
              }}
            >
              +Add promo code
            </button>
          </div> */}
          {
            // <div className='bg-[#cff3cf] rounded-xl p-3 '>
            //   <div className='flex items-center justify-between gap-2'>
            //     <div className='items-center gap-2 flex'>
            //       <TagIcon />
            //       <span>{appliedOffer?.data?.orderDiscounts[0]?.description}</span>
            //       <span>{appliedOffer?.data?.orderDiscounts[0]?.displayAppliedDiscount}</span>
            //     </div>
            //     <button
            //       disabled={loader?.removeOffer}
            //       onClick={() => {
            //         removeOffer();
            //         getSummary();
            //       }}
            //     >
            //       {loader?.removeOffer ? (
            //         <div className='mt-1 border '>
            //           <IncentivioLoader size={4} className='border-2' />
            //         </div>
            //       ) : (
            //         <CloseIcon className='w-4 h-4' />
            //       )}
            //     </button>
            //   </div>
            // </div>
          }
        </div>

        <div className='mb-4'>
          <div className='flex justify-between gap-5'>
            <div className='text-[#141414] text-lg '>Grand Total</div>
            <div className='text-[#141414] text-lg font-stone uppercase text-xl'>
              {isMounted
                ? `${displayAmount(
                    parseFloat(orderTotal?.displayTotal || cartData?.[0]?.total) +
                      (parseFloat(LocalStorage.get('Tip')) || 0),
                  )}`
                : '$0.00'}
            </div>
          </div>
        </div>

        {loginData?.userId || !isGuest || !isCheckout || (guestInfo && isGuest) ? (
          <Button
            title={`${isCheckout ? 'Pay Order' : 'Proceed to checkout'}  `}
            type='submit'
            form='addCardForm'
            onClick={() => {
              handleButtonClick();
            }}
            loading={loader.orderPlace}
            disabled={loader.orderPlace}
            className='w-full sm:!text-xl first-letter !py-2'
          />
        ) : (
          <div className='flex flex-col gap-4 mt-8'>
            <Button
              title={'sign in'}
              onClick={() => {
                setOpenSignInModal((prev) => !prev);
              }}
              loading={loader.orderPlace}
              disabled={loader.orderPlace}
              className='w-full sm:!text-xl first-letter !py-2'
            />
            <Button
              title={'create an account'}
              onClick={() => {
                setOpenSignInModal((prev) => !prev);
                setOpenRegister((prev) => !prev);
              }}
              loading={loader.orderPlace}
              disabled={loader.orderPlace}
              primary={false}
              className='w-full sm:!text-xl first-letter !py-2 '
            />
            <button
              className='w-full p-4 font-medium hover:bg-gray-100 rounded-full duration-500'
              onClick={() => {
                setIsGuestFormOpen(true);
              }}
            >
              Continue as Guest
            </button>
          </div>
        )}
      </div>
      <DrawerWrapper
        visible={isGuestFormOpen}
        onVisible={setIsGuestFormOpen}
        widthClass='w-[500px]'
        title='Guest Checkout'
        arrow={false}
        onclose={() => {
          setIsGuestFormOpen(false);
        }}
      >
        <GuestInfoForm setIsGuestFormOpen={setIsGuestFormOpen} />
      </DrawerWrapper>
      <DrawerWrapper
        visible={openRewards}
        onVisible={setOpenRewards}
        widthClass='w-[500px]'
        title='Rewards'
        arrow={false}
        modalFooter={
          <div className='flex justify-between gap-4 items-center px-2 -mt-2 w-full'>
            <Button
              className='text-lg w-full'
              title='use rewards'
              loading={loader?.useOffer}
              disabled={loader?.useOffer}
              onClick={() => {
                if (orderSummary?.orderDiscounts?.length > 0) {
                  removeOffer(orderSummary?.orderDiscounts[0]?.discountId);
                }
                onSubmitOffer();
              }}
            />
          </div>
        }
        onclose={() => {
          if (!orderSummary?.orderDiscounts?.[0]?.description) {
            setSelectedOffer();
            setPointsUsed(0);
          }
          setOpenRewards(false);
        }}
      >
        <RewardsList
          handleOfferSelection={handleOfferSelection}
          selectedOffer={selectedOffer}
          applicableOffers={applicableOffers}
          getOffers={getOffers}
          loginData={loginData}
          pointsUsed={pointsUsed}
          setPointsUsed={setPointsUsed}
          loader={loader}
        />
      </DrawerWrapper>
    </div>
  );
};

export default OrderSummary;
