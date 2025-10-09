import { HANDOFF_MODE, KEYS } from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';
import Toast from '@/utils/toast';

export const validateSelections = (
  optionGroups = [],
  modifiers,
  getPrice,
  currItem = {},
  setItemPrice = () => {},
) => {
  if (currItem?.isNested) {
    return false;
  }
  for (const group of optionGroups) {
    const filteredArr = modifiers.filter((mod) => mod.platOpGrpId === group.platOpGrpId);
    const selectedCount = filteredArr.reduce((total, item) => {
      return total + (item.qunt || 0);
    }, 0);

    if (group.isReq && selectedCount === 0) {
      if (!getPrice) {
        Toast.error('Required selection is missing.');
      } else {
        setItemPrice(0);
      }
      return false;
    }

    if (group.minSel > 0 && selectedCount < group.minSel) {
      if (!getPrice) {
        Toast.error(`Minimum ${group.minSel} selections required.`);
      } else {
        setItemPrice(0);
      }
      return false;
    }
  }
  return true;
};

export const getDiningOption = () => {
  return LocalStorage.getJSON(KEYS.DINING_OPTION) === 1
    ? HANDOFF_MODE.DELIVERY
    : HANDOFF_MODE.TAKE_OUT;
};
export const getAddressPayload = () => {
  const { city, country, lat, long, state, zipcode, instruction, apt } =
    LocalStorage.getJSON(KEYS.DELIVERY_ADDRESS) || {};
  return {
    add1: 'street 1', // temp
    city,
    state,
    country,
    zip: zipcode,
    lat,
    long,
    inst: instruction,
    apt,
  };
};
export const getCartPayload = ({
  item,
  qunt,
  editData,
  editCheck,
  diningOption,
  updatedModifiers,
  addressPayload,
  loginData,
  restId,
  restTime,
  specialInstructions,
}) => {
  return {
    userId: loginData.userId,
    restId: restId,
    platRestId: item.restId,
    deliveryMode: diningOption,
    requestedFulfillTime: LocalStorage.getJSON(KEYS.TIME) || restTime,
    product: {
      platOrderItemId: editData?.platOrderItemId,
      prodReplace: editCheck,
      cartProdId: editData?.id,
      prodUpsert: false,
      prodId: item.id,
      amt: item.cost,
      platProdId: item.platItemId,
      platCateId: item?.cateId || item?.cates?.[0]?.cate_id?.platCateId,
      platProdUniqId: item.platItemUniqId,
      prodNm: item.name,
      qunt,
      instr: specialInstructions,
      modifiers: updatedModifiers,
    },
    ...(diningOption === HANDOFF_MODE.DELIVERY && { address: addressPayload }),
  };
};

export const updateQuantity = (prev, data, minus, quantity) => {
  if (quantity > 0 && data?.modifiers?.[0]?.toppingId) {
    return prev.map((item) => {
      if (item.modifiers?.some((mod) => mod.toppingId === data.modifiers[0].toppingId)) {
        const updatedModifiers = item.modifiers.map((mod) => {
          if (mod.toppingId === data.modifiers[0].toppingId) {
            return {
              ...mod,
              qunt: minus ? Math.max(mod.qunt - 1, 0) : mod.qunt + 1,
            };
          }
          return mod;
        });

        return {
          ...item,
          modifiers: updatedModifiers,
        };
      }

      return item;
    });
  }

  if (data?.isNested === false) {
    return prev
      .map((item) =>
        item.modId === data.id && item.parentModId === data.parentItemId
          ? { ...item, qunt: minus ? item.qunt - 1 : quantity > 0 ? quantity + 1 : item.qunt + 1 }
          : item,
      )
      .filter((item) => item.qunt > 0);
  }
  return prev;
};

export const createModifier = (data, groupData, qunt = 1) => ({
  modId: data?.id,
  platModId: data?.platItemId,
  platModUniqId: data?.platItemUniqId,
  platOpGrpId: groupData?.platOpGrpId,
  modNm: data?.name,
  qunt: qunt === 0 ? 1 : qunt,
  amt: data?.cost,
  modifiers: data?.modifiers,
  isNestedMod: data?.isNested,
  ...(data?.toppingId && { toppingId: data?.toppingId }),
  parentModId: data?.parentItemId || null,
  //   selectedTime: new Date(),
});

