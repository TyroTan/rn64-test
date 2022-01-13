import React, { useCallback, useEffect, useState, useRef } from "react";
import { StyleSheet, TextInput, View, Pressable, Image } from "react-native";
import FlipCard from "./RenderFlipCard";
import { AsYouType } from "libphonenumber-js";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledBox,
  StyledText,
  KeyboardAvoiding,
  ButtonText,
} from "components";
import { useUserStore, useAuthStore, useBuyerStore } from "stores";
import { theme } from "styles/theme";
import { validatePhoneNumber } from "utils/validators-util";
import { useResetScreen } from "hooks";
import { cleanMobileNumber } from "utils/js-utils";

const imgSGFlag = require("assets/images/sg-flag.png");
const imgMYFlag = require("assets/images/my-flag.png");

export enum LoginRoutes {
  LoginPhoneInputInitial = "LoginPhoneInputInitial",
  LoginPhoneInput = "LoginPhoneInput",
  LoginOtp = "LoginOtp",
}
export interface LoginPhoneInputParamsList extends ParamListBase {
  [LoginRoutes.LoginPhoneInput]: undefined;
  [LoginRoutes.LoginOtp]: {
    countryPrefix: string;
    mobileNo: string;
  };
}

type LoginProps = NativeStackScreenProps<
  LoginPhoneInputParamsList,
  LoginRoutes.LoginPhoneInput
>;

interface IconComponentPhoneProps {
  refff: any;
  flipped: boolean;
}
class IconComponentPhone extends React.Component<IconComponentPhoneProps, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { refff, flipped } = this.props;

    return (
      <FlipCard
        refff={(this as any).props.refff}
        style={{
          flex: 1,
        }}
        friction={6}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={flipped === true} // face = SG
        clickable={true}
        overflow="hidden"
      >
        <StyledBox
          variant="flexcr"
          height="100%"
          overflow="hidden"
          // border
        >
          <Image
            style={{
              marginLeft: -mscale(2),
              marginRight: mscale(5),
              width: mscale(25),
              height: mscale(26),
            }}
            resizeMode="contain"
            source={imgSGFlag}
          />
          <StyledText fontFamily="PoppinsSemiBold">+65</StyledText>
        </StyledBox>
        <StyledBox variant="flexcr" height="100%">
          <Image
            style={{
              marginLeft: -mscale(2),
              marginRight: mscale(5),
              width: mscale(25),
              height: mscale(26),
            }}
            resizeMode="contain"
            source={imgMYFlag}
          />
          <StyledText fontFamily="PoppinsSemiBold">+60</StyledText>
        </StyledBox>
      </FlipCard>
    );
  }
}

const s = StyleSheet.create({
  countryDialing: {
    flex: 1,
  },
  phoneTextInput: {
    flex: 74,
    borderLeftColor: theme.colors.borderGray,
    borderLeftWidth: 1,
    overflow: "hidden",
    fontFamily: "Poppins",
    fontSize: mscale(14),
    color: theme.colors.typography.darkGray,
    textAlignVertical: "center",
    paddingLeft: mscale(14),
    lineHeight: mscale(19),
    minHeight: mscale(45),
  },
});

const RenderCountryDialing = (props: any) => {
  const { flip, setFlip } = props;
  const refFlipCard = React.createRef();

  return (
    <StyledBox
      flex={26}
      overflow="hidden"
      height="auto"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      children={
        <Pressable
          style={{
            flex: 1,
            overflow: "hidden",
          }}
          onPress={setFlip}
        >
          <IconComponentPhone refff={refFlipCard} flipped={flip} />
        </Pressable>
      }
    />
  );
};

interface ValidResult {
  result: "my" | "sg" | "";
  isValidSg: boolean;
  isValidMy: boolean;
  flip: boolean | null;
}
const getValidResult = (number: string): ValidResult => {
  const cleaned = cleanMobileNumber(number) as string;
  const formatted = new AsYouType("MY").input(cleaned);
  const isValidMy = validatePhoneNumber(formatted, "MY")?.valid === true;

  const isValidSg = validatePhoneNumber(formatted, "SG")?.valid === true;
  let flip = isValidSg ? false : null;
  flip = flip === null ? isValidMy || /8|9/.test(number) : null;
  let result = { flip, isValidSg, isValidMy, result: "" as "my" | "sg" | "" };

  if (isValidMy) {
    return { ...result, result: "my" };
  } else if (isValidSg) {
    return { ...result, result: "sg" };
  }

  return result;
};

const RenderPhoneTextInput = (props: any) => {
  const navigation = useNavigation();
  const { onSubmit, editable, setValue, value, valid, currentFlip } = props;
  const cleaned = cleanMobileNumber(value) as string;

  const formatted = new AsYouType("MY").input(cleaned);
  const isValidMy = validatePhoneNumber(formatted, "MY")?.valid === true;

  const isValidSg = validatePhoneNumber(formatted, "SG")?.valid === true;
  let flip = isValidSg ? false : null;
  flip = flip === null ? isValidMy : null;

  const isOk =
    (currentFlip === true && isValidMy) || (currentFlip === false && isValidSg);

  // *Events - did mount
  const onReset = () => {
    setValue("");
  };

  useResetScreen({
    navigation,
    onReset,
  });

  return (
    <TextInput
      style={[
        s.phoneTextInput,
        !isOk ? { color: theme.colors.actions.failureRed } : {},
      ]}
      value={value}
      onChangeText={setValue}
      onSubmitEditing={onSubmit}
      placeholderTextColor={theme.colors.typography.placeholder}
      placeholder={"91234567"}
      keyboardType="number-pad"
      editable={editable}
    />
  );
};

