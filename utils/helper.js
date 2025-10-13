import Router from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getCookie, setCookie } from 'cookies-next';
import axios from 'axios';
import getConfig from 'next/config';

import {
  DEFAULT_DATE_FORMAT,
  KEYS,
  RESTAURANT_TYPE,
  DEFAULT_LIMIT,
  SIDEBAR_TABS,
} from '@/utils/constant';
import commonApi from '@/services/api/common';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

const getCurrentTimeStamp = () => {
  const today = new Date();
  const time = {
    hour: today.getHours(),
    mins: today.getMinutes(),
  };
  return time;
};
const { publicRuntimeConfig } = getConfig();

const handleRefreshToken = async () => {
  const baseUrl = `${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/`;
  if (getCookie(KEYS.REFRESHTOKEN)) {
    try {
      const token = getCookie(KEYS.REFRESHTOKEN);
      const response = await axios.get(`${baseUrl}user/refresh-token`, {
        headers: {
          refreshtoken: token,
        },
      });

      setCookie(KEYS.REFRESHTOKEN, response.data.data.refresh_token);
      setCookie(KEYS.TOKEN, response.data.data.access_token);
      setCookie(KEYS.EXPIRES, Math.floor(Date.now() / 1000) + response?.data?.data.expires_in / 10);
    } catch (error) {
      console.error('Error refreshing token: ', error);
    }
  }
};

const displayAmount = (amount = 0) => {
  const numericAmount = isNaN(amount) ? 0 : parseFloat(amount);
  const formattedAmount = numericAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formattedAmount;
};

