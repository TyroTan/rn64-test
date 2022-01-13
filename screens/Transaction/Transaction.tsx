import React, { useMemo, useEffect, useState } from "react";
import { StyleSheet, View, Platform, Image } from "react-native";
import { useFetchPalletes } from "./useFetchPalletes";
import type { OngoingTransactionOrder } from "./useFetchPalletes";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  PrivacyPolicyText,
  ButtonText,
  PaymentPlanCard,
  KeyboardAwareScrollView,
  RowItem,
  Card,
  SwitchTabBtns,
  StepsVertical,
  ButtonTextSmall,
  CheckCircle,
  ProgressCircleLayered,
  Arc,
  CardListView,
  CardListItemDivider,
  HeaderLeft,
} from "components";
import { theme } from "styles/theme";
// import useAuthStore from "stores/useAuthStore";
// import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Layout from "constants/Layout";
import { useResetScreen } from "hooks";
import { useBuyerStore, useOrderStore } from "stores";
import globalObjectLastActionState from "utils/global-object-last-action";
import type { ResponseFetchOrder } from "screens/Order/OrderTypes";
import globalObjectState from "utils/global-object-per-country-code";
import { RenderPaymentMethodSelect } from "components/RenderPaymentMethodSelect";
import type { CardItem } from "components/RenderPaymentMethodSelect";
import SkeletonContent from "components/SkeletonContent";
import { TransactionPageRoutes } from "./TransactionPageRoutes";
import { getCardIcon, getGenericSkeletonConfig } from "utils/utils-common";
import { ordinalSuffix } from "utils/js-utils";
import { advancedDayjs } from "utils/date-utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import PaymentSchedule from "components/Order/PaymentSchedule";
// import { RenderUpcomingPayments } from "./LandingWithUpcoming";
// const imgVisa = require("assets/images/visa-cc.png");
const imgDummyBecome = require("assets/images/dummy-become.png");

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
    marginLeft: mscale(15),
    // borderWidth: 1,
  },
  cardIconSmall: {
    height: mscale(26),
    width: mscale(26),
  },
  btnChevronDown: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: mscale(50),
  },
  imgChevronDown: {
    height: mscale(16),
    width: mscale(15),
  },
  flexcr: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,
    marginLeft: mscale(14),
  },
  btnRow: {
    padding: mscale(16),
  },
});

const BannerOutline = ({ order }: { order?: TransactionPaymentOrder }) => {
  const {
    loading: loadingPalletes,
    palletes,
    percentages,
  } = useFetchPalletes({ order } as { order: TransactionPaymentOrder });

  return (
    <StyledBox variant="flexcr" width="100%">
      <ProgressCircleLayered
        loading={loadingPalletes}
        imgMerchantSrc={{ uri: order?.merchant?.logo }}
        percentages={percentages}
        imgStyle={{
          width: mscale(40),
        }}
        colors={palletes}
      />
    </StyledBox>
  );
};

const BannerMerchant: React.FC<any> = (props) => {
  const { formatAsCurrency } = globalObjectState.getLibrary();
  const {
    data,
    onGoBack,
    onChange,
    secondarySmall = false,
    title = "July 2021",
  } = props;

  const order = data as TransactionPaymentOrder;

  if (!order?.repayments_remaining_amount) {
    // todo - show skeleton instead
    return <></>;
  }

  return (
    <StyledBox
      // marginTop={-mscale(32)}
      alignSelf="center"
      // paddingTop="6.0%"
      paddingHorizontal="3.7%"
      paddingRight="6%"
      paddingBottom={"2%"}
      width={"100%"}
      // LeftHeader={<HeaderLeft onPress={onGoBack} />}
      variant={"card2"}
    >
      <HeaderLeft onPress={onGoBack} />
      <BannerOutline order={order} />
      <StyledBox alignSelf="center">
        <StyledText variant="titleSecondary" textAlign="left">
          {order.merchant.name}
        </StyledText>
      </StyledBox>
      <StyledText variant="title" fontSize={28} lineHeight={30}>
        {formatAsCurrency(order.repayments_remaining_amount)}
      </StyledText>
      <StyledBox alignSelf="center">
        <StyledText
          variant="paragraph"
          fontFamily={"PoppinsSemiBold"}
          fontSize={12}
          textAlign="left"
        >
          of {formatAsCurrency(order.repayments_total_mount)} remaining
        </StyledText>
      </StyledBox>

      <SwitchTabBtns width="90%" marginLeft="5%" onChange={onChange} />
    </StyledBox>
  );
};

