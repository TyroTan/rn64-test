import React, { useEffect, useRef, useState } from "react";
import { Modalize } from "react-native-modalize";
import * as Device from "expo-device";
import {
  ButtonText,
  OnboardingRequired,
  StyledBox,
  StyledText,
} from "components";
import { View, Image } from "react-native";
import { theme } from "styles/theme";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import type { KycsObject } from "utils/utils-common";
import { useNestedNavigatorStore, useUserStore } from "stores";
import OrderPageRoutes from "./OrderPageRoutes";
import KycsIncompleteNavigator from "navigation/MyInfo/KycsIncompleteNavigator";
import { btns, modals } from "utils/global-texts";
import ModalMoreCredit from "./ModalMoreCredit";
import type { OrderPaymentModalResult } from "./OrderTypes";
import globalObjectLastActionState from "utils/global-object-last-action";

// const imgVerify = require("assets/images/verify-identity.png");

const ModalOrder = ({
  navigation,
  modalState,
  credits,
  draftOrderData,
  executeOpenModal,
  setExecuteOpenModal,
}: {
  navigation: any;
  modalState: OrderPaymentModalResult["response"]["orderPaymentModal"];
  credits: any;
  draftOrderData: any;
  executeOpenModal: boolean;
  setExecuteOpenModal: (props: any) => void;
}) => {
  const { setLoginShowSplash } = useUserStore();

  const refModal = useRef<any>(null);

  const statusBarHeight = getStatusBarHeight(Device);

  // useState(() => {
  //   const tm = setTimeout(() => {
  //     refModal.current?.open();
  // console.log("on open!!", checkedVerifyIdentity, checkedPaymentMethod);
  // setExecuteOpenModal(false);
  // }, 1500);

  //   return () => {
  //     clearTimeout(tm);
  //   };
  // });

  /*

  */
  // *Methods

  const onStartOnboarding = () => {
    // setLoginShowSplash?.({ isOrderDeepLinkParam: false });
    globalObjectLastActionState.set("orderDLToVerify");
    if (modalState === "ModalOnboardingIdentity") {
      navigation.navigate(OrderPageRoutes.MyInfoIntro);
    } else if (modalState === "ModalOnboardingPaymentMethod") {
      navigation.navigate(OrderPageRoutes.AddPaymentMethod);
    }
    return;
  };

  const onCloseModal = () => refModal?.current.close();

  const onDiscardSuccessReturnHome = () => {
    // to showSplash/refresh back to landing page
    // setLoginShowSplash();

    navigation.goBack();
  };

  // *Effects

  useEffect(() => {
    if (executeOpenModal) {
      refModal.current?.open();
      // console.log("on open!!", checkedVerifyIdentity, checkedPaymentMethod);
      setExecuteOpenModal(false);
    }
  }, [executeOpenModal, refModal, setExecuteOpenModal]);

  const ContentOnboarding = (
    <View
      style={{
        paddingBottom: statusBarHeight > 20 ? statusBarHeight : mscale(20),
      }}
    >
      <OnboardingRequired
        credits={credits}
        onStartOnboarding={onStartOnboarding}
      />
    </View>
  );

  const ContentDiscardSuccess = (
    <View
      style={{
        paddingBottom: statusBarHeight > 20 ? statusBarHeight : mscale(20),
      }}
    >
      <StyledBox
        width="100%"
        alignSelf="center"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="stretch"
        borderTopRightRadius={mscale(16)}
        borderTopLeftRadius={mscale(16)}
        padding={5}
      >
        <StyledBox alignSelf="center" width="78%" mb={3}>
          <StyledText mt={5} variant="titleModalBottom">
            Information
          </StyledText>
          <StyledText
            mt={5}
            variant="paragraphModalBottom"
            textAlign="left"
            lineHeight={19}
            mb={2}
            children={modals.orderCancelled}
          />
        </StyledBox>
        <ButtonText onPress={onDiscardSuccessReturnHome} mb={2}>
          {btns.returnHome}
        </ButtonText>
      </StyledBox>
    </View>
  );

  const ContentNoPaymentPlan = (
    <View
      style={{
        paddingBottom: statusBarHeight > 20 ? statusBarHeight : mscale(20),
      }}
    >
      <StyledBox
        width="100%"
        alignSelf="center"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="stretch"
        borderTopRightRadius={mscale(16)}
        borderTopLeftRadius={mscale(16)}
        padding={5}
      >
        <StyledBox alignSelf="center" width="78%" mb={3}>
          <StyledText mt={5} variant="titleModalBottom">
            Information
          </StyledText>
          <StyledText
            mt={5}
            variant="paragraphModalBottom"
            textAlign="left"
            lineHeight={19}
            mb={2}
            children={modals.noPaymentPlan}
          />
        </StyledBox>
        <ButtonText onPress={onCloseModal} mb={2}>
          {btns.returnHome}
        </ButtonText>
      </StyledBox>
    </View>
  );

  let Content = <></>;

  switch (modalState) {
    case "ModalOnboardingIdentity":
    case "ModalOnboardingPaymentMethod":
      Content = ContentOnboarding;
      break;
    case "ModalNoPaymentPlan":
      Content = ContentNoPaymentPlan;
      break;

    case "ModalMoreCredit":
      Content = (
        <ModalMoreCredit
          navigation={navigation}
          order={draftOrderData}
          credits={credits}
          onCloseModal={onCloseModal}
        />
      );
      break;

    case "ModalDiscardSuccess":
      Content = ContentDiscardSuccess;
      break;

    default:
      break;
  }

  // todo - maybe allow panGesture to close the modal, then that would mean the user proceed with purchase
  return (
    <Modalize
      onBackButtonPress={() => false}
      panGestureEnabled={false}
      closeOnOverlayTap={false}
      ref={refModal}
      adjustToContentHeight
    >
      {Content}
    </Modalize>
  );
};

export default ModalOrder;
