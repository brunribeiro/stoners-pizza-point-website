import React, { useContext, useState } from 'react';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

import commonApi from '@/services/api/common';
import AppContext from '@/utils/appContext';
import { LocalStorage } from '@/utils/localStorage';
import { posthogTrack } from '@/utils/analytics';
import {
  API_SUCCESS_RESPONSE,
  DINING_OPTION,
  HANDOFF_MODE,
  KEYS,
  REST_LOCATION_ID,
} from '@/utils/constant';
import { getAddressPayload, getDiningOption, nestModifiersTree } from '@/hook/model/helper';

const useCart = () => {
  const [cartLoad, setCartLoad] = useState(false);
  const [itemLoad, setItemLoad] = useState(false);
  const [cartItem, setCartItem] = useState();
  const [openCart, setOpenCart] = useState(false);
  const [countLoader, setCountLoader] = useState(false);
  const [isChangeOrderDetail, setIsChangeOrderDetail] = useState(false);
  const { loginData, itemCount, setItemCount } = useContext(AppContext);
  const router = useRouter();
  const getCart = async () => {
    setOpenCart(true);
    setCartLoad(true);
    try {
      const response = await commonApi({
        action: 'getCart',
        data: { userId: loginData?.userId },
      });
      if (response?.data?.[0]) {
        LocalStorage.set('restId', response.data?.[0]?.restId);
        LocalStorage.setJSON(REST_LOCATION_ID, response.data?.[0]?.platRestId);
        LocalStorage.set(DINING_OPTION, response.data?.[0]?.deliveryMode === 1 ? 0 : 1);
      }

      if (response.data?.[0]) {
        posthogTrack({
          name: 'view_cart',
          trackData: {
            cart_id: String(response.data?.[0]?.id),
            item_count: response.data?.[0]?.products?.length,
            restaurant_id: response.data?.[0]?.restId,
            total_value: response.data?.[0]?.total || 0,
            source_screen: router.asPath,
          },
        });
      }
      setCartItem(response.data);
      setItemCount(response.data?.[0]?.products?.length || 0);
    } catch (error) {
      console.error('Error fetching cart list:', error);
    } finally {
      setCartLoad(false);
    }
  };

  const addSoftCart = (data, item) => {
    setCartLoad(true);
    function collectAllModifiers(optionGroups) {
      return optionGroups.flatMap((group) =>
        // eslint-disable-next-line no-unused-vars
        group.modifiers.flatMap(({ cartItemId, id, option_groups, ...rest }) => {
          // Flatten nested modifiers
          const nestedModifiers =
            option_groups.length > 0 ? collectAllModifiers(option_groups) : [];
          return [rest, ...nestedModifiers]; // Include rest of fields except the ones excluded
        }),
      );
    }

    // Get all modifiers from the data
    const allModifiers = collectAllModifiers(item.option_groups);
    let updatedModifiers = allModifiers.map(({ ...rest }) => rest);
    const addressPayload = getAddressPayload();
    const diningOption = getDiningOption();
    updatedModifiers = nestModifiersTree(updatedModifiers);
    const payload = {
      userId: loginData?.userId,
      restId: data[0].restId.toString(),
      platRestId: data[0].platRestId.toString(),
      deliveryMode: diningOption,
      product: {
        platOrderItemId: item.platOrderItemId,
        cartProdId: item.id,
        prodReplace: false,
        prodId: item.prodId,
        amt: item.amt,
        platProdId: item.platProdId,
        platCateId: item.platCateId,
        platProdUniqId: item.platProdUniqId,
        prodNm: item.prodNm,
        qunt: 1,
        instr: item.instr,
        modifiers: updatedModifiers,
      },
      ...(diningOption === HANDOFF_MODE.DELIVERY && { address: addressPayload }),
    };

    async function fetchData() {
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
        setItemLoad(true);
        await commonApi({
          action: 'addToCart',
          data: payload,
        });
        LocalStorage.remove('Tip');
      } catch (error) {
        console.error('Error in adding item :', error);
      } finally {
        getCart();
        setItemLoad(false);
      }
    }

    fetchData();
  };

  const removeItem = async (item, prodDelete, cartDelete) => {
    posthogTrack({
      name: 'remove_from_cart',
      trackData: {
        item_id: Number(item.prodId),
        item_name: item.prodNm,
        item_price: item.amt,
        quantity: item.qunt,
      },
    });
    setCartLoad(true);
    const payload = {
      qunt: item.qunt.toString(),
      prodDel: prodDelete,
      cartDel: cartDelete,
      ...(loginData?.userId && { userId: loginData?.userId }),
    };

    try {
      setItemLoad(true);
      await commonApi({
        action: 'removeItem',
        parameters: [item.id],
        data: payload,
      });
      LocalStorage.remove('Tip');
    } catch (error) {
      console.error('Error fetching category list:', error);
    } finally {
      getCart();
      setItemLoad(false);
      if (cartDelete) {
        setItemCount(0);
      }
    }
  };

  const getCartCount = async () => {
    setCountLoader(true);
    try {
      const response = await commonApi({
        action: 'getcartCount',
        config: {
          headers: {
            'x-device-id': getCookie(KEYS.deviceToken),
          },
        },
        data: { userId: loginData?.userId },
      });
      if (response.code === API_SUCCESS_RESPONSE) {
        if (itemCount !== response?.data?.count) setItemCount(response?.data?.count);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCountLoader(false);
    }
  };

  const buildOptionDataJSX = (optionGroups = [], depth = 0) => {
    const elements = [];

    for (const group of optionGroups) {
      const groupName = group.name || '';
      const interfaceType = group.interface;
      const isHalf = group.isHalf;
      const modifiers = group.modifiers ?? [];

      // Case 1: isHalf === true
      if (isHalf === true) {
        const halfMap = {};

        for (const mod of modifiers) {
          const modName = mod.modNm || 'Unknown Modifier';
          const nestedGroups = mod.option_groups || [];

          for (const nestedGroup of nestedGroups) {
            const nestedMods = nestedGroup.modifiers ?? [];
            for (const nestedMod of nestedMods) {
              const nestedModName = nestedMod.modNm || 'Unknown Nested Modifier';
              if (!halfMap[modName]) {
                halfMap[modName] = [];
              }
              halfMap[modName].push(nestedModName);
            }
          }
        }

        for (const key in halfMap) {
          elements.push(
            <div key={key} className='text-stone-black text-[14px]'>
              <span>{key}:</span> {halfMap[key].join(', ')}
            </div>,
          );
        }
      }

      // Case 2: interface == 2 (Nested layout)
      else if (interfaceType === 2) {
        const modNames = modifiers.map((mod) => mod.modNm || 'Unknown Modifier');
        if (modNames.length > 0) {
          elements.push(
            <div key={groupName} className='text-stone-black text-[14px]'>
              <span>{groupName}:</span> {modNames.join(', ')}
            </div>,
          );
        }

        for (const mod of modifiers) {
          const nestedGroups = mod.option_groups || [];
          if (nestedGroups.length > 0) {
            elements.push(...buildOptionDataJSX(nestedGroups, depth + 1));
          }
        }
      }

      // Case 3: default
      else {
        const modNames = modifiers.map((mod) => mod.modNm || 'Unknown Modifier');
        if (modNames.length > 0) {
          elements.push(
            <div key={groupName} className='text-stone-black text-[14px] font-medium'>
              <span>{groupName}:</span> {modNames.join(', ')}
            </div>,
          );
        }

        for (const mod of modifiers) {
          const nestedGroups = mod.option_groups || [];
          if (nestedGroups.length > 0) {
            elements.push(...buildOptionDataJSX(nestedGroups, depth + 1));
          }
        }
      }
    }

    return elements;
  };

  return {
    countLoader,
    getCartCount,
    cartLoad,
    getCart,
    setOpenCart,
    openCart,
    cartItem,
    addSoftCart,
    removeItem,
    setCartLoad,
    itemLoad,
    itemCount,
    isChangeOrderDetail,
    setIsChangeOrderDetail,
    buildOptionDataJSX,
  };
};

export default useCart;
