import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { Modalize } from "react-native-modalize";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import * as globalTexts from "utils/global-texts";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  PrivacyPolicyText,
  ButtonText,
  ModalBottom,
  StepsVertical,
  HeaderLeft,
} from "components";
import { theme } from "styles/theme";
// import useAuthStore from "stores/useAuthStore";
// import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Layout from "constants/Layout";
import { CreditRemainingMyInfoRoutes } from "screens/Credit/CreditRemaining";
import { useBuyerStore, useNestedNavigatorStore, useUserStore } from "stores";
import { getCbsJobId, setCbsJobId } from "utils/async-storage-util";
import { awaitableDelay } from "utils/js-utils";
import useCBSLongPolling from "./useCBSLongPolling";
import globalObjectState from "utils/global-object-per-country-code";
const imgCreditBureau = require("assets/images/finance-intro-image-rounded.png");

const imgIntro = require("assets/images/finance-intro-image.png");

const InfoPicture = () => {
  return (
    <StyledBox
      width={mscale(202)}
      height={mscale(202)}
      alignSelf="center"
      justifyContent="center"
      alignItems="center"
      borderRadius={mscale(106)}
      marginBottom={18}
      backgroundColor={theme.colors.faintGray2}
    >
      <Image
        source={imgIntro}
        resizeMode="contain"
        style={{ width: mscale(135), height: mscale(168) }}
      />
    </StyledBox>
  );
};

const StyledTextAmount = ({ children }: any) => {
  return (
    <StyledText variant="paragraphModalBottom" fontFamily={"PoppinsBold"}>
      {children}
    </StyledText>
  );
};

const RenderProgressText = ({ text, success }: any) => (
  <StyledText
    color={
      success
        ? theme.colors.progressbar.barGreen1
        : theme.colors.typography.gray1
    }
    variant="titleTertiary"
  >
    {text}
  </StyledText>
);

