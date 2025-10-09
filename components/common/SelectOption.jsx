import React, { useState } from 'react';
import { Collapse } from 'react-collapse';

import MinusIcon from '@/icons/MinusIcon';
import PlusIcon from '@/icons/PlusIcon';
import WarningIcon from '@/icons/WarningIcon';
import CheckRoundIcon from '@/icons/CheckRoundIcon';
import { sanitizeName } from '@/utils/helper';

const SelectOption = React.forwardRef(
  ({ data = {}, label = 'Lab Test', groupData, selModifiers, isNested = false }, ref) => {
    const [isOpen, setIsOpen] = useState(true);
    const toggleCollapse = () => setIsOpen(!isOpen);

    const isRequired = groupData?.isReq;
    const isSelected = selModifiers?.find(
      (modifier) => modifier.platOpGrpId === groupData.platOpGrpId,
    );

    const getSelectText = (groupData) => {
      const min = groupData?.minSel;
      const max = groupData?.maxSel;

      if (min === 1 && max === 0) {
        return 'Select 1';
      } else if (min === 1 && max > 1) {
        return `Select up to ${max}`;
      } else if ((min > 1 && max > min) || (min === max && min > 0)) {
        return `Select ${min}`;
      } else if (min === 1 && max === 1) {
        return 'Select 1';
      } else if (min === 0 && max > 0) {
        return `Select ${max}`;
      } else {
        return '';
      }
    };

    const selectText = getSelectText(groupData);

    return (
      <>
        {groupData?.modifiers?.length ? (
          <div className='mb-4' ref={ref}>
            <button
              className={`flex w-full px-4 sm:px-2 items-center gap-4 bg-primary-light py-3 cursor-pointer justify-between ${
                isNested && 'flex-col !gap-0 !items-start !px-8 !bg-white pt-8 pb-2'
              }`}
              onClick={!isNested ? toggleCollapse : undefined}
            >
              <div className='flex gap-2 '>
                {!isNested && (
                  <button
                    className='transform transition-transform duration-300 ease-in-out'
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Collapse section' : 'Expand section'}
                  >
                    {isOpen ? <MinusIcon className='h-6 w-6' /> : <PlusIcon className='h-6 w-6' />}
                  </button>
                )}
                <span className='text-black font-semibold'> {sanitizeName(label)}</span>
              </div>

              {isRequired ? (
                <div
                  className={`flex text-xs font-medium items-center ${
                    isSelected ? 'text-[#52ae32]' : 'text-[#A16600]'
                  }`}
                >
                  <span>
                    {isSelected ? (
                      <CheckRoundIcon size='16' green className='mr-[2px] my-[3px] ' />
                    ) : (
                      <WarningIcon size='17' className='mt-1 ml-[1px] mb-[1px]' />
                    )}
                  </span>
                  Required
                  {selectText && (
                    <>
                      <span className='mx-1 text-foreground'>•</span>
                      <span className='text-xs items-center text-foreground'>{selectText}</span>
                    </>
                  )}
                </div>
              ) : (
                <span className='flex text-xs font-medium items-center text-foreground'>
                  Optional
                  {selectText && (
                    <span className='flex text-xs items-center text-foreground ml-1'>
                      {selectText}
                    </span>
                  )}
                </span>
              )}
            </button>

            <Collapse isOpened={isOpen}>
              <div
                className={`transition-all duration-300  ease-in-out py-1 ${
                  isOpen ? 'opacity-100 ' : 'opacity-0 max-h-0'
                } mt-3 overflow-hidden`}
              >
                {data}
              </div>
            </Collapse>
          </div>
        ) : (
          <div ref={ref}></div>
        )}
      </>
    );
  },
);

SelectOption.displayName = 'SelectOption';

export default SelectOption;
