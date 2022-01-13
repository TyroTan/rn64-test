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
import type { KycsObject } from "utils/utils-common";
import { useNestedNavigatorStore, useUserStore } from "stores";
import { cbs, btns } from "utils/global-texts";
import KycsIncompleteNavigator from "navigation/MyInfo/KycsIncompleteNavigator";

// const imgVerify = require("assets/images/verify-identity.png");

const ModalInsufficientCredit = ({
  navigation,
  executeOpenModal,
  setExecuteOpenModal,
}: {
  navigation: any;
  executeOpenModal: boolean;
  setExecuteOpenModal: (bool: boolean) => void;
}) => {
  const { setLoginShowSplash } = useUserStore();

  const refModal = useRef<any>(null);

  const statusBarHeight = getStatusBarHeight(Device);

  // *Methods

  const onStartOnboarding = () => {
    return;
  };

  // *Effects

  useEffect(() => {
    if (executeOpenModal) {
      refModal.current?.open();
      // console.log("on open!!", checkedVerifyIdentity, checkedPaymentMethod);
      setExecuteOpenModal(false);
    }
  }, [executeOpenModal, refModal, setExecuteOpenModal]);

  const Content = (
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
            Your purchase requires more credit
          </StyledText>
          <StyledText
            mt={5}
            variant="paragraphModalBottom"
            textAlign="left"
            lineHeight={19}
            mb={2}
            children={`Payment plans for this purchase require at least {minCredit} of credit.`}
          />
          <StyledText
            mt={2}
            variant="paragraphModalBottom"
            textAlign="left"
            numberOfLines={3}
            lineHeight={19}
            mb={2}
            children={`You may apply for an increase in credit to proceed. {or} Please contact us if you still need additional credit.`}
          />
        </StyledBox>
        <ButtonText onPress={() => {}} mb={2}>
          {btns.contactUs}
        </ButtonText>
      </StyledBox>
    </View>
  );

  return (
    <Modalize ref={refModal} adjustToContentHeight>
      {Content}
    </Modalize>
  );
};

export default ModalInsufficientCredit;
