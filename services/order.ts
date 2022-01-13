import axios from "axios";

import { BASE_API_URL } from "const";

export const getOrder = async (orderCode: string) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/order/${orderCode}/`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getOrderDraft = async (countryCode: string) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/order/draft/?country=${countryCode}`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getOrderOngoing = async (countryCode: string) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/order/ongoing/?country=${countryCode}`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getOrderFullyRepaid = async (countryCode: string) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/order/fullyrepaid/?country=${countryCode}`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postFromCheckout = async (checkoutId: string) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/order/fromcheckout/`;
    const request = await axios.post(url, {
      checkout_id: checkoutId,
    });
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postFromOrderCampaign = async (referredCode: string) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/order/fromordercampaign/`;
    const request = await axios.post(url, {
      referred_code: referredCode,
    });
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postCancelOrder = async (orderCode: string) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/order/${orderCode}/cancel/`;
    const request = await axios.post(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postConfirmOrder = async (
  orderCode: string,
  paymentPlanId: number,
  paymentMethodId: number
) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/order/${orderCode}/confirm/`;
    const request = await axios.post(url, {
      payment_method_id: paymentMethodId,
      payment_plan_def_id: paymentPlanId,
    });
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const putPaymentMethod = async (
  orderCode: string,
  paymentMethodId: number
) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/order/${orderCode}/paymentmethod/`;
    const request = await axios.put(url, {
      collection_payment_method_id: paymentMethodId,
    });
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postPayNext = async (
  orderCode: string,
  paymentMethodId: number,
  repaymentId: number
) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/order/${orderCode}/paynext/`;
    const request = await axios.post(url, {
      payment_method_id: paymentMethodId,
      repayment_id: repaymentId,
    });
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const postOrderForStore = async (storeId: number, amount: number) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/order/forstore/`;
    const request = await axios.post(url, {
      store_id: storeId,
      amount: amount,
    });
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const patchPaymentTransaction = async (data: any) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/order/paymenttransaction/`;
    const request = await axios.patch(url, data);
    return request.data;
  } catch (err) {
    throw err;
  }
};
