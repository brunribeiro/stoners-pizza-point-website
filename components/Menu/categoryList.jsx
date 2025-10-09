import React from 'react';

import MenuCard from './MenuCard';

import TomatoIcon from '@/icons/TomatoIcon';
import { LocalStorage } from '@/utils/localStorage';

const CategoryList = ({ idHandler, categoryList, categoryId, setCategoryHandler }) => {
  const onItemClick = (value) => {
    idHandler(value.id);
    setCategoryHandler(value);
  };

  const activeClass =
    'before:absolute before:bottom-0 before:bg-primary before:w-[3px] before:h-full before:left-0 bg-gray-200';

  return (
    <aside className='sticky top-[110px] bg-primary-light z-10 hidden lg:block my-7 mb-0 py-5 rounded-2xl !shadow-lg'>
      <div className='flex items-center gap-2 mb-1 px-5'>
        <TomatoIcon />
        <h1 className='uppercase font-stone sm:text-3xl text-2xl'>Menu</h1>
      </div>
      <div className='py-5 rounded-2xl px-5 max-h-[calc(100dvh-229px)] overflow-y-auto'>
        <div className='flex flex-col'>
          {categoryList?.length > 0 &&
            categoryList?.map((value) => (
              <MenuCard
                key={value.id}
                img={value.smallImg}
                menu={value.name}
                classMenu='!text-black text-left'
                className={`transition-all duration-200 hover:bg-light-gray ${+categoryId === value.id ? activeClass : ''}`}
                onClick={() => {
                  LocalStorage.set(
                    'selectedCat',
                    JSON.stringify({ itemId: value.id, name: value.name }),
                  );
                  onItemClick(value);
                }}
              />
            ))}
        </div>
      </div>
    </aside>
  );
};

export default CategoryList;
