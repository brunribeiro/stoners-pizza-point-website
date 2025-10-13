/* eslint-disable @next/next/no-page-custom-font */
import React, { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { ReactNotifications } from 'react-notifications-component';

import '@/styles/globals.css';
import '@/styles/button.css';
import 'react-notifications-component/dist/theme.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useFastNavigation } from '@/utils/fastNavigation';
import AppContext from '@/utils/appContext';
import useAppContext from '@/hook/context/useAppContext';
import { DEFAULT_NEXT_API_HEADER } from '@/utils/constant';
import { setDeviceIdCookie } from '@/utils/common';
import { RestaurantProvider } from '@/contexts/restaurantContext';
import { MenuProvider } from '@/contexts/menuContext';
import { GoogleMapsProvider } from '@/contexts/GoogleMapsContext';

const { publicRuntimeConfig } = getConfig();

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const contextValue = useAppContext();

  // Set login data & device cookie
  useEffect(() => {
    if (pageProps?.userData) {
      contextValue.setLoginData(pageProps.userData);
      setDeviceIdCookie(pageProps);
    }
  }, [pageProps?.userData]);

  // Fetch session menu ID on initial load
  useEffect(() => {
    const fetchSessionIds = async () => {
      try {
        const response = await fetch('/api/get-stored-id', {
          headers: DEFAULT_NEXT_API_HEADER,
        });
        const data = await response.json();
        contextValue.setMenuRestId(data?.restInfo);
      } catch (err) {
        console.error('Error fetching session IDs:', err);
      }
    };

    contextValue.setIsButtonLoad({});
    if (!contextValue.menuRestId?.menuId) fetchSessionIds();
  }, [router.asPath]);

  // Initialize and identify user with Atlas (only for logged-in users)
  useEffect(() => {
    const { email, name, userId, phoneNumber } = contextValue.loginData || {};
    if (!email) return; // Only run for logged-in users

    const initAtlas = () => {
      if (!window.Atlas) {
        console.error('Atlas SDK failed to load');
        return;
      }

      // Configure Atlas
      window.Atlas.call('config', {
        position: 'bottom-right',
      });

      // Start Atlas chat
      window.Atlas.call('start', {
        chat: {
          position: 'bottomRight',
          offset: [30, 30],
          hideBubble: true,
          openIncoming: true,
        },
      });

      // Identify the user
      window.Atlas.call('identify', {
        userId,
        name,
        email,
        phoneNumber: phoneNumber,
        customFields: {
          account: 'Stoners Pizza',
        },
      });
    };

    // Wait for Atlas to load before initializing
    const checkAtlasLoaded = setInterval(() => {
      if (window.Atlas && typeof window.Atlas.call === 'function') {
        clearInterval(checkAtlasLoaded);
        initAtlas();
      }
    }, 100); // Check every 100ms

    // Cleanup interval on unmount
    return () => clearInterval(checkAtlasLoaded);
  }, [contextValue.loginData?.email]);

  // Initialize fast navigation
  useFastNavigation();

  return (
    <>
      <Head>
        <title>Stoner&apos;s Pizza Joint</title>
        <meta name='viewport' content='width=device-width' />
        <meta name='title' content="Stoner's Pizza Joint" />
        <meta
          name='description'
          content='Find convenience at your fingertips with Stoner! Your ultimate destination for food options. Order now and satisfy all your cravings'
        />
        <meta
          property='og:description'
          content='Find convenience at your fingertips with Stoner! Your ultimate destination for food options. Order now and satisfy all your cravings'
        />
        <meta property='og:title' content="Stoner's Pizza Joint" />
        <meta property='og:type' content='website' />
      </Head>

      {/* Atlas Widget Script - Only load for logged-in users */}
      {contextValue.loginData?.email && (
        <Script
          id='atlas-snippet'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                "use strict";
                var t, e = {
                  appId: "ld2n10pcuu",
                  v: 2,
                  q: [],
                  call: function () { this.q.push(arguments); }
                };
                window.Atlas = e;
                var n = document.createElement("script");
                n.async = true;
                n.src = "https://app.atlas.so/client-js/atlas.bundle.js";
                var s = document.getElementsByTagName("script")[0];
                (t = s.parentNode) && t.insertBefore(n, s);
              })();
            `,
          }}
        />
      )}

      {/* PostHog Analytics - Deferred loading with idle callback */}
      {publicRuntimeConfig.NEXT_PUBLIC_POSTHOG_KEY &&
        publicRuntimeConfig.NEXT_PUBLIC_POSTHOG_HOST && (
          <Script
            id='posthog-js'
            src='https://app.posthog.com/static/array.js'
            strategy='worker'
            onLoad={() => {
              // Load PostHog when browser is idle
              if ('requestIdleCallback' in window) {
                window.requestIdleCallback(() => {
                  if (window.posthog) {
                    window.posthog.init(publicRuntimeConfig.NEXT_PUBLIC_POSTHOG_KEY, {
                      api_host: publicRuntimeConfig.NEXT_PUBLIC_POSTHOG_HOST,
                      debug: false,
                      autocapture: false,
                    });
                  }
                });
              } else {
                // Fallback for browsers that don't support requestIdleCallback
                setTimeout(() => {
                  if (window.posthog) {
                    window.posthog.init(publicRuntimeConfig.NEXT_PUBLIC_POSTHOG_KEY, {
                      api_host: publicRuntimeConfig.NEXT_PUBLIC_POSTHOG_HOST,
                      debug: false,
                      autocapture: false,
                    });
                  }
                }, 2000);
              }
            }}
          />
        )}

      <AppContext.Provider value={contextValue}>
        <GoogleMapsProvider>
          <RestaurantProvider>
            <MenuProvider>
              <ReactNotifications />
              <Component {...pageProps} />
            </MenuProvider>
          </RestaurantProvider>
        </GoogleMapsProvider>
      </AppContext.Provider>
    </>
  );
}
