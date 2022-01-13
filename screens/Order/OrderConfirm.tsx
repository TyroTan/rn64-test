import React, { useRef, useEffect, useMemo, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  Animated,
  Image,
  Easing,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Progress from "react-native-progress";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import LottieView from "lottie-react-native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  PrivacyPolicyText,
  ButtonText,
  PaymentPlanCard,
  KeyboardAwareScrollView,
  CardListView,
  RowItem,
  StepsVertical,
} from "components";
import { theme } from "styles/theme";
// import useAuthStore from "stores/useAuthStore";
// import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Layout from "constants/Layout";
import { useResetScreen } from "hooks";
import type { OrderPaymentPlan } from "./OrderTypes";
import { useBuyerStore, useOrderStore, useUserStore } from "stores";
import {
  calculateTodaysPayment,
  getCardIcon,
  getGenericSkeletonConfig,
  getKycsObjectKey,
  secureCardNumber,
} from "utils/utils-common";
import OrderPageRoutes from "./OrderPageRoutes";
import { Modalize } from "react-native-modalize";
import RenderScheduleRow from "./RenderScheduleRow";
import { alerts } from "utils/global-texts";
import globalObjectState from "utils/global-object-per-country-code";
import PaymentSchedule from "components/Order/PaymentSchedule";
import globalObjectLastActionState from "utils/global-object-last-action";
import { RenderPaymentMethodSelect } from "components/RenderPaymentMethodSelect";
import SkeletonContent from "components/SkeletonContent";

// const imgVisa = require("assets/images/visa-cc.png");
const imgChevronDown = require("assets/images/chevron-down-path.png");

const styles = StyleSheet.create({
  line: {
    borderWidth: mscale(0.5),
    height: mscale(1),
    width: "100%",
    borderColor: "#E9E9E9",
  },
  cardIcon: {
    height: mscale(46),
    width: mscale(46),
    // marginTop: mscale(9),
    marginLeft: mscale(11),
    // alignSelf: "center",
    // borderWidth: 1,
  },
  btnChevronDown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: mscale(50),
  },
  imgChevronDown: {
    height: mscale(16),
    width: mscale(15),
    marginRight: mscale(18),
  },
  flexcr: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,
    marginLeft: mscale(14),
  },
});

const Line = ({ borderStyle = "solid", marginTop = null }: any) => (
  <View
    style={[
      styles.line,
      {
        marginTop: marginTop ?? mscale(12),
        borderStyle,
      },
    ]}
  />
);

const RenderPaymentAgreement = (allProps: any) => {
  return (
    <StyledText variant="paragraph" fontSize={9} {...allProps}>
      I agree to the terms in Rn64test's
      <StyledText
        variant="paragraph"
        fontSize={10}
        color={theme.colors.buttons.marineBlue}
      >
        {" "}
        Instalment Payment Agreement
      </StyledText>
    </StyledText>
  );
};

const RenderPaymentDetails = ({
  plan: selectedPlan,
  onViewPaymentSchedule,
}: {
  plan: OrderPaymentPlan;
  onViewPaymentSchedule: () => void;
}) => {
  const { formatAsCurrency } = globalObjectState.getLibrary();
  const {
    downpayment_amount,
    instalment_amount,
    instalment_processing_fee_amount,
  } = selectedPlan;

  return (
    <CardListView
      variant="card2"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      marginTop={1}
    >
      {selectedPlan &&
      selectedPlan.instalment_frequency === "end_of_month" &&
      selectedPlan.repayments &&
      selectedPlan.repayments.length === 2 ? (
        <>
          <RowItem
            label="Today's Payment"
            value={formatAsCurrency(selectedPlan.repayments[0].total_amount)}
            paddingTop={mscale(16)}
          />
          <RowItem
            label="Pay in 1 month"
            value={formatAsCurrency(selectedPlan.repayments[1].total_amount)}
          />
        </>
      ) : selectedPlan &&
        selectedPlan.repayments &&
        selectedPlan.repayments.length > 0 &&
        selectedPlan.downpayment_amount &&
        selectedPlan.instalment_amount &&
        selectedPlan.instalment_processing_fee_amount ? (
        <>
          <RowItem
            label="Downpayment"
            value={formatAsCurrency(downpayment_amount)}
            paddingTop={mscale(16)}
          />
          <RowItem
            label="1st instalment amount"
            value={formatAsCurrency(instalment_amount)}
          />
          <RowItem
            label="Monthly processing fee"
            value={formatAsCurrency(instalment_processing_fee_amount)}
          />
          <Line borderStyle="dashed" />
          <RowItem
            label="Today's payment"
            // value={formatAsCurrency(calculateTodaysPayment(selectedPlan))}
            value={selectedPlan.repayments[0].total_amount}
          />
          <Line marginTop={mscale(19)} />
        </>
      ) : (
        <></>
      )}
      <ButtonText
        variant="primaryInverted"
        children="View payment schedule"
        borderWidth={0}
        width="100%"
        onPress={onViewPaymentSchedule}
        textProps={{
          letterSpacing: 0,
          style: {
            textTransform: "none",
          },
          fontSize: 14,
          lineHeight: 41,
          fontFamily: "PoppinsBold",
        }}
      />
    </CardListView>
  );
};

