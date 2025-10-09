import React, { useEffect, useRef } from 'react';

import SkeletonLoader from '../common/SkeletonLoader';

import CategoryCard from './CategoryCard';

import SearchInput from '@/widgets/SearchInput';
import NoItemTag from '@/icons/NoItemTag';

const CategoryItems = ({
  itemList,
  itemLoad,
  category,
  showSearch,
  setSearchLoader,
  id,
  index,
  categoryName,
  searchData,
  handleItemClick,
  itemimg,
  shouldShowSearchResults,
  setCategoryId,
  categoryId,
  isManualScroll,
  searchValue,
  handleSearchChange,
  handleClear,
  debouncedValue,
  isSearching,
}) => {
  const sectionRef = useRef(null);
  const noResults = !itemLoad && categoryName && searchData?.length === 0;
  const emptySearch = searchData?.length === 0;
  const isFirstCategory = index === 0;

  const shouldShowHeader = (emptySearch || isFirstCategory) && (!noResults || isFirstCategory);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isManualScroll.current) {
            setCategoryId(id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0,
      },
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      id={id}
      ref={sectionRef}
      className={!shouldShowSearchResults && !noResults ? 'mb-[2rem] mt-3' : ''}
    >
      {shouldShowHeader && (
        <div
          className={`flex py-5 items-center sticky top-[138px] xl:top-[70px] sm:pt-8 bg-white z-40 justify-between ${shouldShowSearchResults ? 'mt-3' : ''}`}
        >
          <h2 className='relative text-left bg-white before:absolute before:top-1/2 before:left-1/2 before:w-full before:opacity-30 before:-translate-x-1/2 before:z-[1]  text-2xl md:text-[40px] font-stone uppercase'>
            <span className='relative z-[2] bg-white px-2'>
              {debouncedValue ? 'Search Result - ' : ''} {categoryName || category}
            </span>
          </h2>

          {showSearch && (
            <div
              className={` hidden sm:block transition-opacity duration-200 ${
                isFirstCategory || Number(id) === Number(categoryId)
                  ? 'opacity-100 visible'
                  : 'opacity-0 invisible absolute'
              }`}
            >
              <SearchInput
                searchValue={searchValue}
                handleSearchChange={handleSearchChange}
                handleClear={handleClear}
                setSearchLoader={setSearchLoader}
              />
            </div>
          )}
        </div>
      )}

      {itemLoad && <SkeletonLoader noOfBoxes={9} wrapperClass='xl:!grid-cols-3' />}

      {!itemLoad && noResults && isFirstCategory && !isSearching && (
        <div className='flex justify-center items-center min-h-96 h-[40dvh] flex-col'>
          <NoItemTag className='cursor-default' />
          <p className='text-sm text-[#0B121580] my-6'>
            We have over 50 locations! Find the store nearest to you
          </p>
        </div>
      )}

      {!itemLoad && emptySearch && !noResults && !isSearching && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {itemList?.map((item) => (
            <CategoryCard
              key={item.id}
              img={item.mediumImg || itemimg}
              price={item.cost}
              name={item.name}
              content={item.shortDesc}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryItems;
