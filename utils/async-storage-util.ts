import AsyncStorage from "@react-native-async-storage/async-storage";

const { ASYNC_STORAGE_KEY_PREFIX } = process.env;

enum ASYNC_STORAGE_KEYS {
  myinfo_oauth_state = "myinfo_oauth_state",
  country_code = "country_code",
  token = "token",
  payment_method_redirect = "payment_method_redirect",
  checkout_id = "checkout_id",
  referred_code = "referred_code",
  draft_order = "draft_order",
  sg_verify_identity_saved_form = "sg_verify_identity_saved_form",
  cbs_upload_job_id = "cbs_upload_job_id",
}

const prefixKey = (key: string) => `${ASYNC_STORAGE_KEY_PREFIX}_${key}`;

const removeData = async (key: string) => {
  try {
    const keyPrefixed = prefixKey(key);
    await AsyncStorage.removeItem(keyPrefixed);
    return true;
  } catch (exception) {
    return false;
  }
};

const storeJSONData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    const keyPrefixed = prefixKey(key);
    await AsyncStorage.setItem(keyPrefixed as string, jsonValue);
  } catch (e) {
    // saving error
  }
};

const getJSONData = async (key: string) => {
  try {
    const keyPrefixed = prefixKey(key);
    const jsonValue = await AsyncStorage.getItem(keyPrefixed as string);
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

const storeData = async (key: string, value: string) => {
  try {
    const keyPrefixed = prefixKey(key);
    await AsyncStorage.setItem(keyPrefixed as string, value);
  } catch (e) {
    // saving error
  }
};

const getData = async (key: string) => {
  try {
    const keyPrefixed = prefixKey(key);
    return AsyncStorage.getItem(keyPrefixed as string);
  } catch (e) {
    // error reading value
  }
};

export const setTokenLocalDb = async (token: string) => {
  return storeData(ASYNC_STORAGE_KEYS.token, token);
};

export const getTokenLocalDb = async () => {
  return getData(ASYNC_STORAGE_KEYS.token);
};

export const removeTokenLocalDb = async () => {
  return removeData(ASYNC_STORAGE_KEYS.token);
};

// export const setCountryCodeLocalDb = async (countryCode: string) => {
//   return storeData(ASYNC_STORAGE_KEYS.country_code, countryCode);
// };

// export const getCountryCodeLocalDb = async () => {
//   return getData(ASYNC_STORAGE_KEYS.country_code) ?? "sg";
// };

// export const removeCountryCodeLocalDb = async () => {
//   return removeData(ASYNC_STORAGE_KEYS.country_code);
// };

export const setPaymentMethodRedirectLocalDb = async (url: string) => {
  return storeData(ASYNC_STORAGE_KEYS.payment_method_redirect, url);
};

export const getPaymentMethodRedirectLocalDb = async () => {
  return getData(ASYNC_STORAGE_KEYS.payment_method_redirect);
};

export const removePaymentMethodRedirectLocalDb = async () => {
  return removeData(ASYNC_STORAGE_KEYS.payment_method_redirect);
};

export const setCheckoutIdLocalDb = async (checkoutId: string) => {
  return storeData(ASYNC_STORAGE_KEYS.checkout_id, checkoutId);
};

export const getCheckoutIdLocalDb = async () => {
  return getData(ASYNC_STORAGE_KEYS.checkout_id);
};

export const removeCheckoutIdLocalDb = async () => {
  return removeData(ASYNC_STORAGE_KEYS.checkout_id);
};

export const setReferredCodeLocalDb = async (referredCode: string) => {
  return storeData(ASYNC_STORAGE_KEYS.referred_code, referredCode);
};

export const getReferredCodeLocalDb = async () => {
  return getData(ASYNC_STORAGE_KEYS.referred_code);
};

export const removeReferredCodeLocalDb = async () => {
  return removeData(ASYNC_STORAGE_KEYS.referred_code);
};

export const setDraftOrderLocalDb = async (draftOrder: any) => {
  return storeJSONData(ASYNC_STORAGE_KEYS.draft_order, draftOrder);
};

/*export const getDraftOrderLocalDb = () => {
  const result = localStorage.getItem("draft_order");
  if (result !== null || result !== undefined) {
    return JSON.parse(result);
  }
  return null;
};

export const removeDraftOrderLocalDb = () => {
  localStorage.removeItem("draft_order");
};

export const setMobilePrefixLocalDb = (prefix) => {
  localStorage.setItem("mobile_prefix", prefix);
};

export const getMobilePrefixLocalDb = () => {
  const result = localStorage.getItem("mobile_prefix");
  return result;
};

export const removeMobilePrefixLocalDb = () => {
  localStorage.removeItem("mobile_prefix");
};

export const setMobileNumberLocalDb = (mobile) => {
  localStorage.setItem("mobile_number", mobile);
};

export const getMobileNumberLocalDb = () => {
  const result = localStorage.getItem("mobile_number");
  return result;
};

export const removeMobileNumberLocalDb = () => {
  localStorage.removeItem("mobile_number");
};
*/

export const setMyinfoOauthStateLocalDb = (state: any) => {
  if (!state) return;
  return storeJSONData(ASYNC_STORAGE_KEYS.myinfo_oauth_state, state);
};

export const getMyinfoOauthStateLocalDb = () => {
  return getJSONData(ASYNC_STORAGE_KEYS.myinfo_oauth_state);
};

export const removeMyinfoOauthStateLocalDb = () => {
  return removeData(ASYNC_STORAGE_KEYS.myinfo_oauth_state);
};

export const setCbsJobId = (jobId: string) => {
  return storeJSONData(ASYNC_STORAGE_KEYS.cbs_upload_job_id, jobId.toString());
};

export const getCbsJobId = () => {
  return getJSONData(ASYNC_STORAGE_KEYS.cbs_upload_job_id);
};

export const removeCbsJobId = () => {
  return removeData(ASYNC_STORAGE_KEYS.cbs_upload_job_id);
};

/*
export const setPaymentTransactionLocalDb = (paymentTransaction) => {
  localStorage.setItem(
    "payment_transaction",
    JSON.stringify(paymentTransaction)
  );
};

export const getPaymentTransactionLocalDb = () => {
  const result = localStorage.getItem("payment_transaction");
  if (result !== null || result !== undefined) {
    return JSON.parse(result);
  }
  return null;
};

export const removePaymentTransactionLocalDb = () => {
  localStorage.removeItem("payment_transaction");
};

export const setTransactionReceiptLocalDb = (transactionReceipt) => {
  localStorage.setItem(
    "transaction_receipt",
    JSON.stringify(transactionReceipt)
  );
};

export const getTransactionReceiptLocalDb = () => {
  const result = localStorage.getItem("transaction_receipt");
  if (result !== null || result !== undefined) {
    return JSON.parse(result);
  }
  return null;
};

export const removeTransactionReceiptLocalDb = () => {
  localStorage.removeItem("transactionReceipt");
};

export const setPaymentPlanLocalDb = (paymentPlan) => {
  localStorage.setItem("payment_plan", JSON.stringify(paymentPlan));
};

export const getPaymentPlanLocalDb = () => {
  const result = localStorage.getItem("payment_plan");
  if (result !== null || result !== undefined) {
    return JSON.parse(result);
  }
  return null;
};

export const removePaymentPlanLocalDb = () => {
  localStorage.removeItem("payment_plan");
};

export const setMyinfoDataLocalDb = (data) => {
  localStorage.setItem("myinfo_data", JSON.stringify(data));
};

export const getMyinfoDataLocalDb = () => {
  const result = localStorage.getItem("myinfo_data");
  if (result !== null || result !== undefined) {
    return JSON.parse(result);
  }
  return null;
};

export const removeMyinfoDataLocalDb = () => {
  localStorage.removeItem("myinfo_data");
};
*/
export const setSgVerifyIdentitySavedFormLocalDb = async (formData: any) => {
  const key = ASYNC_STORAGE_KEYS.sg_verify_identity_saved_form;

  const current = await getJSONData(key);

  return storeJSONData(ASYNC_STORAGE_KEYS.sg_verify_identity_saved_form, {
    ...current,
    ...(typeof formData === "string" ? JSON.parse(formData) : formData),
  });
};

export interface SgVerifyIdentity {
  mobile_number: string;
  cpf_contribution_history?: {
    month: string;
    date: string;
    employer: string;
    amount: string;
  }[];
  cpf_balances: {
    ordinary_account: string;
    special_account: string;
    medisave_account: string;
    retirement_account: string;
  };
  noa_history: {
    year_of_assessment: string;
    amount: string;
    employment: string;
    interest: string;
  }[];
  nric: string;
  principal_name: string;
  sex: string;
  race: string;
  nationality: string;
  country_of_birth: string;
  date_of_birth: string;
  residential_status: string;
  email: string;
  type: string;

  type_of_hdb: string;
  others?: string;
  type_of_housing?: string;

  // TODO - which is the correct field name?
  ownership_private_property: boolean;
  // type_of_housing: string;

  registered_address_floor: string;
  registered_address_unit: string;
  registered_address_block: string;
  registered_address_building: string;
  registered_address_street: string;
  registered_address_postal: string;
  employment_sector: string;
  highest_education_level: string;
  marital_status: string;
}

export interface SgVerifyIdentityFromLocalDB
  extends Omit<SgVerifyIdentity, "cpf_contribution_history"> {
  cpf_contribution_history: {
    yearMonth: string;
    employer: string;
    amount: string;
  }[];
}

type GetSgVerifyIdentitySavedFormLocalDbTypes = Promise<
  Partial<SgVerifyIdentity> | SgVerifyIdentityFromLocalDB
>;
export const getSgVerifyIdentitySavedFormLocalDb =
  async (): GetSgVerifyIdentitySavedFormLocalDbTypes => {
    return getJSONData(ASYNC_STORAGE_KEYS.sg_verify_identity_saved_form);
  };

export const removeSgVerifyIdentitySavedFormLocalDb = async () => {
  removeData(ASYNC_STORAGE_KEYS.sg_verify_identity_saved_form);
};
