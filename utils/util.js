import dayjs from 'dayjs';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { deleteCookie, setCookie } from 'cookies-next';

import Toast from './toast';
import { LocalStorage } from './localStorage';

import commonApi from '@/api/common';
import { KEYS } from '@/utils/constant';
import { resetPosthog } from '@/utils/analytics';

export const isArray = (data) => data.constructor.name === 'Array';

export const isObject = (data) => data.constructor.name === 'Object';

export const isBoolean = (data) => data.constructor.name === 'Boolean';

export const isString = (data) => data.constructor.name === 'String';

export const joinString = (text) => {
  return text.replaceAll(' ', '_');
};

export const removeNullAndUndefinedFromObject = (object) => {
  for (const propertyName in object) {
    if (
      object[propertyName] === null ||
      object[propertyName] === undefined ||
      object[propertyName] === ''
    ) {
      delete object[propertyName];
    }
  }
  return object;
};

export const addTitleSpace = (string) => {
  return string.split(/(?=[A-Z])/).join(' ');
};

export const capitalizeFirstLetter = (string = '') =>
  `${string.charAt(0)?.toUpperCase()}${string?.slice(1)}`;

const setDate = (date) => {
  return date ? dayjs(date) : '';
};
export const dateDisplay = (date, format = 'MM/DD/YYYY') => {
  return date ? dayjs(date).format(format) : '';
};

export const codeValidation = (string = '') => {
  return `${string
    ?.replace(/[^\s\w]/gi, '')
    ?.toUpperCase()
    ?.replace(/ /g, '_')
    ?.trim()}`;
};

export const handleCode = (event) => {
  // eslint-disable-next-line no-param-reassign
  event.target.value = codeValidation(event.target.value);
  return event;
};

