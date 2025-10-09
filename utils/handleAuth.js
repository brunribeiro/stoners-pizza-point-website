import getConfig from 'next/config';

import { routes } from './routes';

import { withSessionSsr } from '@/lib/withSession';

const { publicRuntimeConfig } = getConfig();

const redirectIfMaintainanceMode = () => {
  return {
    redirect: {
      destination: routes.fiveZeroThree,
      permanent: false,
    },
  };
};

export const publicRoute = () => {
  return withSessionSsr(async (context) => {
    const { req } = context;
    const { token, user = {} } = req.session;
    if (publicRuntimeConfig.NEXT_PUBLIC_IS_MAINTAINANCE === 'true') {
      return redirectIfMaintainanceMode();
    }

    return {
      props: token ? { token, user } : {},
    };
  });
};

// this redirection will based on role
//  if role is not passed then route will be access by both the user

export const privateRoute = () => {
  return withSessionSsr(async (context) => {
    const { req } = context;
    const { token = '', user = {} } = req.session;

    // if (publicRuntimeConfig.NEXT_PUBLIC_IS_MAINTAINANCE === "true") {
    //   return redirectIfMaintainanceMode()
    // }
    // if (!token) {
    //   return {
    //     redirect: {
    //       destination: routes.aboutUs,
    //       permanent: false,
    //     },
    //   }
    // }
    // if (role.includes(user.role)) {
    //   return {
    //     props: { token, user },
    //   }
    // }

    // if (role) {
    //   return {
    //     redirect: {
    //       destination:
    //         getCookie(KEYS.site, { req, res }) ||
    //         (user.role === USER_ROLE.CLIENT || user.role === USER_ROLE.SUPPORTIVE_CLIENT
    //           ? routes.clientLogin
    //           : routes.login),
    //       permanent: false,
    //     },
    //     props: { token, user },
    //   }
    // }

    return {
      props: { userData: { ...user, token } },
    };
  });
};
