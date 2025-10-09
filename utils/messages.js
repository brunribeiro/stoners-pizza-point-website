const AUTH = {
  SIGNUP: 'You have registered successfully.',
  EMAIL_VERIFY: 'Please verify your email to unlock all features. Check your inbox now!',
  PASSWORD_VALIDATION:
    'Password must be 8 characters or more, and include uppercase, lowercase, numbers, and special characters.',
  PASSWORD_ERROR: 'Your entered new password is wrong.',
  NEW_PASSWORD_ERROR: 'Confirm password must be same as new password.',
  USER_EXISTS: 'The account already taken. Choose another or try to login.',
  LOGIN: 'You have logged in successfully.',
  INVALID_CREDENTIALS: 'Invalid login. Please verify your credentials and try again.',
  LOGOUT: 'You have logged out successfully.',
  CHANGE_PASSWORD: 'You have successfully changed your password. Please relogin to continue.',
  WRONG_PASSWORD: 'Your entered old password is wrong. Plese recheck and try again.',
  INVALID_TOKEN: 'You are unable to use this. Please try to relogin.',
  NO_USER_ID: 'User Id is required in the body and is missing',
  DELETE_ACCOUNT: 'Account deleted successfully.',
  BILLINGACCOUNT_UPDATE: 'Billing account updated.',
  GET_USER: 'User details obtained successfully.',
  USER_UPDATE: 'Your details has been updated successfully.',
  FORGOT_PASSWORD: 'Email has been sent to you, you can reset your password from there.',
  RESET_PASSWORD: 'Your password has been reset, now you can login using it.',
  REFRESH_TOKEN: 'Request for new token successfull',
};

const RESTAURANT = {
  NEAR_RESTAURANT: 'Near By Restaurant data fetch successfully.',
  RECENT_RESTAURANT: 'Recent restaurant data fetch successfully.',
  CREATE_RECENT: 'Recent restaurant create successfully.',
  FETCH_MENU_ITEM: 'Menu item data fetch successfully.',
  FAVORITE_RESTAURANT: 'Favorite restaurant data fetch successfully.',
  RESTAURANT_TIME: 'Restaurant time fetch successfully.',
  CATEGORY: 'Category data fetch successfully.',
  MENU_ITEM: 'Menu item data fetch successfully.',
  ITEM_OPTION: 'Item detail data fetch successfully.',
  NO_RESTAURAN_FOUND: 'No restaurant found according to your location.',
};

const ORDER = {
  ORDER_SUBMIT: 'Your order submitted successfully.',
  ORDER_CREATE: 'Your order create successfully.',
  CARD_LIST: 'Your card list has been fetched successfully.',
  ORDER_LIST: 'Your order list has been fetched successfully.',
  ORDER_UPDATE: 'Your order update successfully.',
};

const CART = {
  ADD: 'Item successfully added to your cart.',
  REMOVE: 'Item successfully removed from your cart.',
  COUNTS: 'Cart counts fetched successfully.',
  LIST: 'Cart details obtained successfully.',
  WRONG_QUNT: 'Please enter valid item quantity to decrease.',
  NOT_FOUND: 'Cart not found!',
  LOC_CHANGE_WITH_WARNING: 'Warning! {items} is not available at your selected location.',
  LOC_CHANGE: 'You successfully changed your location.',
};

const COUPON = {
  LIST: 'Coupons details obtained successfully.',
  APPLY: 'Coupon applied.',
  REMOVE: 'Coupon removed.',
};

const DELIVERY = {
  ADD: 'Your delivery address add successfully.',
};
const REWARDS = {
  GET_BALANCE: 'Rewards balance retrived successfully.',
  GET_REWARDS_BYSTORE: 'Your rewards retrived successfully.',
  GET_REWARDS_BYITEMS:
    'Your rewards were successfully retrieved in accordance with your purchases.',
  REWARDS_ADD_BYORDER: 'Your reward apply successfully.',
  REWARDS_DELETE: 'Your reward removed successfully.',
};

const PAYMENT_METHOD = {
  GET_PAYMENT_METHOD: 'Payment method fetched successfully.',
};

const DATE = {
  FORMATE: 'YYYYMMDD',
  FORMATE_HH_MM: 'YYYYMMDD HH:mm',
};
const ADS = {
  USER_ADS: 'You successfully viewed ads.',
  USER_ADS_LIST: 'Viewed ads data fetched successfully.',
};

const PAYMENT_METHOD_TYPE = {
  GOOGLE_PAY: '1',
  APPLE_PAY: '2',
  CREDIT_CARD: '3',
};
export {
  AUTH,
  RESTAURANT,
  CART,
  ORDER,
  REWARDS,
  DATE,
  DELIVERY,
  ADS,
  PAYMENT_METHOD,
  COUPON,
  PAYMENT_METHOD_TYPE,
};
