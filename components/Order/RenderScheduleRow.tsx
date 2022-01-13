import React, { useEffect, useState } from "react";
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { theme } from "styles/theme";
import { mscale } from "utils/scales-util";
import CheckCircle from "components/CheckCircle";
import StyledBox from "components/StyledBoxes";
import StyledText from "components/StyledTexts";
import { ButtonTextSmall } from "components/StyledButtons";
import Layout from "constants/Layout";
import globalObjectState from "utils/global-object-per-country-code";
import { advancedDayjs, checkIsToday } from "utils/date-utils";
import { ordinalSuffix } from "utils/js-utils";
const imgCheck = require("assets/images/white-check.png");
const imgCheckBlue = require("assets/images/blue-check.png");

const styles = StyleSheet.create({
  wrapper: {
    // flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "flex-start",
  },
  wrapperItem: {
    // flexDirection: "row",
    // justifyContent: "flex-start",
    // alignItems: "center",
    // width: "100%",
    // borderWidth: 1,
  },
  item: {
    width: Layout.screen.width - mscale(55),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderLeftWidth: mscale(2),
    borderColor: theme.colors.typography.gray6,
    height: mscale(50),
    borderWidth: 2,
    // overflow: "hidden",
    // width: mscale(2),
  },
  last: {
    borderColor: "transparent",
  },
});

const StepItem = (propsAll: any) => {
  const {
    variant,
    last,
    index,
    payment,
    selectedPaymentMethod,
    ...wrapperProps
  } = propsAll;

  const { formatAsCurrency } = globalObjectState.getLibrary();
  const { sequence, due_at, total_amount } = payment;

  const [isToday, setIsToday] = useState(false);
  const [isOverdue, setIsOverdue] = useState(false);
  const [canPay, setCanPay] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // *Methods

  const getPaymentDateColor = () => {
    return canPay && !isOverdue
      ? theme.colors.buttons.marineBlue
      : canPay && isOverdue
      ? theme.colors.typography.red1
      : paymentStatus === "collect_success"
      ? theme.colors.typography.gray7
      : isToday
      ? theme.colors.buttons.marineBlue
      : "#191919";
  };

  const getPaymentDate = () => {
    return isToday
      ? "Today"
      : canPay && isOverdue
      ? `${advancedDayjs(due_at).format("Do MMM YYYY")} (Overdue)`
      : advancedDayjs(due_at).format("Do MMM YYYY");
  };

  const renderPaymentAmount = () => {
    if (!canPay) {
      return (
        <StyledText
          color={
            paymentStatus === "collect_success"
              ? theme.colors.lockGray
              : "black"
          }
          variant="titleSecondarySemi"
          textDecoration={
            paymentStatus === "collect_success" ? "line-through" : "none"
          }
        >{`${formatAsCurrency(total_amount)}`}</StyledText>
      );
    } else {
      return (
        <ButtonTextSmall
          variant={isOverdue ? "secondarySmall" : "primary"}
          disabled={!selectedPaymentMethod}
          children={`${formatAsCurrency(total_amount)}`}
        />
      );
    }
  };

  // *Effects
  useEffect(() => {
    setIsToday(checkIsToday(due_at));
    setIsOverdue(payment.state === "overdue");
  }, []);

  useEffect(() => {
    if (payment && payment.state) {
      setPaymentStatus(payment.state);
      setCanPay(payment.can_pay);
    }
  }, [payment]);

  const placementText = `${sequence + 1}${ordinalSuffix(sequence + 1)} payment`;

  return (
    <StyledBox
      variant="flexcr"
      justifyContent="space-between"
      {...wrapperProps}
    >
      <CheckCircle
        style={{
          // marginLeft: mscale(-10),
          // marginTop: mscale(10),
          // zIndex: 1,
          backgroundColor: theme.colors.background2,
        }}
        size={mscale(20)}
        variant={variant}
      />
      <StyledBox
        flex={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
      >
        <StyledText
          //   color={theme.colors.buttons.marineBlue}
          color={getPaymentDateColor()}
          variant="titleTertiary"
        >
          {getPaymentDate()}
        </StyledText>
        <StyledText variant="paragraphSmallest">{placementText}</StyledText>
      </StyledBox>
      {/* <StyledText variant="titleSecondarySemi"> */}
      {renderPaymentAmount()}
      {/* </StyledText> */}
    </StyledBox>
  );
};

const getVariantByIndex = (
  position: number,
  current: {
    index: number;
    overdue?: boolean;
    mode?: "greenThemed";
  }
) => {
  const { index: currentIndex, overdue, mode } = current;
  const isGreenThemed = mode === "greenThemed";

  if (position < currentIndex) {
    return isGreenThemed ? "green" : "blue";
  } else if (position === currentIndex) {
    if (overdue) {
      return "redInverted";
    }

    return isGreenThemed ? null : "blueInverted";
  } else {
    return null;
  }
};

const RenderScheduleRow = (allProps: any) => {
  const {
    style,
    current: currentProps = 0,

    repayments,
    orderCode,
    isLoading,
    selectedPaymentMethod,
  } = allProps;
  const contentsLength = repayments?.length ?? 0;
  const current =
    typeof currentProps === "number"
      ? {
          index: currentProps,
        }
      : {
          index: currentProps.index,
          overdue: currentProps.overdue,
          mode: currentProps?.mode,
        };

  return (
    <View style={[styles.wrapper, style]}>
      {repayments?.map((payment: any, i: number) => (
        <>
          <StepItem
            last={i + 1 === contentsLength}
            variant={getVariantByIndex(i, current)}
            index={i}
            payment={payment}
            //   orderCode={orderCode}
            //   isLoading={isLoading}
            selectedPaymentMethod={selectedPaymentMethod}
          />
        </>
      )) ?? <></>}
    </View>
  );
};

export default RenderScheduleRow;