interface CardItem {
  is_default: boolean;
  status: string;
  id: string;
  expired_at: string;
  card: {
    brand: string;
    funding: string;
    ending_digits: string;
  };
}

const ModalPaymentSchedule = (props: ModalPaymentScheduleProps) => {
  const { selectedPlan, selectedPaymentMethod } = props;
  const { repayments } = selectedPlan;

  return (
    <StyledBox width="74%" alignSelf="center">
      <StyledBox flexDirection="row" justifyContent="flex-start">
        <StyledText mt={17} variant="titleModalBottom">
          Payment schedule
        </StyledText>
      </StyledBox>
      <StyledText
        mt={7}
        variant="paragraphModalBottom"
        textAlign="left"
        numberOfLines={3}
        lineHeight={15}
        mb={2}
      >
        Monthly payments will be collected from your specified payment method on
        each instalment date.
      </StyledText>
      <PaymentSchedule
        //   current={5}
        repayments={repayments}
        // orderCode={orderCode}
        //   isLoading={updatePaymentMethodIsLoading}
        isLoading={false}
        selectedPaymentMethod={selectedPaymentMethod}
      />
    </StyledBox>
  );
};

interface ModalPaymentScheduleProps {
  selectedPlan: OrderPaymentPlan;
  orderCode?: string;
  isLoading?: boolean;
  selectedPaymentMethod: string;
}

