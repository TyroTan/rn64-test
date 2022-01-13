import axios from "axios";

import { BASE_API_URL } from "const";

export const postMobile = async (countryCode, mobileNo) => {
  try {
    const url = `${BASE_API_URL}/v2/auth/otp/send/`;
    const request = await axios.post(url, {
      country_dialling_code: countryCode,
      mobile_number: mobileNo,
    });
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postOtp = async (otp, sessionId) => {
  try {
    const url = `${BASE_API_URL}/v2/auth/otp/verify/`;
    const request = await axios.post(url, {
      otp: otp,
      session_id: sessionId,
    });

    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postExtendToken = async () => {
  try {
    const url = `${BASE_API_URL}/v2/auth/token/extend/`;
    const request = await axios.post(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};
