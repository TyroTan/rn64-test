import React, { createRef, useEffect, useRef, useState } from "react";
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
import { useBuyerStore, useUserStore } from "stores";
import { Modalize } from "react-native-modalize";
import useCBSLongPolling from "./useCBSLongPolling";
import { CreditRemainingMyInfoRoutes } from "./CreditRemaining";
import { useDisableAndroidBackHook } from "hooks";
import { alerts } from "utils/global-texts";
import globalObjectState from "utils/global-object-per-country-code";
const imgUploadIcon = require("assets/images/upload-icon.png");

const RenderBtnNote = ({ note, onPress }: any) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: mscale(2) }}>
      <StyledText
        fontFamily={"Poppins"}
        textAlign="left"
        color={theme.colors.lockGray}
        marginBottom={3}
        fontSize={13}
        lineHeight={18}
      >
        If you have an existing valid Credit Bureau report. you may upload it
        here. Otherwise, you may{" "}
        <StyledText
          color={theme.colors.buttons.marineBlue}
          fontSize={13}
          lineHeight={18}
        >
          retrieve it through our app.
        </StyledText>
      </StyledText>
    </TouchableOpacity>
  );
};

const RenderErrors = ({ errors }: any) => {
  return (
    <StyledText
      marginTop={2}
      variant="paragraph"
      fontSize={10}
      lineHeight={11}
      textAlign="left"
      color={theme.colors.typography.red1}
    >
      {errors ?? ""}
    </StyledText>
  );
};

const RenderButtonCountdownTimer = (allProps: any) => {
  const [time, setTime] = useState(59);
  const refTime = useRef(time);

  useEffect(() => {
    const timer: any = setInterval(() => {
      setTime((prev) => {
        refTime.current = prev;
        return prev - 1;
      });

      if (refTime.current <= 1) {
        return clearInterval(timer);
      }
    }, 1000);

    return () => {
      if (timer !== null) clearInterval(timer);
    };
  }, []);

  const timeText = `0:${time.toString().padStart(2, "0")}`;

  const disabled = !(refTime?.current === 1);

  return (
    <ButtonText
      disabled={disabled}
      variant={disabled ? "opacity7" : "primary"}
      {...allProps}
    >
      RETURN ({timeText})
    </ButtonText>
  );
};

const ModalContent = ({ errorsPollingData, onReturn }: any) => {
  if (errorsPollingData) {
    return (
      <StyledBox width="88%" alignSelf="center">
        <StyledText mt={11} variant="titleModalBottom">
          Information
        </StyledText>
        <StyledText
          mt={7}
          variant="paragraphModalBottom"
          color={theme.colors.typography.main}
          textAlign="left"
          numberOfLines={3}
          lineHeight={19}
          mb={2}
        >
          {alerts.genericError}
        </StyledText>
        <ButtonText
          onPress={onReturn}
          children="Back"
          width="100%"
          mb={10}
          mt={10}
        />
      </StyledBox>
    );
  }

  return (
    <StyledBox width="88%" alignSelf="center">
      <StyledText mt={11} variant="titleModalBottom">
        Processing...
      </StyledText>
      <StyledText
        mt={7}
        variant="paragraphModalBottom"
        color={theme.colors.typography.main}
        textAlign="left"
        numberOfLines={3}
        lineHeight={19}
        mb={2}
      >
        We are handling the analysis of your credit report.
      </StyledText>
      <StyledText
        mt={7}
        variant="paragraphModalBottom"
        color={theme.colors.typography.main}
        textAlign="left"
        numberOfLines={3}
        lineHeight={19}
        mb={2}
      >
        Please give us a moment and do not close the app.
      </StyledText>
      <RenderButtonCountdownTimer
        onPress={onReturn}
        width="100%"
        mb={10}
        mt={10}
      />
      {/* <ButtonText
      variant="primaryInverted"
      mt={3}
      children="PROCEED WITH PURCHASE"
      width="100%"
      mb={5}
    /> */}
    </StyledBox>
  );
};

