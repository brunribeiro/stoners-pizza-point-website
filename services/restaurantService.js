// I just separated  restaurant api logic with request de-duplication and short-term caching also Covers default list and search list for pickup/delivery.

import commonApi from '@/api/common';
import { SIDEBAR_TABS } from '@/utils/constant';

// 30s cache window
const CACHE_TTL_MS = 30 * 1000;

// In-memory caches (module singletons)
const requestCache = new Map(); // key -> { data, expiresAt }
const pendingRequests = new Map(); // key -> Promise

const now = () => Date.now();

const makeKey = ({ action, currentTab, coordsKey, userId }) => {
  const tab = currentTab === SIDEBAR_TABS.delivery ? 'del' : 'pick';
  return `${action}|${tab}|${coordsKey || 'nil'}|${userId || 'anon'}`;
};

const getCached = (key) => {
  const hit = requestCache.get(key);
  if (hit && hit.expiresAt > now()) return hit.data;
  if (hit) requestCache.delete(key);
  return undefined;
};

const setCached = (key, data) => {
  requestCache.set(key, { data, expiresAt: now() + CACHE_TTL_MS });
};

async function runOnce(key, exec) {
  const cached = getCached(key);
  if (cached !== undefined) return cached;

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }
  const p = exec()
    .then((data) => {
      setCached(key, data);
      return data;
    })
    .finally(() => pendingRequests.delete(key));

  pendingRequests.set(key, p);
  return p;
}

export async function fetchNearbyDefault({ payload, currentTab, coordsKey, userId }) {
  const key = makeKey({ action: 'getNearByRestaurant', currentTab, coordsKey, userId });
  return runOnce(key, async () => {
    const res = await commonApi({ action: 'getNearByRestaurant', data: payload });
    return res;
  });
}

export async function fetchNearbySearch({ payload, currentTab, coordsKey, userId }) {
  const key = makeKey({ action: 'getNearByRestaurant_bySearch', currentTab, coordsKey, userId });
  return runOnce(key, async () => {
    const res = await commonApi({ action: 'getNearByRestaurant_bySearch', data: payload });
    return res;
  });
}

export function clearRestaurantCache() {
  requestCache.clear();
  pendingRequests.clear();
}
