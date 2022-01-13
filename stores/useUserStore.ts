import create from "zustand";
import { SG_NRIC_REGEX, MY_NRIC_REGEX, SG_POSTAL_REGEX } from "const";
import {
  getTokenLocalDb,
  getMyinfoOauthStateLocalDb,
  setMyinfoOauthStateLocalDb,
  removeTokenLocalDb,
  removeMyinfoOauthStateLocalDb,
  removeSgVerifyIdentitySavedFormLocalDb,
} from "utils/async-storage-util";
import { awaitableDelay, cleanMobileNumber } from "utils/js-utils";
import {
  getCredit,
  getStore,
  postGetOrCreate,
  getUpcomingPayments,
  postFromOrderCampaign,
  getOrder,
  getPaymentMethod,
  postFromCheckout,
} from "services";
import {
  findIdentityKyc,
  findPaymentMethodKyc,
  getApprovedCredit,
} from "utils/utils-common";
import globalObjectState from "utils/global-object-per-country-code";
import type { OrderState } from "screens/Order/OrderTypes";
import globalObjectLastActionState from "utils/global-object-last-action";

type userStoreType = "platform" | "user" | "showSplash";

interface UserData {
  email?: string;
  name?: string;
  full_mobile_number: string;
  interactions: any[];
  unread_notification_count: number;
}

export interface UserSession {
  authToken: null | string;
  data?: UserData;
  isSG: boolean;
  // currencySign: "S$" | "RM$ ";
  countryCode: "sg" | "my";
  countryPrefixMobile: "65" | "60";
  NRIC_REGEX: RegExp;
  POSTAL_REGEX: RegExp;
  // ORDER_AMOUNT_MANUAL_MIN: number;
  landingToScreen:
    | "Credit"
    | "MyInfoIntro"
    | "AddPaymentMethodIntro"
    | "OrderDL";
}

export interface StoreStates {
  getOrCreate?: any;
  credits?: any;

  // if coming from deeplink
  store?: any;
  // orderCampaign?: OrderState;
  upcomingPayments?: any;
  paymentMethodFetch?: any;
  order?: OrderState;
}

export type InitialStoreStates = null | StoreStates;

const initialUserState: UserSession = {
  authToken: null,
  data: {} as UserSession["data"],
  isSG: true,
  // currencySign: "S$",
  countryCode: "sg", // my
  countryPrefixMobile: "65",
  NRIC_REGEX: SG_NRIC_REGEX,
  POSTAL_REGEX: SG_POSTAL_REGEX,
  // ORDER_AMOUNT_MANUAL_MIN: SG_MANUAL_MIN,
  landingToScreen: "Credit",
};

interface ApprovedCredit {
  amount: number;
  completedAt: string;
}

const initialApprovedCreditState: ApprovedCredit = {} as ApprovedCredit;

const getInitialUseUserStoreState = () => ({
  isLoading: {
    platform: null,
    user: null,
    showSplash: null,
    initialStoreStates: null,
    approvedCredit: null,
  },
  response: {
    platform: null,
    user: { ...initialUserState },
    initialStoreStates: null,
    approvedCredit: { ...initialApprovedCreditState },
  },
  errors: {
    platform: null,
    user: null,
    initialStoreStates: null,
    approvedCredit: null,
  },
});

const resetAll_ = async (setter: (props: any) => void, initialState: any) => {
  return setter({ ...initialState });
};

interface OrderDLStoreIdParams {
  storeId: string;
}
interface OrderDLOrderCampaignReferredCodeParams {
  orderCampaignReferredCode: string;
}
interface OrderDLStoreIdParams {
  checkoutId: string;
}

interface SetLoginShowSplashParamDefault {
  landingToScreenParam: UserSession["landingToScreen"];
}

type OrderDLURLSearchParams =
  | {
      type: "store_id";
      data: OrderDLStoreIdParams;
    }
  | {
      type: "order_campaign_referred_code";
      data: OrderDLOrderCampaignReferredCodeParams;
    }
  | {
      type: "checkout_id";
      data: OrderDLStoreIdParams;
    };

