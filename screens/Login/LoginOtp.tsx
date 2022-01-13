import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FC } from "react";
import { View, Image, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  ButtonText,
  StyledText,
  KeyboardAvoiding,
  StyledSafeAreaView,
  StyledBox,
} from "components";
import { theme } from "styles/theme";
import {
  useAuthStore,
  useBuyerStore,
  useNestedNavigatorStore,
  useUserStore,
} from "stores";
import { StyledScrollView } from "components";
import CodeInput from "screens/Login/CodeInput";
import {
  setTokenLocalDb,
  removeReferredCodeLocalDb,
  getCheckoutIdLocalDb,
  getReferredCodeLocalDb,
} from "utils/async-storage-util";

import { useKeyboard, useToastMessage } from "hooks";
import { LoginRoutes } from "./LoginPhoneInput";
import type { LoginPhoneInputParamsList } from "./LoginPhoneInput";
import { AsYouType } from "libphonenumber-js";
import { alerts } from "utils/global-texts";
import { awaitableDelay } from "utils/js-utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import type { UserSession } from "stores/useUserStore";
import globalObjectState from "utils/global-object-per-country-code";

const imgVerificationBanner = require("assets/images/verification.png");

type LoginOtpProps = NativeStackScreenProps<
  LoginPhoneInputParamsList,
  LoginRoutes.LoginPhoneInput
>;

const AnimatingVerifyBanner = () => {
  const { keyboardShown } = useKeyboard();

  return (
    <View
      style={{
        paddingTop: mscale(50),
        display: "flex",
        justifyContent: "center",
        alignItems: keyboardShown ? "flex-start" : "center",
      }}
    >
      <Image
        source={imgVerificationBanner}
        resizeMode="cover"
        style={{
          height: keyboardShown ? mscale(105) : mscale(180),
          width: keyboardShown ? mscale(105) : mscale(180),
        }}
      />
    </View>
  );
};

interface RenderCodeInputProps {
  onFulfill: (value: string) => void;
  onCodeChange: (code: string) => void;
  // expectedCode: string;
  error?: boolean;
  onInput?: () => void;
}

const RenderCodeInput: FC<RenderCodeInputProps> = ({
  onFulfill,
  onCodeChange,
  // expectedCode,
  error,
  onInput,
}) => {
  const colorsTypography = theme.colors.typography;
  const colorError = theme.colors.actions.failureRed;

  return (
    <CodeInput
      // ref="codeInputRef2"
      // secureTextEntry
      keyboardType="numeric"
      activeColor={error ? colorError : colorsTypography.main}
      inactiveColor={error ? colorError : colorsTypography.grayNeutral}
      // className={"border-b"}
      autoFocus={false}
      // ignoreCase={true}
      inputPosition="left"
      codeLength={6}
      space={mscale(6)}
      // size={mscale(50)}
      onFulfill={(code: string) => {
        onFulfill(code);
      }}
      // onChange={(): void => {
      //   onInput?.();
      // }}
      onCodeChange={onCodeChange}
      containerStyle={{
        alignSelf: "center",
        marginTop: mscale(14),
        height: mscale(50),
      }}
      codeInputStyle={{
        color: theme.colors.typography.grayNeutral,
        fontFamily: "PoppinsSemiBold",
        fontSize: mscale(22),
        lineHeight: mscale(28),
        width: "13%", // 14 x 6 = 84%
        height: mscale(50),
        borderWidth: mscale(0.5),
        borderRadius: mscale(8),
      }}
    />
  );
};

const RenderTextEnterOtp = ({ mobileNumber }: { mobileNumber: string }) => {
  const formatted = new AsYouType("MY").input(mobileNumber);

  return (
    <StyledText
      variant="paragraph"
      marginTop={37}
      fontSize={14}
      lineHeight={14}
    >
      Enter the OTP sent to{" "}
      <StyledText fontFamily="PoppinsSemiBold" fontSize={14} lineHeight={14}>
        {formatted}
      </StyledText>
    </StyledText>
  );
};

interface POSTParamSendOTP {
  country_dialling_code: "+65";
  mobile_number: string;
}

