import React, { createRef, useEffect, useState } from "react";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import { theme } from "styles/theme";
import styled from "styled-components/native";
import { isNumeric, textInputMask2Decimal } from "utils/js-utils";
import {
  useBuyerStore,
  useOrderStore,
  useMerchantStore,
  useUserStore,
} from "stores";
import type { OrderState, OrderPaymentModalResult } from "./OrderTypes";
import {
  checkForInsufficientCredit,
  getKycsObject,
  getKycsObjectKey,
} from "utils/utils-common";
import globalObjectLastActionState from "utils/global-object-last-action";

const useOrderPaymentModal = (
  countryCode: "sg" | "my"
): OrderPaymentModalResult => {
  const {
    response: { credits: responseCredits },
    refreshBuyerStates,
  } = useBuyerStore();
  // const {
  //   response: { store: responseStore },
  //   isLoading: { store: isLoadingStore },
  // } = useMerchantStore();
  const {
    response: { initialStoreStates },
  } = useUserStore();

  const {
    response: {
      draft: responseDraftOrders,
      order: responseOrder,
      cancelOrder: responseCancelOrder,
    },
    isLoading: { orderForStore: isLoadingOrderForStore },
    refreshOrderStates,
  } = useOrderStore();

  const [execute, setExecute] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderPaymentModal, setOrderPaymentModal] =
    useState<OrderPaymentModalResult["response"]["orderPaymentModal"]>(null);

  // const onResetModalState = () => {
  //   setCheckedVerifyIdentity(null);

  //   setCheckedPaymentMethod(null);
  // };

  const onResetModalState = () => {
    setExecute(false);
    setIsLoading(false);
    setOrderPaymentModal(null);
  };

  const onModalCheck = () => {
    setExecute(true);
  };

  useEffect(() => {
    console.log("continue??", execute, orderPaymentModal, isLoading);
  }, []);

  useEffect(() => {
    if (execute) {
      try {
        setExecute(false);
        setIsLoading(true);

        if (isLoading) {
          setIsLoading(false);
          setOrderPaymentModal(null);
          return;
        }

        const {
          draft: currentResponseDraftOrders,
          order: currentResponseOrder,
        } = refreshOrderStates().response;
        const { credits: currentCredits } = refreshBuyerStates().response;

        const draftOrder =
          currentResponseDraftOrders?.orders?.[
            (currentResponseDraftOrders?.orders?.length ?? 0) - 1
          ];

        console.log(
          'currentResponseOrdercurrentResponseOrder", currentResponseOrder',
          currentResponseOrder
            ? Object.keys(currentResponseOrder)
            : currentResponseOrder === null
            ? "nulll"
            : currentResponseOrder === undefined
            ? "undef!"
            : `thentypeof ${typeof currentResponseOrder}`
        );
        const draftOrderData = (
          currentResponseOrder
            ? currentResponseOrder
            : initialStoreStates?.order
            ? initialStoreStates?.order
            : draftOrder
        ) as OrderState;

        const credits = initialStoreStates?.credits?.kycs
          ? initialStoreStates.credits
          : currentCredits;

        // const [checkedVerifyIdentity, setCheckedVerifyIdentity] =
        //   useState<OrderPaymentModalResult["checkedVerifyIdentity"]>(null);
        // const [checkedPaymentMethod, setCheckedPaymentMethod] =
        //   useState<OrderPaymentModalResult["checkedPaymentMethod"]>(null);

        const kycsObject = getKycsObject(credits);
        // const orderIsLoading = isLoadingOrderForStore;

        const dataIdentity = getKycsObjectKey(
          countryCode,
          "identity",
          kycsObject
        );
        const dataPaymentMethod = getKycsObjectKey(
          countryCode,
          "payment_method",
          kycsObject
        );

        const checkedVerifyIdentity = dataIdentity === "data_available";
        const checkedPaymentMethod = dataPaymentMethod === "data_available";

        let validationState: OrderPaymentModalResult["response"]["orderPaymentModal"] =
          null;

        let creditIsInsufficient = false,
          creditMinSufficientAmount = "0.00";

        if (draftOrderData?.available_payment_plans) {
          if (draftOrderData?.available_payment_plans.length === 0) {
            creditIsInsufficient = true;
          } else {
            const { insufficientCredit, minSufficientCreditAmount } =
              checkForInsufficientCredit(
                draftOrderData.available_payment_plans
              );

            creditIsInsufficient = insufficientCredit;
            creditMinSufficientAmount = minSufficientCreditAmount;
          }
        }

        if (!(checkedVerifyIdentity && checkedPaymentMethod)) {
          validationState = checkedVerifyIdentity
            ? "ModalOnboardingPaymentMethod"
            : "ModalOnboardingIdentity";
        } else if (
          // draftOrder &&
          draftOrderData &&
          kycsObject &&
          draftOrderData?.state !== "cancelled" &&
          "min_credit_amount_for_profit" in draftOrderData &&
          "has_min_credit_amount_for_profit" in draftOrderData &&
          !draftOrderData.has_min_credit_amount_for_profit
          // && !orderIsLoading
        ) {
          validationState = "ModalInsufficientCredit";
        } else if (
          kycsObject &&
          draftOrderData &&
          draftOrderData.available_payment_plans &&
          draftOrderData.available_payment_plans.length > 0 &&
          draftOrderData.min_credit_amount_for_profit &&
          creditIsInsufficient
        ) {
          validationState = "ModalMoreCredit";
        } else if (
          getKycsObjectKey(countryCode, "identity", kycsObject) === "expired"
        ) {
          validationState = "ModalExpiredIdentity";

          // modals when hitting payment plans screen
        } else if (!draftOrderData?.available_payment_plans?.length) {
          console.log("this empty??", draftOrderData?.available_payment_plans);
          validationState = "ModalNoPaymentPlan";
        } else if (responseCancelOrder) {
          validationState = "ModalDiscardSuccess";
        }

        const lastAction = globalObjectLastActionState.get()?.action;

        if (validationState && lastAction === "modalProceedPurchase") {
          // use already clicked proceed during ModalMoreCredit
          validationState = null;
        }

        setOrderPaymentModal(
          validationState === null ? "ModalNoError" : validationState
        );
        return;
      } catch (e: any) {
        setOrderPaymentModal(null);
      } finally {
        setIsLoading(false);
        return;
      }
    }
  }, [execute, isLoading]);

  return {
    onModalCheck,
    onReset: onResetModalState,
    isLoading: {
      orderPaymentModal: isLoading,
    },
    response: {
      orderPaymentModal,
    },
  };
};

export default useOrderPaymentModal;