const OrderConfirm: React.FC<any> = (props: any) => {
  const { route, navigation, setHeaderProgress } = props;
  const { selectedPlan } = route?.params ?? {};
  const refModal = useRef();
  const { formatAsCurrency, countryCode } = globalObjectState.getLibrary();
  const {
    fetchPaymentMethod,
    resetStates: resetStatesBuyer,
    isLoading: { paymentMethodFetch: isLoadingPaymentMethod },
    response: {
      credits: responseCredits,
      paymentMethodFetch: responsePaymentMethodFetch,
    },
  } = useBuyerStore();

  const {
    response: { initialStoreStates },
  } = useUserStore();

  const {
    isLoading: {
      confirmOrder: isLoadingConfirmOrder,
      updatePaymentTransaction: updatePaymentTransactionIsLoading,
    },
    response: {
      orderForStore: responseOrderForStore,
      confirmOrder: responseConfirmOrder,
      updatePaymentTransaction: updatePaymentTransactionResponse,
      draft: responseOrderDraft,
    },
    errors: {
      confirmOrder: errorsConfirmOrder,
      updatePaymentTransaction: updatePaymentTransactionError,
    },
    resetStates: resetStatesOrder,
    submitConfirmOrder,
    updatePaymentTransaction,
  } = useOrderStore();

  const draftOrderRecord =
    responseOrderDraft?.orders?.[(responseOrderDraft?.orders?.length ?? 0) - 1];
  const pendingPurchaseDraftOrder = draftOrderRecord;

  const draftOrderData = responseOrderForStore?.merchant?.logo
    ? responseOrderForStore
    : initialStoreStates?.order ?? pendingPurchaseDraftOrder;

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<CardItem>();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>();

  // *Event on focus
  useResetScreen({
    navigation,
    onReset: () => {
      // setHeaderProgress?.(0.88);
    },
  });

  const isIOS = Platform.OS === "ios";
  const { width } = Layout.screen;

  // *Effects

  useEffect(() => {
    fetchPaymentMethod(countryCode);

    navigation.setParams({
      onGoBack: navigation.goBack,
    });

    return () => {
      resetStatesBuyer("paymentMethodFetch");
      resetStatesOrder("confirmOrder");
    };
  }, []);

  useEffect(() => {
    if (responseConfirmOrder?.data && responseConfirmOrder?.success) {
      if (responseConfirmOrder.data.order.state === "approved") {
        const orderCode = draftOrderData.code;

        // setPaymentTransactionLocalDb(responseConfirmOrder.data);
        // removeDraftOrderLocalDb();

        resetStatesOrder("confirmOrder");
        // pushTransctionHistory(history, orderCode);
        // history.push("/order/success");

        onNext();
        return;
      } else if (
        responseConfirmOrder.data.repayment.payment_transaction.status ===
        "require_action"
      ) {
        // handleStripeActionRequired();
      } else {
        setErrors(alerts.genericError);
        setIsLoading(false);
        // return setPaymentFailed(true);
      }
    }
  }, [responseConfirmOrder]);

  useEffect(() => {
    if (errorsConfirmOrder) {
      // todo handle errors

      Alert.alert(`Information`, errorsConfirmOrder);
    }
  }, [errorsConfirmOrder]);

  useEffect(() => {
    if (responsePaymentMethodFetch) {
    }
  }, [responsePaymentMethodFetch]);

  // * Handlers - onpress
  const onGoBack = () => {
    navigation.goBack();
  };

  const onNext = () =>
    navigation.navigate(OrderPageRoutes.OrderPaymentReceipt, {
      responseConfirmOrder,
    });

  const onViewPaymentSchedule = () => {
    refModal?.current?.open?.();
  };

  const handleClearErrors = () => {
    setIsLoading(false);
    setErrors(null);
    resetStatesOrder("confirmOrder");
    resetStatesOrder("updatePaymentTransaction");
  };

  const onConfirmOrder = () => {
    onNext();
    // dddebug
    // if (!!onNext) return;

    if (!selectedPaymentMethod?.id) {
      return;
    }

    const orderCode = draftOrderData.code;
    const paymentPlanId = selectedPlan.payment_plan_def_id;
    const paymentMethodId = selectedPaymentMethod.id;

    setIsLoading(true);
    submitConfirmOrder(orderCode, paymentPlanId, paymentMethodId);
  };
  const onPay = () => {
    if (!selectedPaymentMethod) {
      Alert.alert(alerts.headerInformation, alerts.pleaseSelectAPaymentMethod);
      return;
    }
    onConfirmOrder();
  };

  const onAddNewPaymentMethod = () => {
    globalObjectLastActionState.set("fromOrderConfirm");
    navigation.navigate(OrderPageRoutes.AddPaymentMethod);
  };

  const isLoadingBtns = isLoadingPaymentMethod || isLoadingConfirmOrder;
  console.log(
    "responsePaymentMethodFetchresponsePaymentMethodFetch",
    responsePaymentMethodFetch
  );

  return (
    <StyledBox
      flex={1}
      // mt={-20}
      paddingTop={0}
      paddingBottom={0}
      margin={0}
      // marginTop={mscale(-getStatusBarHeight(Device) + 22)}
      height="100%"
    >
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <StyledBox
          flex={1}
          width="100%"
          paddingX={7}
          // alignItems="center"
          paddingTop={mscale(12)}
          paddingBottom={mscale(20)}
        >
          <StyledText
            variant="titleSecondary"
            textAlign="left"
            // children="Step 2 of 2: Make today's payment"
            marginBottom={4}
          >{`Step 2 of 2: ${
            selectedPlan && selectedPlan.instalment_frequency === "end_of_month"
              ? "Confirm Payment Plan"
              : "Make today's payment"
          }`}</StyledText>
          <RenderPaymentDetails
            onViewPaymentSchedule={onViewPaymentSchedule}
            plan={selectedPlan}
          />

          <>
            <StyledText
              variant="titleSecondary"
              textAlign="left"
              children="Payment Method"
              marginTop={mscale(13)}
            />
            {/* <RenderPaymentMethodSelect
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                cards={responsePaymentMethodFetch}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
              /> */}
            <SkeletonContent
              containerStyle={{
                flex: 1,
                width: "100%",
                paddingVertical: mscale(10),
              }}
              // isLoading={!responsePaymentMethodFetch || !draftOrderData}
              isLoading={isLoadingBtns || !responsePaymentMethodFetch?.length}
              layout={getGenericSkeletonConfig()}
            >
              <CardListView
                width="100%"
                // flexDirection="row"
                // justifyContent="center"
                // alignItems="center"
                paddingVertical={2}
              >
                <RenderPaymentMethodSelect
                  collapsedPaymentMethod={collapsed}
                  setCollapsedPaymentMethod={setCollapsed}
                  cards={responsePaymentMethodFetch}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                  onAddNewPaymentMethod={onAddNewPaymentMethod}
                  presetActivePaymentMethod={
                    (draftOrderData &&
                      draftOrderData.collection_payment_method) ||
                    null
                  }
                  //   saveCurrentUrl
                  //   useNewPaymentMethod={useNewPaymentMethod}
                />
              </CardListView>
            </SkeletonContent>
          </>
        </StyledBox>
      </KeyboardAwareScrollView>
      <StyledBox
        width="100%"
        borderTopWidth={1}
        borderColor="#E8E8E8"
        flexDirection="column"
        alignItems="center"
      >
        <RenderPaymentAgreement />
        <ButtonText
          children={`PAY ${formatAsCurrency(
            calculateTodaysPayment(selectedPlan)
          )}`}
          onPress={onPay}
          disabled={isLoadingBtns}
          loading={isLoadingBtns}
          marginTop={2}
          marginBottom={10}
        />
        {/* <ButtonText
            children="BACK"
            onPress={navigation.goBack}
            disabled={isLoadingBtns}
            // loading={isLoadingBtns}
            marginBottom={0}
          /> */}
      </StyledBox>
      <Modalize
        ref={refModal}
        // adjustToContentHeight={true}
        modalHeight={Math.round(Layout.screen.height * 0.55)}
        disableScrollIfPossible={true}
      >
        <ModalPaymentSchedule
          selectedPaymentMethod={selectedPaymentMethod?.id as string}
          selectedPlan={selectedPlan}
        />
      </Modalize>
    </StyledBox>
  );
};

export default OrderConfirm;
