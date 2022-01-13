/* warning, this is experimental, use with care */
/* global variables or objects should be avoided */
/* as much as possible do not add more features to this */
/* do not override any object/class member/fields */

import { MY_MANUAL_MIN } from "const";
import { SG_MANUAL_MIN } from "const";

type CountryCode = "sg" | "my";

const sgState = {
  formatAsCurrency: (value: any) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    const valueLocaleString = num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // TODO needs to be updated when handling more than two countries
    return `S$${valueLocaleString}`;
  },
  currencySign: "S$",
  countryCode: "sg",
  ORDER_AMOUNT_MANUAL_MIN: SG_MANUAL_MIN,
};

const myState = {
  formatAsCurrency: (value: any) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    const valueLocaleString = num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // TODO needs to be updated when handling more than two countries
    return `RM$ ${valueLocaleString}`;
  },
  currencySign: "RM$ ",
  countryCode: "my",
  ORDER_AMOUNT_MANUAL_MIN: MY_MANUAL_MIN,
};

const getStatePerCountry = (countryCode: CountryCode) => {
  if (countryCode === "my") {
    return { ...myState };
  } else if (countryCode === "sg") {
    return { ...sgState };
  }

  return { ...myState };
};

interface GlobalObjectState {
  getLibrary: () => typeof myState | typeof sgState;
  resetBeforeLogin: () => void;
  setWhenLoggingIn: (countryCode: CountryCode) => void;
}

const globalObjectState: GlobalObjectState = {
  // my by default
  getLibrary: () => ({ ...getStatePerCountry("my") }),

  // should only be called right after every setTokenLocalDb
  resetBeforeLogin: () => {
    globalObjectState.getLibrary = () => getStatePerCountry("my");
  },
  setWhenLoggingIn: (countryCode: CountryCode) => {
    globalObjectState.getLibrary = () => getStatePerCountry(countryCode);
  },
};

export default globalObjectState;
