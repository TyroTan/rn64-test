import React, { useEffect } from "react";

import styled from "styled-components/native";
import {
  variant,
  border,
  compose,
  layout,
  flexbox,
  color,
  space,
} from "styled-system";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import type { ImageURISource, ViewProps } from "react-native";
import StyledBox from "./StyledBoxes";
import { theme } from "styles/theme";
import type { CSSProps } from "types";
import { mscale } from "utils/scales-util";

// !TODO remove this
const imgMerchantDummy = require("assets/images/bg-safe-and-secure.png");

const isIOS = Platform.OS === "ios";
const StyledImg = styled.Image`
  height: ${mscale(57)};
  width: ${mscale(57)};
  /* border-width: 2px; */
`;

const StyledMerchantImgWrapper = styled.View`
  background-color: #fff;
  padding: 3px;
  /* box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.098066); */
  /* box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.098066); */
  /* elevation: 9; */
  border-radius: ${mscale(12)};

  ${variant({
    variants: {
      normal: {
        shadowColor: isIOS ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0.8)",
        shadowOffset: "0px 3px",
        shadowOpacity: 0.25,
        shadowRadius: mscale(7),
        elevation: 5,
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
      },
    },
  })};
`;

StyledMerchantImgWrapper.defaultProps = {
  variant: "normal",
};

const StyledMerchantBanner = (allProps: any) => {
  const { imgProps = {}, source, ...props } = allProps;
  const mergedImgProps = {
    source: source ?? imgMerchantDummy,
    resizeMode: "center",
    ...imgProps,
  };
  return (
    <StyledMerchantImgWrapper {...props}>
      <StyledImg resizeMode="center" {...mergedImgProps} />
    </StyledMerchantImgWrapper>
  );
};

export default StyledMerchantBanner;
