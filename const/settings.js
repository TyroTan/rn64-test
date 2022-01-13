// dddebug export const BASE_API_URL = process.env.REACT_APP_API_URL;

export const BASE_API_URL = "https://backend.dev.rn64test.com/api";
// REACT_APP_API_URL=https://backend.dev.rn64test.com/api
// REACT_APP_API_URL=https://backend.dev.rn64test.com/api

console.log("BASE_API_URLBASE_API_URL", BASE_API_URL);

export const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

export const DEBOUNCE_DELAY = 1000;

export const COUNTRY_CODE_SG = "sg";
export const COUNTRY_CODE_MY = "my";

export const SG_NRIC_REGEX = /^[STFGstfg]\d{7}[A-Za-z]$/;
export const MY_NRIC_REGEX = /^\d{6}\d{2}\d{4}$/;

export const SG_POSTAL_REGEX = /^\d{6}/;

export const SG_MOBILE_REGEX = /^(8|9)\d{7}$/;
export const MY_MOBILE_REGEX = /^(\+?6?01)[0-46-9]*[0-9]{7,8}$/;
export const EMAIL_REGEX =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/;

export const SG_MANUAL_MIN = 100;
export const MY_MANUAL_MIN = 175;

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

export const FIREBASE_CONFIG = {
  apiKey: FIREBASE_API_KEY,
  appId: FIREBASE_APP_ID,
  projectId: FIREBASE_PROJECT_ID,
};
