import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { getCookie } from 'cookies-next';

import SideBar from '../sideBar';
import ProfileDropDown from '../ProfileDropDown';

import Logo from '@/icons/logo';
import CartIcon from '@/icons/cartIcon';
import DrawerWrapper from '@/shared/drawer';
import SignIncard from '@/components/Auth/signIncard';
import SignUpcard from '@/components/Auth/signUpCard';
import useRegister from '@/components/Auth/hooks/useRegister';
import useLogin from '@/components/Auth/hooks/useLogin';
import AppContext from '@/utils/appContext';
import ForgotPassword from '@/components/Auth/forgotPassword';
import useForgotPassword from '@/components/Auth/hooks/useForgotPassword';
import EnterPromoCode from '@/components/Checkout/EnterPromoCode';
import { NAV_DROPDOWN, KEYS, DININGOPTION_TAB_CODES } from '@/utils/constant';
import useInbox from '@/components/Inbox/hooks/useInbox';
import PromotionMassage from '@/components/Checkout/PromotionMassage';
import CartOverLay from '@/components/Menu/cartOverLay';
import useCart from '@/components/Menu/hook/useCart';
import InboxCard from '@/components/Inbox/InboxCard';
import { formatCustomDate, initializeAtlasChatbot } from '@/utils/helper';
import useOrderPlace from '@/hook/payment/useOrderPlace';
import DownIcon from '@/icons/DownIcon';
import LoyaltyCard from '@/components/LoyaltyCard';
import { LocalStorage } from '@/utils/localStorage';
import Button from '@/widgets/button';
import routes from '@/utils/routes';
import useAddress from '@/hook/useAddress';
import useRestaurant from '@/components/Home/hook/useRestaurant';
import RightArrowIcon from '@/icons/rightArrowIcon';
import LoyaltyCardIcon from '@/icons/LoyaltyCardIcon';
import GreenDot from '@/icons/GreenDot';
import EnterCodeIcon from '@/icons/EnterCodeIcon';
import { logout } from '@/utils/util';
import IncentivioLink from '@/widgets/incentivioLink';
import ThreeLineIcon from '@/icons/ThreeLineIcon';
import SmallLoader from '@/components/common/SmallLoader';
import AdsSlider from '@/components/Menu/AdsSlider';
import HelpIcon from '@/icons/HelpIcon';
import { Tooltip } from 'react-tooltip';