const ModalContent = ({
  requestCreditCheckPromptText,
  onCloseDoNotRefreshPrompt,
  onCloseModal,
  errors,
  currentIndexCompleted,
}: any) => {
  if (requestCreditCheckPromptText) {
    return (
      <StyledBox
        width="88%"
        alignSelf="center"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="stretch"
        padding={5}
      >
        <StyledBox>
          <StyledText mt={5} variant="titleModalBottom">
            Information
          </StyledText>
          <StyledText
            mt={5}
            variant="paragraphModalBottom"
            textAlign="left"
            lineHeight={19}
            mb={2}
            children={globalTexts.cbs.requestCreditCheck1}
          />
          <StyledText
            mt={2}
            variant="paragraphModalBottom"
            textAlign="left"
            numberOfLines={3}
            lineHeight={19}
            mb={2}
            children={globalTexts.cbs.requestCreditCheck2}
          />
          <StyledText
            mt={2}
            variant="paragraphModalBottom"
            textAlign="left"
            numberOfLines={3}
            lineHeight={19}
            mb={5}
            children={globalTexts.cbs.requestCreditCheck3}
          />
        </StyledBox>
        <ButtonText onPress={onCloseDoNotRefreshPrompt} mb={2}>
          OKAY
        </ButtonText>
      </StyledBox>
    );
  } else if (errors) {
    return (
      <StyledBox width="74%" alignSelf="center" padding={5}>
        <StyledBox flexDirection="row" justifyContent="center">
          <StyledText variant="titleModalBottom">{"Information"}</StyledText>
        </StyledBox>
        <StyledText
          mt={7}
          variant="paragraphModalBottom"
          textAlign="left"
          lineHeight={19}
          mb={7}
        >
          {errors}
        </StyledText>
        <ButtonText mb={5} onPress={onCloseModal}>
          Return
        </ButtonText>
      </StyledBox>
    );
  }

  return (
    <StyledBox
      width="74%"
      alignSelf="center"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={5}
    >
      <Image
        style={{ width: mscale(70), height: mscale(70) }}
        resizeMode="contain"
        source={imgCreditBureau}
      />
      <StyledBox flexDirection="row" justifyContent="flex-start" mt={5}>
        <StyledText variant="titleModalBottom" mr={3}>
          Processing credit report
        </StyledText>
        <ActivityIndicator size="small" color={theme.colors.rn64testBlue} />
      </StyledBox>
      <StyledBox variant="flexcr" justifyContent="center" mt={8}>
        <StepsVertical
          style={{ marginRight: mscale(20), marginTop: mscale(10) }}
          current={{
            index: currentIndexCompleted + 1,
            mode: "greenThemed",
          }}
        />
        <StyledBox height="100%">
          <StyledBox
            variant="flexcr"
            justifyContent="space-between"
            alignItems="flex-start"
            height={mscale(50)}
          >
            <RenderProgressText
              success={currentIndexCompleted >= 0}
              text={"Initializing"}
            />
          </StyledBox>
          <StyledBox
            variant="flexcr"
            justifyContent="space-between"
            alignItems="flex-start"
            height={mscale(50)}
          >
            <RenderProgressText
              success={currentIndexCompleted >= 1}
              text={"Obtaining authorisation"}
            />
          </StyledBox>
          <StyledBox
            variant="flexcr"
            justifyContent="space-between"
            alignItems="flex-start"
            height={mscale(50)}
          >
            <RenderProgressText
              success={currentIndexCompleted >= 2}
              text={"Retrieving information"}
            />
          </StyledBox>
          <StyledBox
            variant="flexcr"
            justifyContent="space-between"
            alignItems="flex-start"
            height={mscale(50)}
          >
            <RenderProgressText
              success={currentIndexCompleted >= 3}
              text={"Analyzing information"}
            />
          </StyledBox>
          <StyledBox
            variant="flexcr"
            justifyContent="space-between"
            alignItems="flex-start"
            height={mscale(50)}
          >
            <RenderProgressText
              success={currentIndexCompleted >= 4}
              text={"Completing session"}
            />
          </StyledBox>
        </StyledBox>
      </StyledBox>
    </StyledBox>
  );
};

