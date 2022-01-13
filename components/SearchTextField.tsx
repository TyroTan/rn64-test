import React from "react";
import { Image, View, Text, TouchableOpacity, Platform } from "react-native";
import styled from "styled-components/native";
import { variant } from "styled-system";
import { mscale } from "utils/scales-util";
import StyledText from "./StyledTexts";
const imgSearchIcon = require("assets/images/search-icon.png");

const isIOS = Platform.OS === "ios";
const ShadowedWrapper = styled.View`
  /* box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.098066); */
  background: #ffffff;
  elevation: 5;
  border-radius: ${mscale(11)};

  top: ${(props: any) => props?.top ?? 0};
  width: ${(props: any) => {
    if (typeof props?.width === "string") return props.width;
    return (props?.width ?? 1) * 0.89;
  }};
  left: ${(props: any) => {
    if (typeof props.left === "string") return props.left;

    return (props?.width ?? 1) * 0.055;
  }};
  position: absolute;
  z-index: 9;

  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${variant({
    variants: {
      normal: {
        // width: "100%",
        marginBottom: mscale(17),
        alignSelf: "center",
        borderRadius: mscale(12),

        shadowColor: isIOS ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, .6)",
        shadowOffset: "0px 2px",
        shadowOpacity: 0.25,
        shadowRadius: mscale(4),
        elevation: 5,
        // backgroundColor: theme.colors.buttons.marineBlue,
      },
    },
  })};
`;

ShadowedWrapper.defaultProps = {
  variant: "normal",
};

const SearchTextInputBase = styled.TextInput`
  /* box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.098066); */
  font-family: "Poppins";
  /* height: 150px; */
  font-size: ${mscale(14)};
  line-height: ${mscale(18)};
  padding-vertical: ${mscale(5)};
  margin-vertical: ${mscale(5)};
  padding-right: ${mscale(5)};
  flex: 1;
  padding-right: ${mscale(8)};

  flex-direction: row;
  justify-content: center;
  align-items: center;

  z-index: 9;

  ${variant({
    variants: {
      normal: {
        // backgroundColor: theme.colors.buttons.marineBlue,
      },
    },
  })};
`;

SearchTextInputBase.defaultProps = {
  variant: "normal",
};

export const SearchTextField = (allProps: any) => {
  const {
    newBgHeight = null,
    newBgWidth = null,
    onSearch,
    left,
    placeholderText,
    ...textInputProps
  } = allProps;
  const top = newBgHeight === null ? mscale(75) : newBgHeight - mscale(27);
  const width = newBgWidth === null ? "89%" : newBgWidth;

  return (
    <ShadowedWrapper top={top} width={width} left={left}>
      {/* <StyledText borderWidth={1} height="100%" /> */}
      <TouchableOpacity onPress={onSearch}>
        <Image
          source={imgSearchIcon}
          resizeMode="contain"
          style={{
            width: mscale(22),
            height: mscale(22),
            margin: mscale(14),
          }}
        />
      </TouchableOpacity>
      <SearchTextInputBase
        textAlignVertical="center"
        placeholder={placeholderText || "Search by name or category"}
        {...textInputProps}
        // editable={false}
      />
    </ShadowedWrapper>
  );
};

export default SearchTextField;