const Header = ({ dtuseModel, cartLoad }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const isMenuRoute = router.pathname.includes('/menu');
  const [seconds, setSeconds] = useState(0);
  // const [fromHeader, setFromHeader] = useState(false);
  const [title, setTitle] = useState(t`enterPromoCode`);
  const {
    loginData,
    promoProps,
    openSignInModal,
    setOpenSignInModal,
    openRegister,
    setOpenRegister,
    openPopup,
    setOpenPopup,
    itemCount,
    setRunOnce,
    runOnce,
    menuRestId,
    openChangeLocation,
    setOpenChangeLocation,
    setCurrentTab,
    currentTab,
    restaurant,
    setRestaurant,
  } = useContext(AppContext);

  const { setValue, register, errors, ...dtAdd } = useAddress({
    currentTab,
    setCurrentTab,
    path: router.pathname,
  });

  const { ...dt } = useRestaurant({ tab: currentTab, dtAdd: { ...dtAdd } });

  useEffect(() => {
    if (openPopup === NAV_DROPDOWN.LOYALTY_CARD) {
      setTitle(t`loyaltyCard`);
    } else {
      setTitle(t`enterPromoCode`);
    }
  }, [openPopup]);
  const { ...dtReg } = useRegister({ setOpenRegister, setSeconds });
  const { getOffers } = useOrderPlace({});
  const { ...dtInput } = useInbox({ isHeader: true, setOpenPopup, getOffers });
  const { ...dtCart } = useCart();
  const { ...dtLogin } = useLogin({
    setOpenRegister,
    openRegister,
    dtReg: { ...dtReg },
    seconds,
    setSeconds,
    setOpenSignInModal,
    getCartCount: dtCart.getCartCount,
  });

  const [openMobileHeader, setOpenMobileHeader] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const [isDealOpen, setIsDealOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loginData !== undefined) {
      setLoading(false);
    }
  }, [loginData]);

  const isActive = (route) => router.pathname === route;
  const isLoggedIn = !!loginData?.email;
  const menuItems = [
    { href: routes.deals, icon: <LoyaltyCardIcon />, label: 'Loyalty' },
    { href: routes.settings, label: 'My Accounts' },
    { href: '#', icon: <EnterCodeIcon />, label: 'Enter Code', isButton: true },
    { href: '#', label: 'Sign Out', isButton: true, action: logout },
  ];
  useEffect(() => {
    const rest = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
    setRestaurant(rest);
    setIsMounted(true);
  }, []);
  const address = LocalStorage.getJSON(KEYS.DELIVERY_ADDRESS);

  const handleCloseMolal = () => {
    setOpenSignInModal(false);
    setOpenRegister(false);
    dtReg.reset(dtReg.defaultValues);
    dtLogin.reset(dtLogin.defaultValues);
  };
  const { ...dtForget } = useForgotPassword();

  useEffect(() => {
    if (!runOnce.cartCount && getCookie(KEYS.deviceToken)) {
      dtCart.getCartCount();
      setRunOnce?.((prev) => ({ ...prev, cartCount: true }));
    }
  }, [loginData]);

  const renderAuth = () => {
    if (openRegister) {
      return <SignUpcard dt={dtReg} />;
    }

    if (dtForget.isForgetPassword) {
      return <ForgotPassword dt={dtForget} setOpenRegister={setOpenRegister} />;
    }

    return (
      <SignIncard
        dt={dtLogin}
        setOpenRegister={setOpenRegister}
        dtReg={dtReg}
        seconds={seconds}
        setSeconds={setSeconds}
        dtForget={dtForget}
      />
    );
  };
  const renderCart = () => {
    return (
      <CartOverLay
        getCart={dtCart?.getCart}
        cartItem={dtCart?.cartItem}
        itemCount={itemCount}
        cartLoad={dtCart?.cartLoad}
        setOpenCart={dtCart?.setOpenCart}
        addSoftCart={dtCart?.addSoftCart}
        removeItem={dtCart?.removeItem}
        itemLoad={dtCart?.itemLoad}
        buildOptionDataJSX={dtCart?.buildOptionDataJSX}
        dtuseModel={dtuseModel}
      />
    );
  };

  const renderDeal = () => {
    return <AdsSlider showList={true} />;
  };

  const renderPopup = () => {
    switch (openPopup) {
      case NAV_DROPDOWN.ENTER_CODE:
        return <EnterPromoCode dtPromo={dtInput} />;
      case NAV_DROPDOWN.NO_PROMO_CONTENT:
        return <PromotionMassage />;
      case NAV_DROPDOWN.PROMO_CONTENT:
        return (
          <InboxCard
            msg={promoProps[0]}
            key={promoProps[0].offerId}
            src={promoProps[0]?.smallImage}
            title={promoProps[0]?.title}
            content={promoProps[0]?.shortDescription}
            show={formatCustomDate(promoProps[0]?.updatedDate)}
            status={promoProps[0]?.status}
          />
        );
      case NAV_DROPDOWN.REWARDS:
        return <></>;
      case NAV_DROPDOWN.LOYALTY_CARD:
        return <LoyaltyCard />;
      default:
        return null; // Return null or a fallback component if needed
    }
  };

  return (
    <div className='flex flex-col bg-primary-light sticky top-0 z-50 shadow-md'>
      <div className='bg-primary-light '>
        <div className='sticky top-0 header z-50 flex mx-auto justify-between items-center md:px-4 max-w-[94%] w-full bg-primary-light p-[5px] py-3'>
          <button
            className='xl:hidden block p-2'
            onClick={() => setOpenMobileHeader(true)}
            aria-label='Open Menu'
          >
            <ThreeLineIcon className='w-8 h-8 text-black' />
          </button>
          <div className='flex gap-3 justify-center items-center '>
            <div className='ml-2 sm:ml-0 hover:scale-110 transition-all duration-300'>
              <Logo
                onClick={() => {
                  const pref = LocalStorage.getJSON(KEYS.DINING_OPTION);
                  const path =
                    pref === 1 ? routes.diningOption('delivery') : routes.diningOption('pickup');
                  router.push(path);
                }}
                className='cursor-pointer '
                width='120'
                height='40'
              />
            </div>
            {isMenuRoute && (
              <div
                className='ml-3'
                role='region'
                aria-label='Toggle between pickup and delivery options '
              >
                <button
                  onClick={() => {
                    // setFromHeader(true);
                    setOpenChangeLocation(true);
                  }}
                  className='hidden sm:flex  text-black  transition-all ml-4'
                >
                  {isMounted && LocalStorage.getJSON(KEYS.DINING_OPTION) === 1 ? (
                    <div className='flex flex-col mt-1 group justify-center items-start gap-1'>
                      <div className=' text-sm font-medium -mb-2'>
                        <p>Delivery to</p>
                      </div>

                      <div className='flex duration-200 group-hover:text-primary items-center'>
                        <div className='uppercase line-clamp-2 text-left text-xl font-stone '>
                          {address?.houseNumber} {address?.apt} {address?.city}
                        </div>

                        <div>
                          <DownIcon size='12' className='ml-2' />
                        </div>
                      </div>
                    </div>
                  ) : isMounted && restaurant && LocalStorage.getJSON(KEYS.DINING_OPTION) === 0 ? (
                    <div className='flex flex-col group mt-1 justify-center items-start gap-1'>
                      <div className='text-black text-sm font-medium -mb-2'>
                        <p>Pickup From</p>
                      </div>
                      <div className='flex items-center duration-200 group-hover:text-primary'>
                        <div className='text-xl font-stone uppercase'>{restaurant.name}</div>
                        <div>
                          <DownIcon size='12' className='ml-2' />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </button>
              </div>
            )}
          </div>

          <div className='lg:flex gap-3 items-center'>
            <nav aria-label='Main navigation'>
              <div className='gap-10 items-center hidden xl:flex'>
                <div className='flex gap-4 items-center'>
                  <ul className='flex gap-10 cursor-pointer'>
                    {menuRestId?.restId &&
                      menuRestId?.menuId && ( // Conditionally render the Menu button
                        <li>
                          <button
                            onClick={() => {
                              router.push(
                                routes.menu(DININGOPTION_TAB_CODES[currentTab], menuRestId?.restId),
                              );
                              // setIsClicked(false);

                              if (router.pathname !== '/menu') {
                                // setIsPageLoad(true);
                              }
                            }}
                            className={`focus:outline-none hover:text-dark-primary font-medium transition-all min-h-11 min-w-11  ${
                              isActive(routes.items) || isActive(routes.menu)
                                ? 'text-dark-primary font-bold'
                                : ''
                            }`}
                          >
                            Menu
                          </button>
                        </li>
                      )}
                    {isLoggedIn && (
                      <>
                        <li>
                          <button
                            className={`focus:outline-none  hover:text-dark-primary font-medium min-h-11 min-w-11 transition-all ${isDealOpen && 'text-dark-primary font-bold'}`}
                            onClick={() => {
                              setIsDealOpen(true);
                            }}
                          >
                            Deals
                          </button>
                        </li>
                        <li>
                          <button
                            className='focus:outline-none hover:text-dark-primary font-medium min-h-11 min-w-11 transition-all'
                            onClick={() => {
                              window.open('https://stonerspizzajoint.myshopify.com/', '_blank');
                            }}
                          >
                            Apparel
                          </button>
                        </li>
                        <li>
                          <button
                            className={`focus:outline-none pe-2 hover:text-dark-primary font-medium transition-all min-h-11 min-w-11 ${isActive(routes.orderHistory) && 'text-dark-primary font-bold'}`}
                            onClick={() => router.push(routes.orderHistory)}
                          >
                            Order History
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {loading ? (
                  <></>
                ) : loginData?.token ? (
                  <ProfileDropDown loginData={loginData} setOpenPopup={setOpenPopup} />
                ) : (
                  <div className='p-2'>
                    <Button
                      title={t`signInJoin`}
                      className='!text-sm !px-6 !h-[43px]' //do not remove this line
                      onClick={() => setOpenSignInModal((prev) => !prev)}
                    ></Button>
                  </div>
                )}
                {loginData?.token && (
                  <button
                    data-tooltip-id='need-help'
                    data-tooltip-content='Need help? Chat with us!'
                    onClick={initializeAtlasChatbot}
                  >
                    <HelpIcon className='hover:text-dark-primary' />
                    <Tooltip id='need-help' />
                  </button>
                )}
              </div>
            </nav>
            <button
              className={`relative flex items-center justify-center rounded-full px-2 py-1.5 md:px-9 md:p-2 md:w-10 border-[3px] shadow-sm hover:scale-105 duration-300
    ${
      dtCart.countLoader || cartLoad
        ? 'bg-gray-100 border-gray-300 hover:border-gray-400 ' // neutral but ensures visibility
        : !itemCount
          ? 'bg-white border-light-gray hover:border-gray-400'
          : 'bg-primary border-dark-primary hover:border-dark-primary text-white'
    }`}
              onClick={() => {
                dtCart?.getCart();
              }}
              aria-label='View Cart'
              data-tooltip-id='cart'
              data-tooltip-content='Cart'
            >
              <CartIcon
                className='w-5 h-5 sm:w-6 sm:h-6 mr-2 '
                color={itemCount && !dtCart.countLoader && !cartLoad ? 'white' : 'black'}
              />
              <Tooltip id='cart' />
              {cartLoad || dtCart.countLoader ? (
                <div className='absolute top-2 right-[5px] w-4 h-4 flex items-center justify-center'>
                  <SmallLoader />
                </div>
              ) : (
                <div className='absolute right-3 sm:top-2 sm:right-4 min-w-[16px] text-center'>
                  {itemCount || 0}
                </div>
              )}
              <div className='ml-1 px-1'></div>
            </button>
          </div>
        </div>

        <DrawerWrapper
          title={
            dtForget.isForgetPassword ? t`forgetPassword` : openRegister ? t`signUp` : t`signInJoin`
          }
          visible={openSignInModal}
          onVisible={setOpenSignInModal}
          widthClass='w-[500px] '
          onclose={handleCloseMolal}
        >
          {renderAuth()}
        </DrawerWrapper>

        <DrawerWrapper
          visible={dtCart?.openCart}
          onVisible={dtCart?.setOpenCart}
          widthClass='w-[500px]'
          title={t`myCart`}
          onclose={() => dtCart?.setOpenCart(false)}
          modalFooter={
            itemCount > 0 && (
              <Button
                title={'Checkout'}
                onClick={() => {
                  router.push('/cart');
                  dtCart?.setOpenCart((pre) => !pre);
                }}
                className='uppercase text-xl !font-bold w-full'
              />
            )
          }
        >
          {renderCart()}
        </DrawerWrapper>

        <DrawerWrapper
          title={'Change Location'}
          visible={openChangeLocation}
          onVisible={setOpenChangeLocation}
          widthClass='w-full sm:w-[480px]'
          onclose={() => {
            setOpenChangeLocation(false);
            // setFromHeader(false);
          }}
        >
          <SideBar
            dt={dt}
            dtAdd={dtAdd}
            setValue={setValue}
            register={register}
            errors={errors}
            setCurrentTab={setCurrentTab}
            currentTab={currentTab}
            isChange={true}
            fromHeader={true}
            fromHome={false}
            setMyLocationTriggered={dt.setMyLocationTriggered}
          />
        </DrawerWrapper>
        <DrawerWrapper
          visible={openMobileHeader}
          onVisible={setOpenMobileHeader}
          onclose={() => setOpenMobileHeader(false)}
          widthClass='w-[500px] '
          childClassname='!bg-primary-light relative'
        >
          <div className='bg-[url("/images/menuBg.webp")] bg-right-bottom bg-no-repeat w-full h-full absolute bottom-10' />
          <div className='flex flex-col min-h-screen justify-between p-4'>
            <div>
              <div className='bg-white p-5 rounded-full mt-16'>
                <h1>
                  {LocalStorage.getJSON(KEYS.USER_NAME) || loginData?.firstName ? (
                    <strong className='mt-2 max-w-32 capitalize truncate'>
                      <>Hi, {LocalStorage.getJSON(KEYS.USER_NAME) || loginData?.firstName}</>
                    </strong>
                  ) : (
                    <button
                      onClick={() => {
                        setOpenSignInModal((prev) => !prev);
                        setOpenMobileHeader(false);
                      }}
                      className='flex w-full justify-between items-center gap-5'
                    >
                      <span className='tracking-tighter text-left'>
                        You will need to login or sign up to access member features.
                      </span>
                      <RightArrowIcon size='18' className='w-5 h-5' />
                    </button>
                  )}
                </h1>
              </div>
              <ul className='space-y-7 mt-7 px-5 '>
                {menuRestId?.restId && menuRestId?.menuId && (
                  <li>
                    <button
                      onClick={() => {
                        router.push(
                          routes.menu(DININGOPTION_TAB_CODES[currentTab], menuRestId?.restId),
                        );
                        setOpenMobileHeader(false);
                      }}
                      className={`flex gap-2 relative items-center hover:text-dark-primary ${isActive(routes.menu) ? 'text-dark-primary' : ''}`}
                    >
                      <span className='absolute -left-5'>
                        {isActive(routes.items) || (isActive(routes.menu) && <GreenDot />)}
                      </span>
                      Menu
                    </button>
                  </li>
                )}
                {isLoggedIn && (
                  <>
                    <li>
                      <button
                        className='focus:outline-none hover:text-dark-primary font-medium transition-all'
                        onClick={() => {
                          window.open('https://stonerspizzajoint.myshopify.com/', '_blank');
                        }}
                      >
                        Apparel
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          router.push(routes.orderHistory);
                          setOpenMobileHeader(false);
                        }}
                        className={`flex w-full justify-between items-center gap-5 hover:text-dark-primary ${isActive(routes.orderHistory) ? 'text-dark-primary' : ''}`}
                      >
                        <span className='absolute -left-5'>
                          {isActive(routes.orderHistory) && <GreenDot />}
                        </span>
                        Order History
                      </button>
                    </li>
                    {menuItems.map((item) => (
                      <li key={item.label} className=' menu-item'>
                        {item.isButton ? (
                          <button
                            onClick={() =>
                              item.action ? item.action() : setOpenPopup(item?.label)
                            }
                            className='text-lg flex justify-between gap-3 items-center w-full text-left'
                            aria-label={item.label} // Accessibility improvement
                          >
                            <span className='flex items-center gap-3 menu-item-text'>
                              {item.label}
                            </span>
                          </button>
                        ) : (
                          <IncentivioLink
                            href={item.href}
                            className={`text-lg relative flex justify-between gap-3 items-center ${
                              router.asPath === item.href ? 'text-dark-primary' : ''
                            }`}
                            aria-label={item.label} // Accessibility improvement
                          >
                            <span className='flex items-center gap-3 menu-item-text'>
                              <span className='absolute -left-5'>
                                {router.asPath === item.href && <GreenDot />}
                              </span>
                              {item.label}
                            </span>
                          </IncentivioLink>
                        )}
                      </li>
                    ))}
                    {loginData?.token && (
                      <li className='flex w-full justify-between items-center gap-5 hover:text-primary'>
                        <button onClick={initializeAtlasChatbot}>Need help? Chat with us!</button>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>

            {!isLoggedIn && (
              <div className='my-1'>
                <div className='w-full flex flex-col justify-center gap-4'>
                  <div className='w-full'>
                    <Button
                      title={t`signUp.title`}
                      className='w-full !text-xl'
                      primary={false}
                      onClick={() => {
                        setOpenSignInModal((prev) => !prev);
                        setOpenRegister((prev) => !prev);
                        setOpenMobileHeader(false);
                      }}
                    />
                  </div>
                  <div className='mx-auto'>
                    <span className='text-stone-black'> I have an account! </span>{' '}
                    <button
                      type='button'
                      className='text-primary text-left underline font-semibold'
                      onClick={() => {
                        setOpenSignInModal((prev) => !prev);
                        setOpenMobileHeader(false);
                      }}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DrawerWrapper>
        <DrawerWrapper
          visible={!!openPopup}
          onVisible={setOpenPopup}
          onclose={() => setOpenPopup(false)}
          widthClass='w-[480px] '
          childClassname='!bg-primary-light relative'
          title={title}
          modalFooter={
            <Button
              title='Submit'
              loading={dtInput?.loader?.submitPromo}
              disabled={!dtInput?.promoCode}
              onClick={async () => {
                await dtInput?.submitPromoCode();
              }}
              className='uppercase text-xl !font-bold w-full'
            />
          }
        >
          {renderPopup()}
        </DrawerWrapper>

        <DrawerWrapper
          visible={isDealOpen}
          onVisible={setIsDealOpen}
          onclose={() => setIsDealOpen(false)}
          widthClass='w-[480px] '
          childClassname='!bg-primary-light relative'
          title={'Deals'}
        >
          {renderDeal()}
        </DrawerWrapper>
      </div>
      <div className='flex justify-between items-center gap-10'>
        {isMenuRoute && (
          <div className='sm:hidden w-full bg-primary-light '>
            <button
              onClick={() => {
                // setFromHeader(true);
                setOpenChangeLocation(true);
              }}
              className='w-full text-black transition-all px-4 py-2'
            >
              {isMounted && LocalStorage.getJSON(KEYS.DINING_OPTION) === 1 ? (
                <div className='flex flex-col items-start '>
                  <div className='text-sm text-stone-black font-medium flex items-center'>
                    <p>Delivery to</p>
                    <div>
                      <DownIcon size='12' className='ml-2 -mt-0.5' />
                    </div>
                  </div>

                  <div className='duration-200 group-hover:text-primary'>
                    <div className='uppercase font-semibold line-clamp-2 text-left'>
                      {address?.houseNumber} {address?.apt} {address?.city}
                    </div>
                  </div>
                </div>
              ) : isMounted && restaurant && LocalStorage.getJSON(KEYS.DINING_OPTION) === 0 ? (
                <div className='flex flex-col items-start'>
                  <div className='text-black text-sm font-medium'>
                    <p>Pickup From</p>
                  </div>
                  <div className='flex items-center duration-200 group-hover:text-primary'>
                    <div className='text-xl font-stone uppercase'>{restaurant.name}</div>
                    <div>
                      <DownIcon size='12' className='ml-2' />
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
