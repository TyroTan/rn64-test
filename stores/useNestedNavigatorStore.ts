/*

could be deprecated by globalObjectLastActionState

*/

import create from "zustand";

type navigatorType = "fromCreditRemaining";

export type FromOrderPaymentReceiptObject = null | "goToTransaction";

const initialResponseState = {
  fromCreditRemaining: null,
  fromMyInfoIntro: null,
  fromBuy: null,
  fromAddPaymentMethodSuccess: null,
  fromPaymentMethod: null,
  fromCreditBureau: null,
  fromCreditBureauSingPassLogin: null,
  fromPendingPurchase: null,
  fromOrderPaymentReceipt: null as FromOrderPaymentReceiptObject,
};

interface UseNestedNavigatorStoreProps {
  isLoading: any;
  response: any;
  errors: any;
  getNestedNavigatorStates: any;
  resetStates: any;
  resetAll: any;
  getState: any;
  setFromOrderPaymentReceipt: (
    param: FromOrderPaymentReceiptObject
  ) => Promise<void>;
  setFromPendingPurchase: any;
  setFromPaymentMethod: any;
  setFromCreditBureau: any;
  setFromSingPassLogin: any;
  setFromCreditRemaining: any;
  setFromMyInfoIntro: any;
  setFromBuy: any;
  setFromAddPaymentMethodSuccess: any;
}

// you have to use this too when working with bottomTabs navigation
// since for some reason passing params in navigation.navigate doesn't work
const createResult: [() => UseNestedNavigatorStoreProps] = create(
  (set, get) => ({
    isLoading: { ...initialResponseState },
    response: { ...initialResponseState },
    errors: { ...initialResponseState },
    getNestedNavigatorStates: () => {
      return {
        ...get(),
      };
    },
    resetStates: (dataType: navigatorType) => {
      set({
        isLoading: { ...get().isLoading, [dataType]: false },
        response: { ...get().response, [dataType]: null },
        errors: { ...get().errors, [dataType]: null },
      });
    },
    resetAll: () => {
      set({
        isLoading: { ...initialResponseState },
        response: { ...initialResponseState },
        errors: { ...initialResponseState },
      });
    },
    getState: (field: navigatorType = "fromCreditRemaining") => {
      return get().response?.[field];
    },
    setFromOrderPaymentReceipt: async (
      params: FromOrderPaymentReceiptObject
    ) => {
      try {
        set({
          response: {
            ...get().response,
            fromOrderPaymentReceipt: params,
          },
        });
      } catch (err) {
        get().resetStates("fromOrderPaymentReceipt");
      }
    },
    setFromPendingPurchase: async (param: { type: string }) => {
      try {
        set({
          response: { ...get().response, fromPendingPurchase: param },
        });
      } catch (err) {
        get().resetStates("fromPendingPurchase");
      }
    },
    setFromPaymentMethod: async (
      param: "Profile" | "KycIncomplete" | "CreditRemaining"
    ) => {
      try {
        set({
          response: { ...get().response, fromPaymentMethod: param },
        });
      } catch (err) {
        get().resetStates("fromPaymentMethod");
      }
    },
    setFromCreditBureau: async (param: { uri: string; authToken: string }) => {
      try {
        set({
          response: { ...get().response, fromCreditBureau: param },
        });
      } catch (err) {
        get().resetStates("fromCreditBureau");
      }
    },
    setFromSingPassLogin: async (bool: boolean) => {
      try {
        set({
          response: { ...get().response, fromCreditBureauSingPassLogin: bool },
        });
      } catch (err) {
        get().resetStates("fromCreditBureau");
      }
    },
    setFromCreditRemaining: async (params: any) => {
      try {
        set({
          isLoading: { ...get().isLoading, fromCreditRemaining: false },
          response: { ...get().response, fromCreditRemaining: params },
          errors: { ...get().errors, fromCreditRemaining: null },
        });
      } catch (err) {
        get().resetStates("fromCreditRemaining");
      }
    },
    setFromMyInfoIntro: async (params: any) => {
      try {
        set({
          isLoading: { ...get().isLoading, fromMyInfoIntro: false },
          response: {
            ...get().response,
            fromMyInfoIntro: params,
          },
          errors: { ...get().errors, fromMyInfoIntro: null },
        });
      } catch (err) {
        get().resetStates("fromMyInfoIntro");
      }
    },
    setFromBuy: async (params: any) => {
      try {
        set({
          isLoading: { ...get().isLoading, fromBuy: false },
          response: {
            ...get().response,
            fromBuy: params,
          },
          errors: { ...get().errors, fromBuy: null },
        });
      } catch (err) {
        get().resetStates("fromBuy");
      }
    },
    setFromAddPaymentMethodSuccess: async (params: any) => {
      try {
        set({
          isLoading: { ...get().isLoading, fromAddPaymentMethodSuccess: false },
          response: {
            ...get().response,
            fromAddPaymentMethodSuccess: params,
          },
          errors: { ...get().errors, fromAddPaymentMethodSuccess: null },
        });
      } catch (err) {
        get().resetStates("fromAddPaymentMethodSuccess");
      }
    },
  })
) as any;

const [useNestedNavigatorStore] = createResult;

export default useNestedNavigatorStore;