const RenderPhoneInputField = (props: any) => {
  const { setFormValue, setIsFormValid, onSubmit, editable } = props;
  const [flip, setFlip] = useState(false);
  const [valid, setValid] = useState<"my" | "sg" | "">("");
  const [value, setValue] = useState("");

  // *Effect
  useEffect(() => {
    const validResult = getValidResult(value);
    const { isValidMy, isValidSg } = validResult;
    if (isValidSg) {
      setFlip(false);
      setValid("sg");
    } else if (isValidMy) {
      setFlip(true);
      setValid("my");
    } else {
      setValid("");
    }
  }, [value, setFlip]);

  useEffect(() => {
    if (valid === "sg" && flip === false) {
      setIsFormValid("sg");
      setFormValue(value);
    } else if (valid === "my" && flip === true) {
      setIsFormValid("my");
      setFormValue(value);
    } else {
      setIsFormValid("");
      setFormValue("");
    }
  }, [valid, flip, setIsFormValid, value, setFormValue]);

  // *Events
  const onToggle = () => setFlip((prev) => !prev);

  return (
    <StyledBox
      variant="flexcr"
      overflow="hidden"
      borderWidth={1}
      borderColor={theme.colors.borderGray}
      borderRadius={mscale(8)}
      width="97%"
    >
      <RenderCountryDialing
        flip={flip}
        setFlip={() => {
          onToggle();
        }}
      />
      <RenderPhoneTextInput
        onSubmit={onSubmit}
        editable={editable}
        currentFlip={flip}
        value={value}
        setValue={setValue}
        valid={valid}
      />
    </StyledBox>
  );
};

const LoginPhoneInput: React.FC<LoginProps> = ({ navigation }) => {
  const [value, setValue] = useState("");
  const [validResult, setValidResult] = useState("");

  const {
    isLoading: { otpSend: otpSendIsLoading },
    response,
    errors: { otpSend: otpSendErrors },
    submitMobile,
    resetStates: authResetStates,
    refreshAuthStore,

    // work around, not sure why sometimes only refreshAuthStore has the updated data
    setOtpSend,
  } = useAuthStore();
  const { resetStates: buyerResetStates } = useBuyerStore();
  const { otpSend: otpSendResponse } = response;

  // *Events - componentDidMount - also triggers screen onFocus

  const onReset = () => {
    authResetStates("otpSend");
    authResetStates("otpVerify");
    buyerResetStates("getOrCreate");
    buyerResetStates("credits");

    // if you won't call this, "response" will be outdated!
    refreshAuthStore();

    setValue("");
    setValidResult("");
  };
  useResetScreen({
    navigation,
    onReset,
  });

  const cleanValue = cleanMobileNumber(value);

  const countryDialingCode = validResult === "my" ? "60" : "65";
  const onSubmit = () => {
    if (cleanValue) {
      submitMobile(countryDialingCode, cleanValue);
      const d = refreshAuthStore();
      if (d && d?.response?.otpSend?.session_id) {
        asyncNavigateToVerify(d);
      }
    }
  };

  // *Effects

  const isFormValid = validResult !== "";
  const asyncNavigateToVerify = useCallback(
    async (otpSendResponse_) => {
      if (otpSendResponse_ && cleanValue && isFormValid) {
        await authResetStates("otpVerity");
        navigation.navigate(LoginRoutes.LoginOtp, {
          countryPrefix: countryDialingCode,
          mobileNo: cleanValue,
        });
      }
    },
    [countryDialingCode, cleanValue, authResetStates]
  );

  useEffect(() => {
    asyncNavigateToVerify(otpSendResponse);
  }, [asyncNavigateToVerify, otpSendResponse]);

  const statusBarHeight = getStatusBarHeight(Device);
  const hasNotch = statusBarHeight > 20;

  return (
    <KeyboardAvoiding contentStyle={{ paddingHorizontal: mscale(16) }}>
      <View>
        <StyledText
          textAlign="left"
          mt={mscale((hasNotch ? 140 : 95) - getStatusBarHeight(Device))}
          mb={11}
          variant="title"
        >
          Enter your phone number
        </StyledText>
        <RenderPhoneInputField
          editable={!otpSendIsLoading}
          onSubmit={onSubmit}
          setFormValue={setValue}
          setIsFormValid={setValidResult}
        />
        <StyledText
          variant="paragraph"
          marginTop={4}
          fontSize={14}
          lineHeight={14}
        >
          You will receive a one time password (OTP)
        </StyledText>
      </View>
      <ButtonText
        marginBottom={10}
        children={"Proceed"}
        disabled={!isFormValid || otpSendIsLoading}
        variant={!isFormValid || otpSendIsLoading ? "opacity7" : "primary"}
        onPress={onSubmit}
        loading={otpSendIsLoading}
      />
    </KeyboardAvoiding>
  );
};

export default LoginPhoneInput;
