import React, { useEffect } from 'react';

import AddressCard from '@/components/Home/addressCard';
import EmptyRestList from '@/components/Home/EmptyRestList';
import RestaurantList from '@/components/Home/restaurantList';
import { isDeliveryEmpty } from '@/utils/helper';
import DeliveryAddressSummary from '@/shared/sidebar/DeliveryAddressSummary';
import useDeliveryUI from '@/shared/sidebar/hooks/useDeliveryUI';
import { useRestaurantCtx } from '@/contexts/restaurantContext';
import RestListSkeleton from '@/components/common/RestListSkeleton';

const DeliveryPanel = ({
  dt,
  currentTab,
  dtAdd,
  isCheckout,
  isChange,
  t,
  localDeliveryAddress,
  loginData,
  fromHome,
  sidebarRef,
  selectedAddress,
  isLoadedMap,
  setValue,
  register,
  errors,
  onClear,
}) => {
  const hasDesc = !!dtAdd?.watch?.('description');
  const showEmpty = isDeliveryEmpty(dt, localDeliveryAddress) && hasDesc;

  const { isEditing, startEdit, finishEdit, shouldShowList } = useDeliveryUI({
    dt,
    localDeliveryAddress,
  });

  const { loadSearchByDelivery } = useRestaurantCtx();
  useEffect(() => {
    if (Array.isArray(dt?.deliverySearchList) && dt.deliverySearchList.length > 0) return;
    const hasCoord = localDeliveryAddress?.lat && localDeliveryAddress?.long;
    if (hasCoord) {
      loadSearchByDelivery({ lat: localDeliveryAddress.lat, lng: localDeliveryAddress.long });
    }
  }, []);

  return (
    <div className='w-full relative mb-2 flex flex-col justify-center items-center gap-2'>
      {isEditing ? (
        <AddressCard
          dtAdd={dtAdd}
          setValue={setValue}
          register={register}
          errors={errors}
          isLoadedMap={isLoadedMap}
          t={t}
          localDeliveryAddress={localDeliveryAddress}
          forceShowForm
          loginData={loginData}
          fromHome={fromHome}
          isChange={isChange}
          sidebarRef={sidebarRef}
          selectedAddress={selectedAddress}
          loader={dt?.loader?.list}
          onAddressCommitted={finishEdit}
        />
      ) : (
        <>
          <DeliveryAddressSummary
            address={localDeliveryAddress}
            onChange={startEdit}
            className='w-full'
            isChange={isChange}
          />
          {dt?.loader?.list && (
            <div className='w-full px-1'>
              <RestListSkeleton />
            </div>
          )}
          {showEmpty && <EmptyRestList onClick={onClear} isChange={isChange} />}
        </>
      )}

      {shouldShowList && (
        <RestaurantList
          dt={dt}
          list={dt?.deliverySearchList}
          currentTab={currentTab}
          dtAdd={dtAdd}
          isCheckout={isCheckout}
          isChange={isChange}
          t={t}
          tabIndex='0'
          hideSelectedBorder={true}
        />
      )}
    </div>
  );
};

export default DeliveryPanel;
