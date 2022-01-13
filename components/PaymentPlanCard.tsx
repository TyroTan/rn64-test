import React, { useCallback, useEffect } from "react";

import styled from "styled-components/native";
import {
  variant,
  border,
  compose,
  layout,
  flexbox,
  color,
  space,
} from "styled-system";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import StyledBox from "./StyledBoxes";
import { theme } from "styles/theme";
import type { CSSProps } from "types";
import { mscale } from "utils/scales-util";
import { useWalkthroughOverlay } from "hooks";
import type { OrderPaymentPlan } from "screens/Order/OrderTypes";
import { useUserStore } from "stores";
import globalObjectState from "utils/global-object-per-country-code";

const isIOS = Platform.OS === "ios";
const PaymentPlanCardView = styled.View`
  background-color: ${(props: CSSProps) => {
    return props.theme.colors.background2;
  }};

  ${variant({
    variants: {
      card: {
        width: "100%",
        marginBottom: mscale(17),
        alignSelf: "center",
        borderRadius: mscale(12),

        shadowColor: isIOS ? "rgba(0, 0, 0, 0.65)" : "rgba(0, 0, 0, .6)",
        // shadowOffset: {
        //   width: mscale(20),
        //   height: mscale(0),
        // },
        shadowOffset: "0 2px",
        shadowOpacity: 0.26,
        shadowRadius: mscale(2),
        elevation: 9,
      },
    },
  })}

  ${compose(border, space, layout, flexbox, color)};
`;

PaymentPlanCardView.defaultProps = {
  variant: "card",
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: mscale(12),
    borderWidth: mscale(2),
    borderColor: "transparent",
  },
  active: {
    backgroundColor: "#F1F7FF",
    borderColor: theme.colors.buttons.marineBlue,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: mscale(18),
    paddingTop: mscale(15),
  },
  body: {
    paddingTop: mscale(14),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontFamily: "PoppinsBold",
    paddingTop: mscale(Platform.OS === "ios" ? 0 : 10),
    fontSize: mscale(26),
    lineHeight: mscale(32),
  },
  headerSubText: {
    fontFamily: "Poppins",
    fontSize: mscale(16),
    lineHeight: mscale(22),
  },
  headerRightText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: mscale(13.5),
    lineHeight: mscale(23.5),
    color: theme.colors.lockGray,
  },
  columnWrapper: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: mscale(18),
    paddingBottom: mscale(15),
  },
  columnWrapper2: {
    flex: 4,
  },
  columnHeaderText: {
    fontFamily: "Poppins",
    fontSize: mscale(11),
    lineHeight: mscale(15),
  },
  value: {
    paddingTop: mscale(2),
    fontFamily: "Poppins",
    fontSize: mscale(11),
    lineHeight: mscale(15),
    color: theme.colors.typography.gray1,
  },
});

const PaymentPlanCard = (allProps: any) => {
  const {
    planKey,
    setSelectedPlan,
    active,
    title,
    children,
    onMeasureInWindow,
    ...props
  } = allProps;

  const { formatAsCurrency } = globalObjectState.getLibrary();
  const plan: OrderPaymentPlan = allProps.plan;
  const r = React.useRef(null);
  useWalkthroughOverlay(onMeasureInWindow, r);

  const {
    instalment_amount,
    instalment_count,
    instalment_frequency,
    downpayment_amount,
    instalment_processing_fee_amount,
    total_amount,
  } = plan;

  // *Events
  const onPress = useCallback(() => {
    setSelectedPlan?.(plan);
  }, [planKey]);

  // *Methods
  const convertInstalmentFrequencyText = (instalment_frequency: string) => {
    switch (instalment_frequency) {
      case "monthly":
        return "months";
      case "weekly":
        return "weeks";
      case "biweekly":
        return "times every 2 weeks";
      case "end_of_month":
        return "Pay Later";
      default:
        return "";
    }
  };

  const convertRepaymentFrequencyText = (instalment_frequency: string) => {
    switch (instalment_frequency) {
      case "monthly":
        return "/mth";
      case "weekly":
        return "/week";
      case "biweekly":
        return "/2 weeks";
      default:
        return "";
    }
  };

  const repaymentFrequencyText =
    convertRepaymentFrequencyText(instalment_frequency);

  const WrapperElement: any = !!setSelectedPlan ? TouchableOpacity : View;

  return (
    <WrapperElement onPress={onPress}>
      <PaymentPlanCardView key={planKey} {...props} ref={r}>
        <View style={[styles.wrapper, active ? styles.active : {}]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {formatAsCurrency(instalment_amount)}
              <Text style={styles.headerSubText}>{repaymentFrequencyText}</Text>
            </Text>
            <Text style={styles.headerRightText}>
              {instalment_count}{" "}
              {convertInstalmentFrequencyText(instalment_frequency)}
            </Text>
          </View>
          <View style={styles.body}>
            <View style={styles.columnWrapper}>
              <Text style={styles.columnHeaderText}>Downpayment</Text>
              <Text style={styles.value}>
                {formatAsCurrency(downpayment_amount)}
              </Text>
            </View>

            <View style={[styles.columnWrapper, styles.columnWrapper2]}>
              <Text style={styles.columnHeaderText}>
                Processing fee{repaymentFrequencyText}
              </Text>
              <Text style={styles.value}>
                {formatAsCurrency(instalment_processing_fee_amount)}
              </Text>
            </View>

            <View style={styles.columnWrapper}>
              <Text style={styles.columnHeaderText}>Total</Text>
              <Text style={styles.value}>{formatAsCurrency(total_amount)}</Text>
            </View>
          </View>
        </View>
      </PaymentPlanCardView>
    </WrapperElement>
  );
};

export default PaymentPlanCard;
