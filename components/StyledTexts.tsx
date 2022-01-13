import styled from "styled-components/native";
import React from "react";
import {
  variant,
  space,
  typography,
  compose,
  layout,
  color,
  border,
} from "styled-system";
import { mscale } from "utils/scales-util";
import { theme } from "styles/theme";
import { CSSProps } from "types";
import { View } from "react-native";

const buttonText = {
  fontFamily: "PoppinsSemiBold",
  color: theme.colors.background2,
  textTransform: "uppercase",
  letterSpacing: 2,
  fontSize: 12,
  lineHeight: 35,
};

const StyledTextBase = styled.Text`
  font-family: Poppins;
  letter-spacing: 0;
  text-align: center;
  font-size: ${mscale(12)};
  line-height: ${mscale(17)};
  color: ${({ theme }: CSSProps) => theme.colors.typography.main};

  ${variant({
    variants: {
      title: {
        fontFamily: "PoppinsBold",
        fontSize: 21,
        lineHeight: 21,
      },
      titleSemi: {
        fontFamily: "PoppinsBold",
        fontSize: 17,
        lineHeight: 17,
      },
      titleSecondary: {
        fontFamily: "PoppinsBold",
        fontSize: 14,
        lineHeight: 14,
      },
      titleModalBottom: {
        fontFamily: "PoppinsBold",
        fontSize: 15,
        lineHeight: 15,
      },
      paragraph: {
        color: theme.colors.typography.gray1,
        fontSize: 16,
        lineHeight: 18,
      },
      paragraphSmall: {
        color: theme.colors.typography.gray1,
        fontSize: 14,
        lineHeight: 16,
      },
      paragraphSmallest: {
        color: theme.colors.typography.gray1,
        fontSize: 10,
        lineHeight: 12,
      },
      paragraphModalBottom: {
        color: theme.colors.typography.gray1,
        fontSize: 14,
        lineHeight: 15,
      },
      buttonText: buttonText,
      buttonTextInverted: {
        ...buttonText,
        color: theme.colors.buttons.marineBlue,
      },
      buttonTextSmall: {
        ...buttonText,
        fontFamily: "PoppinsBold",
        letterSpacing: 0,
        textTransform: "none",
        fontSize: 12,
        lineHeight: 22,
      },
      failure: {
        fontFamily: "PoppinsSemiBold",
        color: theme.colors.actions.failureRed,
        textAlign: "left",
      },
      textField: {
        fontFamily: "PoppinsSemiBold",
        paddingHorizontal: mscale(12),
      },
      label: {
        color: "black",
        textAlign: "left",
        fontFamily: "PoppinsSemiBold",
      },
      mainBlue: {
        fontSize: 13,
        lineHeight: 13,
        fontFamily: "PoppinsBold",
        color: theme.colors.rn64testBlue,
        textAlign: "left",
      },
      titleSecondaryGray: {
        color: theme.colors.typography.gray1,
        fontFamily: "PoppinsBold",
        fontSize: 13,
        lineHeight: 13,
      },
      titleSecondarySemi: {
        fontFamily: "PoppinsBold",
        fontSize: 13,
        lineHeight: 13,
      },
      walkthrough: {
        fontSize: mscale(11.5),
        lineHeight: 11,
        fontFamily: "PoppinsMedium",
        color: theme.colors.typography.mainInverse,
        textAlign: "left",
      },
      titleTertiary: {
        fontSize: 12,
        lineHeight: 12,
        fontFamily: "PoppinsSemiBold",
        alignContent: "center",
      },
    },
  })};

  ${compose(space, border, color, layout, typography)};
`;

export const StyledText = (allProps: any) => {
  const { labelRequiredSign } = allProps ?? {};

  if (labelRequiredSign) {
    const { labelRequiredSign: _, children, ...props } = allProps;
    return (
      <StyledTextBase {...props}>
        {children}
        <StyledTextBase color={theme.colors.actions.failureRed} fontSize={14}>
          {"*"}
        </StyledTextBase>
      </StyledTextBase>
    );
  }

  return <StyledTextBase {...allProps} />;
};

export const PrivacyPolicyText = ({ ...allProps }) => {
  return (
    <StyledText variant="paragraph" fontSize={9} {...allProps}>
      Your data will be kept safe according to our
      <StyledText
        variant="paragraph"
        fontSize={10}
        color={theme.colors.buttons.marineBlue}
      >
        {" "}
        Privacy Policy
      </StyledText>
    </StyledText>
  );
};

export const SDollarText = styled.Text`
  border-color: ${({ theme }: CSSProps) => theme.colors.typography.gray5};
  border-radius: ${mscale(8)};
  font-size: ${mscale(38)};
  line-height: ${mscale(52)};
  font-family: PoppinsBold;
  color: ${theme.colors.typography.main};
  padding-horizontal: ${mscale(8)};
  flex-direction: row;
  align-items: center;
  justify-content: center;

  ${compose(space, border, color, layout, typography)};
`;

export const ProgressLabel = ({
  text,
  currencySign,
  amount,
  ...props
}: any) => {
  const t = `You have %s of available credit `;
  const splitIn3 = t.split("%s");
  return (
    <StyledText
      color={theme.colors.lockGray}
      fontFamily="PoppinsSemiBold"
      fontSize={10}
      lineHeight={10}
      {...props}
    >
      {splitIn3[0]}{" "}
      <StyledText fontFamily="PoppinsBold" color={theme.colors.lockGray}>
        {currencySign}
        {amount}
      </StyledText>{" "}
      {splitIn3[1]}
    </StyledText>
  );
};

export const SDollarTextComponent = (allProps: any) => {
  const {
    label,
    value,
    marginTop = null,
    marginBottom = null,
    wrapperProps = {},
    variant = "normal",
    currencySign,
    ...textProps
  } = allProps;

  const wrapperP = {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop,
    marginBottom,
    ...wrapperProps,
  };

  const fontSize = variant === "landing" ? 43 : 28;
  const fontSizeAmount = variant === "landing" ? 43 : 32;

  return (
    <View style={wrapperP}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <StyledText variant="title" fontSize={fontSize} lineHeight={fontSize}>
          {currencySign}
          <SDollarText
            value={value}
            {...textProps}
            fontSize={fontSize}
            lineHeight={fontSize + 2}
            children={value}
          />
        </StyledText>
      </View>
      <StyledText
        fontFamily={"PoppinsSemiBold"}
        color={theme.colors.typography.gray1}
        fontSize={15}
        lineHeight={15}
      >
        {label}
      </StyledText>
    </View>
  );
};

export default StyledText;