// Get the group modifiers for the specified group
export const getCurrentGroupModifiers = (prev, groupData, data, isHalf) => {
  if (isHalf) {
    return prev.filter((mod) => {
      if (mod?.modifiers?.length > 0) {
        return mod?.modifiers?.[0]?.modNm === data?.modifiers?.[0]?.modNm;
      }
    });
  } else {
    return prev.filter((mod) => {
      if (mod?.parentModId !== data?.parentItemId && mod?.modId === data?.id) {
        return false;
      } else if (mod?.parentModId !== data?.parentItemId) {
        return false;
      } else {
        return mod?.platOpGrpId === groupData?.platOpGrpId;
      }
    });
  }
};

// Remove the current item from the list
export const removeModifier = (prev, data, isHalf) => {
  if (isHalf) {
    return prev.filter((mod) => {
      if (mod?.modId === data?.id) {
        // If there's only one nested modifier, remove the whole mod
        if (mod.modifiers.length === 1) {
          return false;
        }

        // Otherwise, update the nested modifiers
        mod.modifiers = mod.modifiers.filter(
          (nestedMod) => nestedMod?.toppingId !== data?.modifiers?.[0]?.toppingId,
        );
      }
      return true;
    });
  }

  return prev.filter((mod) => mod.modId !== data.id);
};

// Handle adding a modifier when it exceeds the maximum allowed
export const handleMaxSelectionReached = (prev, currentGroupModifiers, data, groupData, isHalf) => {
  const parentIds = new Set(prev.filter((mod) => !mod.parentModId).map((mod) => mod.platModId));

  function isValidModifier(mod) {
    return !mod.parentModId || parentIds.has(mod.parentModId);
  }

  if (isHalf) {
    const found = prev.find((mod) => mod.modId === data.id);

    if (found) {
      return prev
        .map((mod) => {
          if (mod.modId === data.id) {
            return {
              ...mod,
              modifiers: [...mod.modifiers, data.modifiers[0]],
            };
          }

          if (mod.modifiers?.length > 0) {
            const cleanedModifiers = mod.modifiers?.filter(
              (m) => m.toppingId !== data.modifiers[0].toppingId,
            );

            if (cleanedModifiers?.length === 0) return null;

            return {
              ...mod,
              modifiers: cleanedModifiers,
            };
          }
          return mod;
        })
        .filter(Boolean);
    } else {
      const cleanedPrev = prev
        .map((mod) => {
          if (mod.modifiers?.length > 0) {
            const updatedModifiers = mod.modifiers.filter(
              (m) => m.toppingId !== data.modifiers[0].toppingId,
            );

            if (updatedModifiers.length === 0) return null;

            return { ...mod, modifiers: updatedModifiers };
          }

          // If no nested modifiers, return the original mod
          return mod;
        })
        .filter(Boolean); // Filters out any `null` returned from `.map()`

      return [...cleanedPrev, createModifier(data, groupData)];
    }
  }

  // Default (non-half) logic
  return [
    ...prev.filter(
      (mod) =>
        (isValidModifier(mod) && mod.platOpGrpId !== groupData.platOpGrpId) ||
        (isValidModifier(mod) && mod.parentModId !== data.parentItemId),
    ),
    ...currentGroupModifiers.slice(1),
    createModifier(data, groupData),
  ];
};