const userLogout = async () => {
  try {
    const response = await commonApi({ action: 'logout' });

    if (!response) {
      console.error('Logout response is undefined');
      return false;
    }

    const { code, message } = response;

    if (code === 'SUCCESS') {
      resetPosthog();
      deleteCookie(KEYS.TOKEN);
      deleteCookie(KEYS.EXPIRES);
      deleteCookie(KEYS.REFRESHTOKEN);
      if (message) Toast.success(message);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

export const logout = async (directusAPI = true) => {
  if (directusAPI) {
    await userLogout();
  }
  await fetch('/api/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then(() => {
    LocalStorage.clean();
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    } else {
      window.location.reload();
    }
  });
};

export const handleCapitalize = (event) => {
  // eslint-disable-next-line no-param-reassign
  event.target.value = capitalizeFirstLetter(event.target.value);
  return event;
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
export const getMasterObject = (data = {}) => {
  return {
    label: data.name ?? data?.names?.en,
    value: data.id,
    desc: data.dataType,
    ...data,
  };
};
export const getLabelAndValue = (data) => {
  return {
    ...data,
    label: data.name ?? data?.names?.en,
    value: data.id,
  };
};

export const setValueFunction = (setValue, array, object) => {
  return array.map((index) => setValue(index, object?.[index]));
};
export const setValueToUndefined = (setValue, array) => {
  return array.map((index) => setValue(index));
};
export const clearErrorFunction = (clearErrors, array) => {
  return array.map((index) => clearErrors(index));
};

export const deleteUserUndefinedProperties = (object) => {
  for (const key of Object.keys(object)) {
    if (object[key] === undefined) {
      // eslint-disable-next-line no-param-reassign
      delete object[key];
    }
  }
};

export const getFilteredObject = (object) => {
  return Object.fromEntries(
    Object.entries(object).filter(([, v]) => v !== null && v !== undefined && v !== ''),
  );
};
export const displayName = (user = {}) => {
  return `${user.firstName || ''} ${user.lastName || ''}`;
};

export const isRegex = (string_) => {
  if (typeof string_ !== 'string') {
    return false;
  }
  return !!(/^\/(.+)\/[gimuy]*$/.test(string_) || /^#(.+)#[gimuy]*$/.test(string_));
};

export const convertToRegex = (string_) => {
  const regParts = string_.match(/^\/(.*?)\/([gim]*)$/);
  return regParts ? new RegExp(regParts[1], regParts[2]) : new RegExp(string_);
};

export const getType = (type, message, isMulti) => {
  switch (type) {
    case 'TEXT': {
      return yup.string(message);
    }
    case 'NUMBER': {
      return yup.string(message).transform((value) => (Number.isNaN(value) ? undefined : value));
    }
    case 'EMAIL': {
      return yup.string().email(message);
    }
    case 'TEXT_AREA': {
      return yup.string(message);
    }
    case 'TOGGLE_BUTTON': {
      return yup.boolean();
    }
    case 'DROPDOWN': {
      return isMulti ? yup.array() : yup.object();
    }
    case 'DATE': {
      return yup.date(message).transform((value) => (value === '' ? null : value));
    }
    case 'CHECK_BOX': {
      return yup.boolean();
    }
    case 'FILE': {
      return yup.object();
    }
    default: {
      return yup.string();
    }
  }
};

export const createValidationSchema = ({
  type,
  isRequired = false,
  isActive,
  regEx = null,
  errMsg,
  isMulti,
  title,
}) => {
  let schema = getType(type, `${title} is not valid.`, isMulti).nullable();
  if (!isActive) {
    return schema;
  }
  if (isRequired) {
    if (type === 'DROPDOWN' && isMulti) {
      schema = schema.min(1, `${title} is required.`);
    }
    schema =
      type === 'CHECK_BOX' || type === 'TOGGLE_BUTTON'
        ? schema
        : schema.required(`${title} is required.`);
  }

  if (regEx && isRegex(regEx)) {
    schema = schema.matches(convertToRegex(regEx), {
      message: errMsg?.en || `${title} is not valid.`,
      excludeEmptyString: true,
    });
  }

  return schema;
};

// eslint-disable-next-line consistent-return
export const formatArrayObject = (value_ = {}, label = '', value = '', nestedLabel = '') => {
  if (Array.isArray(value_)) {
    return value_.map((v) => ({
      ...v,
      label: v?.[label][nestedLabel],
      value: v?.[value],
    }));
  }

  if (value_) {
    return {
      ...value_,
      label: value_?.[label],
      value: value_?.[value],
    };
  }
};

export const formatProfile = (profile) =>
  profile
    ? {
        fileSize: profile?.fileSize?.toString(),
        name: profile?.name,
        uri: profile?.uri,
        mimeType: profile?.mimeType,
      }
    : undefined;

export const formatMaster = (master) =>
  master
    ? {
        code: master?.code,
        names: master?.names,
        name: master?.name,
        id: master?._id || master?.id,
      }
    : undefined;

export default setDate;

export const steps = [
  {
    icon: '/icons/join.svg',
    alt: 'Join',
    title: 'Join Stoner’s Rewards!',
    subtitle: 'Sign up on our website or app!',
  },
  {
    icon: '/icons/order.svg',
    alt: 'Order',
    title: 'Order Your Pizza Now',
    subtitle: 'Order online or in-store',
  },
  {
    icon: '/icons/earn.svg',
    alt: 'Earn',
    title: 'Earn Points with Every Purchase',
    subtitle: 'Earn 1 point for every $1 spent',
  },
  {
    icon: '/icons/unlock.svg',
    alt: 'Unlock',
    title: 'Unlock Rewards Today!',
    subtitle: 'Redeem your points for more tasty pizza!',
  },
];

export const formatTimeString = (date, time, format) => {
  const dt = dayjs(date).format('YYYY/MM/DD');
  const dateTimeString = `${dt} ${time}`;
  return dayjs(dateTimeString).format(format);
};
export const setDeviceId = () => {
  const uuid = uuidv4();
  setCookie(KEYS.deviceToken, uuid);
  return uuid;
};
export const getFilterDate = (startDate, endDate) => {
  const $gt = dayjs(startDate).format('YYYY-MM-DDT00:00:00.000Z');
  const $lt = dayjs(endDate).format('YYYY-MM-DDT23:59:59.000Z');
  return startDate ? { createdAt: { $gt, $lt } } : {};
};
