import React from 'react';

import RestListSkeleton from '@/components/common/RestListSkeleton';
import RestListSkeleton2 from '@/components/common/RestListSkeleton2';
import EmptyRestList from '@/components/Home/EmptyRestList';
import RestaurantList from '@/components/Home/restaurantList';
import {
  showPickupSecondarySkeleton,
  showPickupPrimarySkeleton,
  isPickupEmpty,
  pickPickupList,
} from '@/utils/helper';

const PickupPanel = ({ dt, currentTab, dtAdd, isCheckout, isChange, t, onClear }) => {
  const secondary = showPickupSecondarySkeleton(dt);
  const primary = !secondary && showPickupPrimarySkeleton(dt);
  const hasPickupInput = !!dt?.pickupInputValue;
  const empty = !secondary && !primary && isPickupEmpty(dt) && hasPickupInput;
  const showList = !secondary && !primary && !empty;

  return (
    <div
      className={`w-full flex flex-col justify-center items-center  gap-2 px-1 ${
        isChange ? '!sm:px-8' : ''
      }`}
    >
      {secondary && <RestListSkeleton2 />}
      {primary && <RestListSkeleton />}
      {empty && <EmptyRestList onClick={onClear} fromPickup={true} />}
      {showList && (
        <RestaurantList
          dt={dt}
          list={pickPickupList(dt)}
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

export default PickupPanel;
