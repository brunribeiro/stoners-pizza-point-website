import posthog from 'posthog-js';

import { getDeviceInfo } from './helper';

export const posthogTrack = async ({ name, trackData = {}, userParams = {} }) => {
  posthog.capture(name, { ...trackData, ...userParams });
};

export const identifyUser = (data) => {
  posthog.identify(data.name, {
    email: data.email,
    user_id: data.userId,
    phone_number: data.phone || data.phoneNumber,
  });
};

export const resetPosthog = () => {
  posthog.reset();
};

// tracking constants
export const POSTHOG_TRACK = {
  SIGN_UP: 'sign_up_completed',
  LOGIN: 'user_login',
};

export const trackLoginEvent = (data) => {
  const userParams = {
    user_id: data.userId,
    name: data.name,
    email: data.email,
    phone_number: data.phone,
  };

  const trackData = {
    login_method: data.login_method,
    session_id: data.session_id,
    login_status: data.login_status,
    failure_reason: data.failure_reason,
  };

  posthogTrack({ name: POSTHOG_TRACK.LOGIN, trackData, userParams });
};

export const trackSignupEvent = (data) => {
  const userParams = {
    user_id: data.userId,
    name: data.name,
    email: data.email,
    phone_number: data.phone,
  };
  const trackData = {
    signup_method: data.signup_method,
    device_type: getDeviceInfo().deviceType,
    platform: getDeviceInfo().os,
  };

  posthogTrack({ name: POSTHOG_TRACK.SIGN_UP, trackData, userParams });
};
