import React, { createRef, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Image,
  ImageBackground,
  StatusBar,
} from "react-native";
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
  CardList as StyledCard,
  PrivacyPolicyText,
  ButtonText,
  PaymentPlanCard,
  KeyboardAwareScrollView,
  CardListView,
  SDollarTextComponent,
  StyledMerchantBanner,
  RowItem,
} from "components";
import { theme } from "styles/theme";
// import useAuthStore from "stores/useAuthStore";
// import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Layout from "constants/Layout";
import { useResetScreen } from "hooks";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
// import type { ResponseConfirmOrder } from "./OrderTypes";
import { useNestedNavigatorStore, useUserStore } from "stores";
import globalObjectState from "utils/global-object-per-country-code";
import dayjs from "dayjs";
import { getCardIcon, secureCardNumber } from "utils/utils-common";
import globalObjectLastActionState from "utils/global-object-last-action";
import { CreditRoutes } from "screens/Credit";
import { TransactionPaymentOrder } from "./Transaction";
const imgVisa = require("assets/images/visa-cc.png");
const imgBgConfetti = require("assets/images/bg-confetti.png");
const imgDashedLine = require("assets/images/dashed-line.png");

const styles = StyleSheet.create({
  imgMerchant: {
    width: mscale(74),
    height: mscale(74),
  },
  ovalWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: mscale(-5),
    overflow: "hidden",
    zIndex: 3,
  },
  ovalLeft: {
    height: mscale(30),
    width: mscale(30),
    marginLeft: mscale(-15),
    borderRadius: mscale(15),
    backgroundColor: theme.colors.rn64testBlue,
  },
  ovalRight: {
    marginLeft: mscale(0),
    marginRight: mscale(-15),
  },
  imgBGConfetti: {
    width: "70%",
    marginTop: mscale(-15),
    height: mscale(145),
    marginLeft: "15%",
    zIndex: 3,
  },
  heading: {
    marginTop: mscale(-15),
    width: "100%",
    height: mscale(98),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  dashedline: {
    width: "86%",
    marginLeft: "7%",
    height: mscale(1),
    marginBottom: mscale(5),
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: mscale(20),
    paddingRight: mscale(20),
    paddingTop: mscale(1),
  },
  imgVisa: {
    // height: mscale(48),
    // width: mscale(48),
    // borderWidth: 1,
    height: mscale(50),
    width: mscale(50),
    marginLeft: mscale(-4),
    marginTop: mscale(-4),
    // borderWidth: 1,
  },
});

const RenderPaymentDetailsInstalment = (props: any) => {
  const { formatAsCurrency } = globalObjectState.getLibrary();
  const { order, repayment } = props;

  const cardIcon = getCardIcon(
    repayment.payment_transaction.payment_method.card.brand as
      | "visa"
      | "mastercard"
      | "mc"
  );

  const fieldsArray = [
    {
      key: "Transaction ID",
      value: repayment.payment_transaction.id,
      fieldProps: {
        marginTop: 33,
      },
    },
    { key: "Merchant", value: order.merchant.name },
    {
      key: "Transacted at",
      value: dayjs(repayment.payment_transaction.created_at).format(
        "DD MMM YYYY, hh:mma"
      ),
      fieldProps: { marginBottom: 20 },
    },
    // {
    //   key: "Payment plan",
    //   value: `${formatAsCurrency(
    //     order.selected_payment_plan.instalment_amount
    //   )} / ${order.selected_payment_plan.instalment_frequency}`,
    //   fieldProps: { marginBottom: 20 },
    // },
    // {
    //   key: "Duration",
    //   value: `${order.selected_payment_plan.instalment_count} instalments`,
    //   fieldProps: { marginBottom: 20 },
    // },
    {
      componentContent: (
        <Image source={imgDashedLine} style={styles.dashedline} />
      ),
    },
    {
      key: "Paid Amount",
      value: `${formatAsCurrency(repayment.total_amount)}`,
    },
  ];

  return (
    <>
      {fieldsArray?.map(
        ({ key, value, componentContent, fieldProps }, index) => {
          // if (transactionType === "Payment") {
          //   if (detail.key === "Payment plan" || detail.key === "Duration")
          //     return <Spacer height={10} key={key} />;
          // }
          if (componentContent) {
            return componentContent;
          }

          return (
            <RowItem key={key} label={key} value={value} {...fieldProps} />
          );
        }
      )}
      <RowItem label="Payment method" value="" />
      <View style={styles.row}>
        <Image style={styles.imgVisa} source={cardIcon} resizeMode="contain" />
        <StyledText fontFamily={"PoppinsBold"} fontSize={13} lineHeight={13}>
          {secureCardNumber(
            repayment.payment_transaction.payment_method.card.ending_digits
          )}
        </StyledText>
      </View>
    </>
  );
};

