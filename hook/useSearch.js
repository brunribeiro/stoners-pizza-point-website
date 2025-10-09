import { useState, useCallback, useContext, useEffect } from 'react';

import commonApi from '@/api/common';
import AppContext from '@/utils/appContext';
import { LocalStorage } from '@/utils/localStorage';
import { KEYS } from '@/utils/constant';

const useSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const { setSearchData, setItemLoad, setCategoryName } = useContext(AppContext);
  const restroDetail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
  const restId = restroDetail.id;

  useEffect(() => {
    const handler = setTimeout(() => {
      setCategoryName(searchValue);
      setDebouncedValue(searchValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  const getItem = useCallback(
    async (query) => {
      setItemLoad(true);
      try {
        const response = await commonApi({
          action: 'searchMenu',
          data: { restId: restId, search: query, page: 1, limit: 100 },
        });
        setSearchData(response.data.items || []);
        setItemLoad(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setItemLoad(false);
      }
    },
    [restId, setSearchData],
  );

  useEffect(() => {
    if (debouncedValue.trim() !== '') {
      getItem(debouncedValue);
    } else {
      setSearchData([]);
    }
  }, [debouncedValue, getItem]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleClear = () => {
    setSearchValue('');
    setDebouncedValue('');
    setSearchData([]);
  };

  return {
    searchValue,
    handleSearchChange,
    handleClear,
    debouncedValue,
  };
};

export default useSearch;