const useCodeValidation = (
  otp: string,
  otpVerifyErrors: any,
  otpSendResponse: any
) => {
  const [errorMessageShown, setErrorMessageShown] = useState("");
  const [isFormValid, setIsFormValid] = useState(true);

  const onResetValidation = () => {
    setErrorMessageShown("");
    setIsFormValid(true);
  };

  useEffect(() => {
    const isValidating = otp.length === 6;

    if (isValidating) {
      setErrorMessageShown("");
      if (otpVerifyErrors) {
        setErrorMessageShown(otpVerifyErrors ?? "Something went wrong.");
        setIsFormValid(false);
        // } else if (otpSendResponse && !isFormValid) {
        //   setIsFormValid(true);
        // } else if (!isFormValid) {
        //   setErrorMessageShown("");
      }
    } else if (!isFormValid && otp.length > 0) {
      onResetValidation();
    }
  }, [
    otp,
    otpVerifyErrors,
    setErrorMessageShown,
    setIsFormValid,
    isFormValid,
    errorMessageShown,
    otpSendResponse,
  ]);

  return { isFormValid, errorMessageShown, onResetValidation };
};

const RenderResendBtnText = ({
  onFulfill,
  isLoading,
  isFormValid,
  otp,
  onResend,
  executeResetTimer,
  setExecuteResetTimer,
}: any) => {
  const [cdNumber, setCdNumber] = useState(59);
  const refCount = useRef<any>(59);

  // *Effects
  useEffect(() => {
    if (cdNumber === 59) {
      refCount.current = cdNumber;
      const tick = async () => {
        if (refCount.current > 0) {
          await awaitableDelay(1000);
          refCount.current = refCount.current - 1;
          setCdNumber(refCount.current);
          tick();
        }
      };

      tick();
    }
  }, [cdNumber]);

  useEffect(() => {
    setCdNumber(59);
    refCount.current = 59;

    return () => {
      refCount.current = 0;
      setCdNumber(0);
      setExecuteResetTimer(false);
    };
  }, []);

  useEffect(() => {
    if (executeResetTimer === true) {
      // resend was clicked and post request succeeded
      setExecuteResetTimer(false);
      setCdNumber(59);
      refCount.current = 59;
    }
  }, [executeResetTimer]);

  const canResend = cdNumber === 0;

  const TimerText = () => {
    if (canResend) {
      return (
        <StyledBox variant="flexcr">
          <StyledText
            variant="paragraph"
            marginBottom={4}
            fontSize={14}
            lineHeight={14}
            children={`Didn't receive the code?`}
          />
          <TouchableOpacity style={{ padding: mscale(3) }} onPress={onResend}>
            <StyledText
              variant="paragraph"
              marginBottom={4}
              fontSize={14}
              lineHeight={14}
              color={theme.colors.buttons.marineBlue}
              children={`Resend`}
            />
          </TouchableOpacity>
        </StyledBox>
      );
    }

    return (
      <StyledText
        variant="paragraph"
        marginBottom={4}
        fontSize={14}
        lineHeight={14}
        children={`Re-send OTP in ${cdNumber
          .toString()
          .padStart(2, "0")} seconds`}
      />
    );
  };

  return (
    <>
      <TimerText />
      <ButtonText
        children="Verify"
        onPress={onFulfill}
        loading={isLoading}
        disabled={isLoading || !isFormValid || otp.length !== 6}
      />
    </>
  );
};

