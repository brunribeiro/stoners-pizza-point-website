import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import SelectOption from '../common/SelectOption';
import SelectProduct from '../common/SelectProduct';
import {
  Buttonskeleton,
  Itemskeleton,
  PlusMinusSkeleton,
  SectionSkeleton,
} from '../common/Itemskeleton';
import InboxModel from '../Inbox/InboxModel';

import SelectionDetailsPopup from './SelectionDetailPopup';

import PlusMinusCart from '@/widgets/PlusMinusCart';
import Button from '@/widgets/button';
import RightIcon from '@/icons/RightIcon';
import useItemModel from '@/hook/model/useItemModel';
import LayoutWrapper from '@/shared/layoutWrapper';
import AppContext from '@/utils/appContext';
import routes from '@/utils/routes';
import { DEFAULT_IMAGE } from '@/utils/constant';
import { displayAmount } from '@/utils/helper';
import RightArrowIcon from '@/icons/rightArrowIcon';

const SelectedItem = ({ pageProps }) => {
  const router = useRouter();

  const {
    setSelectedItem,
    selectedItem,
    nestedSelectItem,
    editData,
    selModifiers,
    setSelModifiers,
    newNestedState,
    setNewNestedState,
    menuRestId,
  } = useContext(AppContext);

  const {
    itemQuant,
    setItemQuant,
    selectedCat,
    breadcrumbs,
    setSpecialInstructions,
    specialInstructions,
    showPopup,
    setShowPopup,
    handleAddToCart,
    modifierRefs,
    nestedModifierRefs,
    nestedDivRef,
    makeInterface,
    ...dtuseModel
  } = useItemModel(pageProps?.user?.userId);

  useEffect(() => {
    makeInterface(true);
  }, [nestedSelectItem]);

  const itemImg = selectedItem?.mediumImg || DEFAULT_IMAGE;

  // const calculateTotal = () => {
  //   const baseCost = selModifiers?.reduce((acc, modifier) => {
  //     const quantity = Number(modifier.qunt) || 0;
  //     const cost = Number(modifier.amt) || 0;
  //     return acc + quantity * cost;
  //   }, 0);

  //   return parseFloat((baseCost + selectedItem?.cost) * qunt).toFixed(2);
  // };
  return (
    <div>
      <LayoutWrapper childClassName='w-[85%] mx-auto sm:px-4 '>
        {dtuseModel.isLoad ? (
          <Itemskeleton />
        ) : (
          <div className='relative w-full lg:rounded-[40px] rounded-[22px] bg-white'>
            <div className='flex w-full flex-col md:flex-row-reverse relative gap-6 sm:pt-10 pb-20 min-h-[calc(100dvh-170px)] '>
              <div className='bg-white md:sticky top-[120px] md:w-1/2 w-full self-start'>
                {
                  <Image
                    src={itemImg}
                    alt={selectedItem?.menu || 'Menu Image'}
                    title={selectedItem?.menu || 'Menu Image'}
                    width={800}
                    height={450}
                    className='!mix-blend-multiply w-full max-h-[450px] rounded-3xl object-cover'
                    style={{ width: '100%', height: 'auto' }}
                  />
                }
              </div>
              <div className='sm:border-[3px] border-[#DADADA] md:w-1/2 w-full rounded-[25px] py-6 relative sm:px-10'>
                <div>
                  {menuRestId?.restId && menuRestId?.menuId && (
                    <div className='flex items-center text-primary ml-4 sm:ml-0'>
                      {breadcrumbs.map((item, index) => (
                        <button
                          key={index}
                          className='flex items-center'
                          onClick={() => {
                            if (index === 0) {
                              const { diningOption, rest } = router.query;
                              router.push(routes.menu(diningOption, rest));
                            } else if (index === 1 && selectedCat?.itemId) {
                              const { diningOption, rest } = router.query;
                              router.push(routes.items(diningOption, rest, selectedCat.itemId));
                            } else {
                              //nothing
                            }
                          }}
                          disabled={index === breadcrumbs.length - 1}
                        >
                          <span
                            className={`text-[14px] duration-300 ${
                              index === breadcrumbs.length - 1
                                ? 'cursor-default'
                                : 'hover:underline cursor-pointer'
                            }`}
                          >
                            {item}
                          </span>
                          {index < breadcrumbs.length - 1 && (
                            <span className='mx-1 text-xl text-black'>›</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {
                  <div className='p-4 sm:px-0 mb-2'>
                    <div className='text-btn-txt font-bold text-black mb-3'>
                      {nestedSelectItem?.name}
                    </div>
                    <p className='text-sm text-foreground'>
                      Let&apos;s get creative! You pick the size an toppings, we make the work of
                      art!
                    </p>
                    <div className='md:text-lg sm:text-base text-sm'>
                      {nestedSelectItem?.longDesc}
                    </div>
                    <div className='w-full text-right'>
                      <span>From </span>
                      <span className='font-stone text-primary text-[30px]'>
                        {displayAmount(selectedItem?.cost || 0)}
                      </span>
                    </div>
                  </div>
                }

                {/* We are handling three case here one is half N half , second is interface === 2 and third normal  */}

                {nestedSelectItem?.option_groups?.map((group, groupIndex) => {
                  const getProcessedGroup = (grp) => {
                    if (grp.isHalf) {
                      const halfGroups = grp.modifiers?.[0]?.option_groups?.map((group) => ({
                        ...group,
                        isHalf: true,
                      }));
                      return halfGroups; // Returns an array
                    }

                    return grp;
                  };

                  const renderModifiers = (grp, newGroupRef, isInterface = false) => (
                    <SelectOption
                      key={grp.id || groupIndex}
                      ref={(el) => (modifierRefs.current[grp.id] = el)}
                      label={`${grp.name}`}
                      selModifiers={selModifiers}
                      groupData={grp}
                      data={
                        <div className='w-full'>
                          <div className='flex flex-col gap-2.5 w-full p-2 px-5'>
                            {grp.modifiers?.map((modifier) => {
                              const modifierPrice = modifier.cost;
                              const modifierCal = modifier?.cal ? ` | ${modifier.cal}` : '';
                              const price = `${modifierPrice}${modifierCal}`;
                              return (
                                <SelectProduct
                                  key={modifier.id}
                                  data={modifier}
                                  groupData={{
                                    ...grp,
                                    selectedModifiers: selModifiers,
                                  }}
                                  max={grp.maxSel}
                                  min={grp.minSel}
                                  price={price}
                                  setOpen={dtuseModel.setOpen}
                                  handleModifierToggle={dtuseModel.handleModifierToggle}
                                  editData={editData}
                                  dtuseModel={dtuseModel}
                                  img={modifier?.img}
                                  setNestedModifier={dtuseModel.setNestedModifier}
                                  setSelectedItem={setSelectedItem}
                                  modifierHistory={dtuseModel.modifierHistory}
                                  nestedModifier={dtuseModel.nestedModifier}
                                  selModifiers={selModifiers}
                                  newGroup={newGroupRef}
                                  isInterface={isInterface}
                                  originalGroup={isInterface ? nestedSelectItem : undefined}
                                  selectedItem={selectedItem}
                                  setSelModifiers={setSelModifiers}
                                  setNewNestedState={setNewNestedState}
                                  setCurrItem={dtuseModel.setCurrItem}
                                  nestedDivRef={nestedDivRef}
                                />
                              );
                            })}
                          </div>
                        </div>
                      }
                    />
                  );

                  const isInterface2 = group.interface === 2;

                  if (isInterface2) {
                    return (
                      <>
                        {renderModifiers(group, group, true)}

                        {selectedItem?.option_groups?.flatMap((subGroup) => {
                          const processedSubGroup = getProcessedGroup(subGroup);

                          // If it's an array (because of isHalf), render all
                          if (Array.isArray(processedSubGroup)) {
                            return processedSubGroup.map((sub) =>
                              renderModifiers(sub, subGroup, sub.interface === 2),
                            );
                          }

                          // Otherwise just render the single group
                          return renderModifiers(
                            processedSubGroup,
                            subGroup,
                            processedSubGroup.interface === 2,
                          );
                        })}
                      </>
                    );
                  }

                  const processedGroup = getProcessedGroup(group);

                  if (Array.isArray(processedGroup)) {
                    return processedGroup.map((g) => renderModifiers(g, group, g.interface === 2));
                  }

                  return renderModifiers(processedGroup, group);
                })}

                <div className='px-4'>
                  <label htmlFor='special-instructions' className='block font-medium text-gray-700'>
                    Add Special Instructions
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
                    placeholder='Additions may be charged extra.'
                    className='mt-1 block w-full h-24 rounded-lg px-3 py-2  border-[3px] border-black focus:outline-none focus:border-green-700 sm:text-sm placeholder-gray-400'
                    rows={1}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </LayoutWrapper>
      <InboxModel
        open={dtuseModel.open}
        setOpen={dtuseModel.setOpen}
        title={newNestedState?.name}
        backButton={true}
        ref={nestedDivRef}
        backButtonContent={
          <>
            {Object.keys(dtuseModel.nestedModifier)?.length > 1 ? (
              <div className='mb-2'>
                <div className='flex text-xl '>
                  <button
                    onClick={() => {
                      dtuseModel.handleBackNestedMod();
                    }}
                    className=' mr-2 font-extrabold text-2xl flex'
                  >
                    <RightIcon size={20} className={'rotate-180'}></RightIcon>
                    <span className='ml-1 text-sm'>Back</span>
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        }
        onModelClose={() => {
          setTimeout(() => {
            dtuseModel.handleClose();
          }, 100);
          setTimeout(() => {
            dtuseModel.setModifierHistory([]);
          }, 200);
          dtuseModel.setOpen(false);
        }}
        modalFooter={
          <div className='flex p-1 justify-between items-center sm:flex-row flex-col gap-5 w-full px-6'>
            <Button
              title={'save options'}
              className='uppercase sm:text-xl text-lg !py-2 w-full'
              onClick={() => {
                let firstUnselectedGroup = null;

                newNestedState?.option_groups?.forEach((group) => {
                  const isRequired = group.minSel > 0;
                  const selectedCount = selModifiers?.filter(
                    (mod) => mod.platOpGrpId === group.platOpGrpId,
                  ).length;

                  if (isRequired && selectedCount < group.minSel && !firstUnselectedGroup) {
                    firstUnselectedGroup = nestedModifierRefs.current[group.id];
                  }
                });

                if (firstUnselectedGroup) {
                  firstUnselectedGroup.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });

                  return;
                }
                dtuseModel.handleSaveChanges();
              }}
            />
          </div>
        }
      >
        <div id='nestedDiv'>
          {newNestedState?.option_groups?.map((group, groupIndex) => {
            const newGroup = group;
            // const isRequired = group?.isReq;
            // const isSelected = selModifiers?.find(
            //   (modifier) => modifier.platOpGrpId === group.platOpGrpId,
            // );
            if (group.isHalf) {
              group = group.modifiers[0].option_groups[0];
            }
            return (
              <div key={groupIndex} className='w-full'>
                <SelectOption
                  key={group.name || groupIndex}
                  ref={(el) => (nestedModifierRefs.current[group.id] = el)}
                  label={`${group.name}`}
                  selModifiers={selModifiers}
                  groupData={group}
                  isNested={true}
                  data={
                    <div className='flex flex-col gap-2.5 w-full px-4 sm:px-8'>
                      {group?.modifiers?.map((modifier) => {
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
                            setOpen={dtuseModel.setOpen}
                            handleModifierToggle={dtuseModel.handleModifierToggle}
                            editData={editData}
                            dtuseModel={dtuseModel}
                            setNestedModifier={dtuseModel.setNestedModifier}
                            setSelectedItem={setSelectedItem}
                            modifierHistory={dtuseModel.modifierHistory}
                            nestedModifier={dtuseModel.nestedModifier}
                            selModifiers={selModifiers}
                            selectedItem={selectedItem}
                            newGroup={newGroup}
                            setCurrItem={dtuseModel.setCurrItem}
                            setNewNestedState={setNewNestedState}
                            nestedDivRef={nestedDivRef}
                          />
                        );
                      })}
                    </div>
                  }
                />
              </div>
            );
          })}
        </div>
      </InboxModel>
      <SelectionDetailsPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onClear={() => {
          setSelModifiers([]);
          makeInterface(false);
          setShowPopup(false);
        }}
        itemName={selectedItem?.name}
        selModifiers={selModifiers}
        modifiers={dtuseModel.selectionDetail}
      />
      <div className='bg-primary-light py-5 sm:px-32 px-5 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.2)] border-black border-opacity-10 sticky bottom-0 rounded-t-[25px]  z-40 '>
        <div className='flex justify-between w-full lg:w-[49%] items-center flex-row gap-1 sm:gap-5 relative'>
          {dtuseModel.isLoad ? (
            <SectionSkeleton />
          ) : !showPopup ? (
            <button
              className={`absolute -top-16 sm:left-0 w-full h-11 bg-primary-light  rounded-t-[25px] shadow-[0px_0px_3px_3px_rgba(0,0,0,0.06)] flex items-center justify-center gap-2 ${selModifiers.filter((e) => e.isNestedMod === false).length === 0 && 'cursor-not-allowed !bg-gray-100'}`}
              onClick={() => {
                if (selModifiers?.filter((e) => e.isNestedMod === false).length) {
                  setShowPopup(true);
                }
              }}
            >
              Selection Details <RightArrowIcon width='16' height='16' className={'-rotate-90'} />
            </button>
          ) : (
            ''
          )}
          {dtuseModel.isLoad ? (
            <PlusMinusSkeleton />
          ) : (
            <PlusMinusCart
              className='bg-white gap-1 p-2'
              iconClassName='sm:!w-10 sm:!h-10 sm:border-[3px] hover:text-white duration-300 '
              iconClass='w-5 h-5 '
              qunt={itemQuant}
              setQunt={setItemQuant}
              deleteIcon={false}
              disabled={dtuseModel.cartLoad || dtuseModel.isLoad}
              disabled2={dtuseModel.cartLoad || dtuseModel.isLoad}
              callback={(minus) => {
                if (!minus) {
                  dtuseModel.addToCart(selModifiers, selectedItem, itemQuant + 1, {}, '', true);
                } else {
                  dtuseModel.addToCart(selModifiers, selectedItem, itemQuant - 1, {}, '', true);
                }
              }}
            />
          )}
          {dtuseModel.isLoad ? (
            <Buttonskeleton />
          ) : (
            <Button
              onClick={handleAddToCart}
              loading={dtuseModel.cartLoad}
              title={`${editData ? 'Update Cart' : 'Add to Cart'} - $${parseFloat(+dtuseModel?.itemPrice).toFixed(2) || parseFloat(0).toFixed(2)}`}
              className='uppercase whitespace-nowrap sm:text-xl !px-3 sm:!px-6 text-lg !py-2'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SelectedItem);
