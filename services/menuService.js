// Menu service: centralized API with short-term caching and request de-duplication
/**
 * @file Menu service layer
 * @description Tiny API for menu data (categories, items, search, offers)
 * with 30s cache and in-flight de-duplication.
 */

import commonApi from '@/api/common';

// 30s cache window
const CACHE_TTL_MS = 30 * 1000;

// In-memory caches (module singletons)
const requestCache = new Map(); // key -> { data, expiresAt }
const pendingRequests = new Map(); // key -> Promise

const now = () => Date.now();

/**
 * @typedef {Object} FetchArgs
 * @property {number|string} restId
 * @property {string} [time]
 * @property {string} [query]
 */

const makeKey = ({ action, restId, time, query }) => {
  return `${action}|${restId || 'nil'}|${time || 'nil'}|${query || 'nil'}`;
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
  if (pendingRequests.has(key)) return pendingRequests.get(key);

  const p = exec()
    .then((data) => {
      setCached(key, data);
      return data;
    })
    .finally(() => pendingRequests.delete(key));

  pendingRequests.set(key, p);
  return p;
}

export async function fetchCategoryList({ restId, time }) {
  const key = makeKey({ action: 'getCategoryList', restId, time });
  return runOnce(key, async () => {
    const res = await commonApi({
      action: 'getCategoryList',
      data: { restId: Number(restId), time },
    });
    return res;
  });
}

export async function fetchItems({ restId, time }) {
  const key = makeKey({ action: 'getAllItems', restId, time });
  return runOnce(key, async () => {
    const res = await commonApi({ action: 'getAllItems', data: { restId, time } });
    return res;
  });
}

export async function searchItems({ restId, time, query }) {
  const key = makeKey({ action: 'searchMenu', restId, time, query });
  return runOnce(key, async () => {
    // API expects 'search' plus pagination; time is not used by backend for search
    const res = await commonApi({
      action: 'searchMenu',
      data: { restId, search: query, page: 1, limit: 100 },
    });
    return res;
  });
}

export async function fetchOffers({ restId, time }) {
  const key = makeKey({ action: 'offerList', restId, time });
  return runOnce(key, async () => {
    const res = await commonApi({ action: 'offerList', data: { restId, time } });
    return res;
  });
}

export function clearMenuCache() {
  requestCache.clear();
  pendingRequests.clear();
}