export type TransactionPaymentOrder = ResponseFetchOrder["data"];

const RenderTransactionDetails = ({
  data,
  orderCode,
}: {
  data: TransactionPaymentOrder;
  orderCode: string;
}) => {
  // dddebug
  //   orderCode = "ODR-LLCYQVW28PE";

  const navigation = useNavigation();

  const { formatAsCurrency } = globalObjectState.getLibrary();

  // *Effects

  // const didMount = () => {
  //   fetchPaymentMethod(countryCode);
  // };

  // useEffect(() => {
  //   didMount();

  //   return () => {
  //     resetStatesBuyer("paymentMethodFetch");
  //     resetStatesOrder("updatePaymentMethod");
  //   };
  // }, []);

  const paymentMethod = data.collection_payment_method;
  const plan = data.selected_payment_plan;
  const repayments = data?.repayments ?? [];
  const successRepayments =
    repayments?.filter((r) => r.state === "collect_success") ?? [];

  return (
    <StyledBox marginX={8}>
      <StyledText
        variant="titleSecondary"
        textAlign="left"
        marginBottom={3}
        marginTop={2}
      >
        Selected Plan
      </StyledText>
      {/* todo - show skeleton when loading, or data is not there yet */}
      {data?.merchant ? (
        <PaymentPlanCard
          key={plan.payment_plan_def_id}
          planKey={plan.payment_plan_def_id}
          // setSelectedPlan={setSelectedPlan}
          // marginTop={index ? 3 : 0}
          // active={true}
          plan={plan}
        />
      ) : (
        <></>
      )}
      <StyledText
        variant="titleSecondary"
        textAlign="left"
        marginBottom={3}
        marginTop={2}
      >
        Transaction receipts
      </StyledText>

      <CardListView flexDirection="column" padding={0} margin={0}>
        {successRepayments.map((repayment, i) => {
          const lastItem = i + 1 === successRepayments?.length;

          const { total_amount, sequence, payment_transaction } = repayment;

          const cardIcon = payment_transaction
            ? getCardIcon(
                payment_transaction
                  ? payment_transaction.payment_method.card.brand
                  : ("" as any)
              )
            : getCardIcon(paymentMethod.card.brand as any);

          const placementText = `${sequence + 1}${ordinalSuffix(
            sequence + 1
          )} payment`;
          const paidText = `Paid ${advancedDayjs(
            payment_transaction ? payment_transaction.created_at : data.due_at
          ).format("Do MMM YYYY hh:mma")}`;

          const onRowPress = () => {
            // TransactionPageRoutes.PaymentReceipt
            navigation.navigate(
              TransactionPageRoutes.TransactionReceipt as any,
              {
                order: data,
                repayment: repayment,
                paymentMethod: paymentMethod,
              }
            );
          };

          return (
            <TouchableOpacity
              onPress={onRowPress}
              style={[
                styles.btnRow,
                lastItem ? {} : { paddingBottom: mscale(5) },
              ]}
            >
              <StyledBox
                variant="flexcr"
                justifyContent="space-between"
                width="100%"
              >
                <StyledText variant="titleSecondary">
                  {data.merchant.name}
                </StyledText>
                <StyledText variant="titleSecondary">
                  {formatAsCurrency(total_amount)}
                </StyledText>
              </StyledBox>
              <StyledBox
                variant="flexcr"
                justifyContent="space-between"
                width="100%"
              >
                <StyledText variant="paragraphSmallest">
                  {placementText}
                </StyledText>
                {/* <StyledText variant="titleSecondary">S$3.50</StyledText> */}
              </StyledBox>
              <StyledBox
                variant="flexcr"
                justifyContent="space-between"
                width="100%"
                marginBottom={5}
              >
                <StyledText variant="paragraphSmallest">{paidText}</StyledText>

                <StyledBox variant="flexcr">
                  <Image
                    style={styles.cardIconSmall}
                    source={cardIcon}
                    resizeMode="contain"
                  />
                  <StyledText variant="paragraphSmallest">
                    {`  **** ${
                      payment_transaction
                        ? payment_transaction.payment_method.card.ending_digits
                        : paymentMethod.card.ending_digits
                    }`}
                  </StyledText>
                </StyledBox>
              </StyledBox>
              {!lastItem && <CardListItemDivider />}
            </TouchableOpacity>
          );
        }) ?? <></>}
      </CardListView>
    </StyledBox>
  );
};

