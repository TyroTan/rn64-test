import axios from "axios";

import { BASE_API_URL } from "const";

export const postGetOrCreate = async () => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/buyer/getorcreate/`;
    const request = await axios.post(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getCtosUrl = async (userNric, userName, email) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/kyc/ctos/url/?nric=${userNric}&full_name=${userName}&email=${email}`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getMyinfoUrl = async () => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/kyc/myinfo/url/`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getMyinfoDetails = async (code, state) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/kyc/myinfo/retrieve/?code=${code}&state=${state}`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getCredit = async (countryCode) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/credit/?country=${countryCode}`;
    const request = await axios.get(url);
    return request?.data ?? {};
  } catch (err) {
    throw err;
  }
};

export const postSgIdentity = async (homeOwnership, myinfo, myInfoState) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/kyc/sgidentity/`;
    let data = {};
    if (homeOwnership) data["home_ownership"] = homeOwnership;
    if (myinfo)
      if (myInfoState) {
        data["myinfo"] = {
          myinfo_oauth_state: myInfoState,
          manual_data: myinfo,
        };
      } else {
        data["myinfo"] = {
          manual_data: myinfo,
        };
      }

    const request = await axios.post(url, data);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postCbsPurchase = async () => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/kyc/cbs/purchase/`;
    const request = await axios.post(url);
    const { data } = request;
    return data || request;
  } catch (err) {
    throw err;
  }
};

export const getCbsPurchaseById = async (jobId) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/kyc/cbs/purchase/${jobId}`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postCbsUpload = async (data) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/kyc/cbs/upload/`;
    const request = await axios.post(url, data);
    // console.log({
    //   resulttt: "123test",
    //   url,
    //   data,
    //   request,
    // });
    return request.data;
  } catch (err) {
    if (err?.response?.data?.success === false) {
      return err?.response?.data;
    }
    throw err;
  }
};

export const getPaymentMethod = async (countryCode) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/paymentmethod/?country=${countryCode}`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getAdyenPaymentMethods = async (countryCode) => {
  try {
    const url = `${BASE_API_URL}/v2/payment/adyen/paymentmethods/?country=${countryCode}`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postPaymentMethod = async (paymentMethod) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/paymentmethod/`;
    const request = await axios.post(url, paymentMethod);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const patchPaymentMethod = async (paymentMethod) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/paymentmethod/`;
    const request = await axios.patch(url, paymentMethod);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const deletePaymentMethod = async (paymentMethodId) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/paymentmethod/${paymentMethodId}`;
    const request = await axios.delete(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postDefaultPaymentMethod = async (
  countryCode,
  paymentMethodId
) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/paymentmethod/${paymentMethodId}/setdefault/`;
    const request = await axios.post(url, { country: countryCode });
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getUpcomingPayments = async (countryCode) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/repayment/unpaid/?country=${countryCode}`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getNotifications = async (countryCode) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/notification/?country=${countryCode}`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postNotificationRead = async (id) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/notification/${id}/read/`;
    const request = await axios.post(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postNotificationReadAll = async () => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/notification/readall/`;
    const request = await axios.post(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getContactUsTopics = async () => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/contactus/topics`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postContactUs = async (data) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/contactus/`;
    const request = await axios.post(url, data);
    return request.data;
  } catch (err) {
    throw err;
  }
};
export const getSettings = async () => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/settings/`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const putSettings = async (data) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/settings/`;
    const request = await axios.put(url, data);
    return request.data;
  } catch (err) {
    throw err;
  }
};
