import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import Header from './header/header';

import useItemModel from '@/hook/model/useItemModel';
import AppContext from '@/utils/appContext';
import useCart from '@/components/Menu/hook/useCart';
import { KEYS } from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';
import MaintenanceScreen from '@/components/common/MaintenaceScreen';
import useCheckMaintence from '@/hook/index/useCheckMaintence';

const LayoutWrapper = ({ children, childClassName = '', changeLocation, id = null }) => {
  const {
    loginData,
    setGlobleCartItem,
    setSelModifiers,
    setSelectedItem,
    setEditData,
    setNestedSelectItem,
  } = useContext(AppContext);
  const router = useRouter();

  const { checkMaintence, loading, IsMaintenance } = useCheckMaintence();

  useEffect(() => {
    if (!router.pathname.includes('/items')) {
      setSelModifiers([]);
      setSelectedItem(null);
      setEditData(null);
      setNestedSelectItem();
      LocalStorage.remove(KEYS.EDIT_ITEM);
    }
  }, []);

  const { ...dtCart } = useCart();
  useEffect(() => {
    if (dtCart?.cartItem?.length > 0) {
      setGlobleCartItem(dtCart?.cartItem?.[0]);
    }
  }, [dtCart.cartItem, setGlobleCartItem]);

  useEffect(() => {
    if (loginData?.userId) {
      dtCart.getCartCount();
    }
  }, [loginData?.userId]);
  const { ...dtuseModel } = useItemModel();

  return (
    <div id={id} className='z-20 relative h-full'>
      {IsMaintenance.underMaintenance ? (
        <MaintenanceScreen loading={loading} checkMaintence={checkMaintence} />
      ) : (
        <>
          <Header
            dtuseModel={dtuseModel}
            changeLocation={changeLocation}
            cartLoad={dtCart.cartLoad}
          />
          <div className={`${childClassName}`}>{children}</div>
        </>
      )}
    </div>
  );
};

export default LayoutWrapper;
