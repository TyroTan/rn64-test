import type { CountryCode, PhoneNumber } from "libphonenumber-js/types";
import { parsePhoneNumberFromString } from "libphonenumber-js/mobile";

interface ValidateUSPhoneNumber extends PhoneNumber {
  valid: boolean;
  country?: any;
  errorMsg: string;
}

export const validatePhoneNumber = (
  number: string,
  defaultCountry: CountryCode
): ValidateUSPhoneNumber | undefined => {
  const INVALID_PHONE_ERROR = "Invalid Phone Number";
  const res = parsePhoneNumberFromString(
    number.replace(/[^0-9]/g, ""),
    defaultCountry ?? "SG"
  ) as PhoneNumber;

  if (__DEV__) {
    if (number.substring(0, 3) === "+65" && number.length === 7) {
      return {
        country: "SG",
        number: number,
        valid: true,
      } as unknown as ValidateUSPhoneNumber;
    }
  }

  if (!res) {
    return {
      country: "",
      number: "",
      valid: false,
      errorMsg: INVALID_PHONE_ERROR,
    } as unknown as ValidateUSPhoneNumber;
  }

  return {
    country: res.country,
    number: res.number,
    valid: res.isValid(),
    errorMsg: res.isValid() ? "" : INVALID_PHONE_ERROR,
    isValid: res.isValid,
    nationalNumber: res.nationalNumber,
    formatNational: res.formatNational,
    formatInternational: res.formatInternational,
    format: res.format,
    getURI: res.getURI,
    getType: res.getType,

    countryCallingCode: res.countryCallingCode,
    isPossible: res.isPossible,
  } as ValidateUSPhoneNumber;
};
