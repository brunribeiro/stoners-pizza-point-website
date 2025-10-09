import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import PlusIcon from '@/icons/PlusIcon';
import PlusMinusCart from '@/widgets/PlusMinusCart';
import RightIcon from '@/icons/RightIcon';
import { DEFAULT_IMAGE, MODIFIER_TYPE } from '@/utils/constant';
import WholeIcon from '@/icons/WholeIcon';
import HalfIcon from '@/icons/HalfIcon';
import FilledHalfIcon from '@/icons/FilledHalfIcon';
import { createHalfNHalf } from '@/hook/model/helper';
import FilledWhole from '@/icons/FilledWhole';
import FilledcheckIcon from '@/icons/FilledcheckIcon';
// import Selected from '@/icons/Selected';
// import NotSelected from '@/icons/NotSelected';
import { displayAmount, sanitizeName } from '@/utils/helper';

const SelectProduct = ({
  data,
  price = '',
  groupData,
  max,
  handleModifierToggle = () => {},
  editData,
  setNestedModifier,
  setOpen,
  className,
  setSelectedItem,
  dtuseModel,
  newGroup,
  isInterface = false,
  originalGroup,
  setSelModifiers,
  selModifiers,
  setCurrItem,
  setNewNestedState,
  nestedDivRef,
}) => {
  const [modQunt, setModQunt] = useState(0);
  const [info, setInfo] = useState({
    type: '',
    id: '',
  });
  const [selected, setSelected] = useState(false);
  const [halfNhalfPrice, setHalfNhalfPrice] = useState();

  const isAdded = groupData?.selectedModifiers?.some((mod) => {
    return mod?.parentModId === data?.parentItemId && mod?.modId === data?.id;
  });

  const effectiveIsAdded = groupData.isReverse ? !isAdded : isAdded;
  const totalCount = dtuseModel.getTotalCount(groupData?.platOpGrpId);
  const isPresent = dtuseModel.isPresent(data.id);
  const isMaxSelected = totalCount > 1 && totalCount === groupData.maxSel && !isPresent;
  const currDisabled = totalCount > 1 && totalCount === groupData.maxSel && isPresent;
  const isDisabled = dtuseModel.cartLoad || isMaxSelected;
  const isMultiQuantity = data.maxQuantity > 1 || data.maxQuantity === 0 || groupData.maxSel > 1;
  const hasNestedOptions = data.option_groups.length > 0;

  const baseClass = `
  text-left p-2 hover:bg-foreground/10 border-[3px] duration-300 
  shadow-[0_0_0_1px_#dadada] border-transparent rounded-[10px] 
  items-end relative gap-1 flex flex-col cursor-pointer overflow-hidden
`;

  const addedClass =
    effectiveIsAdded && !isInterface ? '!border-[3px] !border-green !shadow-none' : '';
  const loadingClass = dtuseModel.cartLoad ? 'opacity-90 !cursor-not-allowed' : '';
  const maxSelClass = isMaxSelected ? 'bg-gray-100 !cursor-not-allowed' : '';

  const checkIsHalfAdded = (modData) => {
    const list = groupData?.selectedModifiers?.filter((mod) => {
      return mod.modId === modData?.id;
    });
    return (
      list?.some((mod) =>
        mod.modifiers?.some((nestedMod) => nestedMod.modId === modData.modifiers?.[0]?.modId),
      ) || false
    );
  };

  useEffect(() => {
    if (!isAdded && data.selectedQty && data.selectedQty > 0) {
      if (data.selectedQty === 1 && !groupData.isHalf) {
        setModQunt(0);
      } else {
        setModQunt(data.selectedQty);
      }
    }

    selModifiers.forEach((mod) => {
      if (mod.modId === data.id && mod.parentModId === data.parentItemId) {
        setModQunt(mod.qunt);
      }
    });
  }, [isAdded]);

  useEffect(() => {
    const allreadyPresent = groupData?.selectedModifiers?.filter((mod) => {
      if (mod?.modifiers?.length > 0) {
        return mod?.modifiers;
      }
    });
    if (allreadyPresent.length > 0) {
      allreadyPresent?.forEach((item) => {
        item.modifiers.forEach((mod) => {
          if (mod.toppingId === data.toppingId) {
            setModQunt(mod.qunt);
            if (editData) {
              setInfo({
                type: item?.modNm.includes(MODIFIER_TYPE.WHOLE)
                  ? MODIFIER_TYPE.WHOLE
                  : item?.modNm.includes(MODIFIER_TYPE.FIRST_HALF)
                    ? MODIFIER_TYPE.FIRST_HALF
                    : item?.modNm.includes(MODIFIER_TYPE.SECOND_HALF)
                      ? MODIFIER_TYPE.SECOND_HALF
                      : MODIFIER_TYPE.WHOLE,
                id: mod?.toppingId,
              });
              setSelected(true);
            }
          }
        });
      });
    } else {
      setSelected(false);
    }

    // if (editData) {
    //   const editDataFlat = editData?.option_groups?.flatMap((group) => group.modifiers);
    //   const matchingModifier = editDataFlat?.find((mod) => mod.modId === data.id);
    //   if (matchingModifier) {
    //     setModQunt(matchingModifier.qunt);
    //   }
    // }
  }, [editData, data.id, selModifiers]);

  const handleToggle = (id, type, remove = false, qunt = 0) => {
    const hasOptionGroups = data.option_groups.length > 0;
    if (dtuseModel.open && nestedDivRef.current && hasOptionGroups) {
      nestedDivRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (isInterface) {
      const isAdded = groupData?.selectedModifiers?.some((mod) => mod.modId === data.id);
      if (isAdded) {
        return;
      }
      const currGroup = originalGroup?.option_groups?.[0]?.modifiers.filter(
        (mod) => mod.platItemId === data.platItemId,
      );
      setSelectedItem(currGroup[0]);

      setSelModifiers((prev) => {
        return prev.filter(
          (mod) => mod.platModId === data.platItemId || mod.parentModId === data.platItemId,
        );
      });
    }

    if (hasOptionGroups && !isInterface) {
      dtuseModel.setModifierHistory((prevHistory) =>
        prevHistory?.length ? [...prevHistory, data] : [data],
      );

      data.isNested = true;
      handleModifierToggle({
        groupData,
        data,
        max,
        isAdded,
        isNested: true,
        setHalfNhalfPrice,
        type,
        id,
      });
      setNestedModifier(data);
      setNewNestedState(data);
      return;
    }

    data.isNested = false;

    if (!groupData?.isHalf) {
      handleModifierToggle({ groupData, data, max, isAdded });
      return;
    }

    const modData = createHalfNHalf(newGroup, groupData, type, id, modQunt);
    const isHalfAdded1 = groupData?.selectedModifiers?.some((mod) => {
      return mod.modifiers?.some((nestedMod) => {
        return nestedMod.toppingId === modData?.modifiers?.[0]?.toppingId;
      });
    });
    const isHalfAdded2 = checkIsHalfAdded(modData);

    if (remove && isHalfAdded1) {
      setSelected(false);
    } else {
      setSelected(!isHalfAdded2);
    }

    if (isHalfAdded2 || (remove && isHalfAdded1)) {
      setInfo({
        type: '',
        id: '',
      });
    }
    handleModifierToggle({
      groupData: newGroup,
      data: modData,
      max: isHalfAdded1 ? 1 : max,
      isAdded: remove && isHalfAdded1 ? remove : isHalfAdded2,
      isHalf: true,
      qunt,
      setHalfNhalfPrice,
      type,
      id,
    });
  };

  const onClick = (id, type, remove = false, qunt = 0) => {
    if (data.maxQuantity <= 1) {
      handleToggle(id, type, remove, qunt);
      data.option_groups.length > 0 && !isInterface && setOpen(true);
    }
  };

  return (
    <>
      {groupData.isHalf ? (
        <button
          onClick={() => {
            if (!selected) {
              setCurrItem(data);
              setModQunt(data.selectedQty);

              const id = info.id || data.toppingId;
              const type = info.id ? info.type : MODIFIER_TYPE.WHOLE;

              onClick(id, type, !info.id, data.selectedQty);
              setInfo({ type, id });
            }
          }}
          disabled={dtuseModel.cartLoad}
          className={`
      ${baseClass}
      ${selected ? '!border-[3px] !border-green !shadow-none' : ''}
      ${className}
      ${dtuseModel.cartLoad ? 'opacity-90 cursor-not-allowed' : ''}
    `}
        >
          <div className='flex justify-between w-full'>
            <div className='flex'>
              <div className='w-14 flex items-center gap-2'>
                <Image
                  src={data.smallImg || DEFAULT_IMAGE}
                  alt={data.name || 'modifier'}
                  width={56}
                  height={56}
                  className='object-contain'
                />
              </div>
              <div className='p-2 pr-0'>
                <div className='text-sm text-stone-black'>{sanitizeName(data.name)}</div>
                <div className='font-thin text-xs text-foreground'>
                  {displayAmount(halfNhalfPrice || price)}
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2 mr-2'>
              {selected ? (
                <button
                  onClick={() => {
                    setCurrItem(data);
                    setModQunt(data.selectedQty);

                    const id = info.id || data.toppingId;
                    const type = info.id ? info.type : MODIFIER_TYPE.WHOLE;

                    onClick(id, type, !info.id, data.selectedQty);
                    setInfo({ type, id });
                  }}
                >
                  <FilledcheckIcon size='32' />
                </button>
              ) : (
                <div className='border-[2px] border-black rounded-full p-1 mr-[1px] hover:border-opacity-0 hover:bg-dark-primary hover:!text-white'>
                  <PlusIcon className='size-18' />
                </div>
              )}
            </div>
          </div>

          {selected && (
            <div className='flex w-full justify-between items-center mt-2'>
              <div className='flex items-center gap-6'>
                {[MODIFIER_TYPE.FIRST_HALF, MODIFIER_TYPE.WHOLE, MODIFIER_TYPE.SECOND_HALF].map(
                  (type) => {
                    const isSelected = info.type === type;
                    const icon =
                      type === MODIFIER_TYPE.WHOLE ? (
                        isSelected ? (
                          <FilledWhole />
                        ) : (
                          <WholeIcon />
                        )
                      ) : isSelected ? (
                        <FilledHalfIcon />
                      ) : (
                        <HalfIcon />
                      );
                    const extraClass = type === MODIFIER_TYPE.SECOND_HALF ? 'rotate-180' : '';

                    return (
                      <button
                        key={type}
                        onClick={(e) => {
                          e.stopPropagation();
                          setInfo({ type, id: data.toppingId });
                          onClick(data.toppingId, type);
                        }}
                        className={`${extraClass} hover:scale-110 duration-300`}
                      >
                        {icon}
                      </button>
                    );
                  },
                )}
              </div>

              {isMultiQuantity && (
                <PlusMinusCart
                  className='gap-1 !bg-white'
                  iconClassName='border-[2px] hover:border-opacity-0 bg-white hover:!text-white duration-300'
                  iconClass='hover:!text-white'
                  qunt={modQunt}
                  minCount={data.minQuantity || 0}
                  setQunt={setModQunt}
                  maxQuantity={data.maxQuantity}
                  callback={(minus) => {
                    const modData = createHalfNHalf(
                      newGroup,
                      groupData,
                      info.type,
                      data.toppingId,
                      modQunt,
                    );
                    const isLastSelected = modQunt === 1 && minus;

                    if (isLastSelected) setSelected(false);

                    handleModifierToggle({
                      groupData,
                      data: modData,
                      max,
                      minus,
                      isAdded: isLastSelected,
                      ...(isLastSelected && { isHalf: true }),
                      qunt: isLastSelected ? 1 : modQunt,
                    });

                    if (isLastSelected) setModQunt(1);
                  }}
                />
              )}
            </div>
          )}
        </button>
      ) : isInterface ? (
        <button
          className={`text-left p-2 hover:bg-foreground/10 border-[3px] duration-300 shadow-[0_0_0_1px_#dadada] border-transparent rounded-[10px] relative cursor-pointer overflow-hidden ${className} ${isMaxSelected ? 'bg-gray-100 !cursor-not-allowed' : ''}`}
          onClick={() => {
            onClick();
            setCurrItem(data);
          }}
          disabled={dtuseModel.cartLoad}
        >
          <div className='flex items-center justify-between pl-3 p-2'>
            <div className='gap-1 flex flex-col'>
              {/* {isAdded ? <Selected className='w-6 h-6' /> : <NotSelected className='w-6 h-6' />} */}
              <div className='flex'>
                <div className='text-sm text-stone-black hover:!text-dark-primary duration-300'>
                  {sanitizeName(data.name)}
                </div>
              </div>
              <div className='font-thin text-xs text-foreground'>{`+${displayAmount(price)}`}</div>
            </div>
            {isAdded ? (
              <div>
                <FilledcheckIcon size='32' />
              </div>
            ) : (
              <div className='border-[2px] border-black rounded-full p-1  hover:border-opacity-0 hover:bg-dark-primary hover:!text-white'>
                <PlusIcon className='size-18' />
              </div>
            )}
          </div>
        </button>
      ) : (
        <button
          className={`${baseClass} ${addedClass} ${className} ${loadingClass} ${maxSelClass}`}
          onClick={() => {
            if (isMultiQuantity && modQunt !== 0) return;
            onClick();
            setCurrItem(data);
          }}
          disabled={isDisabled}
        >
          <div className='flex justify-between w-full'>
            <div className='flex'>
              {data.smallImg && (
                <div className='w-14 flex items-center gap-2'>
                  <Image
                    src={data.smallImg}
                    alt={data.name || 'modifier'}
                    width={56}
                    height={56}
                    className='object-contain'
                  />
                </div>
              )}
              <div className='p-2 pl-3 pr-0 flex flex-col justify-center h-14'>
                <div className='text-sm text-stone-black'>
                  {groupData.isReverse ? data.name.replace(/^No\s+/i, '') : sanitizeName(data.name)}
                </div>
                <div className='text-foreground font-thin text-xs'>
                  {price !== '0' ? displayAmount(price) : ' '}
                </div>
              </div>
            </div>

            <button
              className={`px-2 ${isMaxSelected ? 'bg-gray-100 !cursor-not-allowed' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {isMultiQuantity && !hasNestedOptions && modQunt > 0 ? (
                <PlusMinusCart
                  className='gap-1 !bg-white'
                  iconClassName='border-[2px] hover:border-opacity-0 bg-white hover:!text-white duration-300'
                  iconClass='hover:!text-white'
                  qunt={modQunt}
                  disabled={modQunt === 0}
                  disabled2={currDisabled}
                  minCount={0}
                  setQunt={setModQunt}
                  maxQuantity={groupData.maxSel > 1 ? groupData.maxSel : data.maxQuantity}
                  callback={(minus) => {
                    if (modQunt === 1 && minus) {
                      handleModifierToggle({ groupData, data, max, minus, isAdded: true });
                      return;
                    }
                    if (modQunt === 1 && !minus) {
                      handleModifierToggle({ groupData, data, max, minus, qunt: 1 });
                      return;
                    }
                    handleModifierToggle({ groupData, data, max, minus, qunt: modQunt });
                  }}
                />
              ) : (
                <button className='float-right' onClick={onClick}>
                  {effectiveIsAdded && !hasNestedOptions ? (
                    <FilledcheckIcon size='32' />
                  ) : (
                    <div
                      className={`flex gap-2 justify-center items-center ${isMaxSelected ? '!cursor-not-allowed' : ''}`}
                    >
                      {hasNestedOptions && !isInterface && effectiveIsAdded && (
                        <button
                          className='bg-secondary-gray p-1.5 px-3 text-xs rounded-full hover:text-white hover:bg-dark-primary duration-200 fade-in-delay opacity-0'
                          onClick={(e) => {
                            e.stopPropagation();
                            dtuseModel.clearAllNestedMod(data.platItemId);
                          }}
                        >
                          Clear
                        </button>
                      )}

                      <div
                        className={`border-[2px] border-black rounded-full p-1  hover:border-opacity-0 hover:bg-dark-primary hover:!text-white duration-200 ${isMaxSelected ? 'opacity-50 !cursor-not-allowed' : ''}`}
                      >
                        {hasNestedOptions && !isInterface ? (
                          <div className='flex'>
                            <RightIcon className='menu-indicator' size='18' />
                          </div>
                        ) : (
                          <PlusIcon
                            className={`size-18  ${isMaxSelected ? ' !cursor-not-allowed' : ''}`}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </button>
              )}
            </button>
          </div>

          {effectiveIsAdded && groupData.maxSel > 1 && hasNestedOptions ? (
            <button className='mr-2' onClick={(e) => e.stopPropagation()}>
              <PlusMinusCart
                className='gap-1 !bg-white'
                iconClassName='border-[2px] hover:border-opacity-0 bg-white hover:!text-white duration-300'
                iconClass='hover:!text-white'
                qunt={modQunt}
                disabled={modQunt === 0}
                disabled2={currDisabled}
                minCount={0}
                setQunt={setModQunt}
                maxQuantity={groupData.maxSel || data.maxQuantity}
                callback={(minus) => {
                  if (modQunt === 1 && minus) {
                    dtuseModel.clearAllNestedMod(data.platItemId);
                    return;
                  }
                  if (modQunt === 1 && !minus) {
                    handleModifierToggle({ groupData, data, max, minus, qunt: 1 });
                    return;
                  }
                  handleModifierToggle({ groupData, data, max, minus, qunt: modQunt });
                }}
              />
            </button>
          ) : null}
        </button>
      )}
    </>
  );
};

export default React.memo(SelectProduct);