const { width: layoutScreenWidth, height: layoutScreenHeight } = Layout.screen;

const RenderTransactionPayment = ({
  navigation,
  data,
}: //   orderCode,
{
  navigation: any;
  data: TransactionPaymentOrder;
  //   orderCode: string;
}) => {
  const { code: orderCode } = data;

  console.log("rendertranspaymentdata ", data);
  const { countryCode } = globalObjectState.getLibrary();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    null | TransactionPaymentOrder["collection_payment_method"]
  >(null);
  const [collapsedPaymentMethod, setCollapsedPaymentMethod] = useState(false);

  const {
    response: { paymentMethodFetch: paymentMethodFetchResponse },
    errors: { paymentMethodFetch: paymentMethodFetchError },
    resetStates: resetStatesBuyer,
    fetchPaymentMethod,
  } = useBuyerStore();

  const {
    isLoading: { updatePaymentMethod: updatePaymentMethodIsLoading },
    response: { updatePaymentMethod: updatePaymentMethodResponse },
    errors: { updatePaymentMethod: updatePaymentMethodError },
    resetStates: resetStatesOrder,
    updatePaymentMethod,
    fetchOrder,
  } = useOrderStore();

  // *Effects
  // useEffect(() => {
  // todo - fix causes rerender per tab visit
  // fetchPaymentMethod(countryCode);

  //   return () => {
  //     resetStatesBuyer("paymentMethodFetch");
  //     resetStatesOrder("updatePaymentMethod");
  //   };
  // }, []);

  useEffect(() => {
    if (data && data.collection_payment_method) {
      setSelectedPaymentMethod(data.collection_payment_method);
    }
  }, [data]);

  useEffect(() => {
    if (
      selectedPaymentMethod &&
      data &&
      data.code &&
      data.collection_payment_method &&
      data.collection_payment_method.id
    ) {
      const orderCode = data.code;
      const presetPaymentMethodId = data.collection_payment_method.id;
      const paymentMethodId = selectedPaymentMethod.id;

      if (presetPaymentMethodId !== paymentMethodId)
        updatePaymentMethod(orderCode, paymentMethodId);
    }
  }, [selectedPaymentMethod]);

  useEffect(() => {
    if (updatePaymentMethodResponse && updatePaymentMethodResponse.success) {
      fetchOrder(orderCode);
      resetStatesOrder("updatePaymentMethod");
    }
  }, [updatePaymentMethodResponse]);

  const onAddNewPaymentMethod = () => {
    globalObjectLastActionState.set("fromTransactionItem");
    navigation.navigate(TransactionPageRoutes.AddPaymentMethod);
  };

  const onPayBtnPress = (payment: any) => {
    navigation.navigate(TransactionPageRoutes.TransactionPayNext, {
      orderCode,
      selectedPaymentMethodId: selectedPaymentMethod?.id,
      payment,
    });
  };

  /*if (!paymentMethodFetchResponse || !data) {
    return (
      <SkeletonContent
        containerStyle={{ flex: 1, width: 300 }}
        isLoading={true}
        layout={getGenericSkeletonConfig({
          layoutScreenHeight,
          layoutScreenWidth,
        })}
      >
        {/ * <Text style={styles.normalText}>Your content</Text>
            <Text style={styles.bigText}>Other content</Text> * /}
      </SkeletonContent>
    );
  }*/

  return (
    <StyledBox
      flex={1}
      width="100%"
      paddingX={8}
      // alignItems="center"
    >
      <StyledText
        variant="titleSecondary"
        textAlign="left"
        children="Payment Method"
        mb={2}
      />
      {/* <CardListView
        width="100%"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        paddingVertical={2}
      >
        <Image style={styles.imgVisa} source={imgVisa} resizeMode="contain" />
        <View style={styles.flexcr}>
          <StyledText variant="titleSecondary" marginTop={4} lineHeight={14}>
            Debit Card
          </StyledText>
          <StyledText
            variant="paragraph"
            fontSize={14}
            lineHeight={17}
            marginBottom={mscale(6)}
          >
            **** **** **** 6874
          </StyledText>
        </View>
      </CardListView> */}

      <SkeletonContent
        containerStyle={{ flex: 1, width: "100%" }}
        isLoading={!paymentMethodFetchResponse || !data}
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
            cards={paymentMethodFetchResponse ?? []}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            onAddNewPaymentMethod={onAddNewPaymentMethod}
            presetActivePaymentMethod={
              (data && data.collection_payment_method) || null
            }
            //   saveCurrentUrl
            //   useNewPaymentMethod={useNewPaymentMethod}
          />
        </CardListView>
      </SkeletonContent>
      <StyledText
        variant="titleSecondary"
        textAlign="left"
        children="Payment Plan"
        mt={2}
        mb={2}
      />
      <PaymentSchedule
        //   current={5}
        onPayBtnPress={onPayBtnPress}
        repayments={data && data.repayments}
        // orderCode={orderCode}
        //   isLoading={updatePaymentMethodIsLoading}
        isLoading={false}
        selectedPaymentMethod={selectedPaymentMethod}
      />
    </StyledBox>
  );
};

