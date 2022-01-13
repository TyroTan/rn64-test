import create from "zustand";

import { postMobile, postOtp, postExtendToken } from "services";
import { alerts } from "utils/global-texts";

const [useAuthStore] = create((set, get) => ({
  isLoading: { otpSend: false, otpVerify: false, tokenExtend: false },
  response: { otpSend: null, otpVerify: null, tokenExtend: null },
  errors: { otpSend: null, otpVerify: null, tokenExtend: null },
  resetStates: (dataType) => {
    set({
      isLoading: { ...get().isLoading, [dataType]: false },
      response: { ...get().response, [dataType]: null },
      errors: { ...get().errors, [dataType]: null },
    });
  },
  refreshAuthStore: () => {
    return get();
  },
  setOtpSend: (data) => {
    return set({
      response: { ...get().response, otpSend: data },
    });
  },
  submitMobile: async (countryCode, mobileNoMayHaveArea) => {
    const mobileNo =
      (countryCode === "65" && mobileNoMayHaveArea?.length > 9) ||
      (countryCode === "60" && mobileNoMayHaveArea?.length > 10)
        ? mobileNoMayHaveArea.slice(2)
        : mobileNoMayHaveArea;

    try {
      set({ isLoading: { ...get().isLoading, otpSend: true } });
      const res = await postMobile(countryCode.toString(), mobileNo.toString());

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, otpSend: false },
          response: { ...get().response, otpSend: res.data },
          errors: { ...get().errors, otpSend: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, otpSend: false },
          response: { ...get().response, otpSend: null },
          errors: { ...get().errors, otpSend: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, otpSend: false },
        response: { ...get().response, otpSend: null },
        errors: {
          ...get().errors,
          otpSend: err?.response?.data?.errors ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  submitOtp: async (otp, sessionId) => {
    try {
      set({ isLoading: { ...get().isLoading, otpVerify: true } });
      const res = await postOtp(otp, sessionId);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, otpVerify: false },
          response: { ...get().response, otpVerify: res.data },
          errors: { ...get().errors, otpVerify: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, otpVerify: false },
          response: { ...get().response, otpVerify: null },
          errors: { ...get().errors, otpVerify: res.message },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, otpVerify: false },
        response: { ...get().response, otpVerify: null },
        errors: {
          ...get().errors,
          otpVerify: err?.response?.data?.message ?? "Something went wrong",
        },
      });

      throw err;
    }
  },
  submitExtendToken: async () => {
    try {
      set({ isLoading: { ...get().isLoading, tokenExtend: true } });
      const res = await postExtendToken();

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, tokenExtend: false },
          response: { ...get().response, tokenExtend: res.data },
          errors: { ...get().errors, tokenExtend: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, tokenExtend: false },
          response: { ...get().response, tokenExtend: null },
          errors: { ...get().errors, tokenExtend: res.message },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, tokenExtend: false },
        response: { ...get().response, tokenExtend: null },
        errors: { ...get().errors, tokenExtend: err?.message },
      });

      throw err;
    }
  },
}));

export default useAuthStore;
