import React, { createRef, useCallback, useEffect, useState } from "react";
import { Alert, Image, Platform, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  PrivacyPolicyText,
  ButtonText,
  SDollarTextInputComponent,
  Header,
  KeyboardAvoiding,
  KeyboardAwareScrollView,
} from "components";
import { theme } from "styles/theme";
// import useAuthStore from "stores/useAuthStore";
// import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";
import * as Progress from "react-native-progress";
import Layout from "constants/Layout";
import { ProgressLabel } from "components/StyledTexts";
import { isNumeric, textInputMask2Decimal } from "utils/js-utils";
import { alerts } from "utils/global-texts";
import {
  useBuyerStore,
  useOrderStore,
  useMerchantStore,
  useUserStore,
  useNestedNavigatorStore,
} from "stores";
import ModalOrder from "./ModalOrder";
import { getKycsObject, getKycsObjectKey } from "utils/utils-common";
import OrderPageRoutes from "./OrderPageRoutes";
import type { OrderState, Store } from "./OrderTypes";
import useOrderPaymentModal from "./useOrderPaymentModal";
import { useResetScreen } from "hooks";
import RenderVoucher from "./RenderVoucher";
import type { OrderDraft } from "./OrderTypes";
import globalObjectState from "utils/global-object-per-country-code";
import globalObjectLastActionState from "utils/global-object-last-action";
// import ModalInsufficientCredit from "./ModalInsufficientCredit";
// import ModalExpiredIdentity from "./ModalExpiredIdentity";

const StyledImg = styled.Image`
  height: ${mscale(141)};
  width: ${mscale(141)};
  border-radius: ${mscale(12)};
`;

const StyledMerchantImgWrapper = styled.View`
  /* // TODO -  use boxShadow instead */
  box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.098066);
  border-radius: ${mscale(12)};
  background-color: ${theme.colors.background2};
  elevation: 9;
  margin-bottom: ${mscale(17)};
  align-self: center;
`;

const StyledMerchantBanner = ({ logo }: any) => {
  return (
    <StyledMerchantImgWrapper>
      <StyledImg source={{ uri: logo }} resizeMode="center" />
    </StyledMerchantImgWrapper>
  );
};

type OrderPaymentMode = "NEW_ORDER" | "DRAFT_ORDER";

