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
import CheckCircle from "components/CheckCircle";
const imgCheck = require("assets/images/white-check.png");
const imgCheckBlue = require("assets/images/blue-check.png");

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  item: {
    borderLeftWidth: mscale(2),
    borderColor: theme.colors.typography.gray6,
    height: mscale(50),
    width: mscale(2),
  },
  last: {
    borderColor: "transparent",
  },
});

const StepItem = (propsAll: any) => {
  const { variant, last } = propsAll;
  return (
    <View style={[styles.item, last ? styles.last : {}]}>
      <CheckCircle
        style={{
          marginLeft: mscale(-10),
          marginTop: mscale(-10),
          zIndex: 1,
          backgroundColor: theme.colors.background2,
        }}
        size={mscale(20)}
        variant={variant}
      />
    </View>
  );
};

const getVariantByIndex = (
  position: number,
  current: {
    index: number;
    overdue?: boolean;
    mode?: "greenThemed";
  }
) => {
  const { index: currentIndex, overdue, mode } = current;
  const isGreenThemed = mode === "greenThemed";

  if (position < currentIndex) {
    return isGreenThemed ? "green" : "blue";
  } else if (position === currentIndex) {
    if (overdue) {
      return "redInverted";
    }

    return isGreenThemed ? null : "blueInverted";
  } else {
    return null;
  }
};

const StepsVertical = (allProps: any) => {
  const { style, current: currentProps = 0, count = 5 } = allProps;
  const current =
    typeof currentProps === "number"
      ? {
          index: currentProps,
        }
      : {
          index: currentProps.index,
          overdue: currentProps.overdue,
          mode: currentProps?.mode,
        };

  return (
    <View style={[styles.wrapper, style]}>
      {new Array(count).fill("")?.map((_: any, i) => (
        <StepItem
          last={i + 1 === count}
          variant={getVariantByIndex(i, current)}
        />
      ))}
      {/* <StepItem variant={getVariantByIndex(1, current)} />
      <StepItem variant={getVariantByIndex(2, current)} />
      <StepItem variant={getVariantByIndex(3, current)} />
      <StepItem last variant={getVariantByIndex(4, current)} /> */}
    </View>
  );
};

export default StepsVertical;