const RenderPaymentDetailsPayLater = (props: any) => {
  // const { formatAsCurrency } = globalObjectState.getLibrary();
  const { order, repayment } = props;

  const cardIcon = getCardIcon(
    (order.collection_payment_method
      ? order.collection_payment_method.card.brand
      : repayment.payment_transaction.payment_method.card.brand) as
      | "visa"
      | "mastercard"
      | "mc"
  );

  const fieldsArray = [
    {
      key: "Transaction ID",
      value: repayment.payment_transaction
        ? repayment.payment_transaction.id
        : repayment.id,
      fieldProps: {
        marginTop: 33,
      },
    },
    { key: "Merchant", value: order.merchant.name },
    {
      key: "Transacted at",
      value: dayjs(repayment.due_at).format("DD MMM YYYY, hh:mma"),
    },
    {
      key: "Payment plan",
      value: "Pay in 30 days",
    },
    {
      key: "Collection date",
      value: dayjs(
        order.repayments
          ? order.repayments[1].due_at
          : repayment.payment_transaction.created_at
      ).format("DD MMM YYYY, hh:mma"),
      fieldProps: { marginBottom: 20 },
    },
    {
      componentContent: (
        <Image source={imgDashedLine} style={styles.dashedline} />
      ),
    },
    {
      key: "Today's payment",
      value: `${repayment.total_amount}`,
    },
  ];

  return (
    <>
      {fieldsArray?.map(
        ({ key, value, componentContent, fieldProps }, index) => {
          // if (transactionType === "Payment") {
          //   if (detail.key === "Payment plan" || detail.key === "Duration")
          //     return <Spacer height={10} key={key} />;
          // }
          if (componentContent) {
            return componentContent;
          }

          return (
            <RowItem key={key} label={key} value={value} {...fieldProps} />
          );
        }
      )}
      <RowItem label="Payment method" value="" />
      <View style={styles.row}>
        <Image style={styles.imgVisa} source={cardIcon} resizeMode="contain" />
        <StyledText fontFamily={"PoppinsBold"} fontSize={13} lineHeight={13}>
          {secureCardNumber(
            order.collection_payment_method
              ? order.collection_payment_method.card.ending_digits
              : repayment.payment_transaction.payment_method.card.ending_digits
          )}
        </StyledText>
      </View>
    </>
  );
};

const RenderPaymentDetails = (props: any) => {
  const { order, repayment } = props ?? {};

  /* instalment */
  if (
    order &&
    order.selected_payment_plan &&
    order.selected_payment_plan.instalment_frequency !== "end_of_month"
  ) {
    return <RenderPaymentDetailsInstalment {...props} />;
  }

  /* paylater */
  if (
    order &&
    order.selected_payment_plan &&
    order.selected_payment_plan.instalment_frequency === "end_of_month"
  ) {
    return <RenderPaymentDetailsPayLater {...props} />;
  }

  return <></>;
};

