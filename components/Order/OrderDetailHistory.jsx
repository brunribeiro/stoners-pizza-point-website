import React, { useContext, useState } from 'react';
import Image from 'next/image';

import SkeletonOrderDetails from '../common/SkeletonOrderDetails';

import { dateDisplay } from '@/utils/helper';
import useOrderDetail from '@/hook/order/useOrderDetail';
import { DEFAULT_IMAGE } from '@/utils/constant';
import OrderCompleted from '@/icons/OrderCompleted';
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
        {/* Main Content - Desktop: 960px width, Mobile: full width */}
        <div className='w-full flex flex-col gap-[35px] relative'>
          <div className='w-full flex flex-col gap-[7px] px-10 pb-8 pt-[60px] bg-primary-light fixed top-0'>
            <h4 className='text-3xl text-dark-Green font-stone uppercase w-full'>
              Order #{orderDetail?.orderNumber}
            </h4>
            <span className='text-sm font-medium text-stone-black/70'>
              {dateDisplay(orderDetail?.requestedFullfillTime, 'DD/MM/YYYY')} -{' '}
              {dateDisplay(orderDetail?.requestedFullfillTime, 'hh:mm:ss A')}
            </span>
          </div>

          {/* Order Summary - Shows first on mobile, second on desktop */}
          <div className='w-full mt-[155px]'>
            <div className='w-full flex items-center flex-col gap-[26px] pb-[38px] radius-[20px] bg-white'>
              <div className=' w-full flex flex-col items-center !gap-[10px]'>
                <div className='w-full flex flex-col items-center justify-center px-10'>
                  {orderDetail?.status === 'CLOSED' ? (
                    <div className='w-full'>
                      <div className='w-full'>
                        <OrderCompleted
                          className='w-full'
                          aria-label='Order completed illustration'
                        />
                      </div>
                      <div className='flex flex-col items-center text-center gap-2 mt-4'>
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
                      <div className='flex flex-col items-center text-center gap-2 mt-4'>
                        <ProgressBarIcon height={50} width={400} fill='#E30613' />
                        <span className='font-medium text-foreground'>
                          Uh oh, something went wrong
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className='flex flex-col !gap-[14px] w-full bg-primary-light px-10 py-[30px]'>
                  <div className='text-xl !leading-[1.2] font-stone uppercase'>Order details</div>
                  <div className='flex flex-col gap-[20px]'>
                    {(showAllItems ? orderDetail?.items : orderDetail?.items?.slice(0, 3))?.map(
                      (item) => (
                        <div
                          key={item.id}
                          className='flex pb-[20px] border-light-border gap-[20px]'
                        >
                          <div className='w-[95px] h-[95px] flex items-center justify-center flex-shrink-0 bg-white rounded-xl'>
                            <Image
                              src={item.smallImg || DEFAULT_IMAGE}
                              alt={item.prodNm}
                              width={95}
                              height={95}
                              className='h-auto w-auto object-contain'
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

                <div className='w-full flex flex-col items-center justify-center py-5 border-b-[2px] border-light-primary gap-[26px] px-10'>
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

                <div className='w-full flex flex-col !gap-[14px] px-10 pt-5'>
                  <div>
                    <h4 className='font-stone uppercase text-xl'>Customer info</h4>
                  </div>
                  <div className='w-full flex flex-col gap-[16px]'>
                    <div className='w-full flex flex-col gap-[8px] px-4 sm:px-5 py-[17px] rounded-[10px] bg-primary-light'>
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
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <p>No Data</p>;
  }
};

const OrderDetailHistory = ({ orderId, isHistory = false }) => {
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
    <div className='overflow-x-auto no-scrollbar mx-auto'>
      {loading ? (
        <SkeletonOrderDetails sidemenu={true} />
      ) : (
        <Details orderDetail={orderDetail} isHistory={isHistory} />
      )}
    </div>
  );
};

export default OrderDetailHistory;
