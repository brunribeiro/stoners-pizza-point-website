const apiList = {
  registerUser: {
    url: () => 'user/signup',
    method: 'post',
  },
  signInUser: {
    url: () => 'user/signin',
    method: 'post',
  },
  resendverificationmail: {
    url: (email) => `user/${email}/resendverificationmail`,
    method: 'get',
  },
  profile: {
    url: () => 'user/me',
    method: 'get',
  },
  updateProfile: {
    url: () => 'user/update',
    method: 'post',
  },
  logout: {
    url: () => 'user/logout',
    method: 'get',
  },
  forgotPassword: {
    url: (email) => `user/forgot-password/${email}`,
    method: 'get',
  },
  deleteAccount: {
    url: () => 'user/delete-account',
    method: 'delete',
  },
  changePassword: {
    url: () => 'user/change-password',
    method: 'post',
  },
  getNearByRestaurant: {
    url: () => 'restaurant/near_by_restaurants_state_wise',
    method: 'post',
  },
  getNearByRestaurant_bySearch: {
    url: () => 'restaurant/near_by_restaurants',
    method: 'post',
  },
  getRestaurantTimePickup: {
    url: (restId, isDelivery) =>
      `restaurant/${restId}/restaurantTime${isDelivery ? '?isDelivery=true' : '?isDelivery=false'}`,
    method: 'post',
  },
  getRestDetail: {
    url: (restId) => `restaurant/${restId}/details`,
    method: 'get',
  },
  addAddress: {
    url: () => 'address/add',
    method: 'post',
  },
  editAddress: {
    url: () => 'address',
    method: 'post',
  },
  deleteAddress: {
    url: () => 'address/delete',
    method: 'post',
  },
  addressList: {
    url: () => 'address/get',
    method: 'post',
  },
  // promocode
  offerList: {
    url: () => 'payment/offer-list',
    method: 'post',
  },
  msgList: {
    url: () => 'messages/app-messaging',
    method: 'post',
  },
  orderOffers: {
    url: () => 'payment/order-offers',
    method: 'post',
  },
  applyDiscount: {
    url: () => 'order/apply-discount',
    method: 'post',
  },
  removeDiscount: {
    url: () => 'order/remove-discount',
    method: 'post',
  },
  changeDistributedOfferstatus: {
    url: () => 'payment/change-distributed-offerstatus',
    method: 'post',
  },
  submitPromoCode: {
    url: () => 'payment/promo-code',
    method: 'post',
  },
  orderHistory: {
    url: () => 'order/history',
    method: 'post',
  },
  orderDetail: {
    url: (id) => `order/${id}/details`,
    method: 'get',
  },
  orderPriceDetail: {
    url: () => 'order/incentivio-order-detail',
    method: 'post',
  },
  copyOrder: {
    url: (id) => `order/copy-order/${id}`,
    method: 'post',
  },
  reOrder: {
    url: (id) => `order/re-order/${id}`,
    method: 'post',
  },

  // payment method

  getPaymentList: {
    url: () => 'payment/get-methods',
    method: 'get',
  },
  getCard: {
    url: (id) => `payment/get-methods/${id}`,
    method: 'get',
  },
  addCard: {
    url: () => 'payment/add-card-v2',
    method: 'post',
  },
  spreedlyAPI: {
    url: () => 'payment/add-card-v3',
    method: 'post',
  },
  editCard: {
    url: (id) => `giftCard/update/${id}`,
    method: 'post',
  },
  deleteCard: {
    url: (id) => `payment/delete-card/${id}`,
    method: 'delete',
  },
  paymentInit: {
    url: () => 'payment/init',
    method: 'post',
  },
  makePayment: {
    url: () => 'payment/make-payment',
    method: 'post',
  },

  clientList: {
    url: () => 'clients',
    method: 'post',
  },
  getClientDetail: {
    url: (id) => `client/${id}`,
    method: 'get',
  },
  createAppointment: {
    url: () => 'appointment',
    method: 'post',
  },
  getappointmenByDate: {
    url: (date) => `appointments/date/${date}`,
    method: 'post',
  },
  getAppointmenDetail: {
    url: (id) => `appointments/${id}`,
    method: 'post',
  },
  deleteAppointment: {
    url: () => 'appointment',
    method: 'delete',
  },
  getTherapistToken: {
    url: () => 'token',
    method: 'get',
  },
  getAppointmentSummary: {
    url: (appointmentId) => `summaries/${appointmentId}`,
    method: 'get',
  },
  getAppointmenByClient: {
    url: (clientId) => `appointments/client/${clientId}`,
    method: 'post',
  },
  startStopTranscriptionStatus: {
    url: () => 'transcription',
    method: 'post',
  },
  updateAppointment: {
    url: (id) => `appointment/update/${id}`,
    method: 'put',
  },
  getCategoryList: {
    url: () => 'restaurant/menu?isCatering=false',
    method: 'post',
  },
  searchMenu: {
    url: () => 'restaurant/menu/item/search',
    method: 'post',
  },
  getItemList: {
    url: () => 'restaurant/menu/item',
    method: 'post',
  },
  getAllItems: {
    url: () => 'restaurant/menu/category-item/list',
    method: 'post',
  },
  getItemDetails: {
    url: () => 'restaurant/item-details',
    method: 'post',
  },
  addToCart: {
    url: () => 'cart/add-items',
    method: 'post',
  },
  createPosOrder: {
    url: () => 'cart/create-order-pos',
    method: 'post',
  },
  getItemPrice: {
    url: () => 'cart/orderitemprice',
    method: 'post',
  },
  getCart: {
    url: () => 'cart/list',
    method: 'post',
  },
  removeItem: {
    url: (id) => `cart/remove-item/${id}`,
    method: 'post',
  },
  getcartCount: {
    url: () => 'cart/counts',
    method: 'post',
  },
  getUpsell: {
    url: () => 'get_upsell_menu_items/get_menu_items',
    method: 'post',
  },
  purchaseGift: {
    url: () => 'giftCard/purchase/ecard',
    method: 'post',
  },
  getGiftCard: {
    url: () => 'giftCard/detail',
    method: 'post',
  },
  addValue: {
    url: () => 'giftCard/add-value',
    method: 'post',
  },
  addExistingCard: {
    url: () => 'giftCard/get',
    method: 'post',
  },
  updateTime: {
    url: () => 'cart/updateTime',
    method: 'post',
  },
  getLoyalty: {
    url: () => 'loyality/get',
    method: 'get',
  },
  getRefreshToken: {
    url: () => 'user/refresh-token',
    method: 'get',
  },
  getRewardHistory: {
    url: () => 'loyality/history',
    method: 'post',
  },
  getMasterList: {
    url: () => 'masters/list',
    method: 'post',
  },
  inMaintenance: {
    url: () => 'setting/mobile-version',
    method: 'get',
  },
};
export default apiList;
