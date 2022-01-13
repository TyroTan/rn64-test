import React, { useEffect, useRef, useState } from "react";
import { Modalize } from "react-native-modalize";
import * as Device from "expo-device";
import {
  ButtonText,
  OnboardingRequired,
  StyledBox,
  StyledText,
} from "components";
import { View } from "react-native";
import { theme } from "styles/theme";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import { btns } from "utils/global-texts";
import {
  checkAllKycsCompleted,
  checkForInsufficientCredit,
  findMinDownpayment,
} from "utils/utils-common";
import { OrderState } from "./OrderTypes";
import globalObjectState from "utils/global-object-per-country-code";
import globalObjectLastActionState from "utils/global-object-last-action";
import OrderPageRoutes from "./OrderPageRoutes";

// const imgVerify = require("assets/images/verify-identity.png");

const ModalMoreCredit = ({
  onCloseModal,
  order,
  credits,
  navigation,
}: {
  onCloseModal: () => void;
  order: OrderState;
  credits: any;
  navigation: any;
}) => {
  const { formatAsCurrency } = globalObjectState.getLibrary();
  const statusBarHeight = getStatusBarHeight(Device);
  const allKycsCompleted =
    credits?.kycs?.length > 0 ? checkAllKycsCompleted(credits.kycs) : false;
  const allowAdditionalDataKycCheck =
    !!credits?.can_allow_additional_data_kyc_check;

  let minCredit = "0.00",
    minDownpayment = "";
  if (order.available_payment_plans) {
    if (order.available_payment_plans.length === 0) {
      minCredit = "0.00";
      return;
    } else {
      const { insufficientCredit, minSufficientCreditAmount } =
        checkForInsufficientCredit(order.available_payment_plans);

      minCredit = minSufficientCreditAmount;
    }
    minDownpayment = findMinDownpayment(order.available_payment_plans);
  }

  const onProceedPurchase = () => {
    globalObjectLastActionState.resetBeforeUse();
    globalObjectLastActionState.set("modalProceedPurchase");
    onCloseModal();
  };

  const onContactUs = () => {};

  const onApplyMoreCreditOrManualReview = () => {
    globalObjectLastActionState.resetBeforeUse();
    globalObjectLastActionState.set("orderDLToManualReview");
    navigation.navigate(OrderPageRoutes.ManualReview);
  };

  return (
    <View
      style={{
        paddingBottom: statusBarHeight > 20 ? statusBarHeight : mscale(20),
      }}
    >
      <StyledBox
        width="100%"
        borderTopRightRadius={mscale(16)}
        borderTopLeftRadius={mscale(16)}
        alignSelf="center"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <StyledBox alignSelf="center" width="78%" mb={5}>
          <StyledText mt={5} variant="titleModalBottom">
            Apply for more credit?
          </StyledText>
          <StyledText
            mt={5}
            variant="paragraphModalBottom"
            textAlign="left"
            lineHeight={19}
            mb={2}
          >
            Full instalment payment plans require at least{" "}
            <StyledText
              variant="title"
              fontSize={14}
              lineHeight={19}
              color={theme.colors.typography.gray1}
            >
              {formatAsCurrency(minCredit)}
            </StyledText>{" "}
            of credit for this purchase.
          </StyledText>
          <StyledText
            mt={2}
            variant="paragraphModalBottom"
            textAlign="left"
            numberOfLines={3}
            lineHeight={19}
            mb={2}
            children={`You may either:`}
          />
          <StyledText
            mt={2}
            variant="paragraphModalBottom"
            textAlign="left"
            numberOfLines={3}
            lineHeight={19}
            mb={2}
            children={`1) Request for a manual review with us, or {or} 1) Apply for an increase in credit with us, or`}
          />
          <StyledText
            mt={2}
            variant="paragraphModalBottom"
            textAlign="left"
            numberOfLines={3}
            lineHeight={19}
            mb={2}
          >
            2) Proceed with a downpayment of
            <StyledText
              variant="title"
              fontSize={14}
              lineHeight={19}
              color={theme.colors.typography.gray1}
            >
              {formatAsCurrency(minDownpayment)}
            </StyledText>
          </StyledText>
        </StyledBox>
        {allKycsCompleted ? (
          <ButtonText onPress={onContactUs} mb={2}>
            {btns.contactUs}
          </ButtonText>
        ) : (
          <ButtonText onPress={onApplyMoreCreditOrManualReview} mb={2}>
            {`${
              allowAdditionalDataKycCheck
                ? btns.manualReview
                : btns.applyMoreCredit
            }`}
          </ButtonText>
        )}
        <ButtonText
          variant="primaryInverted"
          onPress={onProceedPurchase}
          mb={2}
        >
          {btns.proceedPurchase}
        </ButtonText>
      </StyledBox>
    </View>
  );
};

export default ModalMoreCredit;
