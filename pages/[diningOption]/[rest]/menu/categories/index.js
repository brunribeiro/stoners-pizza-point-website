// import https from 'https';

import React from 'react';
// import axios from 'axios';

import CategoriesWithItems from '@/components/Menu/CategoriesWithItems';
import { withSessionSsr } from '@/lib/withSession';

const index = (pageProps) => {
  return <CategoriesWithItems pageProps={pageProps} />;
};

export default index;
export const getServerSideProps = withSessionSsr(async (context) => {
  const { req } = context;
  const { token = '', user = {}, id = {} } = req.session;
  // const { restId = null, menuId = null } = id || {};

  // const { restId } = query;
  // const [newRestId, menuId] = restId.split('-').map(Number);

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
    //   { restId, menuId },
    //   { httpsAgent },
    // );

    // const categoryId = initialCategoryListResponse?.data?.data?.[0]?.id || null;
    // let initialItemListResponse = {};
    // if (categoryId) {
    //   initialItemListResponse = await axios.post(
    //     `${process.env.NEXT_PUBLIC_FETCH_URL}/restaurants/items`,
    //     { categoryId, restId: restId },
    //     { httpsAgent },
    //   );
    // }

    return {
      props: {
        // initialCategoryList: initialCategoryListResponse?.data?.data || [],
        // initialItemList: initialItemListResponse?.data?.data?.items || [],
        userData: { ...user, token, id },
        // restId,
        // menuId,
      },
    };
  } catch (error) {
    return {
      props: {
        initialCategoryList: [],
        initialItemList: [],
        userData: { ...user, token, id },
      },
    };
  }
});
