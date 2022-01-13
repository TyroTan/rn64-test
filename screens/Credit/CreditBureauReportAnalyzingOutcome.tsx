import React, { createRef, useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  PrivacyPolicyText,
  ButtonTopTabShadow,
  ButtonText,
  Header,
  StyledMainButton,
} from "components";
import { theme } from "styles/theme";
import {} from "@react-navigation/native-stack";
// import useAuthStore from "stores/useAuthStore";
// import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
import { SafeAreaView } from "react-native-safe-area-context";
import DocumentPicker from "react-native-document-picker";
import { useBuyerStore } from "stores";

const CreditBureauReportAnalyzingOutcome: React.FC<any> = ({
  route,
  navigation,
}) => {
  const {
    response: { cbsUpload: responseCbsUpload },
    errors: { cbsUpload: errorCbsUpload },
    isLoading: { cbsUpload: isLoadingCbsUpload },
    resetStates,
    submitCbsUpload,
  } = useBuyerStore();
  const [errors, setErrors] = useState<any>();

  const isLoadingBtns = isLoadingCbsUpload;

  // *Events

  // * Handlers - onpress
  const onGoBack = () => {
    if (isLoadingBtns) return;
    navigation.pop(3);
  };

  const onNext = () => {
    if (isLoadingBtns) return;
    navigation.navigate("NAVTEST3");
  };

  const onRetrieveThroughApp = () => {
    if (isLoadingBtns) return;
  };

  // *Effects
  useEffect(() => {
    resetStates("cbsUpload");
  }, []);

  useEffect(() => {
    console.log("responseCbsUploadresponseCbsUpload", responseCbsUpload);
  }, [responseCbsUpload]);

  useEffect(() => {
    console.log("errorCbsUploaderrorCbsUpload", errorCbsUpload);
    if (errorCbsUpload?.file) {
      const firstError = errorCbsUpload.file?.length
        ? errorCbsUpload.file[0]
        : errorCbsUpload.file;
      setErrors(firstError);
    }
  }, [errorCbsUpload]);

  return (
    <StyledSafeAreaView
      flex={1}
      flexDirectdion="column"
      justifyConent="flex-end"
      alignItems="stretch"
      paddingHorizontal={25}
      backgroundColor={theme.colors.buttons.marineBlue}
    >
      <StyledText
        variant="title"
        color={theme.colors.typography.mainInverse}
        children={"Report Outcome"}
        marginTop={9}
        marginBottom={2}
      />
      <StyledText
        variant="titleSecondary"
        color={theme.colors.typography.mainInverse}
        children={
          "Based on your credit report, we are unable to grant you additional credit."
        }
        marginTop={9}
        marginBottom={2}
      />
      <StyledText
        variant="titleSecondary"
        color={theme.colors.typography.mainInverse}
        children={
          "If you wish to appeal this decision, you may request to be reviewed manually."
        }
        marginTop={9}
        marginBottom={2}
      />
      <StyledBox
        flex={1}
        width="100%"
        backgroundColor={theme.colors.buttons.marineBlue}
        // alignItems="center"
        // justifyContent="flex-start"
        // paddingTop={mscale(77)}
      />
      <StyledBox width="100%" backgroundColor={theme.colors.buttons.marineBlue}>
        <ButtonText
          variant="primaryInverted"
          children="REQUEST MANUAL REVIEW"
          onPress={onNext}
          disabled={isLoadingBtns}
          loading={isLoadingBtns}
          marginBottom={3}
        />
        <ButtonText
          children="BACK"
          onPress={onGoBack}
          disabled={isLoadingBtns}
          loading={isLoadingBtns}
          marginBottom={0}
          backgroundColor={theme.colors.buttons.marineBlue}
        />
      </StyledBox>
    </StyledSafeAreaView>
  );
};

export default CreditBureauReportAnalyzingOutcome;
