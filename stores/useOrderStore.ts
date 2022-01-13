import create from "zustand";

import {
  getOrder,
  getOrderDraft,
  getOrderOngoing,
  getOrderFullyRepaid,
  postFromCheckout,
  postFromOrderCampaign,
  postCancelOrder,
  postConfirmOrder,
  putPaymentMethod,
  postPayNext,
  postOrderForStore,
  patchPaymentTransaction,
} from "services";
import { alerts } from "utils/global-texts";

const [useOrderStore] = create((set, get) => ({
  isLoading: {
    order: false,
    draft: false,
    ongoing: false,
    fullyRepaid: false,
    fromCheckout: false,
    fromOrderCampaign: false,
    cancelOrder: false,
    confirmOrder: false,
    updatePaymentMethod: false,
    payNext: false,
    orderForStore: false,
    updatePaymentTransaction: false,
  },
  response: {
    order: null,
    draft: null,
    ongoing: null,
    fullyRepaid: null,
    fromCheckout: null,
    fromOrderCampaign: null,
    cancelOrder: null,
    confirmOrder: null,
    updatePaymentMethod: null,
    payNext: null,
    orderForStore: null,
    updatePaymentTransaction: null,
  },
  errors: {
    order: null,
    draft: null,
    ongoing: null,
    fullyRepaid: null,
    fromCheckout: null,
    fromOrderCampaign: null,
    cancelOrder: null,
    confirmOrder: null,
    updatePaymentMethod: null,
    payNext: null,
    orderForStore: null,
    updatePaymentTransaction: null,
  },
  // might not necessarily be a "refresh"
  refreshOrderStates: () => {
    return {
      ...get(),
    };
  },
  resetStates: (dataType: string) => {
    set({
      isLoading: { ...get().isLoading, [dataType]: false },
      response: { ...get().response, [dataType]: null },
      errors: { ...get().errors, [dataType]: null },
    });
  },
  fetchOrder: async (orderCode: string) => {
    try {
      set({ isLoading: { ...get().isLoading, order: true } });
      // dddebug const res = await getOrder(orderCode);
      const res = await getOrder(orderCode);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, order: false },
          response: { ...get().response, order: res.data },
          errors: { ...get().errors, order: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, order: false },
          response: { ...get().response, order: null },
          errors: { ...get().errors, order: res.data.errors },
        });
      }
    } catch (err: any) {
      set({
        isLoading: { ...get().isLoading, order: false },
        response: { ...get().response, order: null },
        errors: {
          ...get().errors,
          order: err?.response?.data ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  fetchOrderDraft: async (countryCode: string) => {
    try {
      set({ isLoading: { ...get().isLoading, draft: true } });
      const res = await getOrderDraft(countryCode);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, draft: false },
          response: { ...get().response, draft: res.data },
          errors: { ...get().errors, draft: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, draft: false },
          response: { ...get().response, draft: null },
          errors: { ...get().errors, draft: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, draft: false },
        response: { ...get().response, draft: null },
        errors: { ...get().errors, draft: err ?? alerts.genericError },
      });

      throw err;
    }
  },
  fetchOrderOngoing: async (countryCode: string) => {
    try {
      set({ isLoading: { ...get().isLoading, ongoing: true } });
      const res = await getOrderOngoing(countryCode);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, ongoing: false },
          response: { ...get().response, ongoing: res.data },
          errors: { ...get().errors, ongoing: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, ongoing: false },
          response: { ...get().response, ongoing: null },
          errors: { ...get().errors, ongoing: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, ongoing: false },
        response: { ...get().response, ongoing: null },
        errors: { ...get().errors, ongoing: err },
      });

      throw err;
    }
  },
  fetchOrderFullyRepaid: async (countryCode: string) => {
    try {
      set({ isLoading: { ...get().isLoading, fullyRepaid: true } });
      const res = await getOrderFullyRepaid(countryCode);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, fullyRepaid: false },
          response: { ...get().response, fullyRepaid: res.data },
          errors: { ...get().errors, fullyRepaid: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, fullyRepaid: false },
          response: { ...get().response, fullyRepaid: null },
          errors: { ...get().errors, fullyRepaid: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, fullyRepaid: false },
        response: { ...get().response, fullyRepaid: null },
        errors: { ...get().errors, fullyRepaid: err },
      });

      throw err;
    }
  },
  submitFromCheckout: async (checkoutId: string) => {
    try {
      set({ isLoading: { ...get().isLoading, fromCheckout: true } });
      const res = await postFromCheckout(checkoutId);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, fromCheckout: false },
          response: { ...get().response, fromCheckout: res.data },
          errors: { ...get().errors, fromCheckout: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, fromCheckout: false },
          response: { ...get().response, fromCheckout: null },
          errors: {
            ...get().errors,
            fromCheckout: res.data.errors,
          },
        });
      }
    } catch (err: any) {
      set({
        isLoading: { ...get().isLoading, fromCheckout: false },
        response: { ...get().response, fromCheckout: null },
        errors: {
          ...get().errors,
          fromCheckout: err?.response?.data?.errors ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  submitFromOrderCampaign: async (orderCode: string) => {
    try {
      set({ isLoading: { ...get().isLoading, fromOrderCampaign: true } });
      const res = await postFromOrderCampaign(orderCode);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, fromOrderCampaign: false },
          response: { ...get().response, fromOrderCampaign: res.data },
          errors: { ...get().errors, fromOrderCampaign: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, fromOrderCampaign: false },
          response: { ...get().response, fromOrderCampaign: null },
          errors: {
            ...get().errors,
            fromOrderCampaign: res.data.errors,
          },
        });
      }
    } catch (err: any) {
      set({
        isLoading: { ...get().isLoading, fromOrderCampaign: false },
        response: { ...get().response, fromOrderCampaign: null },
        errors: {
          ...get().errors,
          fromOrderCampaign: err?.response?.data?.errors ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  submitCancelOrder: async (orderCode: string) => {
    try {
      set({ isLoading: { ...get().isLoading, cancelOrder: true } });
      const res = await postCancelOrder(orderCode);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, cancelOrder: false },
          response: { ...get().response, cancelOrder: res },
          errors: { ...get().errors, cancelOrder: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, cancelOrder: false },
          response: { ...get().response, cancelOrder: null },
          errors: { ...get().errors, cancelOrder: res.data.errors },
        });
      }
    } catch (err: any) {
      set({
        isLoading: { ...get().isLoading, cancelOrder: false },
        response: { ...get().response, cancelOrder: null },
        errors: {
          ...get().errors,
          cancelOrder: err?.response?.data?.message ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  submitConfirmOrder: async (
    orderCode: string,
    paymentPlanId: number,
    paymentMethodId: number
  ) => {
    try {
      set({ isLoading: { ...get().isLoading, confirmOrder: true } });
      const res = await postConfirmOrder(
        orderCode,
        paymentPlanId,
        paymentMethodId
      );

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, confirmOrder: false },
          response: { ...get().response, confirmOrder: res },
          errors: { ...get().errors, confirmOrder: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, confirmOrder: false },
          response: { ...get().response, confirmOrder: null },
          errors: { ...get().errors, confirmOrder: res.data.errors },
        });
      }
    } catch (err: any) {
      set({
        isLoading: { ...get().isLoading, confirmOrder: false },
        response: { ...get().response, confirmOrder: null },
        errors: {
          ...get().errors,
          confirmOrder: err?.response?.data?.message ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  updatePaymentMethod: async (orderCode: string, paymentMethodId: number) => {
    try {
      set({ isLoading: { ...get().isLoading, updatePaymentMethod: true } });
      const res = await putPaymentMethod(orderCode, paymentMethodId);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, updatePaymentMethod: false },
          response: { ...get().response, updatePaymentMethod: res },
          errors: { ...get().errors, updatePaymentMethod: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, updatePaymentMethod: false },
          response: { ...get().response, updatePaymentMethod: null },
          errors: { ...get().errors, updatePaymentMethod: res.data.errors },
        });
      }
    } catch (err: any) {
      set({
        isLoading: { ...get().isLoading, updatePaymentMethod: false },
        response: { ...get().response, updatePaymentMethod: null },
        errors: {
          ...get().errors,
          updatePaymentMethod:
            err?.response?.data?.message ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  submitPayNext: async (
    orderCode: string,
    paymentMethodId: number,
    repaymentId: number
  ) => {
    try {
      set({ isLoading: { ...get().isLoading, payNext: true } });
      const res = await postPayNext(orderCode, paymentMethodId, repaymentId);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, payNext: false },
          response: { ...get().response, payNext: res },
          errors: { ...get().errors, payNext: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, payNext: false },
          response: { ...get().response, payNext: null },
          errors: { ...get().errors, payNext: res.data.errors },
        });
      }
    } catch (err: any) {
      set({
        isLoading: { ...get().isLoading, payNext: false },
        response: { ...get().response, payNext: null },
        errors: {
          ...get().errors,
          payNext: err?.response?.data?.errors ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  submitOrderForStore: async (storeId: number, amount: number) => {
    try {
      set({ isLoading: { ...get().isLoading, orderForStore: true } });
      const res = await postOrderForStore(storeId, amount);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, orderForStore: false },
          response: { ...get().response, orderForStore: res.data },
          errors: { ...get().errors, orderForStore: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, orderForStore: false },
          response: { ...get().response, orderForStore: null },
          errors: {
            ...get().errors,
            orderForStore: res?.data?.errors ?? alerts.genericError,
          },
        });
      }
    } catch (err: any) {
      set({
        isLoading: { ...get().isLoading, orderForStore: false },
        response: { ...get().response, orderForStore: null },
        errors: {
          ...get().errors,
          orderForStore: err?.response?.data?.errors ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  updatePaymentTransaction: async (data: any) => {
    try {
      set({
        isLoading: { ...get().isLoading, updatePaymentTransaction: true },
      });
      const res = await patchPaymentTransaction(data);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, updatePaymentTransaction: false },
          response: { ...get().response, updatePaymentTransaction: res.data },
          errors: { ...get().errors, updatePaymentTransaction: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, updatePaymentTransaction: false },
          response: { ...get().response, updatePaymentTransaction: null },
          errors: {
            ...get().errors,
            updatePaymentTransaction: res.data.errors,
          },
        });
      }
    } catch (err: any) {
      set({
        isLoading: { ...get().isLoading, updatePaymentTransaction: false },
        response: { ...get().response, updatePaymentTransaction: null },
        errors: {
          ...get().errors,
          updatePaymentTransaction:
            err?.response?.data?.errors ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
}));

export default useOrderStore;