interface SetLoginShowSplashParamOrderDL {
  landingToScreenParam: "OrderDL";
  // isOrderDeepLinkParam: boolean;
  deeplinkUrlSearchParams: OrderDLURLSearchParams;
}

type SetLoginShowSplashParam =
  | SetLoginShowSplashParamDefault
  | SetLoginShowSplashParamOrderDL;

const fetchDeeplinkData = async (
  deeplinkUrlSearchParams: OrderDLURLSearchParams
) => {
  let resultStoreId = null,
    resultOrderCampaignReferredCode = null,
    resultCheckoutId = null,
    resultOrder = null;

  try {
    if (
      deeplinkUrlSearchParams.type === "store_id" &&
      deeplinkUrlSearchParams.data.storeId
    ) {
      resultStoreId = await getStore(deeplinkUrlSearchParams.data.storeId);
    } else if (
      deeplinkUrlSearchParams.type === "order_campaign_referred_code" &&
      deeplinkUrlSearchParams.data.orderCampaignReferredCode
    ) {
      resultOrderCampaignReferredCode = await postFromOrderCampaign(
        deeplinkUrlSearchParams.data.orderCampaignReferredCode
      );
    } else if (
      deeplinkUrlSearchParams.type === "checkout_id" &&
      deeplinkUrlSearchParams.data.checkoutId
    ) {
      resultCheckoutId = await postFromCheckout(
        deeplinkUrlSearchParams.data.checkoutId
      );
    }

    if (
      (resultOrderCampaignReferredCode?.success &&
        resultOrderCampaignReferredCode?.data?.code) ||
      (resultCheckoutId?.success && resultCheckoutId?.data?.code)
    ) {
      const dataCode =
        resultOrderCampaignReferredCode?.data?.code ??
        resultCheckoutId?.data?.code;

      resultOrder = await getOrder(dataCode);
    }
  } catch (e) {
    return {
      resultStoreId: null,
      resultOrderCampaignReferredCode: null,
      resultCheckoutId: null,
      resultOrder: null,
    };
  }

  return {
    resultStoreId,
    resultOrderCampaignReferredCode,
    resultCheckoutId,
    resultOrder,
  };
};

