import React from "react";
import { Image, ActivityIndicator, StyleSheet, Platform } from "react-native";
import type { FC } from "react";
import styled from "styled-components/native";
import {
  compose,
  variant,
  space,
  typography,
  layout,
  flexbox,
  color,
  border,
  position,
} from "styled-system";
import { mscale } from "utils/scales-util";
import type { CSSProps } from "types";
import { theme } from "styles/theme";
import { StyledText } from "components/StyledTexts";
import { hexToRGB } from "utils/hex-util";

const imgBackWhite = require("assets/images/back-white.png");

export const FloatingButton = styled.TouchableOpacity`
  background-color: ${({ theme }: CSSProps) => theme.colors.rn64testBlue};
  /* Oval */

  width: ${mscale(66)}px;
  height: ${mscale(66)}px;
  border-radius: ${mscale(33)}px;
  box-shadow: 0px 5px 8px rgba(58, 161, 239, 0.784774);

  elevation: 5;
`;

export const StyledMainButton = styled.TouchableOpacity`
  border-width: 1;
  border-color: ${({ theme }: CSSProps) => theme.colors.buttons.marineBlue};
  border-radius: ${mscale(15)};

  ${variant({
    variants: {
      primary: {
        backgroundColor: theme.colors.buttons.marineBlue,
      },
      secondarySmall: {
        backgroundColor: theme.colors.buttons.secondarySmall,
        borderColor: theme.colors.buttons.secondarySmall,
      },
      primaryInverted: {
        backgroundColor: theme.colors.background2,
      },
      opacity7: {
        backgroundColor: hexToRGB(theme.colors.buttons.marineBlue, 0.7),
      },
    },
  })}

  ${compose(typography, space, position, layout, color, border, flexbox)}
`;

const isIOS = Platform.OS === "ios";
const ButtonTopTabShadowed = styled.TouchableOpacity`
  /* box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.098066); */
  border-radius: ${mscale(10)}px;
  /* box-shadow: 0px 5px 8px rgba(58, 161, 239, 0.784774); */
  /* elevation: 9; */

  ${variant({
    variants: {
      primary: {
        shadowColor: isIOS ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.75)",
        // shadowOffset: {
        //   width: mscale(20),
        //   height: mscale(0),
        // },
        shadowOffset: "0px -6px",
        shadowOpacity: 0.25,
        shadowRadius: mscale(20),
        elevation: 12,

        backgroundColor: theme.colors.buttons.marineBlue,
      },
      primaryInverted: {
        shadowColor: isIOS ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.75)",
        shadowOffset: "0px -6px",
        // shadowOffset: {
        //   width: mscale(20),
        //   height: mscale(0),
        // },
        shadowOpacity: 0.25,
        shadowRadius: mscale(20),
        elevation: 12,

        backgroundColor: theme.colors.background2,
      },
    },
  })}

  ${compose(typography, space, position, layout, color, border, flexbox)}
`;

export const ButtonTopTabShadow = (allProps: any) => {
  const { children, textProps, variant, ...buttonProps } = allProps;

  const mergedButtonProps = {
    variant: variant ?? "primary",
    children:
      typeof children === "string" || Array.isArray(children) ? (
        <StyledText
          children={children}
          fontSize={12}
          lineHeight={28}
          fontFamily={"PoppinsSemiBold"}
          alignContent="center"
          textAlignVertical="center"
          color={
            variant === "primary"
              ? theme.colors.typography.mainInverse
              : theme.colors.typography.main
          }
          {...textProps}
        />
      ) : (
        children
      ),
    alignSelf: "center",
    ...buttonProps,
  };

  return <ButtonTopTabShadowed {...mergedButtonProps} />;
};

type ButtonTextProps = any;

const Loader = (props: any) => {
  const defaultStyle = {
    width: mscale(47),
    height: mscale(47),
    alignSelf: "center",
  };
  const styleLoaderStore = props?.style ?? {};
  const { style: _, source, ...restLoaderProps } = props;

  const mergedLoaderProps = {
    size: mscale(30),
    ...restLoaderProps,
    style: StyleSheet.create({
      loaderStyle: {
        ...defaultStyle,
        ...styleLoaderStore,
      },
    }).loaderStyle,
  };

  return <ActivityIndicator {...mergedLoaderProps} />;
};

export const ButtonText: FC<ButtonTextProps> = (props) => {
  const {
    textProps = {},
    loaderProps = {},
    loading = false,
    children,
    ...buttonProps
  } = props ?? {};

  const buttonVariant = buttonProps?.variant;
  const mergedTextProps = {
    variant:
      buttonVariant === "primaryInverted" ? "buttonTextInverted" : "buttonText",
    ...textProps,
  };

  loaderProps.color =
    buttonVariant === "primaryInverted"
      ? theme.colors.rn64testBlue
      : theme.colors.background2;

  const mergedButtonProps = {
    variant: "primary",
    children: loading ? (
      <Loader {...loaderProps} />
    ) : typeof children === "string" || Array.isArray(children) ? (
      <StyledText {...mergedTextProps} children={children} />
    ) : (
      children
    ),
    width: "82%",
    alignSelf: "center",
    ...buttonProps,
  };

  return <StyledMainButton {...mergedButtonProps} />;
};

export default ButtonText;

export const ButtonTextSmall: FC<ButtonTextProps> = (props) => {
  const {
    textProps = {},
    loaderProps = {},
    loading = false,
    children,
    ...buttonProps
  } = props ?? {};

  const buttonVariant = buttonProps?.variant;
  const mergedTextProps = {
    variant:
      buttonVariant === "primaryInverted"
        ? "buttonTextInverted"
        : "buttonTextSmall",
    ...textProps,
  };

  loaderProps.color =
    buttonVariant === "primaryInverted"
      ? theme.colors.rn64testBlue
      : theme.colors.background2;

  const mergedButtonProps = {
    variant: "primary",
    children: loading ? (
      <Loader {...loaderProps} />
    ) : typeof children === "string" || Array.isArray(children) ? (
      <StyledText {...mergedTextProps} children={children} />
    ) : (
      children
    ),
    // width: "130%",
    minWidth: mscale(104),
    paddingLeft: mscale(10),
    paddingRight: mscale(10),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: mscale(10),
    ...buttonProps,
  };

  return <StyledMainButton {...mergedButtonProps} />;
};

const BackBlendingBtnBase = styled.TouchableOpacity`
  position: absolute;
  width: ${mscale(36)};
  height: ${mscale(36)};
  left: ${mscale(26)};
  top: ${mscale(44)};

  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: ${mscale(40)};

  background: ${hexToRGB("#FFFFFF", 0.26)};
  /* opacity: 0.26; */
  z-index: 12;
`;

export const BackBlendingBtn = ({ onPress }: any) => {
  return (
    <BackBlendingBtnBase onPress={onPress}>
      <Image
        source={imgBackWhite}
        resizeMode="contain"
        style={{
          margin: mscale(2),
          width: mscale(16),
          height: mscale(16),
          borderColor: "red",
        }}
      />
    </BackBlendingBtnBase>
  );
};