const LoginOtp: React.FC<LoginOtpProps> = ({ route, navigation }) => {
  // dddebug
  const { params } = route ?? {};

  const [isLoading, setIsLoading] = useState(false);
  const {
    isLoading: { otpSend: otpSendIsLoading },
    response: { otpSend: otpSendResponse, otpVerify: otpVerifyResponse },
    errors: { otpVerify: otpVerifyErrors, otpSend: otpSendErrors },
    resetStates: authResetStates,
    submitMobile,
    submitOtp,
  } = useAuthStore();
  const { resetAll: resetAllNestedNav } = useNestedNavigatorStore();
  const { session_id } = otpSendResponse ?? {};
  const {
    response: { getOrCreate: getOrCreateResponse, credits: creditsResponse },
    errors: { getOrCreate: getOrCreateErrors, credits: creditsError },
    submitGetOrCreate,

    // workaround
    refreshBuyerStates,
    fetchCredits,
  } = useBuyerStore();
  useToastMessage(getOrCreateErrors);

  const {
    response: { user },
    setUserInfo,
    setLoginShowSplash,
  } = useUserStore();
  const { countryCode } = globalObjectState.getLibrary();

  // const { keyboardShown } = useKeyboard();
  const mobileNumber = (params as any).mobileNo;
  const [otp, setOtp] = useState<string>("");
  const [executeResetTimer, setExecuteResetTimer] = useState(false);
  const { isFormValid, errorMessageShown, onResetValidation } =
    useCodeValidation(otp, otpVerifyErrors, otpSendResponse);

  // *Events
  const onSuccessReset = useCallback(() => {
    onResetValidation();
    setOtp("");
    setIsLoading(false);
  }, [authResetStates, setOtp]);

  const onErrorReset = useCallback(() => {
    authResetStates("otpVerify");
    setOtp("");
    setIsLoading(false);
  }, [authResetStates, setOtp]);

  const onInput = (input: string) => {
    setOtp(input);
  };

  const onFulfill = (otpOnFulfill: string) => {
    setOtp(otpOnFulfill);
    authResetStates("otpVerify");
    submitOtp(otpOnFulfill, session_id);
    setIsLoading(true);
  };

  const asyncEffectOtpVerifyResponse = useCallback(
    async (otpResp: any) => {
      if (otpResp?.token) {
        globalObjectState.resetBeforeLogin();
        await setTokenLocalDb(otpResp.token);

        // ! may be we can remove this here, deprcated by useLogin?
        submitGetOrCreate(setUserInfo);
      }
    },
    [setTokenLocalDb, submitGetOrCreate, setUserInfo]
  );

  const onResend = () => {
    onErrorReset();
    authResetStates("otpSend");
    setIsLoading(true);
    submitMobile((params as any).countryPrefix, (params as any).mobileNo);
  };

  // *Effects
  useEffect(() => {
    asyncEffectOtpVerifyResponse(otpVerifyResponse);
  }, [otpVerifyResponse]);

  useEffect(() => {
    if (otpSendResponse) {
      setIsLoading(false);
      setExecuteResetTimer(true);
    }
  }, [otpSendResponse]);

  useEffect(() => {
    if (otpSendErrors) {
      onErrorReset();
      authResetStates("otpSend");
      setExecuteResetTimer(true);
      Alert.alert(alerts.headerInformation, alerts.genericError, [
        {
          text: alerts.btnOk,
          onPress: () => {},
          style: "default",
        },
      ]);
    }
  }, [otpSendErrors]);

  useEffect(() => {
    if (otpVerifyErrors) {
      onErrorReset();
    }
  }, [otpVerifyErrors, onErrorReset]);

  useEffect(() => {
    if (getOrCreateResponse && countryCode) {
      fetchCredits(countryCode);
    }
  }, [getOrCreateResponse, fetchCredits, countryCode]);

  useEffect(() => {
    if (getOrCreateErrors) {
      onErrorReset();
      Alert.alert(alerts.headerInformation, alerts.genericError, [
        {
          text: alerts.btnOk,
          onPress: () => navigation.goBack(),
          style: "default",
        },
      ]);
    }
  }, [getOrCreateErrors]);

  const processReferredFlow = async () => {
    if (getOrCreateResponse) {
      // const referredCode = await getReferredCodeLocalDb();
      // const checkoutId = await getCheckoutIdLocalDb();
      let landingToScreenParam: UserSession["landingToScreen"] = "Credit";

      if (getOrCreateResponse.name === "") {
        landingToScreenParam = "MyInfoIntro";
        //   history.push("/verify?type=identity");
      } else {
        //   history.push("/home");
      }

      // priority given to checkout id
      // if (checkoutId !== null) {
      // await removeReferredCodeLocalDb();
      // return history.push("/order");
      // }

      // if (referredCode !== null) {
      // return history.push("/order");
      // }

      // window.location.reload();

      // onSuccessReset();
      setLoginShowSplash({ landingToScreenParam }); // navigation happens
    }
  };

  useEffect(() => {
    processReferredFlow();
  }, [creditsResponse]);

  // *Didmount
  useEffect(() => {
    resetAllNestedNav();
  }, []);

  // const statusBarHeight = getStatusBarHeight(Device);

  const isAllLoading = isLoading && otpSendIsLoading;

  return (
    <StyledSafeAreaView
      height="100%"
      margin={0}
      padding={0}
      // paddingBottom={statusBarHeight > 20 ? mscale(10) : mscale(20)}
    >
      <KeyboardAvoiding>
        <StyledScrollView paddingX={8}>
          <AnimatingVerifyBanner />
          <RenderTextEnterOtp mobileNumber={mobileNumber} />
          <RenderCodeInput
            onFulfill={onFulfill}
            // expectedCode={expectedCode}
            error={!isFormValid}
            onCodeChange={onInput}
          />
          <StyledText
            margin={3}
            marginLeft={7}
            fontSize={12}
            lineHeight={12}
            variant="failure"
            children={errorMessageShown ? errorMessageShown : <></>}
          />
        </StyledScrollView>
        <RenderResendBtnText
          setExecuteResetTimer={setExecuteResetTimer}
          executeResetTimer={executeResetTimer}
          onResend={onResend}
          onFulfill={onFulfill}
          isLoading={isAllLoading}
          isFormValid={isFormValid}
          otp={otp}
        />
      </KeyboardAvoiding>
    </StyledSafeAreaView>
  );
};

export default LoginOtp;