const useNavigationLogic = ({
  initialStoreStates, // coming from setLoginShowSplash
  fromPendingPurchase,
  countryCode,
  amount,
  storeId,
  onGoToPaymentPlans,
}: {
  initialStoreStates: any; // coming from setLoginShowSplash
  fromPendingPurchase: any;
  countryCode: "sg" | "my";
  amount: number;
  storeId?: string;
  onGoToPaymentPlans: () => void;
}) => {
  // const [mode, setMode] = useState<OrderPaymentMode>(
  //   fromPendingPurchase?.draftOrder?.merchant ? "DRAFT_ORDER" : "NEW_ORDER"
  // );
  const mode: OrderPaymentMode =
    initialStoreStates?.order?.merchant ||
    fromPendingPurchase?.draftOrder?.merchant
      ? "DRAFT_ORDER"
      : "NEW_ORDER";

  const {
    response: { credits: responseCredits },
    errors: { credits: errorsCredits },
    isLoading: { credits: isLoadingCredits },
    fetchPaymentMethod,
    fetchCredits,
    resetStates,
  } = useBuyerStore();

  const credits = responseCredits
    ? responseCredits
    : initialStoreStates?.credits;

  const {
    response: { store: responseStore },
    errors: { store: errorsStore },
    isLoading: { store: isLoadingStore },
    fetchStore,
  } = useMerchantStore();

  const {
    submitOrderForStore,
    fetchOrderDraft,
    fetchOrder,
    submitCancelOrder,
    response: {
      orderForStore: responseOrderForStore,
      order: responseOrder,
      draft: responseOrderDraft,
      cancelOrder: responseCancelOrder,
    },
    isLoading: {
      cancelOrder: isLoadingCancelOrder,
      orderForStore: isLoadingOrderForStore,
      order: isLoadingOrder,
    },
    errors: { orderForStore: errorsOrderForStore },
  } = useOrderStore();

  const draftOrderData =
    mode === "DRAFT_ORDER"
      ? initialStoreStates?.order
        ? initialStoreStates.order
        : responseOrder
        ? responseOrder
        : fromPendingPurchase?.draftOrder
      : responseOrder;

  const onReset = () => {
    onResetModalCheck();
    fetchCredits(countryCode);
    fetchPaymentMethod(countryCode);

    if (fromPendingPurchase?.draftOrder?.code) {
      fetchOrder(fromPendingPurchase.draftOrder.code);
    }
    // fetchOrder?
  };

  const {
    onModalCheck,
    onReset: onResetModalCheck,

    isLoading: { orderPaymentModal: isLoadingOrderPaymentModal },
    response: { orderPaymentModal: responseOrderPaymentModal },
  } = useOrderPaymentModal(countryCode);

  const [executeContinue, setExecuteContinue] = useState(false);

  const [errors, setErrors] = useState<any>();

  const isLoadingNavLogic =
    isLoadingCredits ||
    isLoadingOrderPaymentModal ||
    isLoadingOrder ||
    isLoadingStore ||
    isLoadingCancelOrder ||
    isLoadingOrderForStore;

  const onContinue = () => {
    console.log("just go nowww~", responseOrderPaymentModal, isLoadingNavLogic);
    if (isLoadingNavLogic) {
      return;
    }

    if (mode === "DRAFT_ORDER") {
      setExecuteContinue(true);
      return;
    }

    if (validateAmount(amount)) {
      return setErrors(validateAmount(amount));
    }

    resetStates("credits");
    setErrors(null);

    // triggers effects - flow #1
    setExecuteContinue(true);
    // fetchCredits(countryCode);
    // setIsContinuing(true);
  };

  // *Effects

  // effects flow #1 - for manual order
  useEffect(() => {
    if (executeContinue && mode === "NEW_ORDER") {
      // triggers effects - flow #2
      fetchCredits(countryCode);
    }
  }, [executeContinue, mode]);

  useEffect(() => {
    if (isLoadingNavLogic) {
      return;
    }

    if (
      executeContinue === false &&
      mode === "NEW_ORDER" &&
      !responseOrderPaymentModal &&
      responseOrder
    ) {
      // responseOrderLoading Done
      onGoToPaymentPlans();
    } else if (
      executeContinue === true &&
      mode === "DRAFT_ORDER" &&
      responseOrder
    ) {
      console.log("responseOrderPaymentModal", responseOrderPaymentModal);
      if (responseOrderPaymentModal === null) {
        onModalCheck();
      } else if (responseOrderPaymentModal === "ModalNoError") {
        // executeContinue stays true, loading/fetching order data is not needed, draftOrderData already filled up during setLoginShowSplash
        onGoToPaymentPlans();
      }
    }
  }, [
    executeContinue,
    mode,
    responseOrderPaymentModal,
    isLoadingNavLogic,
    responseOrder,
    draftOrderData,
  ]);

  useEffect(() => {
    if (errorsCredits) {
      setErrors(errorsCredits);
      resetStates("credits");
      onResetModalCheck();
      // setCheckedVerifyIdentity(false);
      // setCheckedPaymentMethod(false);
    }
  }, [errorsCredits]);

  useEffect(() => {
    if (errorsStore) {
      // TODO reset go to credits
      onResetModalCheck();
    }
  }, [errorsStore]);

  useEffect(() => {
    if (errorsOrderForStore) {
      onResetModalCheck();
    }
  }, [errorsOrderForStore]);

  // manual
  useEffect(() => {
    if (storeId && responseStore) {
      submitOrderForStore(storeId, textInputMask2Decimal(amount));
    }
  }, [storeId, responseStore]);

  useEffect(() => {
    if (!responseOrderPaymentModal && responseOrderForStore) {
      fetchOrder((responseOrderForStore as OrderState).code);
    }
  }, [responseOrderPaymentModal, responseOrderForStore]);

  useEffect(() => {
    if (responseOrder) {
      // console.log("responseOrderresponseOrder", responseOrder);
      // mabe only trigger if manual?
      onModalCheck();
    }
  }, [responseOrder]);

  const checkAndShowOnboardingModals = useCallback(
    ({
      shouldExecuteModalCheck,
      setShouldExecuteModalCheck,
    }: {
      shouldExecuteModalCheck: boolean;
      setShouldExecuteModalCheck: (bool: boolean) => void;
    }) => {
      if (credits && !isLoadingCredits && shouldExecuteModalCheck) {
        setShouldExecuteModalCheck(false);
        // console.log("responseCredits", responseCredits);
        const kycsObject = getKycsObject(credits);
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

        const isOk =
          dataIdentity === "data_available" &&
          dataPaymentMethod === "data_available";

        if (isOk === true && storeId && storeId?.length > 0) {
          // manual amount input flow
          fetchStore(storeId);
        } else {
          onModalCheck();
        }
      }
    },
    [mode, credits, responseCredits]
  );

  // effects flow #2 - continue button was clicked - for manual
  useEffect(() => {
    checkAndShowOnboardingModals({
      shouldExecuteModalCheck: executeContinue,
      setShouldExecuteModalCheck: setExecuteContinue,
    });
  }, [mode, credits, responseCredits]);

  // useEffect(() => {
  //   fetchOrderDraft(countryCode);
  // }, [countryCode]);

  // useEffect(() => {
  //   if (responseOrderDraft?.orders?.length) {
  //     setMode("DRAFT_ORDER");
  //   }
  // }, [responseOrderDraft]);

  const isFormLoading =
    isLoadingCredits ||
    isLoadingStore ||
    isLoadingCancelOrder ||
    isLoadingOrderPaymentModal ||
    isLoadingOrder;

  return {
    errors,
    isFormLoading,
    onContinue,
    credits,
    responseStore,
    checkAndShowOnboardingModals,
    modalState: isFormLoading ? null : responseOrderPaymentModal,
    draftOrderData,
    submitCancelOrder,
    responseCancelOrder,
    mode,
    onReset,
  };
};