const useProcessingState = ({ onNavigateToSingPassLogin }: any) => {
  const {
    fetchCbsPurchaseById,
    submitCbsPurchase,
    fetchMyinfoUrl,
    resetStates: resetStatesBuyer,
    response: {
      myInfoUrl: myInfoUrlResponse,
      cbsPurchaseById: responseCbsPurchaseById,
      cbsPurchase: responseCbsPurchase,
    },
    isLoading: {
      cbsPurchaseById: isLoadingCbsPurchaseById,
      cbsPurchase: isLoadingCbsPurchase,
      myInfoUrl: isloadingMyInfoUrl,
    },
    errors: {
      cbsPurchaseById: errorsCbsPurchaseById,
      cbsPurchase: errorsCbsPurchase,
    },
  } = useBuyerStore();

  const {
    response: { user: responseUser, approvedCredit: responseApprovedCredit },
    setNewApprovedCredit,
  } = useUserStore();
  const {
    setFromCreditBureau,
    resetAll: resetAllNestedNav,
    response: { fromCreditBureauSingPassLogin },
  } = useNestedNavigatorStore();

  const refLoopLimit = useRef<number>(0);
  const [isUsingAwaitableDelay, setIsUsingAwaitableDelay] = useState(false);
  const [errors, setErrors] = useState<string | undefined>();
  const [purchaseState, setPurchaseState] = useState("");
  const [executeCreditPolling, setExecuteCreditPolling] = useState(false);

  const { countryCode } = globalObjectState.getLibrary();
  const { outcomeData, reset: resetOutcome } = useCBSLongPolling(
    2,
    errors,
    countryCode,
    responseApprovedCredit,
    executeCreditPolling
  );

  const isPurchaseLoading =
    isUsingAwaitableDelay ||
    isLoadingCbsPurchaseById ||
    isLoadingCbsPurchase ||
    executeCreditPolling ||
    isloadingMyInfoUrl;

  const purchaseCBS = useCallback(async () => {
    if (!isLoadingCbsPurchaseById && !isLoadingCbsPurchase) {
      if (!responseCbsPurchaseById && !responseCbsPurchase) {
        submitCbsPurchase();
      }
    }
  }, [
    isLoadingCbsPurchaseById,
    isLoadingCbsPurchase,
    responseCbsPurchaseById,
    responseCbsPurchase,
  ]);

  const onResetStates = () => {
    resetStatesBuyer("cbsPurchase");
    resetStatesBuyer("cbsPurchaseById");
    resetStatesBuyer("myInfoUrl");
  };

  const handleCbsPurhcaseResponse = async (responseCbsPurchase: any) => {
    const jobId = responseCbsPurchase.job_id;

    await setCbsJobId(jobId);

    setIsUsingAwaitableDelay(true);
    await awaitableDelay(3000);
    setIsUsingAwaitableDelay(false);
    fetchCbsPurchaseById(jobId);
  };

  const handleCbsPurhcaseByIdResponse = async () => {
    refLoopLimit.current = (refLoopLimit?.current ?? 0) + 1;

    if (refLoopLimit.current > 15) {
      onResetStates();
      return setErrors(globalTexts.alerts.genericError);
    }
    const jobId = await getCbsJobId();

    setIsUsingAwaitableDelay(true);
    await awaitableDelay(3000);
    setIsUsingAwaitableDelay(false);
    fetchCbsPurchaseById(jobId);
  };

  // *Effects

  useEffect(() => {
    if (
      !isLoadingCbsPurchaseById &&
      !responseCbsPurchaseById &&
      responseCbsPurchase &&
      responseCbsPurchase.job_id
    ) {
      handleCbsPurhcaseResponse(responseCbsPurchase);
    }
  }, [
    isLoadingCbsPurchaseById,
    responseCbsPurchase,
    handleCbsPurhcaseResponse,
  ]);

  useEffect(() => {
    if (fromCreditBureauSingPassLogin === true) {
      // resetAllNestedNav(); don't reset yet to avoid loop
      onResetStates();
      purchaseCBS();
    }
  }, [fromCreditBureauSingPassLogin]);

  useEffect(() => {
    if (myInfoUrlResponse && !isPurchaseLoading && myInfoUrlResponse?.url) {
      setFromCreditBureau({
        uri: myInfoUrlResponse.url,
        authToken: responseUser.authToken,
      });
      onNavigateToSingPassLogin();
      // navigation.navigate(MyInfoRoutes.MyInfoSingpassWebview, {
      //   uri: myInfoUrlResponse?.url,
      //   authToken: userResponse.authToken,
      // });
    }
  }, [myInfoUrlResponse, isPurchaseLoading]);

  useEffect(() => {
    if (
      !isLoadingCbsPurchaseById &&
      !responseCbsPurchaseById &&
      responseCbsPurchase &&
      responseCbsPurchase.job_id
    ) {
      handleCbsPurhcaseResponse(responseCbsPurchase);
    }
  }, [
    isLoadingCbsPurchaseById,
    responseCbsPurchase,
    handleCbsPurhcaseResponse,
  ]);

  useEffect(() => {
    if (responseCbsPurchaseById && responseCbsPurchaseById.state) {
      const { state, authorise_qrcode_html } = responseCbsPurchaseById;

      if (state === "singpass_login_required") {
        console.log("singpass_login_required");
        onResetStates();

        // already from singpass login webview
        if (fromCreditBureauSingPassLogin === true) {
          handleCbsPurhcaseByIdResponse();
          setPurchaseState(state);
          return;
        }

        // triggers loading and navigation to webview 99% of the time
        fetchMyinfoUrl();
        setPurchaseState(state);
        return;
      }

      if (state === "failed" || state === "data_extraction_failed") {
        setPurchaseState("error");
        return;
      } else if (state !== "success") {
        handleCbsPurhcaseByIdResponse();
        // setErrors("An error occurred, please try again later");
      }

      setPurchaseState(state);
    }
  }, [responseCbsPurchaseById]);

  useEffect(() => {
    if (outcomeData) {
      // onCloseModal();

      if (outcomeData === "no-increase") {
        // onNextOutcomeNoIncrease();
      } else if (outcomeData === "increased") {
        setNewApprovedCredit(countryCode);
        // onNextOutcomeIncreased();
      }

      setExecuteCreditPolling(false);
    }
  }, [outcomeData]);

  useEffect(() => {
    console.log(
      "errorsCbsPurchaseById || errorsCbsPurchase",
      errorsCbsPurchaseById,
      errorsCbsPurchase
    );
    if (errorsCbsPurchaseById || errorsCbsPurchase) {
      setErrors(errorsCbsPurchaseById ?? errorsCbsPurchase);
      // if (errorsCbsPurchaseById)
      onResetStates();
    }
  }, [errorsCbsPurchaseById, errorsCbsPurchase]);

  return {
    errors,
    setErrors,
    onResetStates,
    purchaseState,
    isPurchaseLoading,
    purchaseCBS,
    responseCbsPurchaseById,
    outcomeData,
    resetOutcome,
    setNewApprovedCredit,
    setExecuteCreditPolling,
    fetchMyinfoUrl,
  };
};

