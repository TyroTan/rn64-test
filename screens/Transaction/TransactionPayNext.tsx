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
const imgDashedLine = require("assets/images/dashed-line.png");
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
import { useStripe } from "@stripe/stripe-react-native";
// import useAuthStore from "stores/useAuthStore";
// import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Layout from "constants/Layout";
import { useResetScreen } from "hooks";
// import type { OrderPaymentPlan } from "./OrderTypes";
import { useBuyerStore, useOrderStore, useUserStore } from "stores";
import {
  calculateTodaysPayment,
  getCardIcon,
  getGenericSkeletonConfig,
  getKycsObjectKey,
  secureCardNumber,
} from "utils/utils-common";
// import OrderPageRoutes from "./OrderPageRoutes";
import { Modalize } from "react-native-modalize";
// import RenderScheduleRow from "./RenderScheduleRow";
import { alerts } from "utils/global-texts";
import globalObjectState from "utils/global-object-per-country-code";
// import { navigationRef } from "navigation/RootNavigation";
import PaymentSchedule from "components/Order/PaymentSchedule";
import globalObjectLastActionState from "utils/global-object-last-action";
import { RenderPaymentMethodSelect } from "components/RenderPaymentMethodSelect";
import { SkeletonContent } from "components";
import { OrderPaymentPlan, ResponseFetchOrder } from "screens/Order/OrderTypes";
import { OrderPageRoutes } from "screens/Order";
import { TransactionPaymentOrder } from "./Transaction";
import { ordinalSuffix } from "utils/js-utils";
import { TransactionPageRoutes } from "./TransactionPageRoutes";
import type { ResponsePayNext } from "./TransactionTypes";

// const imgVisa = require("assets/images/visa-cc.png");
const imgChevronDown = require("assets/images/chevron-down-path.png");

