import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { ButtonText, StyledText } from "components";
import { StyledBox } from "components";
import { hexToRGB } from "utils/hex-util";
import { btns } from "utils/global-texts";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import * as Device from "expo-device";

const TransactionModal = (allProps: any) => {
  const { route, navigation } = allProps ?? {};
  const {
    errorMessage = "An error occurred when making the payment. Please try again.",
  } = route?.params ?? {};
  const modalizeRef = useRef<any>(null);

  const onClose = () => {
    modalizeRef?.current?.close();
    // setTimeout(() => {
    //   navigation.goBack();
    // }, 0);
  };

  const onClosed = () => {
    setTimeout(() => {
      navigation.goBack();
    }, 0);
  };

  useEffect(() => {
    modalizeRef?.current?.open();
  }, []);

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: "100%",
        backgroundColor: hexToRGB("#4F4F4F", 0.58),
      }}
    >
      <Modalize
        // alwaysOpen={1}
        ref={modalizeRef}
        adjustToContentHeight
        onClosed={onClosed}
        // onBackButtonPress={() => false}
        // panGestureEnabled={false}
        // closeOnOverlayTap={false}
      >
        <StyledBox
          width="88%"
          alignSelf="center"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="stretch"
          padding={5}
          marginBottom={mscale(20)}
        >
          <StyledBox>
            <StyledText mt={5} variant="titleModalBottom">
              Information
            </StyledText>
          </StyledBox>
          <StyledText
            mt={7}
            variant="paragraphModalBottom"
            textAlign="left"
            mb={7}
          >
            {errorMessage}
          </StyledText>
          <ButtonText onPress={onClose}>{btns.okay}</ButtonText>
        </StyledBox>
      </Modalize>
    </View>
  );
};

export default TransactionModal;