const Transaction: React.FC<any> = (props: any) => {
  const { countryCode } = globalObjectState.getLibrary();
  const { action, data: dataOrderCode } = globalObjectLastActionState.get();

  const { orderCode } = props?.route?.params
    ? props?.route?.params
    : action === "fromPaymentReceipt" && dataOrderCode?.orderCode
    ? dataOrderCode
    : ({} as any);
  // dddebug
  //   const orderCode = "ODR-LLCYQVW28PE";

  const { route, navigation, setHeaderProgress } = props;
  const [activeTab, setActiveTab] = useState(0);

  // persists if navigating back from the next screen (...PayNext.tsx), not previous
  const [isScreenInMemory, setIsScreenInMemory] = useState(false);

  const {
    isLoading: { order: isLoadingOrder },
    response: { order: responseOrder },
    errors: { order: errorOrder },
    resetStates: resetStatesOrder,
    fetchOrder,
  } = useOrderStore();

  const {
    fetchPaymentMethod,
    resetStates: resetStatesBuyer,
    isLoading: { paymentMethodFetch: isLoadingPaymentMethod },
    response: {
      credits: responseCredits,
      paymentMethodFetch: responsePaymentMethodFetch,
    },
  } = useBuyerStore();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<CardItem>();

  // *Event on focus

  const didMount = () => {
    if (isScreenInMemory) {
      return;
    }

    setIsScreenInMemory(true);
    resetStatesOrder("order");

    resetStatesBuyer("paymentMethodFetch");
    resetStatesOrder("updatePaymentMethod");

    fetchOrder(orderCode);
    fetchPaymentMethod(countryCode);
  };

  useResetScreen({
    navigation,
    onReset: () => {
      const { action } = globalObjectLastActionState.get();
      globalObjectLastActionState.resetAfterUse();
      if (action === "fromTransactionItemPaymentMethodSuccess") {
        // didMount();
        // todo - show alert when failed?
      } else if (action === "fromTransactionItemPaymentMethodFailed") {
      }

      // always call didmount on focus but isScreenInMemory handles the caching logic
      didMount();
    },
  });

  const isIOS = Platform.OS === "ios";
  const { width } = Layout.screen;

  // *Events

  // * Handlers - onpress
  const onGoBack = () => {
    navigation.goBack();
  };

  // *Effects
  useEffect(() => {
    // didMount();
    return () => resetStatesOrder("order");
  }, []);

  const onNext = () => navigation.navigate("NAVTEST5");
  const isLoadingBtns = false;

  const PaymentTab = useMemo(() => {
    if (!responseOrder) {
      return (
        <SkeletonContent
          containerStyle={{ flex: 1, width: 300 }}
          isLoading={true}
          layout={[
            {
              key: "banner",
              width: layoutScreenWidth * 0.5,
              marginTop: layoutScreenHeight * 0.05,
              marginLeft: layoutScreenWidth * 0.25,
              height: layoutScreenHeight * 0.2,
            },
            {
              key: "tabs",
              marginTop: layoutScreenHeight * 0.02,
              width: layoutScreenWidth * 0.7,
              marginLeft: layoutScreenWidth * 0.15,
              height: layoutScreenHeight * 0.06,
            },
            {
              key: "paymentMethod",
              marginTop: layoutScreenHeight * 0.02,
              width: layoutScreenWidth * 0.8,
              marginLeft: layoutScreenWidth * 0.1,
              height: layoutScreenHeight * 0.1,
            },
            {
              key: "content1",
              marginTop: layoutScreenHeight * 0.02,
              width: layoutScreenWidth * 0.7,
              marginLeft: layoutScreenWidth * 0.1,
              height: layoutScreenHeight * 0.05,
            },
            {
              key: "content2",
              marginTop: layoutScreenHeight * 0.02,
              width: layoutScreenWidth * 0.6,
              marginLeft: layoutScreenWidth * 0.1,
              height: layoutScreenHeight * 0.05,
            },
            {
              key: "content3",
              marginTop: layoutScreenHeight * 0.02,
              width: layoutScreenWidth * 0.5,
              marginLeft: layoutScreenWidth * 0.1,
              height: layoutScreenHeight * 0.04,
            },
          ]}
        >
          {/* <Text style={styles.normalText}>Your content</Text>
              <Text style={styles.bigText}>Other content</Text> */}
        </SkeletonContent>
      );
    }
    if (activeTab === 1) {
      return (
        <RenderTransactionDetails orderCode={orderCode} data={responseOrder} />
      );

      // dddebug
    } else if (!activeTab) {
      //   return (
      //     <PaymentSchedule
      //       //   current={5}
      //       repayments={responseOrder && responseOrder.repayments}
      //       orderCode={`orderCode`}
      //       //   isLoading={updatePaymentMethodIsLoading}
      //       isLoading={false}
      //       selectedPaymentMethod={selectedPaymentMethod}
      //     />
      //   );
    }

    return (
      <RenderTransactionPayment navigation={navigation} data={responseOrder} />
    );
  }, [activeTab, responseOrder, responsePaymentMethodFetch]);

  const Content = PaymentTab;

  return (
    <KeyboardAwareScrollView contentContainerStyle={{}}>
      <StyledSafeAreaView flex={1} height="100%">
        <BannerMerchant
          data={responseOrder}
          onGoBack={onGoBack}
          onChange={setActiveTab}
        />
        {Content}
      </StyledSafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default Transaction;