const concatCurrentTime = (date) => {
  const currentDate = date
    ? dayjs(
        dayjs(date, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' ' + dayjs().format('HH:mm:ss'),
      ).format('YYYY-MM-DDTHH:mm:ss')
    : dayjs().format('YYYY-MM-DDTHH:mm:ss');

  return currentDate;
};

const getClinic = () => getCookie('clinic') ?? '';

const customStyles = {
  placeholder: (defaultStyles) => {
    return {
      ...defaultStyles,
      color: '#a6a6a6',
      fontSize: '14px',
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    };
  },
  control: (provided, { isFocused, isDisabled }) => ({
    ...provided,
    minHeight: '48px',
    boxShadow: 'none',
    fontSize: '14px',
    borderRadius: '8px',
    borderWidth: '1px',
    backgroundColor: isDisabled && '#FAFAFA',
    borderColor: isFocused && 'var(--primary-color)',
    outline: isFocused && '2px solid var(--primary-color)',
    '&:hover': {
      borderWidth: '1px',
      borderColor: isFocused && 'var(--primary-color)',
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 99,
    borderRadius: '8px',
  }),
  option: (styles, { isFocused }) => {
    return {
      ...styles,
      fontSize: 14,
      fontWeight: 500,
      textTransform: 'capitalize',
      background: isFocused ? 'var(--primary-color)' : '#ffffff',
      color: isFocused ? '#fff' : '#000',
    };
  },
  noOptionsMessage: (base) => ({
    ...base,
    fontSize: 14,
    fontWeight: 500,
    color: '#000000',
  }),
  indicatorSeparator: (styles) => {
    return {
      ...styles,
      display: 'none',
    };
  },
};

const checkPhone = (e, type, formik) => {
  const { value: oldValue } = formik?.getFieldProps(type) || {};
  const { value } = e.target;
  if (value && /^\d+$/.test(value)) {
    formik?.setFieldValue(type, e.target.value);
  } else if (!e.target?.value) {
    formik?.setFieldValue(type, '');
  } else {
    formik?.setFieldValue(type, oldValue);
  }
};

const strToJSDate = (str) => {
  const value = dayjs(str, 'DD/MM/YYYY').toDate();
  if (Object.prototype.toString.call(value) === '[object Date]') {
    if (Number.isNaN(value.getTime())) {
      // d.valueOf() could also work
      return undefined;
    } else {
      return value;
    }
  }

  return undefined;
};

const tzDateDisplay = (date, format = 'DD MMM YYYY') => {
  return dayjs(date).tz(tz).format(format);
};

const jsDatetoStr = (date) => {
  const value = new Date(date);
  if (Object.prototype.toString.call(value) === '[object Date]') {
    if (Number.isNaN(value.getTime())) {
      // d.valueOf() could also work
      return undefined;
    } else {
      return value.toLocaleDateString();
    }
  }
  return undefined;
};

const timeDisplay = (date) => {
  return dayjs(date).format('hh:mm A');
};

const timeDisplayWithouUTC = (date, dateFormat = 'hh:mm A') => {
  return dayjs(date).format(dateFormat);
};
const getDuration = (startDate, endDate) => {
  const date1 = dayjs(startDate);
  const date2 = dayjs(endDate);
  return date2.diff(date1, 'minutes');
};

const timeDisplayUTC = (date, format = 'hh:mm A') => {
  return dayjs(date).utc().format(format);
};

const formatDate = (date, dateFormat = DEFAULT_DATE_FORMAT) => {
  return dayjs(date).format(dateFormat);
};

const dateDisplayUTC = (date, dateFormat = 'DD MMM YYYY') => {
  return dayjs(date).utc().format(dateFormat);
};

const dateDisplay = (date, dateFormat = 'DD MMM YYYY') => {
  return dayjs(date).format(dateFormat);
};

const capitalizaWords = (sentence = '') => {
  const arr = sentence.split(' ');

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(' ');
};

export const filterObject = (object = {}) =>
  Object.fromEntries(
    Object.entries(object)
      .map(([key, value]) => value && [key, value])
      .filter((item) => item),
  );

export const objectToQueryString = (object = {}) =>
  new URLSearchParams(filterObject(object)).toString();

export const checkTimeGrater = (timeStr1, timeStr2) => {
  const regex = new RegExp(':', 'g');

  return parseInt(timeStr2.replace(regex, ''), 10) > parseInt(timeStr1.replace(regex, ''), 10);
};

export const formatName = (str = '') => {
  return str ? str.slice(0, 50) + (str.length <= 50 ? '' : '...') : str;
};

export const debounce = (callback, wait = 1000) => {
  let timeout;

  return function executedFunction(...parameters) {
    const later = () => {
      clearTimeout(timeout);
      callback(...parameters);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Create a stable key from a coordinate object used in restaurant searches
export const restaurantCoordKey = (coord) => {
  if (!coord) return 'nil';
  const lat = coord?.lat ?? coord?.latitude;
  const lng = coord?.lng ?? coord?.long ?? coord?.longitude;
  return `${lat || 0},${lng || 0}`;
};

export const roundAmount = (amount = 0, precision = 0) => Number(amount).toFixed(precision);

function convertTZ(date, tzString) {
  return new Date(
    (typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
      timeZone: tzString,
    }),
  );
}

const getErrors = ({ objKey = false, inputName, formik }) => {
  if (objKey) {
    return formik.touched?.[objKey]?.[inputName] && formik.errors?.[objKey]?.[inputName];
  } else {
    return formik.touched?.[inputName] && formik.errors?.[inputName];
  }
};
const getDomain = (input) => {
  return input
    .replace(/-+/g, '-')
    .replace(/ +/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    ?.toLowerCase();
};

const replaceSpecialCharacter = (input) => {
  return input.replace(/[^a-zA-Z0-9-\s]/g, '');
};

const getRouterCookie = () => (getCookie('clinic') ? `/${getCookie('clinic')}` : '');

const ERouter = {
  push: (route) => {
    if (route.pathname) {
      Router.push({
        ...route,
        pathname: `${getRouterCookie()}${route.pathname}`,
      });
    } else {
      Router.push(`${getRouterCookie()}${route}`);
    }
  },
  replace: (route) => {
    Router.replace(`${getRouterCookie()}${route}`);
  },
};

// const getRouter = () => {
//   const { query } = Router.useRouter();
//   const isClinic = !!query?.clinicSlug;
//   return isClinic ? ERouter : Router;
// };

const getQuery = (searchFields, searchValue = '') => {
  const query = {
    $or: [],
  };

  searchFields.forEach((field) => {
    const fieldQuery = {
      [field]: {
        $regex: searchValue,
        $options: 'i',
      },
    };

    query.$or.push(fieldQuery);
  });

  return query;
};

const generateColorVariant = (hexCode, factor) => {
  // Validate hex code
  const hex = hexCode.replace(/^#/, '');
  if (hex.length !== 6) {
    throw new Error('Invalid hex code');
  }

  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Adjust RGB values based on the factor (negative for darker, positive for lighter)
  r = Math.round(Math.min(255, Math.max(0, r + r * factor)));
  g = Math.round(Math.min(255, Math.max(0, g + g * factor)));
  b = Math.round(Math.min(255, Math.max(0, b + b * factor)));

  // Convert back to hex
  const resultHex = `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;

  return resultHex;
};

const generateContrastColor = (hexCode) => {
  // Validate hex code
  const hex = hexCode.replace(/^#/, '');
  if (hex.length !== 6) {
    throw new Error('Invalid hex code');
  }

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Invert the color by subtracting each component from 255
  const contrastR = 255 - r;
  const contrastG = 255 - g;
  const contrastB = 255 - b;

  // Convert back to hex
  const contrastHex = `#${((1 << 24) | (contrastR << 16) | (contrastG << 8) | contrastB)
    .toString(16)
    .slice(1)}`;

  return contrastHex;
};

const genNumbers = (count = 0) => {
  return [...Array(count)].map((_, i) => {
    return i < 10 ? `0${i}` : `${i}`;
  });
};

const stripeStyle = (themeColor) => ({
  style: {
    base: {
      iconColor: themeColor,
      color: '#000',
      fontWeight: '500',
      fontFamily: 'Karla, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      height: '44px',
      border: '1px solid #c3c3c3',
      ':disabled': {
        color: '#c3c3c3',
        cursor: 'not-allowed',
      },
    },
  },
});

const capitalizeFirstLetterString = (string = '') =>
  `${string?.charAt(0)?.toUpperCase()}${string?.slice(1)}`;

const setCountryData = async (countryName) => {
  const { DATA } = await commonApi({
    action: 'countriesList',
    data: {
      query: {
        isActive: true,
        ...getQuery(['name'], countryName),
      },
    },
  });
  const list = DATA?.data?.map((opt) => ({
    value: opt?.id,
    label: opt?.name,
    ...opt,
  }));
  return list[0];
};

const getStartEndTime = (startDate, endDate) => {
  return `${dateDisplay(startDate, 'h:mma')} - ${dateDisplay(endDate, 'h:mma')}`;
};
function formatTimeTo12Hour(timeString) {
  // Split the input time string into its components
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');

  // Convert hours from string to number
  let hour = parseInt(hours, 10);

  // Determine AM or PM suffix
  const suffix = hour >= 12 ? 'pm' : 'am';

  // Convert to 12-hour format
  hour = hour % 12 || 12; // Convert '0' hour to '12' for 12 AM/PM

  // Return formatted time
  return `${hour}:${minutes} ${suffix}`;
}

const extractDay = (date) => {
  // Ensure the input is a valid Date object
  if (!(date instanceof Date) || isNaN(date)) {
    return null; // Return null or handle the error if the input is invalid
  }

  // Get the day of the month (1-31)
  const day = date.getDate();

  // Convert day to a string to remove any leading zeros (e.g., '03' to '3')
  return day.toString();
};

const getDayNames = (date) => {
  // Assuming 'date' is a Date object
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Get the day index (0-6) for the given date
  const dayIndex = date.getDay();

  // Return the first three letters of the day name
  return dayNames[dayIndex].slice(0, 3);
};

const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/[^\d]/g, '');

  const formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;

  return { cleaned, formatted };
};

const formatPhoneNumber2 = (phoneNumberString) => {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? '+1 ' : '';
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return null;
};

const formatCustomDate = (dateString) => {
  const date = dayjs(dateString);
  const now = dayjs();

  if (date.isSame(now, 'day')) {
    // If the date is today
    return date.fromNow(); // e.g., "40 minutes ago"
  } else if (date.isSame(now.subtract(1, 'days'), 'day')) {
    // If the date is yesterday
    return 'Yesterday';
  } else if (date.isSame(now, 'week')) {
    // If the date is within the current week
    return date.format('dddd'); // e.g., "Thursday"
  } else if (date.isSame(now, 'month')) {
    // If the date is in the same month
    return date.format('MMM DD'); // e.g., "Sep 04"
  } else if (date.isSame(now.subtract(1, 'months'), 'month')) {
    // If the date is in the last month
    return 'Last month';
  } else {
    // For all other cases, return the full date
    return date.format('MMM DD, YYYY'); // e.g., "Aug 15, 2024"
  }
};

const localDateTime = (format = 'YYYY-MM-DDTHH:mm:ss') => {
  return dayjs().format(format);
};

// Set an item in localStorage
export const setLocalStorageItem = (key, value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

// Get an item from localStorage
export const getLocalStorageItem = (key) => {
  if (typeof window !== 'undefined') {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

// Remove an item from localStorage
export const removeLocalStorageItem = (key) => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
};

// Clear all items in localStorage
export const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
  }
};

function convertTo12Hour(dateTimeString) {
  if (!dateTimeString) return 'Invalid time';

  // Split the dateTime string by 'T' to get the time part
  const timeString = dateTimeString.split('T')[1];

  if (!timeString) return 'Invalid time';

  // Extract hours and minutes
  let hours = timeString.split(':')[0]; // 'hours' will be reassigned, so use 'let'
  const minutes = timeString.split(':')[1]; // 'minutes' is not reassigned, so use 'const'

  // Convert hours from string to number
  hours = parseInt(hours, 10);

  // Determine AM or PM
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert 24-hour time to 12-hour time
  hours = hours % 12 || 12; // If hours is 0 or 12, set it to 12 for 12-hour format

  // Return the formatted time in 12-hour format with AM/PM
  return `${hours}:${minutes} ${ampm}`;
}
export const formatDateTime = (date, time) => {
  const year = date?.slice(0, 4);
  const month = date?.slice(4, 6);
  const day = date?.slice(6, 8);

  const hours = time?.slice(0, 2);
  const minutes = time?.slice(3, 5);

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Build payload for getNearByRestaurant APIs (pickup/delivery)
// Accepts the current tab, optional pickup/delivery coordinates, and optional userId
const buildRestaurantPayload = ({ currentTab, pickupLocation, selectedLocation, userId }) => {
  const pickUpAddress = currentTab === SIDEBAR_TABS.pickup &&
    pickupLocation && {
      latitude: pickupLocation?.lat,
      longitude: pickupLocation?.lng,
    };

  const deliveryAddress = currentTab === SIDEBAR_TABS.delivery &&
    selectedLocation && {
      latitude: selectedLocation?.lat,
      longitude: selectedLocation?.lng,
    };

  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    date: Date.now().toString(),
    page: 1,
    limit: DEFAULT_LIMIT,
    type: currentTab === SIDEBAR_TABS.pickup ? RESTAURANT_TYPE.pickUp : RESTAURANT_TYPE.delivery,
    ...(userId && { userId }),
    ...deliveryAddress,
    ...pickUpAddress,
  };
};

export const placesSessionKey = (isPickUp = false) =>
  isPickUp ? 'pickupUserAddress' : 'deliveryUserAddress';

export const getAddressComponentValue = (components = [], type) =>
  components.find((c) => Array.isArray(c.types) && c.types.includes(type))?.long_name || '';

// Build our app's address data shape from Google geocode results
export const buildAddressDataFromGeoResults = (geoResults = [], lat, lng) => {
  if (!geoResults?.length) return {};
  const components = geoResults[0].address_components || [];
  const formattedAddress = geoResults[0].formatted_address;
  return {
    streetAddress: getAddressComponentValue(components, 'route'),
    city: getAddressComponentValue(components, 'locality'),
    state: getAddressComponentValue(components, 'administrative_area_level_1'),
    country: getAddressComponentValue(components, 'country'),
    zipcode: getAddressComponentValue(components, 'postal_code'),
    street1: getAddressComponentValue(components, 'street_number'),
    formattedAddress,
    lat,
    long: lng,
    description: formattedAddress,
  };
};

// =========================
// SideBar helpers (UI/Render logic extract)
// =========================

// Returns className for the ORDER TYPE switch container based on context
export const getOrderTypeContainerClass = (fromHeader = false) =>
  `bg-white rounded-full flex justify-between cursor-pointer items-center h-[50px] border-[3px] border-black  w-full relative ${
    fromHeader ? 'max-w-[400px]' : 'max-w-[512px]'
  }`;

// Decide which list to render on Pickup panel
export const pickPickupList = (dt) => {
  // Only use search list when an explicit pickup location is set.
  const useSearch = !!dt?.pickupLocation;
  return useSearch ? dt?.pickupSearchList : dt?.restaturantList;
};

// Whether to show the secondary skeleton (initial loading without pickup location)
export const showPickupSecondarySkeleton = (dt) => {
  // Show secondary skeleton only when loading without a pickup location.
  return dt?.loader?.list && !dt?.pickupLocation;
};

// Whether to show the primary skeleton
export const showPickupPrimarySkeleton = (dt) => {
  // Primary skeleton applies when loading a search-driven list (explicit pickup location).
  const usingSearch = !!dt?.pickupLocation;
  return (
    (dt?.loader?.list && usingSearch) ||
    (usingSearch ? dt?.pickupSearchList?.[0] === false : dt?.restaturantList?.[0] === false)
  );
};

// Whether the list is empty on pickup panel
export const isPickupEmpty = (dt) => {
  // Only consider empty state for search-driven results (explicit pickup location selected)
  const usingSearch = !!dt?.pickupLocation;
  // Only consider empty state for search-driven results.
  // For default list (no pickup location/session), suppress empty message to avoid initial flicker.
  if (!usingSearch) return false;

  // Ensure we are not currently loading and we didn't set the sentinel `false` (pending fetch)
  // before deciding it's truly empty.
  return (
    !dt?.loader?.list &&
    dt?.pickupSearchList?.[0] !== false &&
    Array.isArray(dt?.pickupSearchList) &&
    dt?.pickupSearchList?.length === 0
  );
};

// Delivery panel helpers
export const hasDeliveryList = (dt, localDeliveryAddress) =>
  !dt?.loader?.list &&
  !!localDeliveryAddress &&
  dt?.deliverySearchList?.[0] !== false &&
  dt?.deliverySearchList?.length > 0;

export const isDeliveryEmpty = (dt, localDeliveryAddress) =>
  !dt?.loader?.list &&
  localDeliveryAddress &&
  dt?.deliverySearchList?.[0] !== false &&
  dt?.deliverySearchList?.length === 0;

const filterSelModifier = (selmodifier, savedMod, newNestedState) => {
  const optionGroupPlatOpGrpIds = new Set(
    (newNestedState.option_groups || []).map((group) => group.platOpGrpId),
  );

  const savedModUniqIds = new Set();
  function collectPlatModUniqIds(mods) {
    for (const mod of mods) {
      savedModUniqIds.add(mod.platModUniqId);
      // if (mod.modifiers && mod.modifiers.length) {
      //   collectPlatModUniqIds(mod.modifiers);
      // }
    }
  }
  collectPlatModUniqIds(savedMod);

  const filteredSelModifier = selmodifier.filter((mod) => {
    const shouldCheck = optionGroupPlatOpGrpIds.has(mod.platOpGrpId);
    const isInSavedMod = savedModUniqIds.has(mod.platModUniqId);
    return shouldCheck && !isInSavedMod;
  });

  return filteredSelModifier;
};

const handleValidation = (restDate, selectedTime) => {
  const newErrors = {};
  if (!restDate) {
    newErrors.date = 'Date is Required';
  }

  if (!selectedTime) {
    newErrors.time = 'Time is Required';
  }

  if (Object.keys(newErrors).length === 0) {
    newErrors.error = true;
  }
  return newErrors;
};

const sanitizeName = (text) => text.replace(/\*/g, '');

const gethalfNhalfPrice = (updatedModifiers, type, setHalfNhalfPrice, id) => {
  const currMod = updatedModifiers.find((item) => {
    return item?.modNm?.includes(type);
  });
  if (currMod?.modifiers) {
    const Hpirce = currMod?.modifiers.find((item) => {
      return item.toppingId === id;
    });
    if (Hpirce) {
      setHalfNhalfPrice(Hpirce.amt);
    }
  } else {
    setHalfNhalfPrice();
  }
};

export const initializeAtlasChatbot = () => {
  const openChatWindow = () => {
    if (window.Atlas && typeof window.Atlas.chat.openWindow === 'function') {
      window.Atlas.chat.openWindow();
      console.log('Atlas chat window opened successfully!');
    } else {
      console.error('Atlas chat API is not available yet.');
    }
  };
  openChatWindow();
};

function getDeviceInfo() {
  const ua = navigator.userAgent;
  const deviceType = /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? 'Mobile' : 'Web';
  let os = 'Unknown';

  if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else {
    // do nothing
  }

  return { deviceType, os };
}

export {
  sanitizeName,
  formatPhoneNumber2,
  gethalfNhalfPrice,
  handleValidation,
  filterSelModifier,
  displayAmount,
  handleRefreshToken,
  getCurrentTimeStamp,
  customStyles,
  checkPhone,
  strToJSDate,
  jsDatetoStr,
  timeDisplay,
  dateDisplay,
  capitalizaWords,
  tzDateDisplay,
  timeDisplayUTC,
  timeDisplayWithouUTC,
  dateDisplayUTC,
  formatDate,
  convertTZ,
  getErrors,
  getDomain,
  ERouter,
  getClinic,
  // getRouter,
  getQuery,
  replaceSpecialCharacter,
  generateColorVariant,
  generateContrastColor,
  genNumbers,
  getRouterCookie,
  concatCurrentTime,
  stripeStyle,
  capitalizeFirstLetterString,
  setCountryData,
  getStartEndTime,
  getDuration,
  formatTimeTo12Hour,
  extractDay,
  getDayNames,
  formatPhoneNumber,
  formatCustomDate,
  localDateTime,
  convertTo12Hour,
  getDeviceInfo,
  buildRestaurantPayload,
};
