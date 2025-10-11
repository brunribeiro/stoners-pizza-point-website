import axios from 'axios';
import qs from 'qs';
import getConfig from 'next/config';
import { getCookie } from 'cookies-next';

import { logout } from '@/utils/util';
import Toast from '@/utils/toast';
// import { getToken } from '@/utils/localStorage';
import { KEYS } from '@/utils/constant';
import { setDeviceIdCookie } from '@/utils/common';
import { handleRefreshToken } from '@/utils/helper';

const { publicRuntimeConfig } = getConfig();

export const baseUrl = `${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/`;
const GET = 'GET';
const DELETE = 'DELETE';
const POST = 'POST';
const PUT = 'PUT';
const PATCH = 'PATCH';

let cache = [];

const cancel = [];
const ACTION_HANDLERS = {
  [GET]: (url, data, headers) => {
    let queryUrl = url;

    if (data !== undefined) {
      const query = qs.stringify(data);
      queryUrl = `${queryUrl}?${query}`;
    }

    return axios.get(baseUrl + queryUrl, {
      // cancelToken: new axios.CancelToken((cToken) => {
      //   cancel.push({ url, cToken });
      // }),

      headers,
    });
  },

  [DELETE]: (url, data, headers) => axios.delete(baseUrl + url, { headers, data }),

  [POST]: (url, data, headers) =>
    axios.post(baseUrl + url, data, {
      headers,
    }),
  [PATCH]: (url, data, headers) =>
    axios.patch(baseUrl + url, data, {
      headers,
    }),

  [PUT]: (url, data, headers) =>
    axios.put(baseUrl + url, data, {
      headers,
    }),
};

// if using common capatcha then add async

function setHeaders({
  contentType = 'application/json',
  authToken = true,
  isServer = false,
  userAgent = true,
  timezone = true,
  host = true,
  userToken,
  captchaToken,
  deviceToken = true,
  customDeviceId = false,
  // action,
}) {
  if (authToken && !isServer) {
    const token = getCookie(KEYS.TOKEN) || userToken;
    if (token) {
      axios.defaults.headers.common.accesstoken = token;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }

  // if (publicRuntimeConfig.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY && typeof window !== 'undefined') {
  //   try {
  //     const token = await window.grecaptcha.execute(
  //       publicRuntimeConfig.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY,
  //       {
  //         action: 'login',
  //       },
  //     );
  //     axios.defaults.headers.common['g-recaptcha-token'] = token;
  //   } catch (err) {
  //     console.error('Failed to get reCAPTCHA token:', err);
  //   }
  // }

  // axios.defaults.headers.common['inc-device'] = 'WEB';
  if (captchaToken) {
    axios.defaults.headers.common['g-recaptcha-token'] = captchaToken;
    axios.defaults.headers.common['inc-device'] = 'WEB';
  }

  // Note: User-Agent and host headers are automatically set by the browser
  // and cannot be manually set in JavaScript for security reasons

  if (customDeviceId) {
    axios.defaults.headers.post['x-device-id'] = customDeviceId;
  } else {
    if (deviceToken) {
      setDeviceIdCookie();
      axios.defaults.headers.post['x-device-id'] = getCookie(KEYS.deviceToken);
    }
  }

  if (timezone) {
    axios.defaults.headers.post.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  if (contentType) {
    axios.defaults.headers.post['Content-Type'] = contentType;
    axios.defaults.headers.post.Accept = 'application/json';
  }
}

function handleError(error) {
  cache = [];
  const { response = {} } = error || {};
  const UnauthorizedCode = 401;

  // this condtition was applied in the below If()
  //   response.status === UnauthorizedCode &&
  //     typeof window !== 'undefined' &&
  //     !Object.prototype.hasOwn(response.data, 'confirmed') &&
  //     window.location.pathname !== routes.home,

  if (response.status === UnauthorizedCode) {
    logout(false);
    return;
  }

  const { message } = response.data || {};

  message && Toast.error(message);

  return Promise.reject(error instanceof Error ? error : new Error(message));
}

const cacheHandler = (url, { shouldRefetch, handleCache = true }, type) => {
  if (!shouldRefetch && handleCache) {
    if (type.toUpperCase() === 'GET') {
      if (cache.includes(url)) {
        const controller = Array.isArray(cancel) ? cancel.filter((index) => index.url === url) : [];
        controller?.map((item) => item?.cToken());
      } else {
        cache.push(url);
      }
    }
  }
};

let refreshPromise = null;

const fetchUrl = async ({ type, url, data = {}, config = {}, hash = '' }) => {
  cacheHandler(hash ? `${url}?${hash}` : url, config, type.toUpperCase());

  const expires = Number(getCookie(KEYS.EXPIRES));
  const now = Math.floor(Date.now() / 1000);

  if (expires && expires - now < 1000) {
    if (!refreshPromise) {
      refreshPromise = handleRefreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    await refreshPromise;
  }

  setHeaders(config);

  const handler = ACTION_HANDLERS[type.toUpperCase()];
  return handler(url, data, config.headers)
    .then((response) => Promise.resolve(response.data))
    .catch(handleError);
};

export default fetchUrl;
