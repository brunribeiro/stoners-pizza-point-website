import { useRouter } from 'next/router';
import { useEffect } from 'react';

const prefetched = new Set();

const normalize = (url) => url?.split(/[?#]/)[0] || null;

const isInternal = (url) =>
  url && (url[0] === '/' || url.startsWith(window.location.origin) || !/^https?:\/\//.test(url));

export const useFastNavigation = () => {
  const { prefetch, push, replace } = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefetchLinks = () => {
      document.querySelectorAll('a[href]').forEach((link) => {
        const href = link.getAttribute('href');
        if (isInternal(href)) {
          const url = normalize(href);
          if (url && !prefetched.has(url)) {
            prefetched.add(url);
            prefetch(url).catch(() => {});
          }
        }
      });
    };

    prefetchLinks();

    const observer = new MutationObserver(() => prefetchLinks());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href'],
    });

    return () => observer.disconnect();
  }, [prefetch]);

  useEffect(() => {
    if (window) {
      window.fastPush = (url, as = url, options = {}) =>
        options.shallow
          ? push(url, as, { ...options, scroll: false })
          : (prefetched.add(normalize(as || url)),
            (window.location.href = as || url),
            Promise.resolve(true));

      window.fastReplace = (url, as = url, options = {}) =>
        options.shallow
          ? replace(url, as, { ...options, scroll: false })
          : (prefetched.add(normalize(as || url)),
            window.location.replace(as || url),
            Promise.resolve(true));
    }
  }, [push, replace]);
};
