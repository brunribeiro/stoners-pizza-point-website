import { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';

import {
  createModifier,
  getAddressPayload,
  getCartPayload,
  getCurrentGroupModifiers,
  getDiningOption,
  handleMaxSelectionReached,
  nestModifiersTree,
  removeModifier,
  updateQuantity,
  validateSelections,
} from './helper';

import commonApi from '@/api/common';
import Toast from '@/utils/toast';
import AppContext from '@/utils/appContext';
import { KEYS, MODIFIER_TYPE, DININGOPTION_TAB_CODES } from '@/utils/constant';
import { LocalStorage } from '@/utils/localStorage';
import routes from '@/utils/routes';
import { gethalfNhalfPrice } from '@/utils/helper';
import { posthogTrack } from '@/utils/analytics';
import useCart from '@/components/Menu/hook/useCart';

const useItemModel = () => {
  const { getCartCount } = useCart();
  const [modifierHistory, setModifierHistory] = useState([]);
  const [cartLoad, setCartLoad] = useState(false);
  const [recentSelectModifier, setRecentSelectModifier] = useState({});
  const [itemPrice, setItemPrice] = useState(false);
  const [currItem, setCurrItem] = useState(null);
  const [itemQuant, setItemQuant] = useState(1);
  const [selectionDetail, setSelectionDetail] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState(['Menu']);
  const [selectedCat, setSelectedCat] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showPopup, setShowPopup] = useState(null);
  const [isLoad, setIsLoad] = useState(true);

  const modifierRefs = useRef({});
  const nestedModifierRefs = useRef({});
  const nestedDivRef = useRef(null);

  const {
    loginData,
    setSelectedItem,
    selectedItem,
    setNestedSelectItem,
    setEditData,
    setSelModifiers,
    parentSelectedItem,
    setParentSelectedItem,
    setNewNestedState,
    newNestedState,
    selModifiers,
    savedMod,
    nestedSavedMod,
    setSavedMod,
    setNestedSavedMod,
    nestedSelectItem,
    editData,
  } = useContext(AppContext);
  const [restId, setRestId] = useState(null);
  const [restTime, setRestTime] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [nestedModifier, setNestedModifier] = useState({});

  const storedRestTime = LocalStorage.getJSON(KEYS.TIME);
  const router = useRouter();
  const pendingItemIdRef = useRef(null);

  const getItemDetails = async (itemId) => {
    const beforetime = Date.now();
    const detail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
    const restroId = detail.id;
    if (itemId) {
      try {
        if (selectedItem?.id === Number(itemId)) return;
        if (pendingItemIdRef.current === String(itemId)) return;
        pendingItemIdRef.current = String(itemId);
        setIsLoad(true);
        const response = await commonApi({
          action: 'getItemDetails',
          data: { itemId, restId: restroId },
        });
        setItemPrice(response?.data?.cost);
        setSelectedItem(response?.data);
        setNestedSelectItem(response?.data);
        setParentSelectedItem(response?.data);
        const aftertime = Date.now();
        posthogTrack({
          name: 'menu_item_viewed',
          trackData: {
            item_id: Number(response?.data.id),
            item_name: response?.data.name,
            item_price: response?.data.cost,
            item_category: response?.data.cateId,
            restaurant_id: response?.data.direRestId,
            viewing_duration_seconds: (aftertime - beforetime) / 1000,
            session_id: '',
          },
        });
        setTimeout(() => {
          setIsLoad(false);
        }, 300);
      } catch (error) {
        console.error('Error fetching category list:', error);
        setTimeout(() => {
          setIsLoad(false);
        }, 300);
      } finally {
        pendingItemIdRef.current = null;
      }
    }
  };

  const makeInterface = (check = false) => {
    parentSelectedItem?.option_groups?.forEach((group) => {
      if (group.interface !== 2) return;

      const grp = group.isHalf
        ? { ...group.modifiers?.[0]?.option_groups?.[0], isHalf: true }
        : group;

      let defaultModifiers = grp.modifiers?.filter((m) => m.isDefaultSelItem) || [];

      const editedModifier = editData?.option_groups?.[0]?.modifiers?.[0];
      if (editedModifier) {
        const matchedModifier = grp.modifiers?.find((m) => m.id === editedModifier.modId);
        if (matchedModifier) {
          defaultModifiers = [matchedModifier];
        }
      }
      const applyModifier = (modifier, delay) => {
        setTimeout(() => {
          setSelectedItem(modifier);
        }, delay);

        const alreadySelected = selModifiers.find((item) => item?.modId === modifier?.id);
        if (alreadySelected && check) return;

        handleModifierToggle({
          groupData: grp,
          data: modifier,
          max: grp.maxSel,
          isAdded: false,
          isNested: true,
        });
      };

      if (defaultModifiers.length) {
        applyModifier(defaultModifiers[0], 0);
      } else if (grp.modifiers?.length) {
        applyModifier(grp.modifiers[0], 0);
      } else {
        //nothing
      }
    });
    setItemPrice(parentSelectedItem?.cost);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const detail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
      if (detail.id) {
        setRestId(String(detail.id));
      }

      if (storedRestTime) {
        setRestTime(storedRestTime);
      }
    }
    if (
      !selectedItem &&
      router.query.itemId &&
      typeof router.asPath === 'string' &&
      router.asPath.includes('/menu/categories/items')
    ) {
      getItemDetails(router.query.itemId);
    }
  }, [router.query.itemId]);

  const handleItemClick = async (id, itemData = {}) => {
    if (itemData && itemData?.option_groups?.length) {
      setEditData(itemData);
      LocalStorage.setJSON(KEYS.EDIT_ITEM, itemData);
      const extractModifiers = (modifiers) => {
        const flattenedModifiers = [];

        const traverseModifiers = (mods) => {
          mods.forEach((mod) => {
            const modNmIncludesSpecial = [
              MODIFIER_TYPE.WHOLE,
              MODIFIER_TYPE.FIRST_HALF,
              MODIFIER_TYPE.SECOND_HALF,
            ].some((type) => mod.modNm.includes(type));

            flattenedModifiers.push({
              modId: mod.modId,
              platModId: mod.platModId,
              platModUniqId: mod.platModUniqId,
              platOpGrpId: mod.platOpGrpId,
              modNm: mod.modNm,
              amt: mod.amt,
              qunt: mod.qunt,
              modifiers: modNmIncludesSpecial ? mod.option_groups?.[0]?.modifiers : [],
              isNestedMod: mod.isNestedMod,
              parentModId: mod?.parentModId || null,
            });

            if (modNmIncludesSpecial) {
              return;
            }

            if (mod.option_groups && mod.option_groups.length > 0) {
              mod.option_groups.forEach((optionGroup) => {
                if (optionGroup.modifiers && optionGroup.modifiers.length > 0) {
                  traverseModifiers(optionGroup.modifiers);
                }
              });
            }
          });
        };

        traverseModifiers(modifiers);

        return flattenedModifiers;
      };
      setSavedMod((prev) => {
        const newModifiers = itemData?.option_groups
          ?.map((modGroup) => extractModifiers(modGroup.modifiers))
          .flat();

        return [...prev, ...newModifiers];
      });
      setSelModifiers((prev) => {
        const newModifiers = itemData?.option_groups
          ?.map((modGroup) => extractModifiers(modGroup.modifiers))
          .flat();

        return [...prev, ...newModifiers];
      });

      let { diningOption, rest } = router.query;
      if (!diningOption || !rest) {
        const detail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL) || {};
        const tab = LocalStorage.getJSON(KEYS.DINING_OPTION);
        rest = detail.id || rest;
        diningOption = DININGOPTION_TAB_CODES?.[tab] || diningOption || 'pickup';
      }
      router.push(routes.selectedItem(diningOption, rest, id, true));
      return;
    }
    if (!selectedItem) {
      setSelectedItem(true);
    }
    try {
      setIsOpen(true);
      setIsLoad(true);
      const response = await commonApi({ action: 'getItemDetails', data: { itemId: id, restId } });
      setSelectedItem(response?.data);
      setItemPrice(response?.data?.cost);
      setNestedSelectItem(response?.data);
      setParentSelectedItem(response?.data);
      setModifierHistory((prevHistory) => {
        const res = prevHistory?.length ? [...prevHistory, response?.data] : [response?.data];

        return res;
      });
    } catch (error) {
      console.error('Error fetching category list:', error);
    } finally {
      setIsLoad(false);
    }
  };
  const updateMod = (prev, data, minus, isNested, qunt, isHalf) => {
    if (data) {
      data.isNested = isNested;
    }
    return updateQuantity(prev, data, minus, qunt, isHalf);
  };
  const createMofifier = ({ prev, data, groupData, isNested, isHalf, qunt }) => {
    if (data) {
      data.isNested = isNested;
    }
    let isUpdated = false;

    const updatedPrev = prev.map((item) => {
      if (item?.modId === data?.id && isHalf) {
        isUpdated = true;
        return {
          ...item,
          modifiers: [...(item?.modifiers || []), createModifier(data, groupData).modifiers?.[0]],
        };
      }
      return item;
    });

    if (isHalf && isUpdated) {
      return updatedPrev;
    }

    const created = createModifier(data, groupData, qunt, isHalf);
    return [...prev, created];
  };

  const selectionStructure = (updatedModifiers, groupData) => {
    setSelectionDetail((prev) => {
      const groupedModifiers = {};
      const modMap = {};

      // Build modMap for quick lookup by platModId
      updatedModifiers.forEach((mod) => {
        modMap[mod.platModId] = mod;
      });

      updatedModifiers.forEach((mod) => {
        const groupKey = mod.modNm;
        const groupId = mod.platOpGrpId;

        const isGroupMod =
          mod.modNm?.includes(MODIFIER_TYPE.WHOLE) ||
          mod.modNm?.includes(MODIFIER_TYPE.FIRST_HALF) ||
          mod.modNm?.includes(MODIFIER_TYPE.SECOND_HALF);

        if (isGroupMod && Array.isArray(mod.modifiers)) {
          if (!groupedModifiers[groupKey]) {
            groupedModifiers[groupKey] = {
              id: groupId,
              name: groupKey,
              mods: [],
            };
          }

          mod.modifiers.forEach((nestedMod) => {
            groupedModifiers[groupKey].mods.push({
              modName: nestedMod.modNm,
              modId: nestedMod.modId || nestedMod.platModId,
              qunt: nestedMod.qunt,
            });
          });

          return;
        }

        let topMod = mod;
        while (
          topMod?.parentModId &&
          modMap[topMod.parentModId] &&
          !modMap[topMod.parentModId].platOpGrpId?.includes('CUSTOM')
        ) {
          topMod = modMap[topMod.parentModId];
        }

        const effectiveGroupId = topMod.platOpGrpId;
        const existingGroup = prev.find((item) => item.id === effectiveGroupId);
        const groupName = existingGroup?.name || groupData.name || topMod.modNm;

        if (!groupedModifiers[effectiveGroupId]) {
          groupedModifiers[effectiveGroupId] = {
            id: effectiveGroupId,
            name: groupName,
            mods: [],
          };
        }

        const modsList = groupedModifiers[effectiveGroupId].mods;
        if (!modsList.some((m) => m.modId === mod.modId || m.modId === mod.platModId)) {
          modsList.push({
            modName: mod.modNm,
            modId: mod.modId || mod.platModId,
            qunt: mod.qunt,
          });
        }
      });

      const updatedSelection = Object.values(groupedModifiers);
      return updatedSelection;
    });
  };

  // Main handler for toggling modifiers
  const handleModifierToggle = ({
    groupData = {},
    data,
    max,
    isAdded = false,
    minus = false,
    isNested = false,
    isHalf = false,
    qunt = 0,
    setHalfNhalfPrice = () => {},
    type,
    id,
  }) => {
    setSelModifiers((prev) => {
      const currentGroupModifiers = getCurrentGroupModifiers(prev, groupData, data, isHalf);
      const matchedItem = prev.find((item) => {
        return item?.modId === data?.id && item?.parentModId === data?.parentItemId;
      });

      let updatedModifiers;

      if ((isAdded && data.isNested === false) || (isAdded && !data.isNested)) {
        updatedModifiers = removeModifier(prev, data, isHalf);
      } else if (
        (max > 0 && isHalf) ||
        (currentGroupModifiers.length >= max && !isHalf && max > 0)
      ) {
        updatedModifiers =
          matchedItem && !isHalf
            ? updateMod(prev, data, minus, isNested, qunt, isHalf)
            : handleMaxSelectionReached(prev, currentGroupModifiers, data, groupData, isHalf);
      } else if (max === 0 || currentGroupModifiers.length < max) {
        updatedModifiers =
          matchedItem && !isHalf
            ? updateMod(prev, data, minus, isNested, qunt, isHalf)
            : createMofifier({ prev, data, groupData, isNested, isHalf, qunt });
      } else {
        console.error('Case not found');
        updatedModifiers = prev;
      }

      if (isHalf) {
        gethalfNhalfPrice(updatedModifiers, type, setHalfNhalfPrice, id);
      }
      selectionStructure(updatedModifiers, groupData);

      if (!isNested && !open) {
        setSavedMod(updatedModifiers);
      }
      const instr = '';
      const getPrice = true;
      if (Object.keys(newNestedState).length > 0) {
        // addToCart(updatedModifiers, newNestedState, 1, {}, instr, getPrice, data);
      } else if (updatedModifiers.length > 0 && selectedItem !== true) {
        addToCart(updatedModifiers, selectedItem, itemQuant, {}, instr, getPrice, data);
      } else {
        //nothing
      }
      return updatedModifiers;
    });
  };

  const addToCart = (
    modifiers,
    item,
    qunt,
    editData = {},
    specialInstructions,
    getPrice = false,
    currItem1 = {},
  ) => {
    if (!validateSelections(item?.option_groups, modifiers, getPrice, currItem1, setItemPrice))
      return true;

    const editCheck = Boolean(editData?.option_groups?.length);

    const diningOption = getDiningOption();
    const addressPayload = getAddressPayload();

    let updatedModifiers = modifiers.map(({ ...rest }) => rest);

    updatedModifiers = nestModifiersTree(updatedModifiers, getPrice);
    const restroDetail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
    const payload = getCartPayload({
      item: parentSelectedItem,
      qunt,
      editData,
      editCheck,
      diningOption,
      updatedModifiers,
      addressPayload,
      loginData,
      restId: toString(restroDetail.id),
      restTime,
      specialInstructions,
    });

    if (getPrice) {
      if (!payload.platRestId || !payload.restId) {
        const restroDetail = LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL);
        payload.platRestId = restroDetail.restId;
        payload.restId = restroDetail.id;
      }
      fetchPrice(payload);
    } else {
      fetchData(payload, editCheck);
    }
  };

  const fetchPrice = async (payload) => {
    try {
      setCartLoad(true);
      const response = await commonApi({
        action: 'getItemPrice',
        data: payload,
      });
      setItemPrice(response?.data?.subtotal);
      setCartLoad(false);
    } catch (error) {
      console.error('Error fetching category list:', error);
      setCartLoad(false);
    }
  };

  // Fetch data from API and handle cart operations
  const fetchData = async (payload, editCheck) => {
    payload.restId = String(LocalStorage.getJSON(KEYS.RESTAURANT_DETAIL).id);

    setCartLoad(true);
    try {
      posthogTrack({
        name: 'add_to_cart',
        trackData: {
          item_id: Number(payload.product.prodId),
          item_name: payload.product.prodNm,
          item_price: payload.product.amt,
          quantity: payload.product.qunt,
          customizations: payload.product.modifiers,
          restaurant_id: payload.restId,
        },
      });
      setCartLoad(true);
      await commonApi({
        action: 'addToCart',
        data: payload,
      });
      try {
        await getCartCount();
      } catch (e) {
        // silent
      }
      router.back();
      Toast.success(editCheck ? 'Item updated' : 'Added to cart');
      setIsOpen(false);
      // setItemCount(itemCount + 1);
      setSavedMod([]);
      setNestedSavedMod([]);
    } catch (error) {
      console.error('Error fetching category list:', error);
    } finally {
      setTimeout(() => {
        resetCartState();
        setCartLoad(false);
        setNestedModifier({});
        setModifierHistory([]);
        setSelectedItem(null);
      }, 2000);
    }
  };

  // Reset cart state after API call
  const resetCartState = () => {
    setIsOpen(false);
    setSelectedItem('');
    setCartLoad(false);
    setSelModifiers([]);
  };

  const selectDefault = (state) => {
    state?.option_groups?.forEach((group) => {
      const grp = group.isHalf
        ? { ...group.modifiers?.[0]?.option_groups?.[0], isHalf: true }
        : group;

      const defaultModifiers = grp.modifiers?.filter((m) => m.isDefault) || [];

      const applyModifier = (modifier) => {
        const alreadySelected = selModifiers.find((item) => item?.modId === modifier?.id);
        if (alreadySelected) return;

        handleModifierToggle({
          groupData: grp,
          data: modifier,
          max: grp.maxSel,
          isAdded: false,
          isNested: true,
        });
      };

      if (defaultModifiers.length) {
        applyModifier(defaultModifiers[0]);
      }
    });
  };

  const handleSaveChanges = () => {
    const lastHistory = modifierHistory[modifierHistory.length - 1];
    setNestedSavedMod(selModifiers);
    // Only one modifier history
    if (modifierHistory.length === 1) {
      if (validateSelections(lastHistory?.option_groups, selModifiers)) {
        setSavedMod(selModifiers);
        addToCart(selModifiers, selectedItem, 1, {}, '', true);
        setOpen(false);
        setTimeout(() => {
          setModifierHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            newHistory.pop();
            return newHistory;
          });
        }, 300);
      }
      return;
    }

    // Handle nested modifier before validating
    const hasNestedMod = selModifiers[selModifiers.length - 1]?.isNestedMod;

    const tempModifiers = [...selModifiers];
    if (hasNestedMod) {
      tempModifiers.pop();
    }

    const isNewStateValid = validateSelections(lastHistory.option_groups, tempModifiers);

    if (isNewStateValid) {
      // Actually apply state updates after validation
      if (hasNestedMod) {
        setSelModifiers((prev) => {
          const newData = [...prev];
          newData.pop();
          return newData;
        });
      }

      setModifierHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory.pop();
        return newHistory;
      });

      return;
    }
  };

  const handleClose = () => {
    setSelModifiers(savedMod);
  };

  const handleBackNestedMod = () => {
    setSelModifiers(nestedSavedMod);
    setModifierHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      newHistory.pop();

      return newHistory;
    });
  };

  const handleAddToCart = useCallback(() => {
    let firstUnselectedGroup = null;

    selectedItem?.option_groups?.forEach((group) => {
      const isRequired = group.minSel > 0;
      const selectedCount = selModifiers?.filter(
        (mod) => mod.platOpGrpId === group.platOpGrpId,
      ).length;

      if (isRequired && selectedCount < group.minSel && !firstUnselectedGroup) {
        firstUnselectedGroup = modifierRefs.current[group.id];
      }
    });

    if (firstUnselectedGroup) {
      const headerOffset = 100; // adjust this based on your fixed header height
      const elementPosition = firstUnselectedGroup.getBoundingClientRect().top;
      const offsetPosition = window.pageYOffset + elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    addToCart(selModifiers, selectedItem, itemQuant, editData, specialInstructions);
  }, [addToCart, selModifiers, selectedItem, itemQuant, specialInstructions]);

  const getTotalCount = (id) => {
    const totalQuantity = selModifiers.reduce((acc, mod) => {
      if (mod.platOpGrpId === id) {
        return acc + (mod.qunt || 0);
      }
      return acc;
    }, 0);

    return totalQuantity;
  };

  const isPresent = (id) => {
    return selModifiers.some((item) => item.modId === id);
  };

  const clearAllNestedMod = (id) => {
    if (id) {
      setSelModifiers((prev) => {
        const updatedMod = prev.filter((mod) => mod.platModId !== id && mod.parentModId !== id);
        addToCart(updatedMod, selectedItem, itemQuant, {}, '', true, {});
        return updatedMod;
      });
      setSavedMod((prev) => prev.filter((mod) => mod.platModId !== id && mod.parentModId !== id));
    }
  };

  useEffect(() => {
    if (modifierHistory?.length === 1 && Object.keys(nestedModifier)?.length) {
      setNewNestedState(modifierHistory[0]);
      setNestedModifier({});
    } else {
      if (modifierHistory.length > 0) {
        setNewNestedState(modifierHistory[modifierHistory.length - 1]);
      } else {
        setNewNestedState({});
      }
    }
  }, [modifierHistory]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectedCatRaw = localStorage.getItem('selectedCat');

      try {
        const parsedCat = selectedCatRaw ? JSON.parse(selectedCatRaw) : null;
        setSelectedCat(parsedCat);

        const crumbs = ['Menu'];
        if (parsedCat?.name) crumbs.push(parsedCat.name);
        if (nestedSelectItem?.name) crumbs.push(nestedSelectItem.name);
        setBreadcrumbs(crumbs);
      } catch (error) {
        console.error('Error parsing selectedCat from localStorage:', error);
      }
    }
  }, [selectedItem]);

  useEffect(() => {
    if (!editData) {
      selectDefault(nestedSelectItem);
    }
  }, [nestedSelectItem]);

  useEffect(() => {
    if (!editData) {
      selectDefault(newNestedState);
    }
  }, [newNestedState]);

  return {
    isPresent,
    getTotalCount,
    clearAllNestedMod,
    selectedCat,
    breadcrumbs,
    handleClose,
    addToCart,
    handleItemClick,
    selectedItem,
    handleModifierToggle,
    isLoad,
    setSelectedItem,
    setEditData,
    cartLoad,
    setSelModifiers,
    isOpen,
    setIsOpen,
    parentSelectedItem,
    handleBackNestedMod,
    recentSelectModifier,
    setRecentSelectModifier,
    modifierHistory,
    setModifierHistory,
    nestedModifier,
    setNestedModifier,
    setOpen,
    open,
    handleSaveChanges,
    itemPrice,
    currItem,
    setCurrItem,
    getItemDetails,
    itemQuant,
    setItemQuant,
    selectionDetail,
    specialInstructions,
    setSpecialInstructions,
    showPopup,
    setShowPopup,
    handleAddToCart,
    nestedModifierRefs,
    modifierRefs,
    nestedDivRef,
    makeInterface,
  };
};

export default useItemModel;
