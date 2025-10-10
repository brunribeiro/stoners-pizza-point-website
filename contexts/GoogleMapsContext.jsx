import React, { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

/**
 * Google Maps Context
 * Provides a singleton loader for Google Maps API across the entire app
 * This prevents multiple instances of the Google Maps script from being loaded
 */
const GoogleMapsContext = createContext({
  isLoaded: false,
  loadError: null,
});

// Libraries needed for the app
const LIBRARIES = ['places', 'geometry'];

/**
 * Google Maps Provider Component
 * Wraps the app and provides Google Maps API loading state
 */
export function GoogleMapsProvider({ children }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    language: 'en',
    region: 'US',
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

/**
 * Custom hook to access Google Maps loading state
 * @returns {Object} { isLoaded: boolean, loadError: Error | null }
 */
export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);

  if (context === undefined) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }

  return context;
}

export default GoogleMapsContext;