const CreditBureauReport: React.FC<any> = ({ route, navigation }) => {
  // useDisableAndroidBackHook();
  const {
    response: { cbsUpload: responseCbsUpload },
    errors: { cbsUpload: errorCbsUpload },
    isLoading: { cbsUpload: isLoadingCbsUpload },
    resetStates,
    submitCbsUpload,
  } = useBuyerStore();
  const {
    response: { approvedCredit: responseApprovedCredit },
    setNewApprovedCredit,
  } = useUserStore();

  const modalizeRef = useRef<Modalize>(null);

  const [errors, setErrors] = useState<any>();
  const [errorsPollingData, setErrorsPollingData] = useState<any>();

  const isLoadingBtns = isLoadingCbsUpload;
  const { countryCode } = globalObjectState.getLibrary();
  const { outcomeData, reset: resetOutcome } = useCBSLongPolling(
    15,
    errors || errorsPollingData,
    countryCode,
    responseApprovedCredit,
    isLoadingCbsUpload
  );

  // *Events

  // * Handlers - onpress
  const onGoBack = () => {
    if (isLoadingBtns) return;
    navigation.goBack();
  };

  const onOpenModal = () => {
    modalizeRef.current?.open();
  };

  const onCloseModal = () => {
    if (errorsPollingData) {
      setErrorsPollingData(true);
    }
    modalizeRef.current?.close();
  };

  const onNextOutcomeNoIncrease = () => {
    navigation.navigate(
      CreditRemainingMyInfoRoutes.CreditBureauReportAnalyzingOutcome
    );
  };

  const onNextOutcomeIncreased = () => {
    navigation.navigate(
      CreditRemainingMyInfoRoutes.CreditBureauReportAnalyzingSuccess
    );
  };

  const onRetrieveThroughApp = () => {
    if (isLoadingBtns) return;
  };

  const onPickDocuments = async (props: any) => {
    // Pick a single file
    setErrors(null);
    setErrorsPollingData(false);
    resetOutcome();
    resetStates("cbsUpload");
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        mode: "import",
        copyTo: "documentDirectory",
      });

      // TODO loader

      const results = res.map((item) => ({
        ...item,
        fileCopyUri: `file://${decodeURIComponent(item.fileCopyUri)}`,
      }));

      const formData = new FormData();

      results.forEach((file) => {
        formData.append("file", {
          name: file.name as string,
          type: file.type,
          uri: file.fileCopyUri,
        } as any);
      });

      submitCbsUpload(formData);
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  // *Effects
  useEffect(() => {
    resetStates("cbsUpload");
  }, []);

  useEffect(() => {
    if (isLoadingCbsUpload && !errors && !errorsPollingData) {
      onOpenModal();
    }
  }, [isLoadingCbsUpload, errors, errorsPollingData]);

  useEffect(() => {
    if (outcomeData) {
      onCloseModal();

      if (outcomeData === "no-increase") {
        onNextOutcomeNoIncrease();
      } else if (outcomeData === "increased") {
        setNewApprovedCredit(countryCode);
        onNextOutcomeIncreased();
      } else if (outcomeData === "data_error") {
        setTimeout(() => {
          setErrorsPollingData(true);
        }, 350);
      }
    }
  }, [outcomeData]);

  useEffect(() => {
    if (errorsPollingData) {
      onOpenModal();
    }
  }, [errorsPollingData]);

  useEffect(() => {
    if (responseCbsUpload?.success === false) {
      if (responseCbsUpload?.errors) {
        onCloseModal();
        const firstError = responseCbsUpload.errors?.file?.length
          ? responseCbsUpload.errors.file[0]
          : responseCbsUpload.errors.file;
        setErrors(firstError);
      }
    }
  }, [responseCbsUpload]);

  useEffect(() => {
    if (errorCbsUpload?.file) {
      onCloseModal();

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
      paddingVertical={10}
    >
      <Header
        onPress={onGoBack}
        title={"Credit Bureau Report"}
        style={{ paddingLeft: 0, marginLeft: mscale(-10) }}
      />
      <RenderBtnNote onPress={onRetrieveThroughApp} />
      <StyledText
        variant="titleSecondary"
        textAlign="left"
        children={"Upload Credit Bureau Report"}
        marginTop={9}
        marginBottom={2}
      />
      <StyledBox
        flex={1}
        width="100%"
        // alignItems="center"
        // justifyContent="flex-start"
        // paddingTop={mscale(77)}
      >
        <StyledMainButton
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
          borderRadius={mscale(12)}
          borderColor={theme.colors.lockGray}
          borderWidth={0.5}
          onPress={onPickDocuments}
        >
          <View>
            <Image
              source={imgUploadIcon}
              resizeMode="contain"
              style={{
                width: mscale(37),
                height: mscale(37),
                margin: mscale(16),
              }}
            />
          </View>
          <StyledText
            fontFamily={"Poppins"}
            textAlign="left"
            color={theme.colors.lockGray}
            children={`Click this box to select files to upload\nAccepted formats: jpeg, pdf`}
          />
        </StyledMainButton>
        <RenderErrors errors={errors} />
      </StyledBox>
      <StyledBox width="100%">
        <ButtonText
          children="SUBMIT"
          // onPress={onNext}
          variant="opacity7"
          disabled={true}
          loading={isLoadingBtns}
          marginBottom={0}
        />
      </StyledBox>
      <Modalize
        onBackButtonPress={() => false}
        panGestureEnabled={false}
        closeOnOverlayTap={false}
        ref={modalizeRef}
        adjustToContentHeight
      >
        {/* <ModalBottom /> */}
        {/* <ModalMoreCredit /> */}
        <ModalContent
          errorsPollingData={errorsPollingData}
          onReturn={onCloseModal}
        />
      </Modalize>
    </StyledSafeAreaView>
  );
};

export default CreditBureauReport;