const FinancePaymentIntro: React.FC<any> = ({ route, navigation }) => {
  const modalizeRef = useRef<Modalize>(null);
  const [requestCreditCheckPromptText, setRequestCreditCheckPromptText] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndexCompleted, setCurrentIndexCompleted] = useState(-1);

  const onNavigateToSingPassLogin = () => {
    navigation.navigate(CreditRemainingMyInfoRoutes.SingPassLogin);
  };

  const {
    purchaseState,
    responseCbsPurchaseById,
    isPurchaseLoading,
    purchaseCBS,
    onResetStates,
    errors,
    setErrors,
    outcomeData,
    resetOutcome,
    // setNewApprovedCredit,
    setExecuteCreditPolling,
    fetchMyinfoUrl,
  } = useProcessingState({ onNavigateToSingPassLogin });

  // *Events

  // *Handlers - onpress
  const onGoBack = () => {
    if (!isPurchaseLoading) {
      navigation.goBack();
    }
    // modalizeRef.current?.open();
  };

  const onOpenModal = () => {
    if (isModalOpen) return;
    setIsModalOpen(true);
    modalizeRef?.current?.open();
  };

  const onCloseModal = () => {
    if (!isModalOpen) return;
    setIsModalOpen(false);
    modalizeRef?.current?.close();
  };

  const onClosed = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    }
    console.log("states", errors);
    if (errors) {
      resetOutcome();
      onResetStates();
    }

    console.log("why setting errors to undefined?");
    setErrors(undefined);
  };

  const onGoToOutcome = () => {
    // navigation.navigate(
    //   CreditRemainingMyInfoRoutes.CreditBureauReportAnalyzingOutcome
    // );
  };

  const onOpenDoNotRefreshPrompt = () => {
    setRequestCreditCheckPromptText(true);
    onOpenModal();
  };

  const onCloseDoNotRefreshPrompt = () => {
    setRequestCreditCheckPromptText(false);
    onCloseModal();
    purchaseCBS();
  };

  const onRetrieve = () => {
    onOpenModal();
    onOpenDoNotRefreshPrompt();
    // onSuccess();
  };

  const onSuccessOutcomeIncreased = () => {
    navigation.navigate(
      CreditRemainingMyInfoRoutes.CreditBureauReportAnalyzingSuccess
    );
  };

  const onNext = () =>
    navigation.navigate(CreditRemainingMyInfoRoutes.CreditBureauReportUpload);
  //   const onNext = () => navigation.navigate("NAVTEST2");
  // const onNext = onOpen;

  // *Effects
  useEffect(() => {
    if (purchaseState) {
      onOpenModal();
      switch (purchaseState) {
        case "init":
          // setCurrentIndexCompleted(-1);
          break;

        case "myinfo_consent_required":
          setCurrentIndexCompleted(0);
          break;

        case "myinfo_consent_given":
          setCurrentIndexCompleted(1);
          break;

        case "payment_made":
          setCurrentIndexCompleted(2);
          break;

        case "credit_report_downloaded":
        case "credit_report_created":
          setCurrentIndexCompleted(3);
          setTimeout(() => {
            onOpenModal();
          }, 500);
          break;
        case "success":
          setExecuteCreditPolling(true);
          break;
        case "error":
          onResetStates();
          setErrors(globalTexts.alerts.genericError);
          break;
      }
    }
  }, [purchaseState]);

  useEffect(() => {
    if (outcomeData) {
      // onCloseModal();

      if (outcomeData === "no-increase") {
        // onNextOutcomeNoIncrease();
      } else if (outcomeData === "increased") {
        onSuccessOutcomeIncreased();
      } else if (outcomeData === "data_error" || outcomeData === "timed-out") {
        onResetStates();
        setErrors(globalTexts.alerts.genericError);
      }
    }
  }, [outcomeData]);

  useEffect(() => {
    if (errors) {
      onOpenModal();
    }
  }, [errors]);

  const isLoadingBtns = isPurchaseLoading;
  const hasNotch = getStatusBarHeight(Device) > 20;

  return (
    <StyledSafeAreaView flex={1} paddingTop={3}>
      <HeaderLeft onPress={onGoBack} />
      <StyledBox
        flex={1}
        flexDirection="column"
        justifyContent="flex-end"
        alignItems="center"
      >
        <StyledBox
          flex={1}
          width="100%"
          alignItems="center"
          paddingTop={mscale(97)}
        >
          <InfoPicture />
          <StyledText
            variant="title"
            children="Credit Bureau Report"
            marginBottom={2}
          />
          <StyledText
            paddingX={5}
            variant="paragraph"
            children="The financial information provided in this report will allow us to better evaluate an increase in your credit for a larger purchase, or for more purchases"
            fontSize={13}
            marginBottom={10}
            width="92%"
          />
        </StyledBox>
        <StyledBox width="100%">
          <ButtonText
            children="RETRIEVE MY CREDIT REPORT"
            onPress={onRetrieve}
            disabled={isPurchaseLoading}
            loading={isPurchaseLoading}
            marginBottom={3}
          />
          <ButtonText
            variant="primaryInverted"
            children="UPLOAD MANUALLY"
            onPress={onNext}
            disabled={isPurchaseLoading}
            // loading={isLoadingBtns}
            marginBottom={0}
          />
          <PrivacyPolicyText />
        </StyledBox>
      </StyledBox>
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        onClosed={onClosed}
        onBackButtonPress={() => false}
        // panGestureEnabled={false}
        closeOnOverlayTap={false}
      >
        {/* <ModalBottom /> */}
        {/* <ModalMoreCredit /> */}
        <ModalContent
          currentIndexCompleted={currentIndexCompleted}
          requestCreditCheckPromptText={requestCreditCheckPromptText}
          onCloseDoNotRefreshPrompt={onCloseDoNotRefreshPrompt}
          onCloseModal={onCloseModal}
          responseCbsPurchaseById={responseCbsPurchaseById}
          errors={errors}
        />
      </Modalize>
    </StyledSafeAreaView>
  );
};

export default FinancePaymentIntro;
