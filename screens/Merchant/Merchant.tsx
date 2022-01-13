import React, { useEffect, useMemo, useState } from "react";
import * as Device from "expo-device";

import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable as Button,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  CardListView,
  Card,
  StyledText,
  KeyboardAvoiding,
  StyledBox,
  StyledScrollView,
  KeyboardAwareScrollView,
  StyledSafeAreaView,
  ProgressCircleLayered,
  ButtonTextSmall,
  CardListItemDivider,
  BackBlendingBtn,
  ButtonText,
} from "components";
import { theme } from "styles/theme";
import { useAuthStore } from "stores";
const imgMerchantProfile = require("assets/images/dummy-merchant-profile.png");
const imgCaretUp = require("assets/images/caret-up-black.png");
const imgCaretDown = require("assets/images/caret-down-black.png");

import { useDisableAndroidBackHook } from "hooks";
import Layout from "constants/Layout";
import MerchantPageRoutes from "./MerchantRoutes";

export interface MerchantParamsList extends ParamListBase {
  [MerchantPageRoutes.MerchantPageInitial]: undefined;
}

type MerchantProps = NativeStackScreenProps<
  MerchantParamsList,
  MerchantPageRoutes.MerchantPageInitial
>;

const StyledBGHeader = ({
  onChangeHeaderBgImageDimension,
  onGoBack,
}: {
  onGoBack: () => void;
  onChangeHeaderBgImageDimension: ({
    finalHeight,
    finalWidth,
  }: {
    finalHeight: number;
    finalWidth: number;
  }) => void;
}) => {
  const [height, setHeight] = useState(0);
  const assetImgSrc = Image.resolveAssetSource(imgMerchantProfile);
  const { width, height: layoutHeight } = Layout?.window ?? {};

  useEffect(() => {
    const srcHeight = assetImgSrc?.height ?? 1,
      srcWidth = assetImgSrc?.width ?? 1;
    const maxHeight = layoutHeight ?? 1;
    const maxWidth = width ?? 1;
    const ratio = Math.min(
      maxWidth / (srcWidth ?? 1),
      maxHeight / (srcHeight ?? 1)
    );
    const finalHeight = srcHeight * ratio;
    setHeight(finalHeight);
    onChangeHeaderBgImageDimension({
      finalHeight,
      finalWidth: srcWidth * ratio,
    });
  }, [layoutHeight, width, assetImgSrc]);

  return (
    <>
      <Image
        resizeMode="contain"
        source={imgMerchantProfile}
        style={{
          position: "absolute",
          top: 0,
          height: height,
          width: width,
          zIndex: 1,
        }}
      />
      <BackBlendingBtn onPress={onGoBack} />
    </>
  );
};

const RenderAccordion = () => {
  const [collapsed, setCollapsed] = useState(false);
  const imgCaret = collapsed ? imgCaretUp : imgCaretDown;

  const onToggleAccordion = () => setCollapsed((prev) => !prev);

  const Field = () => {
    return (
      <StyledBox variant="flexcr" justifyContent="space-between">
        <StyledText variant="titleSecondarySemi">Store Locations</StyledText>
        <TouchableOpacity onPress={onToggleAccordion}>
          <Image
            source={imgCaret}
            resizeMode="contain"
            style={{ margin: mscale(2), width: mscale(18), height: mscale(18) }}
          />
        </TouchableOpacity>
      </StyledBox>
    );
  };

  if (collapsed) {
    return (
      <>
        <Field />
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E3E3E3",
            borderWidth: 1,
            borderRadius: mscale(15),
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingVertical: mscale(11),
            paddingHorizontal: mscale(16),
          }}
        >
          <StyledText variant="titleSecondarySemi">IKEA Tampines</StyledText>
          <StyledText variant="paragraphSmallest" fontSize={mscale(12.5)}>
            60 Tampines North Drive 2, Singapore
          </StyledText>
          <StyledText variant="paragraphSmallest" fontSize={mscale(12.5)}>
            528764
          </StyledText>
        </View>
      </>
    );
  }

  return <Field />;
};

const Merchant: React.FC<MerchantProps> = (props: any) => {
  const { navigation } = props;
  useDisableAndroidBackHook();
  const [newBgHeight, setNewBgHeight] = useState(0);
  const [newBgWidth, setNewBgWidth] = useState(0);

  const onSetNewDimension = (dim: {
    finalHeight: number;
    finalWidth: number;
  }) => {
    if (dim?.finalHeight) {
      setNewBgHeight(dim.finalHeight);
      setNewBgWidth(dim.finalWidth);
    }
  };

  // useEffect(() => {
  //   console.log("newBgHeight v newBgWidth", newBgHeight, newBgWidth);
  // }, [newBgHeight, newBgWidth]);

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: "transparent",
      }}
    >
      <StyledBGHeader
        onGoBack={navigation.goBack}
        onChangeHeaderBgImageDimension={onSetNewDimension}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={{
          zIndex: 11,
          position: "absolute",
        }}
        contentContainerStyle={{
          backgroundColor: "#FFF",
          width: "100%",
          // height: "120%",
          marginTop: newBgHeight - mscale(52),
          paddingTop: mscale(60),
          paddingHorizontal: "5%",
          shadowColor: "rgba(0, 0, 0, 0.188893)",
          shadowOpacity: 0.19,
          shadowRadius: 9,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          elevation: 7,

          borderTopRightRadius: mscale(16),
          borderTopLeftRadius: mscale(16),
          // paddingHorizontal: mscale(2),
          // height: mscale(95),
        }}
      >
        <StyledText
          variant="title"
          textAlign="left"
          mb={5}
          // marginLeft={mscale(23)}
        >
          IKEA
        </StyledText>
        <StyledText variant="paragraphSmall" textAlign="left" mb={10}>
          This is still a dummy text and will be worked on after we have some
          agreement regarding the look and feel
        </StyledText>
        <StyledText variant="titleSemi" textAlign="left" mb={2}>
          Highlighted Product
        </StyledText>
        <RenderAccordion />
      </KeyboardAwareScrollView>
      <ButtonText
        position="absolute"
        bottom={getStatusBarHeight(Device) + mscale(5)}
        children={"Visit Website"}
        variant={"primaryInverted"}
      />
    </View>
  );
};

export default Merchant;
