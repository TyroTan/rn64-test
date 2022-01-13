import React, { createRef, useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  ButtonText,
  SuccessConfetti,
} from "components";
import { theme } from "styles/theme";
import { StyleSheet, View, ViewStyle } from "react-native";
import { MyInfoFillParamsList } from "./MyInfoFill";
import { MyInfoFillRoutes } from ".";
import { useUserStore } from "stores";

// export interface VerificationSuccessPramsList extends ParamListBase {
//   [PaymentMethodRoutes.PaymentMethodRoutesInitial]: undefined;
// }

type VerificationSuccessProps = NativeStackScreenProps<
  MyInfoFillParamsList,
  MyInfoFillRoutes.VerificationSuccess
>;

const VerificationSuccess: React.FC<VerificationSuccessProps> = ({
  route,
  navigation,
}) => {
  const { setLoginShowSplash } = useUserStore();

  const onReturn = () => {
    setLoginShowSplash();
  };
  // const { onReturn } = route ?? {};
  return (
    <SuccessConfetti
      onReturn={onReturn}
      successText={"Verification Successful!"}
    />
  );
};

export default VerificationSuccess;
