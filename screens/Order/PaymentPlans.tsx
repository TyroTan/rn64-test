import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TouchableOpacity, StyleSheet, View, Platform } from "react-native";
import * as Progress from "react-native-progress";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  ButtonText,
  PaymentPlanCard,
  KeyboardAwareScrollView,
} from "components";
import { theme } from "styles/theme";
// import useAuthStore from "stores/useAuthStore";
// import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Layout from "constants/Layout";
import { useResetScreen } from "hooks";
import { useOrderStore, useUserStore } from "stores";
import type { OrderPaymentPlan, OrderState } from "./OrderTypes";
import OrderPageRoutes from "./OrderPageRoutes";
import globalObjectState from "utils/global-object-per-country-code";

const styles = StyleSheet.create({
  btnDetails: {
    padding: mscale(3),
  },
  btnPlanCard: {},
});

const RenderBottomCreditDescription = ({ ...allProps }: any) => {
  const {
    creditUsedAmount,
    draftOrderData,
    responseUser,
    wrapperProps = {},
    ...textProps
  } = allProps;

  return (
    <StyledBox
      variant="flexcr"
      justifyContent="flex-start"
      alignItems="center"
      {...wrapperProps}
    >
      <StyledText variant="paragraph" fontSize={9} {...textProps}>
        You will use up to {creditUsedAmount} of credit
      </StyledText>
      <TouchableOpacity style={styles.btnDetails}>
        <StyledText
          fontFamily={"PoppinsMedium"}
          fontSize={10}
          lineHeight={10}
          color={theme.colors.buttons.marineBlue}
        >
          Details
        </StyledText>
      </TouchableOpacity>
    </StyledBox>
  );
};

const sortPaymentPlans = (a: any, b: any) => {
  return parseFloat(a.instalment_amount) < parseFloat(b.instalment_amount)
    ? 1
    : -1;
};

const PaymentPlan: React.FC<any> = ({
  route,
  navigation,
  setHeaderProgress,
}) => {
  const {
    submitOrderForStore,
    fetchOrderDraft,
    fetchOrder,
    submitCancelOrder,
    refreshOrderStates,
    response: {
      orderForStore: responseOrderForStore,
      order: responseOrder,
      draft: responseDraftOrders,
      cancelOrder: responseCancelOrder,
    },
    errors: { orderForStore: errorsOrderForStore },
  } = useOrderStore();
  const {
    response: { initialStoreStates },
  } = useUserStore();

  const draftOrder =
    responseDraftOrders?.orders?.[
      (responseDraftOrders?.orders?.length ?? 0) - 1
    ];
  const draftOrderData = (
    responseOrder ? responseOrder : initialStoreStates?.order ?? draftOrder
  ) as OrderState;

  const {
    response: { user: responseUser },
  } = useUserStore();

  const { formatAsCurrency } = globalObjectState.getLibrary();

  const { available_payment_plans = [] } = (draftOrderData ?? {}) as OrderState;

  const paymentPlansSorted =
    available_payment_plans.sort(sortPaymentPlans) ?? [];

  const [selectedPlan, setSelectedPlan] = useState<OrderPaymentPlan | null>(
    paymentPlansSorted?.[0]
  );

  useResetScreen({
    navigation,
    onReset: () => {
      // setHeaderProgress(0.4);
    },
  });
  const isIOS = Platform.OS === "ios";
  const progress = 0.4;
  const { width } = Layout.screen;
  // const insets = useSafeAreaInsets();

  // *Events

  // * Handlers - onpress
  const onGoBack = () => {
    navigation.goBack();
  };

  const onNext = () => {
    if (selectedPlan) {
      navigation.navigate(OrderPageRoutes.OrderConfirm, {
        selectedPlan,
      });
    }
  };

  const isLoadingBtns = false;

  // TODO --- walkthrough getOrdCreate.interactions where action = view_create_order_payment_plan
  // TODO --- DETAILS button, credit explanation

  return (
    <StyledBox
      flex={1}
      // mt={-20}
      paddingTop={0}
      paddingBottom={0}
      margin={0}
      marginTop={mscale(20)}
      height="100%"
    >
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <StyledBox
          flex={1}
          width="100%"
          paddingX={7}
          // alignItems="center"
          // paddingTop={mscale(97)}
        >
          <StyledText
            variant="titleSecondary"
            textAlign="left"
            children="Step 1 of 2: Select payment plan"
            marginBottom={5}
          />
          {paymentPlansSorted?.map((plan, index: number) => {
            const active =
              plan.payment_plan_def_id === selectedPlan?.payment_plan_def_id;

            return (
              <PaymentPlanCard
                key={plan.payment_plan_def_id}
                planKey={plan.payment_plan_def_id}
                setSelectedPlan={setSelectedPlan}
                marginTop={index ? 3 : 0}
                active={active}
                plan={plan}
              />
            );
          }) ?? <></>}
        </StyledBox>
        <StyledBox
          width="100%"
          borderTopWidth={1}
          borderColor="#E8E8E8"
          flexDirection="column"
          alignItems="center"
          marginBottom={10}
        >
          <StyledBox
            variant="flexcr"
            justifyContent="flex-start"
            marginTop={mscale(15)}
            marginBottom={mscale(2)}
          >
            <Progress.Bar
              height={mscale(11.5)}
              borderRadius={mscale(5)}
              useNativeDriver
              borderWidth={0}
              progress={progress}
              width={width - mscale(120)}
              color={theme.colors.progressbar.barGreen1}
              unfilledColor="rgba(11, 193, 117, 0.5)"
              // unfilledColor={theme.colors.background}
            />
            <View
              style={{
                marginLeft: mscale(-3),
                height: mscale(11.5),
                backgroundColor: "#D7E2E8",
                width: mscale(43),
                borderTopRightRadius: mscale(5),
                borderBottomRightRadius: mscale(5),
              }}
            />
          </StyledBox>
          <RenderBottomCreditDescription
            wrapperProps={{ marginBottom: 5 }}
            creditUsedAmount={formatAsCurrency(
              selectedPlan?.credit_used_amount ?? "0.00"
            )}
            draftOrderData={draftOrderData}
            responseUser={responseUser}
          />
          <ButtonText
            children="CONTINUE"
            onPress={onNext}
            disabled={isLoadingBtns || !available_payment_plans?.length}
            // loading={isLoadingBtns}
            marginBottom={0}
          />
          {/* <ButtonText
            children="BACK"
            onPress={onGoBack}
            disabled={isLoadingBtns}
            // loading={isLoadingBtns}
            marginBottom={0}
          /> */}
        </StyledBox>
      </KeyboardAwareScrollView>
    </StyledBox>
  );
};

export default PaymentPlan;
