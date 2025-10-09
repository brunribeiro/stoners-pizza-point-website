const routes = {
  // menu: '/menu/categories',
  menu: (diningOption, rest) => `/${diningOption}/${rest}/menu/categories`,
  // items: '/menu/categories/items',
  items: (diningOption, rest, id) => `/${diningOption}/${rest}/menu/categories/${id}`,
  selectedItem: (diningOption, rest, itemId, isEdit = false) =>
    `/${diningOption}/${rest}/menu/categories/items/${itemId}${isEdit ? '?isEdit=true' : ''}`,
  home: '/',
  settings: '/settings',
  inbox: '/inbox',
  orderHistory: '/order',
  myCard: '/my-cards',
  add: '/my-cards/add',
  editCard: (id) => `/my-cards/${id}`,
  thankYou: '/thankyou',
  order: (id) => `/order/${id}`,
  checkout: '/checkout',
  purchaseGiftCard: '/my-cards/purchase-gift-card',
  addExistingCard: '/my-cards/add-gift-card',
  emailGiftCard: '/my-cards/email-gift-card',
  cart: '/cart',
  deals: '/deals',
  giftCardConfirmation: '/my-cards/email-gift-card/confirmation',
  diningOption: (mode) => `/${mode}`,
};

module.exports = routes;
