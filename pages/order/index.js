import React from 'react';

import { privateRoute } from '@/utils/handleAuth';
import OrderHistory from '@/components/Order/OrderHistory';
import LayoutWrapper from '@/shared/layoutWrapper';
// import RestaurantScheduler from '@/shared/RestaurantScheduler';
// import AppContext from '@/utils/appContext';
// import useAddress from '@/hook/useAddress';
// import useReorder from '@/hook/order/useReorder';
// import useRestaurant from '@/components/Home/hook/useRestaurant';

const MenuIndex = () => {
  // const { timeModal, setTimeModal, currentTab, setCurrentTab } = useContext(AppContext);

  // const { ...dtAdd } = useAddress({
  //   currentTab,
  //   setCurrentTab,
  // });
  // const { ...dtReorder } = useReorder(dtAdd.address);
  // const { ...dt } = useRestaurant({ tab: currentTab, dtAdd: { ...dtAdd } });
  return (
    <LayoutWrapper>
      <div className='w-[85%]  mx-auto px-5  pt-12 pb-6'>
        <OrderHistory />
      </div>
      {/* <RestaurantScheduler open={timeModal} setOpen={setTimeModal} dt={dtReorder} dtAdd={dtAdd} /> */}
    </LayoutWrapper>
  );
};

export default MenuIndex;
export const getServerSideProps = privateRoute();
