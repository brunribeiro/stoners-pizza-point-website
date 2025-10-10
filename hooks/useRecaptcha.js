import { useEffect, useState } from 'react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

/**
 * Custom hook to dynamically load Google reCAPTCHA v3 script
 * Only loads the script when this hook is called, avoiding global loading
 * @returns {Object} { isLoaded: boolean, executeRecaptcha: function }
 */
export const useRecaptcha = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const captchaKey = publicRuntimeConfig.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY;

  useEffect(() => {
    // If no captcha key configured, mark as loaded (no-op)
    if (!captchaKey) {
      setIsLoaded(true);
      return;
    }

    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha) {
      setIsLoaded(true);
      return;
    }

    // Dynamically load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${captchaKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Wait for grecaptcha.ready
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setIsLoaded(true);
        });
      }
    };

    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script');
      setIsLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
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