const styles = StyleSheet.create({
  //   line: {
  //     borderWidth: mscale(0.5),
  //     height: mscale(1),
  //     width: "100%",
  //     borderColor: "#E9E9E9",
  //   },
  dashedline: {
    width: "90%",
    marginLeft: "0%",
    height: mscale(1),
    marginBottom: mscale(5),
    zIndex: 1,
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

const RenderPayNextDetails = ({
  data,
}: {
  data: TransactionPaymentOrder["repayments"][0];
}) => {
  const { formatAsCurrency } = globalObjectState.getLibrary();

  const {
    sequence,
    instalment_amount,
    instalment_processing_fee_amount,
    total_amount,
  } = data;

  return (
    <CardListView
      variant="card2"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      marginTop={1}
    >
      <RowItem
        label={`${sequence + 1}${ordinalSuffix(
          sequence + 1
        )} instalment amount`}
        value={formatAsCurrency(instalment_amount)}
        paddingTop={mscale(16)}
      />
      <RowItem
        label={"Monthly processing fee"}
        value={formatAsCurrency(instalment_processing_fee_amount)}
        paddingBottom={mscale(16)}
      />
      <Image source={imgDashedLine} style={styles.dashedline} />
      <RowItem
        label="Today's payment"
        value={formatAsCurrency(total_amount)}
        marginBottom={mscale(16)}
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

const TransactionPayNext: React.FC<any> = (props: any) => {
  const { route, navigation, setHeaderProgress } = props;
  const { payment, selectedPaymentMethodId, orderCode } = route?.params ?? {};
  console.log("paynext paramss", route?.params);
  const paymentId = payment.id;
  const repaymentId = paymentId;
  //   orderCode,
  //       selectedPaymentMethodId: selectedPaymentMethod?.id,
  //       payment,
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
      order: responseOrderData,
      payNext: responsePayNextData,
      updatePaymentTransaction: updatePaymentTransactionResponse,
    },
    errors: { payNext: errorsPayNext },
    resetStates: resetStatesOrder,
    fetchOrder,
    submitPayNext,
    updatePaymentTransaction,
  } = useOrderStore();
  const responsePayNext: ResponsePayNext =
    responsePayNextData as ResponsePayNext;

  const responseOrder: ResponseFetchOrder["data"] = responseOrderData;

  const stripe = useStripe();
  // const countryCode = getCountryCodeLocalDb();
  // const history = useHistory();
  // const location = useLocation().search;
  // const orderCode = new URLSearchParams(location).get("order");
  // const repaymentId = new URLSearchParams(location).get("repayment");
  // const useNewPaymentMethod = new URLSearchParams(location).get(
  //   "use_new_payment_method"
  // );

  const [collapsedPaymentMethod, setCollapsedPaymentMethod] = useState(false);
  const [currentRepayment, setCurrentRepayment] = useState<
    null | typeof responseOrder.repayments[0]
  >(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    null | typeof responseOrder.collection_payment_method
  >(null);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // *Methods
  const handleClearErrors = () => {
    setIsLoading(false);
    setPaymentFailed(false);
    setErrorMessage("");
    resetStatesOrder("payNext");
    resetStatesOrder("updatePaymentTransaction");
  };

  const didMount = () => {
    if (orderCode) {
      fetchOrder(orderCode);
    }

    if (countryCode) {
      fetchPaymentMethod(countryCode);
    }
  };

  useResetScreen({
    navigation,
    onReset: () => {
      handleClearErrors();
      didMount();
    },
  });

  const onAddNewPaymentMethod = () => {
    // globalObjectLastActionState.set("fromTransactionPayNext");
    navigation.navigate(TransactionPageRoutes.AddPaymentMethod);
  };

  const handleStripeActionRequired = async () => {
    const stripeData =
      responsePayNext.data.repayment.payment_transaction.stripe;
    console.log("handleStripeActionRequired stripeDatastripeData", stripeData);
    const { client_secret, payment_method_id } = stripeData;

    // confirmPayment: (paymentIntentClientSecret: string, data: PaymentMethodCreateParams.Params, options?: PaymentMethodCreateParams.Options) => Promise<ConfirmPaymentResult>;
    // {
    //     type: 'Card';
    //     paymentMethodId: string;
    //     cvc?: string;
    // }
    const confirmCardPaymentResponse = await stripe.confirmPayment(
      client_secret,
      {
        type: "Card",
        paymentMethodId: payment_method_id as string,
      }
    );

    // handle authentication error
    if (
      confirmCardPaymentResponse &&
      confirmCardPaymentResponse.error &&
      confirmCardPaymentResponse.error.message
    ) {
      setIsLoading(false);
      const paymentIntentId =
        confirmCardPaymentResponse.error.payment_intent.id;

      updatePaymentTransaction({
        third_party_name: "stripe",
        stripe: { country: countryCode, payment_intent_id: paymentIntentId },
      });
      return setErrorMessage(confirmCardPaymentResponse.error.message);
    }

    // handle authentication success
    if (
      confirmCardPaymentResponse &&
      confirmCardPaymentResponse.paymentIntent &&
      confirmCardPaymentResponse.paymentIntent.id
    ) {
      const paymentIntentId = confirmCardPaymentResponse.paymentIntent.id;
      updatePaymentTransaction({
        third_party_name: "stripe",
        stripe: { country: countryCode, payment_intent_id: paymentIntentId },
      });
    }
  };

  const handlePayRepayment = () => {
    const paymentMethodId = selectedPaymentMethodId;

    setIsLoading(true);
    submitPayNext(orderCode, paymentMethodId, repaymentId);
  };

  // *Effects
  useEffect(() => {
    // already called in onFocus
    // onFocus triggers on first visit and when coming back from error modal screen
    // didMount();

    return () => {
      resetStatesBuyer("paymentMethodFetch");
      resetStatesOrder("order");
      resetStatesOrder("payNext");
    };
  }, []);

  useEffect(() => {
    if (errorMessage) {
      return navigation.navigate(TransactionPageRoutes.ShowModalByType, {
        errorMessage,
      });
    }
  }, [errorMessage]);

  useEffect(() => {
    if (responseOrder && responseOrder.repayments) {
      const selectedRepayment = responseOrder.repayments.find(
        (repayment) => repayment.id === repaymentId
      );
      setCurrentRepayment(selectedRepayment ?? null);
    }

    if (responseOrder && responseOrder.collection_payment_method) {
      setSelectedPaymentMethod(responseOrder.collection_payment_method);
    }
  }, [responseOrder]);

  useEffect(() => {
    console.log("responsePayNextresponsePayNext", responsePayNext);
    if (responsePayNext && responsePayNext.success && responsePayNext.data) {
      if (
        responsePayNext.data.repayment.payment_transaction &&
        responsePayNext.data.repayment.payment_transaction.status === "success"
      ) {
        // todo use globalStateLastAction maybe? setPaymentTransactionLocalDb(responsePayNext.data);
        // todo nav to success

        resetStatesOrder("payNext");
        // pushTransctionHistory(history, orderCode);
        // history.push("/transaction/success");
        navigation.navigate(TransactionPageRoutes.TransactionReceipt, {
          type: "paynext",
          order: responsePayNext["data"]["order"],
          repayment: responsePayNext["data"]["repayment"],
        });
      } else if (
        responsePayNext.data.repayment.payment_transaction.status ===
        "require_action"
      ) {
        handleStripeActionRequired();
      } else {
        setPaymentFailed(true);
        setErrorMessage(
          "An error occurred when making the payment. Please try again."
        );
        return;
      }
    }
  }, [responsePayNext]);

  useEffect(() => {
    if (errorsPayNext) {
      setPaymentFailed(true);
      if (errorsPayNext.repayment_id) {
        setErrorMessage(errorsPayNext.repayment_id[0]);
      } else if (errorsPayNext.payment_method_id) {
        setErrorMessage(
          "We are unable to find this payment method in your account. Please check if the payment method is still valid, or use another payment method."
        );
      } else {
        setErrorMessage(
          "An error occurred when making the payment. Please try again."
        );
      }
    }
  }, [errorsPayNext]);

  useEffect(() => {
    if (
      updatePaymentTransactionResponse &&
      updatePaymentTransactionResponse.repayment &&
      updatePaymentTransactionResponse.repayment.payment_transaction &&
      updatePaymentTransactionResponse.repayment.payment_transaction.status &&
      updatePaymentTransactionResponse.repayment.payment_transaction.status ===
        "success"
    ) {
      // todo
      //   setPaymentTransactionLocalDb(updatePaymentTransactionResponse);
      // todo nav to success

      resetStatesOrder("updatePaymentTransaction");
      resetStatesOrder("payNext");
      //   pushTransctionHistory(history, orderCode);
      //   history.push("/transaction/success");

      navigation.navigate(TransactionPageRoutes.TransactionReceipt, {
        type: "paynext",
        order: updatePaymentTransactionResponse["data"]["order"],
        repayment: updatePaymentTransactionResponse["data"]["repayment"],
      });
    }
  }, [updatePaymentTransactionResponse]);

  const isLoadingScreen = !(responseOrder && currentRepayment);

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
            children="Today's Payment"
            // marginTop={mscale(13)}
          />
          {!isLoadingScreen && <RenderPayNextDetails data={payment} />}
          <>
            <StyledText
              variant="titleSecondary"
              textAlign="left"
              children="Payment Method"
              marginTop={mscale(13)}
            />
            <SkeletonContent
              containerStyle={{
                flex: 1,
                width: "100%",
                paddingVertical: mscale(10),
              }}
              isLoading={isLoadingScreen}
              // isLoading={!responsePaymentMethodFetch || !draftOrderData}
              //   isLoading={isLoadingBtns || !responsePaymentMethodFetch?.length}
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
                  collapsedPaymentMethod={collapsedPaymentMethod}
                  setCollapsedPaymentMethod={setCollapsedPaymentMethod}
                  cards={responsePaymentMethodFetch}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                  onAddNewPaymentMethod={onAddNewPaymentMethod}
                  presetActivePaymentMethod={
                    (responseOrder &&
                      responseOrder.collection_payment_method) ||
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
        {!isLoadingScreen && (
          <ButtonText
            children={`PAY ${formatAsCurrency(currentRepayment.total_amount)}`}
            onPress={handlePayRepayment}
            disabled={isLoading}
            loading={isLoading}
            marginTop={2}
            marginBottom={10}
          />
        )}
        {/* <ButtonText
            children="BACK"
            onPress={navigation.goBack}
            disabled={isLoadingBtns}
            // loading={isLoadingBtns}
            marginBottom={0}
          /> */}
      </StyledBox>
    </StyledBox>
  );
};

export default TransactionPayNext;
