import React, { useContext, useState } from 'react';
import Image from 'next/image';

import SkeletonOrderDetails from '../common/SkeletonOrderDetails';

import { dateDisplay } from '@/utils/helper';
import useOrderDetail from '@/hook/order/useOrderDetail';
import {
  DEFAULT_IMAGE,
  DEFAULT_FULL_DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from '@/utils/constant';
import OrderCompleted from '@/icons/OrderCompleted';
import OrderCompletedIcon from '@/icons/OrderCompletedIcon';
import OrderErrorIcon from '@/icons/OrderErrorIcon';
import OrderError from '@/icons/OrderError';
import AppContext from '@/utils/appContext';
import DownIcon from '@/icons/DownIcon';
import ProgressBarIcon from '@/icons/ProgressBarIcon';
import { posthogTrack } from '@/utils/analytics';

const Details = ({ orderDetail }) => {
  const { loginData } = useContext(AppContext);
  const [showAllItems, setShowAllItems] = useState(false);

  if (orderDetail) {
    return (
      <>
        <div className='w-full bg-white top-[70px] py-10 gap-[8px]'>
          <div className='w-full flex flex-col-reverse lg:flex-row'>
            {/* Main Content - Desktop: 960px width, Mobile: full width */}
            <div className='w-full lg:max-w-[960px] flex flex-col px-4 sm:px-6 lg:px-10 gap-[35px]'>
              <div className=' hidden lg:flex w-full flex-col sm:flex-row items-start sm:items-center justify-between'>
                <h4 className='font-stone uppercase text-xl sm:text-2xl lg:text-[30px] !leading-[1.2] tracking-[-0.5px]'>
                  Order #{orderDetail?.orderNumber}
                </h4>
                <h4 className='text-base sm:text-lg font-semibold'>
                  Order Placed:{' '}
                  {dateDisplay(orderDetail?.requestedFullfillTime, DEFAULT_FULL_DATE_FORMAT)} at{' '}
                  {dateDisplay(orderDetail?.requestedFullfillTime, DEFAULT_TIME_FORMAT)}
                </h4>
              </div>

              <div className='flex flex-col !gap-[14px]'>
                <div className='lg:text-[30px] sm:text-2xl text-xl !leading-[1.2] font-stone uppercase'>
                  Order details
                </div>
                <div className='flex flex-col gap-[20px]'>
                  {(showAllItems ? orderDetail?.items : orderDetail?.items?.slice(0, 3))?.map(
                    (item) => (
                      <div key={item.id} className='flex pb-[20px] border-light-border gap-[20px]'>
                        <div className='relative w-16 h-16 sm:w-20 sm:h-20 lg:w-[95px] lg:h-[95px] flex-shrink-0'>
                          <Image
                            src={item.smallImg || DEFAULT_IMAGE}
                            alt={item.prodNm}
                            width={95}
                            height={95}
                            className='absolute top-[6.79px] left-[6.79px] h-auto w-auto sm:h-[80.75px] sm:w-[80.75px] object-contain'
                          />
                        </div>
                        <div className='w-full min-w-0 '>
                          <div className='flex items-start sm:items-center justify-between gap-[10px]  pt-[17px] sm:pt-[10px]'>
                            <div className='font-bold sm:text-base text-sm min-w-0 !leading-[15px] flex-1'>
                              {item.prodNm}
                            </div>
                            <div className='font-stone uppercase text-lg !leading-[1.2] sm:text-xl flex-shrink-0'>
                              ${item.total}
                            </div>
                          </div>
                          <div className='flex flex-col w-full sm:w-[50%] sm:pt-2 pr-[50px]'>
                            {item?.modifiers?.map((mod) => (
                              <div
                                key={mod.id}
                                className='leading-[15px] text-xs text-stone-black/70'
                              >
                                {mod.modNm}
                              </div>
                            ))}
                            {item.instr ? (
                              <p className='text-xs text-stone-black/70 !leading-[15px]'>
                                Special Instruction: {item.instr}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                  {orderDetail?.items?.length > 3 && (
                    <div
                      className='flex items-center justify-end gap-[10px] pb-[1px]  cursor-pointer'
                      onClick={() => setShowAllItems((prev) => !prev)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setShowAllItems((prev) => !prev);
                        }
                      }}
                      role='button'
                      tabIndex={0}
                    >
                      <p className='text-sm text-primary !leading-[15px]'>
                        {showAllItems ? 'See less items' : 'See more items'}
                      </p>

                      <div
                        className={`transition-transform duration-200 !leading-[15px] ${showAllItems ? 'rotate-180' : 'rotate-0'}`}
                      >
                        <DownIcon size={14} className='text-primary' />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className='w-full flex flex-col max-w-[670px] !gap-[14px]'>
                <div>
                  <h4 className='font-stone uppercase text-xl sm:text-2xl lg:text-[30px] !leading-[1.2] tracking-[-0.5px]'>
                    Customer info
                  </h4>
                </div>
                <div className='w-full flex flex-col sm:flex-row gap-[16px]'>
                  <div className='w-full flex flex-col gap-[8px] px-4 sm:px-5 py-[17px] radius-[10px] bg-primary-light'>
                    <p className='font-bold text-sm !leading-[15px] tracking-[-0.5px]'>
                      Customer Details
                    </p>
                    <p className='text-sm !leading-[15px] tracking-[-0.5px]'>
                      {loginData?.firstName + ' ' + loginData?.lastName} <br />
                      {loginData?.phoneNumber} <br />
                      {orderDetail?.add1 || orderDetail?.add2 || 'N/A'}
                    </p>
                  </div>
                  <div className='w-full p-4 rounded-[10px] bg-primary-light'>
                    <div className='flex flex-col gap-4'>
                      <p className='font-bold text-sm !leading-[15px] tracking-[-0.5px]'>
                        Payment Method
                      </p>
                      <p className='text-sm !leading-[15px] tracking-[-0.5px]'>
                        {orderDetail?.paymentType || 'VISA'} <br />
                        {orderDetail?.paymentType || '*** *** 123'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary - Shows first on mobile, second on desktop */}
            <div className='w-full lg:max-w-[440px]'>
              <div className='w-full flex items-center flex-col gap-[26px] px-4 sm:px-6 lg:px-10 pt-10 pb-[38px] radius-[20px] bg-primary-light'>
                <div className=' w-full flex flex-col items-center !gap-[10px]'>
                  <div className='w-full flex flex-col items-center justify-center'>
                    {orderDetail?.status === 'CLOSED' ? (
                      <div className='w-full lg:w-[393px]'>
                        <div className='w-full'>
                          <OrderCompleted
                            className='w-full'
                            aria-label='Order completed illustration'
                          />
                        </div>
                        <div className='hidden lg:block px-5 py-4 bg-white shadow-sm'>
                          <div className='flex items-center justify-center gap-3 text-green-600'>
                            <OrderCompletedIcon className='w-5 h-5' aria-hidden='true' />
                            <span className='font-medium'>Order has been completed.</span>
                          </div>
                        </div>
                        <div className='lg:hidden flex flex-col items-center text-center gap-2 mt-4'>
                          <ProgressBarIcon height={50} width={400} />
                          <span className='font-medium text-foreground'>
                            Order has been completed. Enjoy your meal!
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className='w-full lg:w-[390px]'>
                        <OrderError
                          className='w-full max-w-xs sm:max-w-md mx-auto'
                          aria-label='Order in progress illustration'
                        />
                        <div className='hidden lg:block px-5 py-4 bg-white shadow-sm'>
                          <div className='flex items-center justify-center gap-3 text-amber-600'>
                            <OrderErrorIcon className='w-5 h-5' aria-hidden='true' />
                            <span className='font-medium'>Whoops, something went wrong</span>
                          </div>
                        </div>
                        <div className='lg:hidden flex flex-col items-center text-center gap-2 mt-4'>
                          <ProgressBarIcon height={50} width={400} />
                          <span className='font-medium text-foreground'>
                            Whoops, something went wrong
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='w-full lg:w-[390px] flex flex-col items-center justify-center pt-5 pb-[6px] border-t-[2px] border-light-primary gap-[26px]'>
                    <div className='w-full'>
                      <h5 className='font-stone uppercase text-xl !leading-[1.2]'>Total order</h5>
                    </div>
                    <div className='w-full flex flex-col justify-between gap-[26px]'>
                      <div className='text-sm flex flex-col gap-[5px]'>
                        <div className='text-sm flex justify-between !leading-[15px]'>
                          <div className='text-foreground'>Subtotal</div>
                          <div className='text-foreground'>
                            ${Number(orderDetail?.subtotal).toFixed(2)}
                          </div>
                        </div>
                        {Number(orderDetail?.orderDiscount) > 0 && (
                          <div className='flex justify-between !leading-[15px]'>
                            <div className='text-green'>Reward</div>
                            <div className='text-green'>
                              -${Number(orderDetail?.orderDiscount).toFixed(2)}
                            </div>
                          </div>
                        )}
                        <div className='flex justify-between !leading-[15px]'>
                          <div className='text-foreground'>Tip</div>
                          <div className='text-foreground'>
                            ${Number(orderDetail?.tip).toFixed(2)}
                          </div>
                        </div>
                        <div className='flex justify-between !leading-[15px]'>
                          <div className='text-foreground'>Tax</div>
                          <div className='text-foreground'>
                            ${Number(orderDetail?.tax).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-between'>
                        <div className='font-chivo'>Grand Total</div>
                        <div className='font-stone uppercase text-xl !leading-[24px]'>
                          ${Number(orderDetail?.total).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* for Mobile View */}
            <div className='block lg:hidden'>
              <div className='w-full h-[77px] flex flex-col gap-[13px] px-5'>
                <h4 className='font-stone uppercase text-2xl tracking-[-0.5px]'>
                  Order #{orderDetail?.orderNumber}
                </h4>
                <h4 className='text-sm'>
                  <span className='font-medium text-stone-black/70'>Date Order Placed: </span>
                  <span className='font-bold text-stone-black'>
                    {dateDisplay(orderDetail?.requestedFullfillTime, DEFAULT_DATE_FORMAT)}
                  </span>{' '}
                  <br />
                  <span className='font-medium text-stone-black/70'>Time Order Placed: </span>
                  <span className='font-bold text-stone-black'>
                    {dateDisplay(orderDetail?.requestedFullfillTime, DEFAULT_TIME_FORMAT)}
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <p>No Data</p>;
  }
};

const OrderDetail = ({ orderId, isHistory = false }) => {
  const { orderDetail, loading } = useOrderDetail(orderId.id);
  if (!isHistory) {
    posthogTrack({
      name: 'order_completed',
      trackData: {
        order_id: String(orderDetail?.id),
        // cart_id : orderDetail?.cartId,
        payment_method: orderDetail?.paymentType,
        restaurant_id: orderDetail?.rest,
        total_items: orderDetail?.items.length,
        total_amount: String(orderDetail?.total),
        subtotal: String(orderDetail?.subtotal),
        tax: orderDetail?.tax,
        coupon_applied: orderDetail?.orderDiscount > 0 ? true : false,
      },
    });
  }

  return (
    <div className='overflow-x-auto h-[100dvh] no-scrollbar max-w-[1440px] mx-auto'>
      {loading ? (
        <SkeletonOrderDetails />
      ) : (
        <Details orderDetail={orderDetail} isHistory={isHistory} />
      )}
    </div>
  );
};

export default OrderDetail;
