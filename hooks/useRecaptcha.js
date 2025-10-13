import { useEffect, useState } from 'react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

// Global singleton state to prevent multiple reCAPTCHA loads
const recaptchaLoadState = {
  isLoaded: false,
  isLoading: false,
  promise: null,
  script: null,
  listeners: [],
};

/**
 * Custom hook to dynamically load Google reCAPTCHA v3 script
 * Uses a singleton pattern to ensure only ONE script is loaded globally
 * @returns {Object} { isLoaded: boolean, executeRecaptcha: function }
 */
export const useRecaptcha = () => {
  const [isLoaded, setIsLoaded] = useState(recaptchaLoadState.isLoaded);
  const captchaKey = publicRuntimeConfig.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY;

  useEffect(() => {
    // If no captcha key configured, mark as loaded (no-op)
    if (!captchaKey) {
      setIsLoaded(true);
      return;
    }

    // If already loaded globally, update local state
    if (recaptchaLoadState.isLoaded) {
      setIsLoaded(true);
      return;
    }

    // Add this component to listeners
    const updateListener = (loaded) => setIsLoaded(loaded);
    recaptchaLoadState.listeners.push(updateListener);

    // If already loading, just wait for the existing load to complete
    if (recaptchaLoadState.isLoading) {
      // Cleanup listener on unmount
      return () => {
        recaptchaLoadState.listeners = recaptchaLoadState.listeners.filter(
          (listener) => listener !== updateListener,
        );
      };
    }

    // Start loading reCAPTCHA (first call only)
    recaptchaLoadState.isLoading = true;

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="google.com/recaptcha/api.js"]');
    if (existingScript) {
      // Script exists but may not be ready yet
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          recaptchaLoadState.isLoaded = true;
          recaptchaLoadState.isLoading = false;
          recaptchaLoadState.listeners.forEach((listener) => listener(true));
        });
      }
      return () => {
        recaptchaLoadState.listeners = recaptchaLoadState.listeners.filter(
          (listener) => listener !== updateListener,
        );
      };
    }

    // Create and load the script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${captchaKey}`;
    script.async = true;
    script.defer = true;
    script.id = 'recaptcha-script';
    recaptchaLoadState.script = script;

    script.onload = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          recaptchaLoadState.isLoaded = true;
          recaptchaLoadState.isLoading = false;
          // Notify all listeners
          recaptchaLoadState.listeners.forEach((listener) => listener(true));
        });
      }
    };

    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script');
      recaptchaLoadState.isLoaded = false;
      recaptchaLoadState.isLoading = false;
      // Notify all listeners
      recaptchaLoadState.listeners.forEach((listener) => listener(false));
    };

    document.head.appendChild(script);

    // Cleanup listener on unmount (do NOT remove script)
    return () => {
      recaptchaLoadState.listeners = recaptchaLoadState.listeners.filter(
        (listener) => listener !== updateListener,
      );
    };
  }, [captchaKey]);

  /**
   * Execute reCAPTCHA challenge
   * @param {string} action - The action name for this reCAPTCHA execution
   * @returns {Promise<string|null>} The reCAPTCHA token or null if not available
   */
  const executeRecaptcha = async (action) => {
    if (!captchaKey) {
      return null;
    }

    if (!isLoaded || !window.grecaptcha) {
      console.warn('reCAPTCHA not loaded yet');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(captchaKey, { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      return null;
    }
  };

  return { isLoaded, executeRecaptcha };
};
