import React, { useEffect, useRef, useState } from "react";
import { SuccessConfetti } from "components";
import { useBuyerStore, useNestedNavigatorStore, useUserStore } from "stores";
import { Keyboard } from "react-native";
import globalObjectLastActionState from "utils/global-object-last-action";
import globalObjectState from "utils/global-object-per-country-code";
import { getKycsObject, getKycsObjectKey } from "utils/utils-common";

const useNavigationLogic = ({
  route,
  navigation,
  setFromAddPaymentMethodSuccess,
  setLoginShowSplash,
}: any) => {
  const { name: routeName, params = {} } = route;

  const onEnd = (success: boolean) => {
    const { action } = globalObjectLastActionState.get();
    if (action === "fromTransactionItem") {
      if (success) {
        globalObjectLastActionState.set(
          "fromTransactionItemPaymentMethodSuccess"
        );
      } else {
        globalObjectLastActionState.set(
          "fromTransactionItemPaymentMethodFailed"
        );
      }
      navigation.pop(2);
      return;
    } else if (action === "fromOrderConfirm") {
      if (success) {
        globalObjectLastActionState.set(
          "fromTransactionItemPaymentMethodSuccess"
        );
      } else {
        globalObjectLastActionState.set(
          "fromTransactionItemPaymentMethodFailed"
        );
      }
      navigation.pop(2);
      return;
    }

    if (success) {
      if (action === "orderDLToVerify") {
        // dddebug
        setLoginShowSplash({
          landingToScreenParam: "OrderDL",
          // isOrderDeepLinkParam: true, //url.includes("ab;),
          deepLinkUrlSearchParams: {
            type: "store_id",
            data: { storeId: "SG-S-JXJAJWW87CEX" },
          },
        } as any);
        return;
      }
    }

    setFromAddPaymentMethodSuccess({
      goToHomeCreditRemaining: true,
    });
    navigation.pop(5);
  };

  return {
    onEnd,
  };
};

const AddPyamentMethodSuccess = ({ navigation, route }: any) => {
  const { countryCode } = globalObjectState.getLibrary();
  const { setFromAddPaymentMethodSuccess } = useNestedNavigatorStore();
  const { refreshUserStore, setLoginShowSplash } = useUserStore();
  const {
    response: { credits: responseCredits },
    isLoading: { credits: isLoadingCredits },
    fetchCredits,
  } = useBuyerStore();
  const [loading, setLoading] = useState(false);
  const { onEnd } = useNavigationLogic({
    navigation,
    route,
    setFromAddPaymentMethodSuccess,
    setLoginShowSplash,
  });
  const refLimiter = useRef(0);

  const onReturn = () => {
    setLoading(true);
    fetchCredits(countryCode);
  };

  useEffect(() => {
    // TODO - handle errorsCredits?
    if (responseCredits && loading && isLoadingCredits === false) {
      refLimiter.current = refLimiter.current + 1;

      const kycsObject = getKycsObject(responseCredits);
      const dataPaymentMethod = getKycsObjectKey(
        countryCode as any,
        "payment_method",
        kycsObject
      );

      const stillNotFinishedProcessing = dataPaymentMethod !== "data_available";

      if (stillNotFinishedProcessing) {
        setTimeout(() => {
          fetchCredits(countryCode);
        }, 2000);
      } else {
        onEnd(true);
      }

      // 3 retries
      if (refLimiter.current > 3) {
        onEnd(false);
      }
    }
  }, [responseCredits, loading, isLoadingCredits]);

  useEffect(() => {
    try {
      Keyboard.dismiss();
    } catch (e) {}
  }, []);

  // const { onReturn } = route ?? {};
  return (
    <SuccessConfetti
      loading={loading}
      onReturn={onReturn}
      successText={"Payment method added!"}
    />
  );
};

export default AddPyamentMethodSuccess;
