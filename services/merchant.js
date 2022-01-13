import axios from "axios";

import { BASE_API_URL } from "const";

export const getSearchResults = async (searchTerm, category, countryCode) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/merchant/?q=${searchTerm}&category=${category}&country=${countryCode}`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getCategories = async () => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/merchant/categories/`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getRecommended = async (countryCode) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/merchant/recommended/?country=${countryCode}`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getMerchant = async (slug) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/merchant/${slug}/`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};

export const getStore = async (storeId) => {
  try {
    const url = `${BASE_API_URL}/v2/buyer/merchant/forstore/${storeId}/`;
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    throw err;
  }
};
