// hooks/useSpreedlyScriptLoading.js or .ts
import useScript from 'react-script-hook';

export const useSpreedlyScriptLoading = (options = {}) => {
  const [loaded, error] = useScript({
    src: 'https://core.spreedly.com/iframe/iframe-v1.min.js',
    checkForExisting: true,
    ...options,
  });

  return { loading: !loaded, error }; // Invert the value to return "loading"
};