export const createHalfNHalf = (newGroup, groupData, type, id, modQunt) => {
  let newData = [];
  if (type === 'Whole') {
    newData.push(newGroup.modifiers[0]);
  } else {
    newData = newGroup.modifiers.filter((item) => item.name.includes(type));
  }
  const optionData = newData;

  if (!newData.length) {
    console.error('newData is empty or undefined', newData);
    return;
  }

  newData = newData[0].option_groups.filter((group) => group.type === groupData.type);

  if (!newData.length) {
    console.error('No matching option_groups found', newData);
    return;
  }

  newData = newData[0].modifiers.filter((mod) => {
    return mod.toppingId === id;
  });

  if (!newData.length) {
    console.error('No matching modifiers found', newData);
    return;
  }

  newData = newData[0];

  const modData = optionData[0];

  if (!modData) {
    console.error('modData is undefined', modData);
    return;
  }
  modData.qunt = 1;
  modData.modifiers = [];
  modData.modifiers[0] = {
    modId: newData.id,
    platModId: newData.platItemId,
    platModUniqId: newData.platItemUniqId,
    platOpGrpId: newData.platOpGrpId,
    modNm: newData.name,
    qunt: modQunt,
    amt: newData.cost,
    modifiers: [],
    toppingId: newData?.toppingId,
    isNestedMod: newData?.isNested || false,
  };
  return modData;
};

//  THIS IS OUR PREVIUOS FUNC

export const nestModifiersTree = (modifiers) => {
  const modMap = new Map();

  // Create a map of modifiers
  modifiers.forEach((modifier) => {
    if (!Array.isArray(modifier.modifiers)) {
      modifier.modifiers = [];
    }
    modMap.set(modifier.platModId, modifier);
  });

  const rootModifiers = [];

  modifiers.forEach((modifier) => {
    if (modifier.parentModId) {
      const parent = modMap.get(modifier.parentModId);
      if (parent) {
        // Remove if already exists
        parent.modifiers = parent.modifiers.filter((m) => m.platModId !== modifier.platModId);
        parent.modifiers.push(modifier);
      }
    } else {
      rootModifiers.push(modifier);
    }
  });

  return rootModifiers;
};

export const nestModifiersTreeForUI = (modifiers) => {
  const clonedModifiers = modifiers.map((mod) => ({ ...mod, modifiers: [] }));
  const modMap = new Map();

  // Map all modifiers
  clonedModifiers.forEach((modifier) => {
    modMap.set(modifier.platModId, modifier);
  });

  const rootModifiers = [];

  clonedModifiers.forEach((modifier) => {
    if (modifier.parentModId) {
      const parent = modMap.get(modifier.parentModId);
      if (parent) {
        parent.modifiers = parent.modifiers.filter((m) => m.platModId !== modifier.platModId);
        parent.modifiers.push(modifier);
      }
    } else {
      rootModifiers.push(modifier);
    }
  });

  return rootModifiers;
};

export const formatTime = (time) => {
  if (!time) return '';
  const [hour, minute] = time.split(':');
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

export const todaysDay = new Date().toLocaleString('en-US', { weekday: 'long' });

// THIS FUNC IS FOR TO NOT REPEAT SAME MODIFIER IN THE MODIFIERS ARRAY AND IT IS WORKING BUT IN THIS THERE IS A ISSUE
//  THIS FUNC WORKS ON PARENT ID TO HANDLE NESTED MODIFIERS BUT IN HALF AND HALF IT IS NOT WORKING COZ THERE IS NO PARENT ID

// export const nestModifiersTree = (modifiers) => {
//   const modMap = new Map();
//   const seenChildIds = new Set(); // Track added child platModIds

//   modifiers.forEach((modifier) => {
//     if (!Array.isArray(modifier.modifiers)) {
//       modifier.modifiers = [];
//     }
//     modMap.set(modifier.platModId, { ...modifier, modifiers: [] }); // Always start with a clean array
//   });

//   const rootModifiers = [];

//   modifiers.forEach((modifier) => {
//     const { platModId, parentModId } = modifier;

//     if (parentModId && modMap.has(parentModId)) {
//       const parent = modMap.get(parentModId);
//       const alreadyAdded = parent.modifiers.some((child) => child.platModId === platModId);

//       if (!alreadyAdded) {
//         parent.modifiers.push(modMap.get(platModId));
//         seenChildIds.add(platModId);
//       }
//     } else {
//       if (!seenChildIds.has(platModId)) {
//         rootModifiers.push(modMap.get(platModId));
//       }
//     }
//   });

//   return rootModifiers;
// };
