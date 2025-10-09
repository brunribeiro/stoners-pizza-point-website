import React from 'react';

import SelectProduct from './SelectProduct';

export const NestedModifierModal = ({
  nestedModifier,
  editData = {},
  setNestedModifier = () => {},
  handleModifierToggle,
  name,
}) => {
  return (
    <div className='lg:max-w-[850px] relative  lg:rounded-[40px] min-h-20 rounded-[22px] overflow-hidden bg-white '>
      <div className='sm:p-5 p-3 bg-[#F3F4F6] rounded-2xl mb-5'>
        <div className='sm:text-2xl text-lg   font-bold mb-4'>
          <button
            onClick={() => {
              setNestedModifier((pre) => {
                return pre;
              });
            }}
            className=' mr-6 font-extrabold text-4xl'
          >
            {'<'}
          </button>
          {name}
        </div>
      </div>

      <div className='overflow-y-autoscrollbar-hide p-4'>
        {nestedModifier?.modifiers?.map((modifier) => {
          const modifierPrice = modifier.cost;
          const modifierCal = modifier?.cal ? ` | ${modifier.cal}` : '';
          const price = `${modifierPrice}${modifierCal}`;

          return (
            <SelectProduct
              key={modifier.id}
              data={modifier}
              price={price}
              editData={editData}
              setNestedModifier={setNestedModifier}
              className={'w-full m-2 '}
              isNested={true}
              handleModifierToggle={handleModifierToggle}
              parentId={nestedModifier.id}
              max={nestedModifier.maxSel}
              groupData={nestedModifier}
            />
          );
        })}
      </div>
    </div>
  );
};
