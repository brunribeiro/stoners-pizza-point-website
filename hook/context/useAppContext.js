import React from 'react';

import { getLocalStorageItem } from '@/utils/helper';

const useAppContext = () => {
  const [openSignInModal, setOpenSignInModal] = React.useState(false);
  const [itemCount, setItemCount] = React.useState(0);
  const [openRegister, setOpenRegister] = React.useState(false);
  const [globleCartItem, setGlobleCartItem] = React.useState(0);
  const [loginData, setLoginData] = React.useState({});
  const [token, setToken] = React.useState();
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [runOnce, setRunOnce] = React.useState({ cartCount: false, reward: false });
  const [selectedLocation, setSelectedLocation] = React.useState();
  const [userCoordinates, setUserCoordinates] = React.useState();
  const [isLoadedMap, setIsLoadedMap] = React.useState(false);
  const [deliveryAddress, setDeliveryAddress] = React.useState({});
  const [offerList, setOfferList] = React.useState([]);
  const [promoProps, setPromoProps] = React.useState({});
  const [selectedCard, setSelectedCard] = React.useState(false);
  const [selectedGiftCard, setSelectedGiftCard] = React.useState(false);
  const [orderReceipt, setOrderReceipt] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState(false);
  const localAppliedOffer = getLocalStorageItem('appliedOffer');
  const [appliedOffer, setAppliedOffer] = React.useState(localAppliedOffer);
  const [applicableOffers, setApplicableOffers] = React.useState([]);
  const [currentTab, setCurrentTab] = React.useState(0);
  const [timeModal, setTimeModal] = React.useState(false);
  const [availableTimes, setAvailableTimes] = React.useState();
  const [reOrderId, setReOrderId] = React.useState();
  const [isPageLoad, setIsPageLoad] = React.useState(false);
  const [isButtonLoad, setIsButtonLoad] = React.useState({});
  const [nestedSelectItem, setNestedSelectItem] = React.useState({});
  const [parentSelectedItem, setParentSelectedItem] = React.useState({});
  const [selectedStore, setSelectedStore] = React.useState(null);
  const [openStoreDetail, setOpenStoreDetail] = React.useState(false);
  const [newNestedState, setNewNestedState] = React.useState({});
  const [editData, setEditData] = React.useState();
  const [selModifiers, setSelModifiers] = React.useState([]);
  const [pageLoad, setPageLoad] = React.useState(false);
  const [menuRestId, setMenuRestId] = React.useState();
  const [currentRestList, setCurrentRestList] = React.useState([]);
  const [isAutoComplete, setIsAutoComplete] = React.useState(false);
  const [openChangeLocation, setOpenChangeLocation] = React.useState(false);
  const [searchData, setSearchData] = React.useState([]);
  const [itemLoad, setItemLoad] = React.useState(false);
  const [openSwapMenu, setOpenSwapMenu] = React.useState(false);
  const [restaurant, setRestaurant] = React.useState(null);
  const [selectedAddress, setSelectedAddress] = React.useState();
  const [categoryName, setCategoryName] = React.useState();
  const [savedMod, setSavedMod] = React.useState([]);
  const [nestedSavedMod, setNestedSavedMod] = React.useState([]);
  const [guestInfo, setGuestInfo] = React.useState();
  const [initApiResponse, setInitApiResponse] = React.useState(null);
  const [loyaltyData, setLoyaltyData] = React.useState();
  const [categoryList, setCategoryList] = React.useState(false);
  const [modal, setModal] = React.useState({
    addExistGift: false,
    addGift: false,
    addCard: false,
  });
  // Shared restaurant lists to minimize API calls across the app
  const [restaturantList, setRestaturantList] = React.useState([false]);
  const [bySearchRestaturantList, setBySearchRestaturantList] = React.useState([false]);
  // Separate search lists per tab to avoid cross-tab interference
  const [pickupSearchList, setPickupSearchList] = React.useState([false]);
  const [deliverySearchList, setDeliverySearchList] = React.useState([false]);

  return {
    loyaltyData,
    setLoyaltyData,
    initApiResponse,
    setInitApiResponse,
    guestInfo,
    setGuestInfo,
    nestedSavedMod,
    setNestedSavedMod,
    savedMod,
    setSavedMod,
    categoryName,
    setCategoryName,
    selectedAddress,
    setSelectedAddress,
    restaurant,
    setRestaurant,
    openSwapMenu,
    setOpenSwapMenu,
    itemLoad,
    setItemLoad,
    searchData,
    setSearchData,
    openChangeLocation,
    setOpenChangeLocation,
    newNestedState,
    setNewNestedState,
    openStoreDetail,
    setOpenStoreDetail,
    selectedStore,
    setSelectedStore,
    selModifiers,
    setSelModifiers,
    openSignInModal,
    setOpenSignInModal,
    loginData,
    setLoginData,
    token,
    setToken,
    selectedItem,
    setSelectedItem,
    selectedLocation,
    setSelectedLocation,
    nestedSelectItem,
    setNestedSelectItem,
    isLoadedMap,
    setIsLoadedMap,
    deliveryAddress,
    setDeliveryAddress,
    userCoordinates,
    setUserCoordinates,
    offerList,
    setOfferList,
    promoProps,
    setPromoProps,
    selectedCard,
    setSelectedCard,
    itemCount,
    setItemCount,
    orderReceipt,
    setOrderReceipt,
    globleCartItem,
    setGlobleCartItem,
    openRegister,
    setOpenRegister,
    openPopup,
    setOpenPopup,
    appliedOffer,
    setAppliedOffer,
    applicableOffers,
    setApplicableOffers,
    currentTab,
    setCurrentTab,
    selectedGiftCard,
    setSelectedGiftCard,
    timeModal,
    setTimeModal,
    availableTimes,
    setAvailableTimes,
    reOrderId,
    setReOrderId,
    isPageLoad,
    setIsPageLoad,
    pageLoad,
    setPageLoad,
    modal,
    setModal,
    runOnce,
    setRunOnce,
    editData,
    setEditData,
    menuRestId,
    setMenuRestId,
    currentRestList,
    setCurrentRestList,
    isAutoComplete,
    setIsAutoComplete,
    isButtonLoad,
    setIsButtonLoad,
    parentSelectedItem,
    setParentSelectedItem,
    categoryList,
    setCategoryList,
    // shared restaurant lists
    restaturantList,
    setRestaturantList,
    bySearchRestaturantList,
    setBySearchRestaturantList,
    // per-tab search lists
    pickupSearchList,
    setPickupSearchList,
    deliverySearchList,
    setDeliverySearchList,
  };
};

export default useAppContext;
