import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        {/* Preconnect to external domains for better performance */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
        <link rel='dns-prefetch' href='https://app.posthog.com' />
        <link rel='dns-prefetch' href='https://app.atlas.so' />
        <link rel='dns-prefetch' href='https://maps.googleapis.com' />

        {/* Preload critical custom fonts to prevent layout shift */}
        <link
          rel='preload'
          href='/font/Chivo-Regular.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/font/MI_StonedType-Regular.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />

        {/* Load Google Fonts with display=swap for better performance */}
        <link
          href='https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap'
          rel='stylesheet'
          media='print'
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            href='https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap'
            rel='stylesheet'
          />
        </noscript>

        {/* Favicon */}
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
