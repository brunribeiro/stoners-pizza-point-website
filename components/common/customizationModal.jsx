import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

import SelectOption from './SelectOption';
import SelectProduct from './SelectProduct';

import PlusMinusCart from '@/widgets/PlusMinusCart';
import Button from '@/widgets/button';
import IncentivioLoader from '@/widgets/incentivioLoader';
import WarningIcon from '@/icons/WarningIcon';
import RightIcon from '@/icons/RightIcon';

const CustomizationModal = ({
  onClose,
  selectedItem,
  handleModifierToggle,
  addToCart,
  selModifiers,
  isLoad,
  editData,
  cartLoad,
  setSelectedItem,
  handleBackNestedMod,
  dtuseModel,
}) => {
  const [qunt, setQunt] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (editData?.qunt) setQunt(editData?.qunt);
  }, [editData]);

  const itemImg =
    selectedItem?.mediumImg ||
    'https://incentivio.s3.amazonaws.com/73c9bdfa-2447-4d04-a4f0-f5c7cf7eb090/default_tile.png';

  const handleAddToCart = useCallback(() => {
    const setIsOpen = dtuseModel.setIsOpen;
    addToCart(selModifiers, selectedItem, qunt, editData, specialInstructions, setIsOpen);
  }, [addToCart, selModifiers, selectedItem, qunt, specialInstructions]);

  const calculateTotal = () => {
    const baseCost = selModifiers?.reduce((acc, modifier) => {
      const quantity = Number(modifier.qunt) || 0;
      const cost = Number(modifier.amt) || 0;
      return acc + quantity * cost;
    }, 0);

    return parseFloat((baseCost + selectedItem?.cost) * qunt).toFixed(2);
  };
  if (!selectedItem) return null;
  return (
    <>
      {isLoad ? (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='flex h-[85dvh] justify-center items-center'>
            <IncentivioLoader />
          </div>
        </div>
      ) : (
        <div className='lg:max-w-[850px] relative  lg:rounded-[40px] rounded-[22px] overflow-hidden bg-white'>
          <button
            onClick={onClose}
            className='absolute text-white top-3 right-5 bg-primary rounded-full px-[8.5px] py-[3px] shadow-lg z-50 transition-all hover:bg-dark-primary'
          >
            ✕
          </button>
          <div className={'overflow-y-auto max-h-[100dvh] scrollbar-hide'}>
            {Object.keys(dtuseModel.nestedModifier)?.length && (
              <div className='relative w-full md:w-[850px] h-[200px] md:h-[350px] mx-auto mb-5'>
                <Image
                  src={itemImg}
                  alt={selectedItem?.menu || 'Menu Image'}
                  className='object-cover'
                  fill
                  priority
                />
              </div>
            )}

            {Object.keys(dtuseModel.nestedModifier)?.length ? (
              <div className='sm:p-5 p-3 bg-white rounded-2xl mb-10'>
                <div className='flex sm:text-2xl text-lg  font-extrabold mt-4 ml-10 item-center'>
                  <button
                    onClick={() => {
                      handleBackNestedMod();
                      // setNestedModifier((pre) => {
                      //   return pre;
                      // });
                    }}
                    className=' mr-6 font-extrabold text-4xl'
                  >
                    <RightIcon className={'rotate-180'}></RightIcon>
                  </button>
                  {selectedItem.name}
                </div>
              </div>
            ) : (
              <></>
            )}

            <div className='sm:px-16 px-5 md:px-15 -sm:mt-20 -mt-10 relative'>
              {!Object.keys(dtuseModel.nestedModifier)?.length && (
                <div className='sm:p-5 p-3 bg-[#F3F4F6] rounded-3xl mb-5'>
                  <div className='sm:text-2xl text-lg   font-bold mb-4'>{selectedItem?.name}</div>
                  <div className='md:text-lg sm:text-base text-sm'>{selectedItem?.longDesc}</div>
                </div>
              )}

              {selectedItem?.option_groups?.map((group, groupIndex) => (
                <SelectOption
                  key={group.name || groupIndex}
                  label={`${group.name}`}
                  groupData={group}
                  data={
                    <div>
                      <div className='text-lg font-bold text-black'>Choose your Choice</div>
                      <div className='mb-4 flex items-center gap-2'>
                        <div className='flex items-center'>
                          <span className='text-[#A16600] text-[17px] font-bold'>
                            {group.isReq ? (
                              <span className='flex items-center'>
                                <WarningIcon /> Required
                              </span>
                            ) : (
                              'optional'
                            )}
                          </span>
                        </div>
                        <span className='w-1 h-1 rounded-full bg-foreground'></span>
                        <span className='text-foreground text-base font-normal'>
                          {group.maxSel === 0 && (group.minSel === 0 || group.minSel === 1)
                            ? 'Select'
                            : group.maxSel === 1 && group.minSel === 1
                              ? 'Select 1'
                              : `Select up to ${group.maxSel}`}
                        </span>
                      </div>

                      <div className='grid md:grid-cols-2 md:gap-3 pb-2 gap-3'>
                        {group.modifiers?.map((modifier) => {
                          const modifierPrice = modifier.cost;
                          const modifierCal = modifier?.cal ? ` | ${modifier.cal}` : '';
                          const price = `${modifierPrice}${modifierCal}`;

                          return (
                            <SelectProduct
                              key={modifier.id}
                              data={modifier}
                              groupData={{
                                ...group,
                                selectedModifiers: selModifiers,
                              }}
                              max={group.maxSel}
                              min={group.minSel}
                              price={price}
                              handleModifierToggle={handleModifierToggle}
                              editData={editData}
                              dtuseModel={dtuseModel}
                              setNestedModifier={dtuseModel.setNestedModifier}
                              setSelectedItem={setSelectedItem}
                              modifierHistory={dtuseModel.modifierHistory}
                              nestedModifier={dtuseModel.nestedModifier}
                            />
                          );
                        })}
                      </div>
                    </div>
                  }
                />
              ))}
            </div>
            <div className='m-8 mx-10'>
              <label htmlFor='special-instructions' className='block font-medium text-gray-700'>
                Special Instructions
              </label>
              <textarea
                id='special-instructions'
                value={specialInstructions}
                onChange={(e) => {
                  const words = e.target.value.split('').filter(Boolean);
                  if (words.length <= 100) {
                    setSpecialInstructions(e.target.value);
                  }
                }}
                placeholder='Special Instructions here ...'
                className='mt-1 block w-full  border-b-2 border-green-500 focus:outline-none focus:border-green-700 sm:text-sm placeholder-gray-400'
                rows={1}
              />
            </div>
          </div>

          <div className='bg-[#F3F4F6] py-5 sm:px-14 px-5 border-t-2 border-black border-opacity-10 sticky bottom-0'>
            <div className='flex justify-between items-center sm:flex-row flex-col gap-5'>
              <PlusMinusCart
                className='bg-white gap-1 p-2'
                iconClassName='!w-10 !h-10 border-[3px] border-[#0E0C5C] border-opacity-50 hover:border-opacity-1 hover:border-[#0E0C5C] hover:bg-[#0E0C5C]'
                iconClass='w-10 p-2 pt-[4px] h-10 hover:!text-white '
                qunt={qunt}
                setQunt={setQunt}
              />
              {Object.keys(dtuseModel.nestedModifier).length === 0 ? (
                <Button
                  onClick={handleAddToCart}
                  loading={cartLoad}
                  title={`${editData ? 'Update Cart' : 'Add to Cart'} - $${calculateTotal()}`}
                  className='sm:w-1/2 w-full white uppercase sm:text-xl text-lg  h-[70px]'
                />
              ) : (
                <Button
                  title={'save changes'}
                  className='sm:w-1/2 w-full uppercase sm:text-xl text-lg h-[70px]'
                  onClick={dtuseModel.handleSaveChanges}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(CustomizationModal);
