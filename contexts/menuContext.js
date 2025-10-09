import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { LocalStorage } from '@/utils/localStorage';
import { KEYS } from '@/utils/constant';
import { fetchCategoryList, fetchItems, searchItems } from '@/services/menuService';

const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [itemList, setItemList] = useState([]);
  // removed offers state (unused)

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [loader, setLoader] = useState({
    categories: false,
    items: false,
    search: false,
  });

  const debounceRef = useRef();
  const debounce = useCallback((fn, delay = 300) => {
    return (...args) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fn(...args), delay);
    };
  }, []);

  const getSession = useCallback(() => {
    const rest = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
    const time = LocalStorage.getJSON(KEYS.TIME);
    return { restId: rest?.id, time };
  }, []);

  const loadCategories = useCallback(async () => {
    const { restId, time } = getSession();
    if (!restId) return;
    setLoader((p) => ({ ...p, categories: true }));
    try {
      const res = await fetchCategoryList({ restId, time });
      setCategoryList(res?.data || []);
    } finally {
      setLoader((p) => ({ ...p, categories: false }));
    }
  }, [getSession]);

  const loadItems = useCallback(async () => {
    const { restId, time } = getSession();
    if (!restId) return;
    setLoader((p) => ({ ...p, items: true }));
    try {
      const res = await fetchItems({ restId, time });
      setItemList(res?.data || []);
    } finally {
      setLoader((p) => ({ ...p, items: false }));
    }
  }, [getSession]);

  const doSearch = useCallback(
    async (q) => {
      const query = (q || '').trim();
      setSearchQuery(query);
      if (!query) {
        setSearchResults([]);
        setLoader((p) => ({ ...p, search: false }));
        return;
      }
      const { restId, time } = getSession();
      if (!restId) return;
      setLoader((p) => ({ ...p, search: true }));
      try {
        const res = await searchItems({ restId, time, query });
        // API returns { data: { items: [...] } }
        setSearchResults(res?.data?.items || []);
      } finally {
        setLoader((p) => ({ ...p, search: false }));
      }
    },
    [getSession],
  );

  const debouncedSearch = useMemo(() => debounce(doSearch, 300), [doSearch, debounce]);
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setLoader((p) => ({ ...p, search: false }));
  }, []);

  // removed loadOffers (unused)

  const value = {
    // state
    categoryList,
    itemList,
    searchQuery,
    searchResults,
    loader,

    // actions
    loadCategories,
    loadItems,
    setSearchQuery,
    searchItems: debouncedSearch,
    clearSearch,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenuCtx = () => useContext(MenuContext);
export default MenuContext;
