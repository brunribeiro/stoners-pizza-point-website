// import https from 'https';

import React, { useContext, useEffect } from 'react';
// import axios from 'axios';

import Menu from '@/components/Menu';
import { withSessionSsr } from '@/lib/withSession';
import AppContext from '@/utils/appContext';

const MenuIndex = (pageProps) => {
  const { setIsPageLoad } = useContext(AppContext);
  useEffect(() => {
    setIsPageLoad(false);
  }, []);
  return <Menu pageProps={pageProps} />;
};

export default MenuIndex;

export const getServerSideProps = withSessionSsr(async (context) => {
  const { req } = context;
  const { token = '', user = {}, id = {} } = req.session;

  // const { menuId, restId } = id;

  // if (!restId) {
  //   return {
  //     notFound: true,
  //   };
  // }

  // const httpsAgent = new https.Agent({
  //   rejectUnauthorized: false,
  // });

  try {
    // const initialCategoryListResponse = await axios.post(
    //   `${process.env.NEXT_PUBLIC_FETCH_URL}/restaurant/menu?isCatering=false`,
    //   { restId: restId, menuId },
    //   { httpsAgent },
    // );

    // const categoryId = initialCategoryListResponse?.data?.data?.[0]?.id || null;
    // let initialItemListResponse = {};
    // if (categoryId) {
    //   initialItemListResponse = await axios.post(
    //     `${process.env.NEXT_PUBLIC_FETCH_URL}/restaurant/menu/item`,
    //     { categoryId, restId: +restId },
    //     { httpsAgent },
    //   );
    // }

    return {
      props: {
        // initialCategoryList: initialCategoryListResponse?.data?.data || [],
        // initialItemList: initialItemListResponse?.data?.data,
        userData: { ...user, token, id },
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialCategoryList: [],
        initialItemList: [],
        userData: { ...user, token },
      },
    };
  }
});
