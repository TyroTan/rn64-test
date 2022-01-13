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

const ModalExpiredIdentity = ({
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
            Verification update required
          </StyledText>
          <StyledText
            mt={5}
            variant="paragraphModalBottom"
            textAlign="left"
            lineHeight={19}
            mb={2}
            children={`You have to update your verification before you can continue the purchase`}
          />
        </StyledBox>
        <ButtonText onPress={() => {}} mb={2}>
          {btns.verify}
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

export default ModalExpiredIdentity;
