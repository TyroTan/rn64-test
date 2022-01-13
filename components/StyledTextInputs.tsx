import React, { useRef } from "react";
import { mscale } from "utils/scales-util";
import { theme } from "styles/theme";
import {
  compose,
  variant,
  color,
  border,
  space,
  layout,
  typography,
} from "styled-system";
import styled from "styled-components/native";
import { CSSProps } from "types";
import StyledText from "./StyledTexts";
import StyledBox from "./StyledBoxes";
import { View, TextInput as TextInputRN, Platform } from "react-native";
import type { TextInputProps } from "react-native";

const TextInput = styled.TextInput`
  border-width: 1;
  border-color: ${({ theme }: CSSProps) => theme.colors.typography.gray5};
  border-radius: ${mscale(8)};
  font-size: ${mscale(14)};
  /* line-height: 14; */
  font-family: Poppins;
  padding-vertical: ${mscale(12)};
  padding-horizontal: ${mscale(15)};
  color: ${theme.colors.typography.main};

  ${variant({
    variants: {
      yellowWarning: {
        backgroundColor: theme.colors.actions.yellowWarning3,
      },
      failure: {
        fontFamily: "PoppinsSemiBold",
        borderColor: theme.colors.actions.failureRed,
        color: theme.colors.actions.failureRed,
        textAlign: "left",
      },
    },
  })};

  ${compose(color)};
`;

interface StyledTextInputProps extends TextInputProps {
  label: string;
  onChangeText?: any;
  onBlur?: any;
  labelRequiredSign?: boolean;
  boxProps?: any;
  disabled?: boolean;
  validated?: any;
  refEl?: any;
  color?: string;
  backgroundColor?: string;
}

const StyledTextInputFieldGroup = (allProps: StyledTextInputProps) => {
  const {
    label,
    boxProps,
    validated,
    refEl,
    labelRequiredSign,
    backgroundColor,
    ...textInputProps
  } = allProps;
  const errorMessage = !validated?.isValid && validated?.msg;

  return (
    <StyledBox width="89%" {...boxProps}>
      <StyledText variant="label" labelRequiredSign={labelRequiredSign}>
        {label}
      </StyledText>
      <TextInput
        ref={refEl}
        variant={!errorMessage ? "" : "failure"}
        autoCapitalize="none"
        {...textInputProps}
      />
      <StyledText
        marginLeft={2}
        fontSize={10}
        lineHeight={10}
        height={mscale(14)}
        variant={!errorMessage ? "" : "failure"}
        children={!errorMessage ? "" : errorMessage}
      />
    </StyledBox>
  );
};

export const SDollarTextInput = styled.TextInput`
  border-color: ${({ theme }: CSSProps) => theme.colors.typography.gray5};
  color: ${theme.colors.typography.main};
  border-radius: ${mscale(8)};
  font-size: ${mscale(38)};
  line-height: ${mscale(52)};
  padding-horizontal: ${mscale(8)};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${compose(space, border, color, layout, typography)};

  ${variant({
    variants: {
      normal:
        Platform.OS === "ios"
          ? {
              fontFamily: "PoppinsBold",
            }
          : { fontFamily: "PoppinsBold" },
    },
  })};
`;

SDollarTextInput.defaultProps = {
  variant: "normal",
};

const noopFn = () => {};

export const SDollarTextInputComponent = (allProps: any) => {
  const [value, setValue] = React.useState("");
  const {
    label,
    marginTop = null,
    variant = "normal",
    marginBottom = null,
    wrapperProps = {},
    errorText,
    currencySign,
    ...textInputProps
  } = allProps;

  const wrapperP = {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop,
    marginBottom,
    ...wrapperProps,
  };

  const textInputPropsWithAndroid = {
    ...textInputProps,
    ...(Platform.OS === "ios"
      ? {
          fontFamily: "PoppinsBold",
        }
      : {
          // textVerticalAlign: "center",
          fontFamily: "PoppinsBold",
        }),
  };

  const fontSize =
    variant === "landing" || variant === "landingLengthGT0" ? 40 : 28;
  const fontSizeAmount =
    variant === "landing" ? 43 : variant === "landingLengthGT0" ? 45 : 37;

  const isIOS = Platform.OS === "ios";

  const refText = useRef();

  return (
    <View
      style={wrapperP}
      // onLayout={() => {
      //   console.log("wrapperplayoutt");
      //   (refText.current as any)?.measureInWindow((...prsop: any): any => {
      //     console.log("annyy", prsop);
      //   });
      // }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StyledText
          variant="title"
          fontSize={fontSize}
          lineHeight={fontSize}
          {...textInputPropsWithAndroid}
        >
          {currencySign}
        </StyledText>
        <SDollarTextInput
          ref={refText}
          // onTextLayout={(event: any) => {
          //   var { x, y, width, height } = event.nativeEvent.layout;
          //   console.log("debug lacks width", x, y, width, height);
          // }}
          height={"auto"}
          // padding={0}
          // fontSize={fontSize}
          // lineHeight={fontSizeAmount + 3}
          placeholder={isIOS ? "0.00" : ""}
          {...textInputPropsWithAndroid}
        />
      </View>
      {errorText && (
        <StyledText
          fontFamily={"PoppinsSemiBold"}
          color={theme.colors.actions.failureRed}
          mt={1}
          fontSize={13}
          lineHeight={13}
        >
          {errorText}
        </StyledText>
      )}
      <StyledText
        fontFamily={"PoppinsSemiBold"}
        color={theme.colors.typography.gray1}
        mt={1}
        fontSize={15}
        lineHeight={15}
      >
        {label}
      </StyledText>
    </View>
  );
};

export default StyledTextInputFieldGroup;