const validateAmount = (value: any): undefined | string => {
  const { ORDER_AMOUNT_MANUAL_MIN, formatAsCurrency } =
    globalObjectState.getLibrary();

  // TODO - limit to two decimals
  const isValid = isNumeric(value);
  console.log("isvalid ammount", value, isValid);
  if (!isValid) {
    // return prev;
    return "Please provide a valid amount.";
  } else if (parseFloat(value) < ORDER_AMOUNT_MANUAL_MIN) {
    return `Please enter at least ${formatAsCurrency(ORDER_AMOUNT_MANUAL_MIN)}`;
  } else if (parseFloat(value) < 0) {
    // return prev;
    return "Please provide a valid amount.";
  }
};

const OrderPayment: React.FC<any> = ({ route, navigation }) => {
  const {
    response: { user: responseUser, initialStoreStates },
    setLoginShowSplash,
    resetStates,
  } = useUserStore();
  const { resetStates: resetStatesBuyer } = useBuyerStore();
  const { resetStates: resetStatesOrder } = useOrderStore();
  const {
    response: { fromPendingPurchase },
  } = useNestedNavigatorStore();
  const { deeplinkUrlSearchParams } = responseUser;

  const { countryCode, currencySign } = globalObjectState.getLibrary();

  const { store: storeMerchantInitialStoreStates } = initialStoreStates as {
    store?: Store;
    // credits: any;
    // orderCampaign?: OrderState;
  };

  // dddebug

  const [executeOpenModal, setExecuteOpenModal] = useState(false);
  const [executeInitialErrorChecks, setExecuteInitialErrorChecks] = useState<
    null | boolean
  >(null);

  const [amount, setAmount] = useState<any>("");
  const [errorText, setErrorText] = useState<any>(null);
  const insets = useSafeAreaInsets();
  const { storeId } = deeplinkUrlSearchParams?.data ?? {};

  const onGoToPaymentPlans = () => {
    navigation.navigate(OrderPageRoutes.PaymentPlans);
  };

  const {
    errors,
    isFormLoading,
    onContinue,
    credits,
    draftOrderData,
    modalState,
    checkAndShowOnboardingModals,
    submitCancelOrder,
    mode,
    onReset,
  } = useNavigationLogic({
    initialStoreStates,
    fromPendingPurchase,
    countryCode,
    amount,
    storeId,
    onGoToPaymentPlans,
  } as any);

  useResetScreen({
    navigation,
    onReset: () => {
      // order, credits, and paymentMethodFetch from initial store states already set by setLoginShowSplash

      // forces refetch every tab visit, might not be optimal
      // but leaves initialStoreStates as it is
      resetStatesBuyer("credits");
      resetStatesOrder("order");
      resetStatesOrder("orderForStore");
      resetStatesOrder("cancelOrder");

      onReset();

      console.log("executeInitialErrorChecks", executeInitialErrorChecks);
      // checkAndShowOnboardingModals({
      //   shouldExecute: true,
      //   setShouldExecute: setExecuteInitialErrorChecks,
      // });
    },
  });

  const storeMerchantData =
    mode === "DRAFT_ORDER"
      ? draftOrderData?.merchant
      : storeMerchantInitialStoreStates;

  // *Events

  // * Handlers - onpress
  const onGoBack = () => {
    // navigation.goBack();

    resetStates("user");
    setLoginShowSplash();
  };

  const onChangeAmount = setAmount;

  const onNext = () => {
    // setIsOpenOnboardingRequiredModal(true);
  };

  const onDiscardPurchase = () => {
    // const currentDraftOrder = getDraftOrderLocalDb();

    // if (fromPendingPurchase?.draftOrder?.code) {
    if (draftOrderData?.code) {
      Alert.alert(alerts.confirmation, alerts.discard, [
        {
          text: "Discard",
          onPress: () => {
            // todo - if referral, skip calling this?
            submitCancelOrder(draftOrderData.code);
          },
        },
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
      ]);
    }
  };

  // *Effects

  // didmount
  // useEffect(() => {
  // see useResetScreen -> onReset instead
  // }, [])

  useEffect(() => {
    if (mode === "DRAFT_ORDER") {
      setAmount(draftOrderData?.grand_total_amount ?? "0.00");
    }
  }, [mode]);

  useEffect(() => {
    // TODO - limit to two decimals
    const result = validateAmount(amount);

    if (amount?.length) {
      if (errorText) {
        setErrorText(null);
      }
    } else {
      return;
    }

    if (result) {
      setErrorText(result);
    } else if (errorText) {
      setErrorText(null);
    }
  }, [amount, errorText]);

  // useEffect(() => {
  //   if (!(checkedVerifyIdentity && checkedPaymentMethod)) {
  //     setExecuteOpenModal(true);
  //   } else if (executeOpenModal === false) {
  //   }
  // }, [checkedVerifyIdentity, checkedPaymentMethod]);

  /* useEffect(() => {
    if (errorsStore) {
      console.log("errorStoreerrorStore", errorsStore);
      // setStore(responseStore as Store);
    }
  }, [errorsStore]); */

  useEffect(() => {
    if (!(modalState === null || modalState === "ModalNoError")) {
      setExecuteOpenModal(true);
    }
  }, [modalState]);

  const isLoadingBtns = isFormLoading;
  const disabledContinue = isLoadingBtns;
  // const disabledContinue = storeId
  //   ? isLoadingBtns
  //   : isLoadingBtns ||
  //     !draftOrderData?.has_min_credit_amount_for_profit ||
  //     credits.is_expired ||
  //     !(
  //       modalState === "ModalOnboardingIdentity" ||
  //       modalState === "ModalOnboardingPaymentMethod"
  //     );

  const isIOS = Platform.OS === "ios";

  useEffect(() => {
    console.log("chekerrr errorText ?? errors", errorText, errors);
  }, [errorText, errors]);

  return (
    <StyledSafeAreaView>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "space-between",
          backgroundColor: theme.colors.background2,
          // paddingTop: isIOS ? 0 : mscale(20),
          // paddingBottom: isIOS ? mscale(20) : 0,
          height: "100%",
        }}
      >
        <StyledBox>
          <Header title="Pay Merchant" onPress={onGoBack} />
          <StyledBox
            mt={10}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <StyledBox alignSelf="center">
              <StyledMerchantBanner logo={storeMerchantData?.logo} />
              <SDollarTextInputComponent
                // autofocus={!kycsObject ? true : false}
                currencySign={currencySign}
                // value={amount}
                errorText={errorText ?? errors}
                keyboardType="numeric"
                onChangeText={onChangeAmount}
                variant={amount.length ? "landingLengthGT0" : "landing"}
                label={storeMerchantData?.name}
                wrapperProps={
                  {
                    // width: Layout.screen.width * 0.6,
                    // borderWidth: 5,
                  }
                }
                {...(mode === "DRAFT_ORDER"
                  ? {
                      defaultValue: draftOrderData?.grand_total_amount,
                      editable: false,
                    }
                  : {})}
              />
            </StyledBox>
          </StyledBox>
        </StyledBox>
        <StyledBox
          width="100%"
          variant="flexcr"
          flexDirection="column"
          justifyContent="flex-end"
          alignItems="center"
          // border
        >
          {draftOrderData?.vouchers?.length > 0 && (
            <RenderVoucher navigation={navigation} order={draftOrderData} />
          )}
          <StyledBox
            width="100%"
            variant="flexcr"
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="center"
            borderTopWidth={1}
            borderColor={"#E8E8E8"}
            paddingTop={mscale(5)}
            marginTop={4}
            zIndex={1}
          >
            <Progress.Bar
              style={{ marginTop: mscale(14), marginBottom: mscale(4) }}
              height={mscale(11)}
              borderRadius={mscale(5)}
              useNativeDriver
              borderWidth={0}
              progress={0.8}
              width={Layout.screen.width * 0.8}
              color={theme.colors.progressbar.barGreen1}
              unfilledColor={theme.colors.background}
            />
            <ProgressLabel
              marginBottom={5}
              text={"123"}
              currencySign={currencySign}
              amount={credits?.balance ?? "0.00"}
            />
            <ButtonText
              children="CONTINUE"
              onPress={onContinue}
              disabled={disabledContinue}
              loading={isLoadingBtns}
              marginBottom={0}
            />
            {draftOrderData?.code && (
              <ButtonText
                variant="primaryInverted"
                textProps={{ color: theme.colors.warningRed }}
                borderColor="transparent"
                children="DISCARD PURCHASE"
                onPress={onDiscardPurchase}
                disabled={isLoadingBtns}
                // loading={isLoadingBtns}
                marginBottom={0}
              />
            )}
          </StyledBox>
        </StyledBox>
      </KeyboardAwareScrollView>

      <ModalOrder
        navigation={navigation}
        modalState={modalState}
        credits={credits}
        draftOrderData={draftOrderData}
        executeOpenModal={executeOpenModal}
        setExecuteOpenModal={setExecuteOpenModal}
      />
      {/* <ModalExpiredIdentity
        navigation={navigation}
        executeOpenModal={executeOpenModal}
        setExecuteOpenModal={setExecuteOpenModal}
      /> */}
    </StyledSafeAreaView>
  );
};

export default OrderPayment;
