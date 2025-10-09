import { hasCookie } from 'cookies-next';

import { DEFAULT_NEXT_API_HEADER, KEYS, REST_LOCATION_ID } from './constant';
import { resetPosthog } from './analytics';
import { setDeviceId } from './util';
import { LocalStorage } from './localStorage';

import Toast from '@/utils/toast';
import commonApi from '@/services/api/common';

export const handleLogout = async () => {
  const response = await fetch('/api/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.ok) {
    resetPosthog();
    return window.location.reload();
  }
  return false;
};

export const getToastMessage = ({ status, message, code }) => {
  if (code === 'SUCCESS') {
    Toast.success(message);
  } else if (status === false) {
    Toast.error(message);
  } else {
    console.error('No case found');
  }
};
//You'll need to verify your account before you can log in. Please check your email and click on the link to verify your account, then continue with logging in. If an email does not show up in your inbox, please check your spam or junk folder.

export const setDeviceIdCookie = () => {
  if (!hasCookie(KEYS.deviceToken)) setDeviceId();
  // if (!hasCookie(KEYS.readOnly) && user?.id) setCookie(KEYS.readOnly, !!user?.offBoardedAt || user.licenceExpire)
  // if (!hasCookie(KEYS.site)) setCookie(KEYS.site, user.role === USER_ROLE.CLIENT ? routes.clientLogin : routes.login)
};

export const formatAddress = (add) => {
  const { city, country, houseNumber, apt, zipcode, state, streetAddress } = add || {};

  // Create the first line with street address and house number, if available
  const firstLineParts = [
    streetAddress, // Display streetAddress if available
  ];

  // Create an array of other address parts
  const secondLineParts = [
    houseNumber,
    city,
    apt ? `Apt ${apt}` : '', // Only include "Apt" if `apt` is not empty
  ];

  // Create the third line for state, country, and zipcode
  const thirdLineParts = [state, country, zipcode];

  // Filter out any empty parts and join with ", " for each line
  const firstLine = firstLineParts.filter(Boolean).join(' ');
  const secondLine = secondLineParts.filter(Boolean).join(', ');
  const thirdLine = thirdLineParts.filter(Boolean).join(', ');

  // Return formatted address with newlines between different lines
  return [
    firstLine,
    secondLine, // Show only if second line exists
    thirdLine, // Show only if third line exists
  ]
    .filter(Boolean)
    .join('\n');
};

export const storeSessionData = async (data) => {
  await fetch('/api/storeId', {
    method: 'POST',
    headers: DEFAULT_NEXT_API_HEADER,
    body: JSON.stringify({
      id: {
        menuId: Number(data.menuId),
        restId: Number(data.restId),
      },
    }),
  });
};

export const getAddressLabel = (add) => {
  const { label } = add || {};

  return label;
};

export const getRestaurantDetail = async ({ slug, setRestaurant }) => {
  try {
    const response = await commonApi({
      action: 'getNearByRestaurant_bySearch',
      data: {
        slug,
      },
    });
    if (response.data?.length) {
      LocalStorage.setJSON(KEYS.RESTAURANT_DETAIL, response?.data?.[0]);
      LocalStorage.setJSON(REST_LOCATION_ID, response?.data?.[0]?.restId);
      setRestaurant(response?.data?.[0]);
      const restInfo = {
        restId: response?.data?.[0]?.id,
        restSlug: slug,
      };
      await storeSessionData(restInfo);
    }

    return response;
  } catch (error) {
    console.error('Error fetching restaurant detail:', error);
    throw error;
  }
};

export const parseDateString = (dateString) => {
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1;
  const day = parseInt(dateString.substring(6, 8), 10);
  return new Date(year, month, day);
};