const [useUserStore] = create((set, get) => ({
  ...getInitialUseUserStoreState(),
  resetStates: (dataType: userStoreType) => {
    const responseValue = dataType === "user" ? { ...initialUserState } : null;
    // const responseValue = dataType === "approvedCredit" ? { ...initialApprovedCreditState } : null;
    set({
      isLoading: { ...get().isLoading, [dataType]: false },
      response: { ...get().response, [dataType]: responseValue },
      errors: { ...get().errors, [dataType]: null },
    });
  },
  refreshUserStore: () => {
    return get();
  },
  logoutUserShowSplash: async ({ authResetStates }: any) => {
    try {
      await set({
        isLoading: { ...get().isLoading, user: true, showSplash: true },
        response: {
          ...get().reponse,
          user: {
            ...initialUserState,
          },
        },
      });
    } catch (e) {
    } finally {
      await removeTokenLocalDb();
      await removeMyinfoOauthStateLocalDb();
      await removeSgVerifyIdentitySavedFormLocalDb();
      await authResetStates();
      await awaitableDelay(500); // navigation is a little too fast! slow it down a bit
      await set({
        isLoading: { ...get().isLoading, user: false, showSplash: false },
      });
    }
  },
  resetAll: () => {
    resetAll_(set, getInitialUseUserStoreState());
  },
  setStartingStates: async (
    allProps: SetLoginShowSplashParam = {} as SetLoginShowSplashParam
  ) => {
    console.log(
      "bad data1",
      typeof allProps !== "undefined" ? allProps : "undefineddd"
    );
    if (allProps === "shouldnt") {
      console.log("bad data", allProps);
      allProps = {};
    }
    const {
      landingToScreenParam,
      // isOrderDeepLinkParam,
      // deeplinkUrlSearchParams,
    } = allProps;
    let { deeplinkUrlSearchParams } =
      allProps as SetLoginShowSplashParamOrderDL;
    let landingToScreen: SetLoginShowSplashParam["landingToScreenParam"] =
      "Credit";

    switch (landingToScreenParam) {
      case "MyInfoIntro":
        landingToScreen = "MyInfoIntro";
        break;
      case "OrderDL":
        landingToScreen = "OrderDL";
        break;

      default:
        break;
    }

    // const currentResponseUser: UserSession = {
    //   ...(get().response?.user ?? {}),
    // };

    // dddebug
    // const isOrderDeepLink = true;
    // landingToScreenParam = "OrderDL";
    // landingToScreen = "OrderDL";

    /*deeplinkUrlSearchParams = {
      type: "order_campaign_referred_code",
      data: null,
    };*/ // { type: "store_id", data: { storeId: "SG-S-JXJAJWW87CEX" } };

    let isOrderDeepLink = landingToScreenParam === "OrderDL";
    landingToScreen = isOrderDeepLink === true ? "OrderDL" : "Credit";
    /* ?? currentResponseUser.isOrderDeepLink; */

    // TODO if deeplink order campaign is MY, require relogin to use the actual country code

    // dummy - test for order_campaign_referred_code
    // const storeId = null; // isOrderDeepLink ? "SG-S-JXJAJWW87CEX" : null;

    // dddebug
    // const orderDeepLinkType: OrderState["deeplink_type"] =
    //   "order_campaign_referred_code";

    const token = await getTokenLocalDb();

    // TODO and from myInfoLocalDB?
    let userData = ((await getMyinfoOauthStateLocalDb()) ?? {}) as UserData;

    // TODO: optimise by requiring backend to tell the frontend
    // TODO: whether getOrCreate needs to be called like = userData.shouldCallGetOrCreate

    // always call if there's a possible change in user session data
    let getOrCreate: any = null;
    if (token) {
      try {
        const res = await postGetOrCreate();

        if (res?.success) {
          getOrCreate = res?.data;
        }

        // TODO: what happens during backend error?
      } catch (e) {}

      await setMyinfoOauthStateLocalDb(getOrCreate);

      userData = {
        ...userData,
        ...(getOrCreate ?? {}),
      };
    }

    // console.log("isSG2", userData, "resGetOrCreate", resGetOrCreate);
    const isSG = (
      (cleanMobileNumber(userData?.full_mobile_number) as string) ?? ""
    ).startsWith("65");

    const dataBasedOnCountry: Partial<UserSession> = {
      isSG,
      countryCode: isSG ? "sg" : "my",
      countryPrefixMobile: isSG ? "65" : "60",
      // currencySign: isSG ? "S$" : "RM$ ",
      NRIC_REGEX: isSG ? SG_NRIC_REGEX : MY_NRIC_REGEX,
      // ORDER_AMOUNT_MANUAL_MIN: isSG ? SG_MANUAL_MIN : MY_MANUAL_MIN,
      // formatAsCurrency: (value: any) => {
      //   const num = typeof value === "string" ? parseFloat(value) : value;
      //   const valueLocaleString = num.toLocaleString(undefined, {
      //     minimumFractionDigits: 2,
      //     maximumFractionDigits: 2,
      //   });

      //   // TODO needs to be updated when handling more than two countries
      //   return `${isSG ? "S$" : "RM$ "}${valueLocaleString}`;
      // },
    };

    let resStore = null as any;
    let resOrderCampaign = null;
    let resOrder = null;
    let resPaymentMethodFetch = null;
    if (token) {
      try {
        if (isOrderDeepLink) {
          const {
            resultCheckoutId,
            resultOrder,
            resultOrderCampaignReferredCode,
            resultStoreId,
          } = await fetchDeeplinkData(deeplinkUrlSearchParams);
          // if (
          //   resultOrderCampaignReferredCode.success &&
          //   resultOrderCampaignReferredCode.data
          // ) {
          // resOrderCampaign = {
          //   ...resultOrderCampaignReferredCode.data,
          //   deeplink_type: "order_campaign_referred_code",
          // } as OrderState;
          // }

          if (resultOrder?.success && resultOrder?.data) {
            resOrder = resultOrder.data;
          }

          if (resultStoreId?.success && resultStoreId?.data) {
            resStore = resultStoreId.data;
          }

          // if (res?.success && res?.data) {
          //   resOrderCampaign = {
          //     ...res.data,
          //     deeplink_type: "order_campaign_referred_code",
          //   } as OrderState;
          // }

          // if (res2?.success && res2?.data) {
          //   resOrder = res2.data;
          // }

          // console.log(
          //   "resOrderCampaignresOrderCampaign",
          //   Object.keys(resOrderCampaign as any),
          //   "resoreso",
          //   Object.keys(resOrder)
          // );

          // if (res3?.success && res3?.data) {
          // resPaymentMethodFetch = res3.data;
          // }
        }
      } catch (e: any) {
        __DEV__ && console.log("err1??", e?.response?.data);

        // 404?
        /* if (e?.message?.toString()?.includes("not found")) {
            resetAll(set, getInitialUseUserStoreState);
            return;
          } 

          // TODO - show 404 instead and do not clear token
          throw e;

          */
      } finally {
        // ignore deeplink on error
        console.log(
          "resStore || resOrderresStore || resOrder",
          resStore,
          resOrder
        );
        isOrderDeepLink = !(resStore || resOrder) ? false : isOrderDeepLink;
        landingToScreen = !isOrderDeepLink ? "Credit" : landingToScreen;
      }
    }

    // debug
    const { action: lastAction } = globalObjectLastActionState.get();

    // test - does this reset during on refresh??
    if (lastAction === "orderDLToVerify") {
      // don't reset
    } else {
      globalObjectLastActionState.resetBeforeUse();
    }
    globalObjectState.setWhenLoggingIn(dataBasedOnCountry.countryCode as any);

    let credits = null as any;
    if (getOrCreate) {
      try {
        const res = await getCredit(dataBasedOnCountry.countryCode);

        if (res?.success) {
          credits = res?.data;
        }

        // TODO: what happens during backend error?
      } catch (e: any) {
        __DEV__ && console.log("err2??", e?.response?.data);

        if (e?.code === "authentication_failed") {
          resetAll_(set, getInitialUseUserStoreState);
          return;
        }
        throw e;
      }
    }

    let upcomingPayments = null as any;
    if (token && userData.full_mobile_number) {
      try {
        const res = await getUpcomingPayments(dataBasedOnCountry.countryCode);

        if (res?.success) {
          upcomingPayments = res.data;
        }

        // TODO: what happens during backend error?
      } catch (e: any) {
        __DEV__ && console.log("err3??", e?.response?.data);
        throw e;
      }
    }

    const { kycs = [] } = credits ?? {};
    console.log(
      "kycs len",
      kycs.length,
      landingToScreenParam,
      landingToScreen,
      deeplinkUrlSearchParams,
      // credits,
      "+65 81288881",
      getOrCreate
    );
    // console.log(
    // "resGetOrCreate credits"
    // resGetOrCreate
    // credits
    // );

    // check whether we should land to payment method intro screen
    if (landingToScreen === "Credit" && kycs?.length) {
      const identityKyc = findIdentityKyc(kycs);
      const paymentMethodKyc = findPaymentMethodKyc(kycs);

      // ! TODO
      // setShouldSetIntentAtCreditScreen();

      if (identityKyc?.status === "incomplete") {
        if (paymentMethodKyc?.status === "incomplete") {
          // seShouldRedirectToAddPayment();
          landingToScreen = "AddPaymentMethodIntro";
        }

        // history.push(/home)
        // history.push(/credit)
        // history.push(/verify?type=identity&initial=true)
      } else if (paymentMethodKyc?.status === "incomplete") {
        landingToScreen = "AddPaymentMethodIntro";
      }

      // ! TODO
    }

    await set({
      response: {
        ...get().reponse,
        user: {
          ...initialUserState,
          data: userData,
          authToken: token,
          landingToScreen,
          deeplinkUrlSearchParams,
          ...dataBasedOnCountry,
        },
        initialStoreStates: {
          credits,
          getOrCreate,
          store: resStore,
          // orderCampaign: resOrderCampaign,
          upcomingPayments,
          order: resOrder,
          paymentMethodFetch: resPaymentMethodFetch,
        } as InitialStoreStates,
        approvedCredit: getApprovedCredit(credits),
      },
    });
  },
  setLoginShowSplash: async (
    allProps: SetLoginShowSplashParam = {} as SetLoginShowSplashParam
  ) => {
    try {
      console.log("before we get", globalObjectLastActionState.get());
      await set({
        isLoading: { ...get().isLoading, user: true, showSplash: true },
      });
      await get().setStartingStates(allProps);
      console.log("afeter we get", globalObjectLastActionState.get());
    } catch (e: any) {
      __DEV__ && console.log("err2??", e?.response?.data ?? e);
      await removeTokenLocalDb();
      await removeMyinfoOauthStateLocalDb();
    } finally {
      await awaitableDelay(500); // navigation is a little too fast! slow it down a bit
      await set({
        isLoading: { ...get().isLoading, user: false, showSplash: false },
      });
    }
  },
  setNewApprovedCredit: async ({ countryCode }: any) => {
    try {
      await set({
        isLoading: { ...get().isLoading, approvedCredit: true },
      });
      const credits = await getCredit(countryCode);

      await set({
        response: {
          ...get().reponse,
          approvedCredit: getApprovedCredit(credits?.data),
        },
      });
    } catch (e) {
      // await set({
      //   isLoading: { ...get().isLoading, approvedCredit: false },
      // });
    } finally {
      await set({
        isLoading: { ...get().isLoading, approvedCredit: false },
      });
    }
  },
  setUserInfo: async ({ userData }: any = {}) => {
    try {
      // userData++;
      // if (userData > 100) return;
      await set({
        isLoading: { ...get().isLoading, user: true },
      });

      // persist in async storage when necessary?
      const res = {
        ...initialUserState,
        authToken: await getTokenLocalDb(),
        data: userData ?? (await getMyinfoOauthStateLocalDb()),
        // data: await getMyinfoOauthStateLocalDb(),
      };

      if (res) {
        set({
          isLoading: { ...get().isLoading, user: false },
          response: { ...get().response, user: res },
          errors: { ...get().errors, user: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, user: false },
          response: { ...get().response, user: { ...initialUserState } },
          errors: {
            ...get().errors,
            user: { msg: "failed to fetch user" },
          },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, user: false },
        response: { ...get().response, user: { ...initialUserState } },
        errors: {
          ...get().errors,
          user: { msg: "failed to fetch user" },
        },
      });

      throw err;
    }
  },

  // setDeviceType: async (Device) => {
  setPlatformInfo: async (Device: any, Platform: any) => {
    try {
      set({ isLoading: { ...get().isLoading, platform: true } });
      const res = await Device.getDeviceTypeAsync();
      const isNotPhone = res !== 1;
      const platformInfo = {
        ...Device,
        ...res,
        isIOS: Platform?.OS === "ios",
        isNotPhone,
      };

      if (res) {
        set({
          isLoading: { ...get().isLoading, platform: false },
          response: { ...get().response, platform: platformInfo },
          errors: { ...get().errors, platform: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, platform: false },
          response: { ...get().response, platform: null },
          errors: {
            ...get().errors,
            platform: { msg: "failed to fetch device type" },
          },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, platform: false },
        response: { ...get().response, platform: null },
        errors: {
          ...get().errors,
          platform: { msg: "failed to fetch device type" },
        },
      });

      throw err;
    }
  },
}));

export default useUserStore;