const TransactionReceiptMain: React.FC<any> = (props: any) => {
  const { type: receiptType, route, navigation, setHeaderProgress } = props;
  const type: TransactionReceiptType = receiptType;

  const {
    order: orderParam,
    repayment,
    paymentMethod: dataPaymentMethod,
  } = route?.params;
  const order: TransactionPaymentOrder = orderParam;

  const { currencySign } = globalObjectState.getLibrary();

  // *Event on focus
  // useResetScreen({
  //   navigation,
  //   onReset: () => {
  //     // setHeaderProgress(0.88);
  //   },
  // });

  // *Events

  // * Handlers - onpress
  const onReturn = () => {
    if (type === "paynext") {
      return navigation.pop(2);
    }
    navigation.goBack();
  };

  const isLoadingBtns = false;

  let paymentAmount =
    repayment &&
    repayment.payment_transaction &&
    repayment.payment_transaction.amount &&
    order &&
    order.merchant &&
    order.merchant.name &&
    order.selected_payment_plan &&
    order.selected_payment_plan.instalment_frequency !== "end_of_month"
      ? repayment.payment_transaction.amount
      : null;

  paymentAmount = paymentAmount
    ? paymentAmount
    : order &&
      order.repayments_total_mount &&
      order.merchant &&
      order.merchant.name &&
      order.selected_payment_plan &&
      order.selected_payment_plan.instalment_frequency === "end_of_month"
    ? order.repayments_total_mount
    : "";

  return (
    <StyledBox
      style={{
        height: "100%",
        paddingTop: getStatusBarHeight(Device) + mscale(10),
        backgroundColor: theme.colors.rn64testBlue,
      }}
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingBottom: mscale(20),
        }}
        extraHeight={200}
      >
        <StatusBar
          backgroundColor={theme.colors.rn64testBlue}
          barStyle="light-content"
        />
        {type === "paynext" ? (
          <StyledText
            variant="title"
            color="#FFF"
            mt={3}
            mb={5}
            fontSize={19}
            lineHeight={19}
          >
            Payment complete!
          </StyledText>
        ) : (
          <></>
        )}
        <StyledMerchantBanner
          style={{ flex: 1, zIndex: 1 }}
          source={{ uri: order.merchant.logo }}
          imgProps={{
            style: styles.imgMerchant,
          }}
        />
        <StyledCard
          variant="cardReceipt"
          width="90%"
          marginTop={mscale(-21)}
          // flex={1}
          // flexDirection="column"
          // justifyContent="flex-start"
        >
          <ImageBackground
            source={imgBgConfetti}
            resizeMode="center"
            imageStyle={styles.imgBGConfetti}
            style={styles.heading}
          >
            <SDollarTextComponent
              value={paymentAmount}
              currencySign={currencySign}
              marginTop={10}
              label={order.merchant.name}
              wrapperProps={{ width: null, alignItems: "center" }}
            />
          </ImageBackground>
          <View style={styles.ovalWrapper}>
            <View style={styles.ovalLeft} />
            <View style={[styles.ovalLeft, styles.ovalRight]} />
          </View>
          <Image source={imgDashedLine} style={styles.dashedline} />

          <RenderPaymentDetails
            type={type}
            order={order}
            repayment={repayment}
          />
          <ButtonText
            onPress={onReturn}
            variant="primaryInverted"
            children="RETURN"
            mt={65}
            mb={4}
          />
        </StyledCard>
      </KeyboardAwareScrollView>
    </StyledBox>
  );
};

const TransactionReceipt = (allProps: any) => {
  if (allProps?.route?.params?.type === "paynext") {
    return <TransactionPayNextReceipt {...allProps} />;
  }
  return <TransactionReceiptMain {...allProps} />;
};

type TransactionReceiptType = "paynext" | "pay";
export const TransactionPayNextReceipt = (allProps: any) => {
  const type: TransactionReceiptType = "paynext";
  return <TransactionReceiptMain {...allProps} type={type} />;
};

export default TransactionReceipt;
