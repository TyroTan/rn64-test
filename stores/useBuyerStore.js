import create from "zustand";

import {
  getTokenLocalDb,
  setMyinfoOauthStateLocalDb,
} from "utils/async-storage-util";

import {
  postGetOrCreate,
  getCtosUrl,
  getMyinfoUrl,
  getMyinfoDetails,
  getCredit,
  postSgIdentity,
  postCbsPurchase,
  getCbsPurchaseById,
  postCbsUpload,
  getAdyenPaymentMethods,
  getPaymentMethod,
  postPaymentMethod,
  patchPaymentMethod,
  deletePaymentMethod,
  postDefaultPaymentMethod,
  getUpcomingPayments,
  getNotifications,
  postNotificationRead,
  postNotificationReadAll,
  getContactUsTopics,
  postContactUs,
  getSettings,
  putSettings,
} from "services";
import { alerts } from "utils/global-texts";

const [useBuyerStore] = create((set, get) => ({
  isLoading: {
    getOrCreate: false,
    ctosUrl: false,
    myInfoUrl: false,
    myInfoDetails: false,
    credits: false,
    sgPersonal: false,
    cbsPurchase: false,
    cbsPurchaseById: false,
    cbsUpload: false,
    adyenPaymentMethods: false,
    paymentMethodFetch: false,
    paymentMethodSubmit: false,
    paymentMethodUpdate: false,
    paymentMethodRemove: false,
    defaultPaymentMethodSubmit: false,
    upcomingPayments: false,
    notifications: false,
    notificationRead: false,
    notificationReadAll: false,
    contactUsTopics: false,
  },
  response: {
    getOrCreate: null,
    ctosUrl: null,
    myInfoUrl: null,
    myInfoDetails: null,
    credits: null,
    sgPersonal: null,
    cbsPurchase: null,
    cbsPurchaseById: null,
    cbsUpload: null,
    adyenPaymentMethods: null,
    paymentMethodFetch: null,
    paymentMethodSubmit: null,
    paymentMethodUpdate: null,
    paymentMethodRemove: null,
    defaultPaymentMethodSubmit: null,
    upcomingPayments: null,
    notifications: null,
    notificationRead: null,
    notificationReadAll: null,
    contactUsTopics: null,
  },
  errors: {
    getOrCreate: null,
    ctosUrl: null,
    myInfoUrl: null,
    myInfoDetails: null,
    credits: null,
    sgPersonal: null,
    cbsPurchase: null,
    cbsPurchaseById: null,
    cbsUpload: null,
    adyenPaymentMethods: null,
    paymentMethodFetch: null,
    paymentMethodSubmit: null,
    paymentMethodUpdate: null,
    paymentMethodRemove: null,
    defaultPaymentMethodSubmit: null,
    upcomingPayments: null,
    notifications: null,
    notificationRead: null,
    notificationReadAll: null,
    contactUsTopics: null,
  },
  resetStates: (dataType) => {
    set({
      isLoading: { ...get().isLoading, [dataType]: false },
      response: { ...get().response, [dataType]: null },
      errors: { ...get().errors, [dataType]: null },
    });
  },
  refreshBuyerStates: () => {
    return {
      ...get(),
    };
  },
  setterBuyerInitialStoreState: (allProps) => {
    if (!allProps) {
      return;
    }

    const { getOrCreate, credits } = allProps;
    set({
      response: {
        ...get().response,
        getOrCreate: {
          ...(get().response?.getOrCreate ?? {}),
          ...(getOrCreate ?? {}),
        },
        credits: {
          ...(get().response?.credits ?? {}),
          ...(credits ?? {}),
        },
      },
    });
  },
  submitGetOrCreate: async (setUserInfo) => {
    try {
      set({ isLoading: { ...get().isLoading, getOrCreate: true } });
      const res = await postGetOrCreate();
      await setMyinfoOauthStateLocalDb(res?.data);
      // setUserInfo?.({ userData: res?.data });

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, getOrCreate: false },
          response: { ...get().response, getOrCreate: res.data },
          errors: { ...get().errors, getOrCreate: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, getOrCreate: false },
          response: { ...get().response, getOrCreate: null },
          errors: { ...get().errors, getOrCreate: res.error },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, getOrCreate: false },
        response: { ...get().response, getOrCreate: null },
        errors: { ...get().errors, getOrCreate: err },
      });

      throw err;
    }
  },
  fetchMyinfoUrl: async () => {
    try {
      set({ isLoading: { ...get().isLoading, myInfoUrl: true } });
      const res = await getMyinfoUrl();

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, myInfoUrl: false },
          response: { ...get().response, myInfoUrl: res.data },
          errors: { ...get().errors, myInfoUrl: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, myInfoUrl: false },
          response: { ...get().response, myInfoUrl: null },
          errors: { ...get().errors, myInfoUrl: res.error },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, myInfoUrl: false },
        response: { ...get().response, myInfoUrl: null },
        errors: { ...get().errors, myInfoUrl: err },
      });

      throw err;
    }
  },
  fetchCtosUrl: async (userNric, userName, email) => {
    try {
      set({ isLoading: { ...get().isLoading, ctosUrl: true } });
      const res = await getCtosUrl(userNric, userName, email);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, ctosUrl: false },
          response: { ...get().response, ctosUrl: res.data },
          errors: { ...get().errors, ctosUrl: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, ctosUrl: false },
          response: { ...get().response, ctosUrl: null },
          errors: { ...get().errors, ctosUrl: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, ctosUrl: false },
        response: { ...get().response, ctosUrl: null },
        errors: { ...get().errors, ctosUrl: err.response.data.message },
      });

      throw err;
    }
  },
  fetchMyinfoDetails: async (code, state) => {
    try {
      set({ isLoading: { ...get().isLoading, myInfoDetails: true } });
      const res = await getMyinfoDetails(code, state);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, myInfoDetails: false },
          response: { ...get().response, myInfoDetails: res.data },
          errors: { ...get().errors, myInfoDetails: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, myInfoDetails: false },
          response: { ...get().response, myInfoDetails: null },
          errors: { ...get().errors, myInfoDetails: res.error },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, myInfoDetails: false },
        response: { ...get().response, myInfoDetails: null },
        errors: { ...get().errors, myInfoDetails: err.response.data.message },
      });

      throw err;
    }
  },
  fetchCredits: async (countryCode) => {
    try {
      set({ isLoading: { ...get().isLoading, credits: true } });
      const res = await getCredit(countryCode);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, credits: false },
          response: { ...get().response, credits: res.data },
          errors: { ...get().errors, credits: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, credits: false },
          response: { ...get().response, credits: null },
          errors: { ...get().errors, credits: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, credits: false },
        response: { ...get().response, credits: null },
        errors: { ...get().errors, credits: err.response.data.error },
      });

      throw err;
    }
  },
  submitSgIdentity: async (homeOwnership, identity, myInfoState) => {
    try {
      set({ isLoading: { ...get().isLoading, sgPersonal: true } });
      const res = await postSgIdentity(homeOwnership, identity, myInfoState);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, sgPersonal: false },
          response: { ...get().response, sgPersonal: res.data },
          errors: { ...get().errors, sgPersonal: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, sgPersonal: false },
          response: { ...get().response, sgPersonal: null },
          errors: { ...get().errors, sgPersonal: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, sgPersonal: false },
        response: { ...get().response, sgPersonal: null },
        errors: { ...get().errors, sgPersonal: err.response.data.errors },
      });

      throw err;
    }
  },
  submitCbsPurchase: async () => {
    try {
      set({ isLoading: { ...get().isLoading, cbsPurchase: true } });

      // dddebug
      // if (set || !set) {
      //   set({
      //     isLoading: { ...get().isLoading, cbsPurchase: false },
      //     response: {
      //       ...get().response,
      //       cbsPurchase: {
      //         job_id: "test-123",
      //       },
      //     },
      //     errors: { ...get().errors, cbsPurchase: null },
      //   });

      //   return;
      // }

      const res = await postCbsPurchase();
      if (res.success) {
        set({
          isLoading: { ...get().isLoading, cbsPurchase: false },
          response: { ...get().response, cbsPurchase: res.data },
          errors: { ...get().errors, cbsPurchase: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, cbsPurchase: false },
          response: { ...get().response, cbsPurchase: null },
          errors: { ...get().errors, cbsPurchase: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, cbsPurchase: false },
        response: { ...get().response, cbsPurchase: null },
        errors: {
          ...get().errors,
          cbsPurchase: err?.response?.data?.message ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  fetchCbsPurchaseById: async (jobId) => {
    try {
      set({ isLoading: { ...get().isLoading, cbsPurchaseById: true } });

      // dddebug
      // if (jobId || !jobId) {
      //   set({
      //     isLoading: { ...get().isLoading, cbsPurchaseById: true },
      //     response: {
      //       ...get().response,
      //       cbsPurchaseById: {
      //         state: "singpass_login_required",
      //       },
      //     },
      //     errors: { ...get().errors, cbsPurchaseById: null },
      //   });

      //   return;
      // }

      // dddebug
      // const promise = () =>
      //   new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       const list = [
      //         "init",
      //         "myinfo_consent_required",
      //         // "singpass_login_required",
      //         "myinfo_consent_given",
      //         "payment_made",
      //         "credit_report_created",
      //         "success",
      //       ];

      //       const currentIndex = list.findIndex(
      //         (item) => item === get().response?.cbsPurchaseById?.state
      //       );
      //       console.log(
      //         "currentIndex",
      //         currentIndex,
      //         "next",
      //         list[currentIndex + 1]
      //       );
      //       set({
      //         isLoading: { ...get().isLoading, cbsPurchaseById: false },
      //         response: {
      //           ...get().response,
      //           cbsPurchaseById: {
      //             state: currentIndex === -1 ? "init" : list[currentIndex + 1],
      //           },
      //         },
      //         errors: { ...get().errors, cbsPurchaseById: null },
      //       });
      //       resolve("ok");
      //     }, 2000);
      //   });

      // if (jobId || !jobId) {
      //   await promise();
      //   return;
      // }

      /* dddebug */
      const res = await getCbsPurchaseById(jobId);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, cbsPurchaseById: false },
          response: { ...get().response, cbsPurchaseById: res.data },
          errors: { ...get().errors, cbsPurchaseById: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, cbsPurchaseById: false },
          response: { ...get().response, cbsPurchaseById: null },
          errors: { ...get().errors, cbsPurchaseById: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, cbsPurchaseById: false },
        response: { ...get().response, cbsPurchaseById: null },
        errors: {
          ...get().errors,
          cbsPurchaseById: err?.response?.data?.message ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  submitCbsUpload: async (data) => {
    try {
      set({ isLoading: { ...get().isLoading, cbsUpload: true } });
      const res = await postCbsUpload(data);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, cbsUpload: false },
          response: { ...get().response, cbsUpload: res?.data },
          errors: { ...get().errors, cbsUpload: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, cbsUpload: false },
          response: { ...get().response, cbsUpload: null },
          errors: {
            ...get().errors,
            cbsUpload: res?.data?.errors ?? res?.errors,
          },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, cbsUpload: false },
        response: { ...get().response, cbsUpload: null },
        errors: { ...get().errors, cbsUpload: err.response.data.errors },
      });

      throw err;
    }
  },
  fetchAdyenPaymentMethods: async (countryCode) => {
    try {
      set({ isLoading: { ...get().isLoading, adyenPaymentMethods: true } });
      const res = await getAdyenPaymentMethods(countryCode);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, adyenPaymentMethods: false },
          response: { ...get().response, adyenPaymentMethods: res.data },
          errors: { ...get().errors, adyenPaymentMethods: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, adyenPaymentMethods: false },
          response: { ...get().response, adyenPaymentMethods: null },
          errors: { ...get().errors, adyenPaymentMethods: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, adyenPaymentMethods: false },
        response: { ...get().response, adyenPaymentMethods: null },
        errors: {
          ...get().errors,
          adyenPaymentMethods: err.response.data.error,
        },
      });

      throw err;
    }
  },
  fetchPaymentMethod: async (countryCode) => {
    try {
      set({ isLoading: { ...get().isLoading, paymentMethodFetch: true } });
      // dddebug const res = await getPaymentMethod(countryCode);
      const res = await getPaymentMethod(countryCode);
      // const res = {
      //   success: true,
      //   data: [
      //     {
      //       is_default: true,
      //       status: "active",
      //       id: "stringid123",
      //       expired_at: new Date().toISOString(),
      //       card: {
      //         brand: "visa",
      //         funding: "credit",
      //         ending_digits: "4444",
      //       },
      //     },
      //   ],
      // };

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, paymentMethodFetch: false },
          response: { ...get().response, paymentMethodFetch: res.data },
          errors: { ...get().errors, paymentMethodFetch: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, paymentMethodFetch: false },
          response: { ...get().response, paymentMethodFetch: null },
          errors: { ...get().errors, paymentMethodFetch: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, paymentMethodFetch: false },
        response: { ...get().response, paymentMethodFetch: null },
        errors: {
          ...get().errors,
          paymentMethodFetch: err.response.data.error,
        },
      });

      throw err;
    }
  },
  submitPaymentMethod: async (paymentMethod) => {
    try {
      set({ isLoading: { ...get().isLoading, paymentMethodSubmit: true } });
      const res = await postPaymentMethod(paymentMethod);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, paymentMethodSubmit: false },
          response: { ...get().response, paymentMethodSubmit: res.data },
          errors: { ...get().errors, paymentMethodSubmit: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, paymentMethodSubmit: false },
          response: { ...get().response, paymentMethodSubmit: null },
          errors: { ...get().errors, paymentMethodSubmit: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, paymentMethodSubmit: false },
        response: { ...get().response, paymentMethodSubmit: null },
        errors: {
          ...get().errors,
          paymentMethodSubmit: err.response.data.error,
        },
      });

      throw err;
    }
  },
  updatePaymentMethod: async (paymentMethod) => {
    try {
      set({ isLoading: { ...get().isLoading, paymentMethodUpdate: true } });
      const res = await patchPaymentMethod(paymentMethod);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, paymentMethodUpdate: false },
          response: { ...get().response, paymentMethodUpdate: res.data },
          errors: { ...get().errors, paymentMethodUpdate: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, paymentMethodUpdate: false },
          response: { ...get().response, paymentMethodUpdate: null },
          errors: { ...get().errors, paymentMethodUpdate: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, paymentMethodUpdate: false },
        response: { ...get().response, paymentMethodUpdate: null },
        errors: {
          ...get().errors,
          paymentMethodUpdate: err.response.data.error,
        },
      });

      throw err;
    }
  },
  removePaymentMethod: async (paymentMethodId) => {
    try {
      set({ isLoading: { ...get().isLoading, paymentMethodRemove: true } });
      const res = await deletePaymentMethod(paymentMethodId);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, paymentMethodRemove: false },
          response: { ...get().response, paymentMethodRemove: res },
          errors: { ...get().errors, paymentMethodRemove: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, paymentMethodRemove: false },
          response: { ...get().response, paymentMethodRemove: null },
          errors: { ...get().errors, paymentMethodRemove: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, paymentMethodRemove: false },
        response: { ...get().response, paymentMethodRemove: null },
        errors: {
          ...get().errors,
          paymentMethodRemove: err.response.data.error,
        },
      });

      throw err;
    }
  },
  submitDefaultPaymentMethod: async (countryCode, paymentMethodId) => {
    try {
      set({
        isLoading: { ...get().isLoading, defaultPaymentMethodSubmit: true },
      });
      const res = await postDefaultPaymentMethod(countryCode, paymentMethodId);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, defaultPaymentMethodSubmit: false },
          response: { ...get().response, defaultPaymentMethodSubmit: res.data },
          errors: { ...get().errors, defaultPaymentMethodSubmit: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, defaultPaymentMethodSubmit: false },
          response: { ...get().response, defaultPaymentMethodSubmit: null },
          errors: { ...get().errors, defaultPaymentMethodSubmit: res.error },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, defaultPaymentMethodSubmit: false },
        response: { ...get().response, defaultPaymentMethodSubmit: null },
        errors: { ...get().errors, defaultPaymentMethodSubmit: err },
      });

      throw err;
    }
  },
  fetchUpcomingPayments: async (countryCode) => {
    try {
      set({ isLoading: { ...get().isLoading, upcomingPayments: true } });
      const res = await getUpcomingPayments(countryCode);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, upcomingPayments: false },
          response: { ...get().response, upcomingPayments: res.data },
          errors: { ...get().errors, upcomingPayments: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, upcomingPayments: false },
          response: { ...get().response, upcomingPayments: null },
          errors: { ...get().errors, upcomingPayments: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, upcomingPayments: false },
        response: { ...get().response, upcomingPayments: null },
        errors: {
          ...get().errors,
          upcomingPayments: err.response.data.error,
        },
      });

      throw err;
    }
  },
  fetchNotifications: async (countryCode) => {
    try {
      set({ isLoading: { ...get().isLoading, notifications: true } });
      const res = await getNotifications(countryCode);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, notifications: false },
          response: { ...get().response, notifications: res.data },
          errors: { ...get().errors, notifications: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, notifications: false },
          response: { ...get().response, notifications: null },
          errors: { ...get().errors, notifications: res.error },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, notifications: false },
        response: { ...get().response, notifications: null },
        errors: { ...get().errors, notifications: err.response.data.message },
      });

      throw err;
    }
  },
  submitNotificationRead: async (id) => {
    try {
      set({ isLoading: { ...get().isLoading, notificationRead: true } });
      const res = await postNotificationRead(id);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, notificationRead: false },
          response: { ...get().response, notificationRead: res.data },
          errors: { ...get().errors, notificationRead: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, notificationRead: false },
          response: { ...get().response, notificationRead: null },
          errors: { ...get().errors, notificationRead: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, notificationRead: false },
        response: { ...get().response, notificationRead: null },
        errors: { ...get().errors, notificationRead: err.response.data.errors },
      });

      throw err;
    }
  },
  submitNotificationReadAll: async () => {
    try {
      set({ isLoading: { ...get().isLoading, notificationReadAll: true } });
      const res = await postNotificationReadAll();

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, notificationReadAll: false },
          response: { ...get().response, notificationReadAll: res.data },
          errors: { ...get().errors, notificationReadAll: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, notificationReadAll: false },
          response: { ...get().response, notificationReadAll: null },
          errors: { ...get().errors, notificationReadAll: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, notificationReadAll: false },
        response: { ...get().response, notificationReadAll: null },
        errors: {
          ...get().errors,
          notificationReadAll: err.response.data.errors,
        },
      });

      throw err;
    }
  },
  fetchContactUsTopics: async () => {
    try {
      set({ isLoading: { ...get().isLoading, contactUsTopics: true } });
      const res = await getContactUsTopics();

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, contactUsTopics: false },
          response: { ...get().response, contactUsTopics: res.data },
          errors: { ...get().errors, contactUsTopics: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, contactUsTopics: false },
          response: { ...get().response, contactUsTopics: null },
          errors: { ...get().errors, contactUsTopics: res.error },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, contactUsTopics: false },
        response: { ...get().response, contactUsTopics: null },
        errors: { ...get().errors, contactUsTopics: err.response.data.message },
      });

      throw err;
    }
  },
  submitContactUs: async (data) => {
    try {
      set({ isLoading: { ...get().isLoading, contactUsSubmit: true } });
      const res = await postContactUs(data);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, contactUsSubmit: false },
          response: { ...get().response, contactUsSubmit: res },
          errors: { ...get().errors, contactUsSubmit: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, contactUsSubmit: false },
          response: { ...get().response, contactUsSubmit: null },
          errors: { ...get().errors, contactUsSubmit: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, contactUsSubmit: false },
        response: { ...get().response, contactUsSubmit: null },
        errors: { ...get().errors, contactUsSubmit: err.response.data.errors },
      });
      throw err;
    }
  },
  submitBuyerInteraction: async (action) => {
    try {
      set({ isLoading: { ...get().isLoading, buyerInteraction: true } });
      const res = await postBuyerInteraction(action);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, buyerInteraction: false },
          response: { ...get().response, buyerInteraction: res },
          errors: { ...get().errors, buyerInteraction: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, buyerInteraction: false },
          response: { ...get().response, buyerInteraction: null },
          errors: { ...get().errors, buyerInteraction: res.data.errors },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, buyerInteraction: false },
        response: { ...get().response, buyerInteraction: null },
        errors: { ...get().errors, buyerInteraction: err.response.data.errors },
      });

      throw err;
    }
  },
  submitAdditionalData: async (data) => {
    try {
      set({ isLoading: { ...get().isLoading, additionalData: true } });
      const res = await postAdditionalData(data);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, additionalData: false },
          response: { ...get().response, additionalData: res },
          errors: { ...get().errors, additionalData: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, additionalData: false },
          response: { ...get().response, additionalData: null },
          errors: {
            ...get().errors,
            additionalData: res?.data?.errors ?? alerts.genericError,
          },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, additionalData: false },
        response: { ...get().response, additionalData: null },
        errors: {
          ...get().errors,
          additionalData: err?.response?.data ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  fetchSettings: async () => {
    try {
      set({ isLoading: { ...get().isLoading, settings: true } });
      const res = await getSettings();

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, settings: false },
          response: { ...get().response, settings: res.data },
          errors: { ...get().errors, settings: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, settings: false },
          response: { ...get().response, settings: null },
          errors: { ...get().errors, settings: res.error },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, settings: false },
        response: { ...get().response, settings: null },
        errors: { ...get().errors, settings: err.response.data.message },
      });

      throw err;
    }
  },
  updateSettings: async (data) => {
    try {
      set({ isLoading: { ...get().isLoading, settingsUpdate: true } });
      const res = await putSettings(data);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, settingsUpdate: false },
          response: { ...get().response, settingsUpdate: res.data },
          errors: { ...get().errors, settingsUpdate: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, settingsUpdate: false },
          response: { ...get().response, settingsUpdate: null },
          errors: { ...get().errors, settingsUpdate: res.error },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, settingsUpdate: false },
        response: { ...get().response, settingsUpdate: null },
        errors: { ...get().errors, settingsUpdate: err.response.data.errors },
      });
      throw err;
    }
  },
}));

export default useBuyerStore;
