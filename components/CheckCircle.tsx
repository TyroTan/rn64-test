import React from "react";
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { theme } from "styles/theme";
import { mscale } from "utils/scales-util";
const imgCheck = require("assets/images/white-check.png");
const imgCheckGray = require("assets/images/gray-check.png");
const imgCheckRed = require("assets/images/red-check.png");
const imgCheckBlue = require("assets/images/blue-check.png");
const imgCheckWhite = require("assets/images/white-check.png");

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: mscale(14),
    borderWidth: mscale(2),
    borderColor: theme.colors.typography.gray6,
    // backgroundColor: theme.colors.typography.main,
  },
  checked: {
    backgroundColor: theme.colors.progressbar.barGreen1,
    borderColor: theme.colors.progressbar.barGreen1,
  },
  img: {
    // height: mscale(13),
    width: mscale(14),
  },
});

const RenderImg = (allProps: any) => {
  const { style, source, width, ...props } = allProps;
  const mergedProps = {
    ...props,
    style: {
      ...styles.img,
      ...style,
      width,
    },
    source,
  };
  return <Image {...mergedProps} />;
};

export const CheckCircleMain = (allProps: any) => {
  const {
    size,
    borderColor,
    borderWidth = styles.btn.borderWidth,
    checked,
    style,
    imgProps = {},
    source,
    ...props
  } = allProps;
  const imgSource = source ?? (checked ? imgCheck : imgCheckGray);
  const sizeBtn = size ?? mscale(28);
  const sizeCheck = sizeBtn / 2;
  const sizeBorderRadius = sizeCheck;
  const mergedProps = {
    ...props,
    style: [
      {
        ...styles.btn,
        borderColor: borderColor ?? styles.btn.borderColor,
        borderWidth: borderWidth,
        borderRadius: sizeBorderRadius,
        height: size ?? mscale(28),
        width: size ?? mscale(28),
        ...style,
      },
      checked ? styles.checked : {},
    ],
  };

  const imgPropsAll = {
    resizeMode: "contain",
    ...imgProps,
  };

  const mergedImgProps = {
    width: sizeCheck,
    ...imgPropsAll,
    source: imgPropsAll?.source ?? imgSource,
  };

  return (
    <View style={styles.btn} {...mergedProps}>
      <RenderImg {...mergedImgProps} />
    </View>
  );
};

export type CheckCircleVariant =
  | "redInverted"
  | "red"
  | "blueInverted"
  | "blue"
  | "green";

const CheckCircle = (allProps: any) => {
  const { variant, ...props } = allProps;
  switch (variant) {
    case "redInverted":
      return (
        <CheckCircleMain
          borderColor={theme.colors.typography.red1}
          source={imgCheckRed}
          {...props}
        />
      );
    case "red":
      return (
        <CheckCircleMain
          borderWidth={null}
          backgroundColor={theme.colors.typography.red1}
          source={imgCheckWhite}
          {...props}
        />
      );
    case "blueInverted":
      return (
        <CheckCircleMain
          borderColor={theme.colors.rn64testBlue}
          source={imgCheckBlue}
          {...props}
        />
      );
    case "blue":
      return (
        <CheckCircleMain
          borderWidth={null}
          backgroundColor={theme.colors.rn64testBlue}
          source={imgCheckWhite}
          {...props}
        />
      );
    case "green":
      return (
        <CheckCircleMain
          borderWidth={null}
          backgroundColor={theme.colors.progressbar.barGreen1}
          source={imgCheckWhite}
          {...props}
        />
      );

    default:
      return <CheckCircleMain {...props} />;
  }
};

export default CheckCircle;
