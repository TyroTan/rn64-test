import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { LoginOtp } from "screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login, { LoginRoutes } from "screens/Login";
import { CreditRemainingMyInfoRoutes } from "screens/Credit/CreditRemaining";
import CreditHomeTabNavigator from "navigation/Credit/CreditHomeTabNavigator";
import { MyInfoSingpassWebview } from "screens/MyInfo";
import * as Device from "expo-device";
import { StyledBox, StyledText, StyledTextInputFieldGroup } from "components";
import { NavigationContainer } from "@react-navigation/native";
import { theme } from "styles/theme";
import { hasNotch, mscale } from "utils/scales-util";
import {
  removeTokenLocalDb,
  removeMyinfoOauthStateLocalDb,
} from "utils/async-storage-util";
import { useBuyerStore, useAuthStore, useUserStore } from "stores";
import { hexToRGB } from "utils/hex-util";
import Layout from "constants/Layout";
import { getStatusBarHeight } from "react-native-status-bar-height";
import RenderMonthsBtn from "./RenderMonthsBtn";

const imgIconHome = require("assets/images/icon-bottom-home.png");
const imgIconCredit = require("assets/images/icon-bottom-credit.png");
// const imgIconQR = require("assets/images/icon-bottom-qr.png");
const imgIconBuy = require("assets/images/icon-bottom-buy.png");
const imgIconProfile = require("assets/images/icon-bottom-profile.png");

const imgIconHomeActive = require("assets/images/icon-bottom-home-active.png");
const imgIconCreditActive = require("assets/images/icon-bottom-credit-active.png");
const imgIconQRActive = require("assets/images/icon-bottom-qr.png");
const imgIconBuyActive = require("assets/images/icon-bottom-buy-active.png");
const imgIconProfileActive = require("assets/images/icon-bottom-profile-active.png");

const RenderYearMonthPicker = (props: any) => {
  const { params } = props?.route ?? {};
  const [monthSelected, setMonthSelected] = useState(-1);
  React.useEffect(() => {}, [monthSelected]);
  const [year, setYear] = useState(new Date().getFullYear().toString());

  // *Methods
  const onNextYear = () =>
    setYear((current) => (Number(current) + 1).toString());
  const onPrevYear = () =>
    setYear((current) => (Number(current) - 1).toString());

  const { height: screenHeight, width: screenWidth } = Layout.screen;

  return (
    <StyledBox
      height={screenHeight * 0.5}
      width={screenWidth * 0.6}
      alignSelf="center"
      // padding={mscale(80)}
      variant="flexcr"
      // flexDirection="column"
    >
      <StyledBox variant="flexcr">
        <TouchableOpacity
          style={{
            flex: 1,
            padding: mscale(5),
            width: mscale(30),
            height: mscale(30),
            backgroundColor: theme.colors.background2,
          }}
          onPress={onPrevYear}
        >
          <Image
            style={{
              width: mscale(20),
              height: mscale(20),
            }}
            resizeMode="contain"
            source={imgIconBuy}
          />
        </TouchableOpacity>
        <StyledBox border borderColor="green" flex={3}>
          <StyledText width="100%">{year}</StyledText>
        </StyledBox>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: mscale(5),
            width: mscale(30),
            height: mscale(30),
            backgroundColor: theme.colors.background2,
          }}
          onPress={onNextYear}
        >
          <Image
            style={{
              width: mscale(20),
              height: mscale(20),
            }}
            resizeMode="contain"
            source={imgIconBuy}
          />
        </TouchableOpacity>
      </StyledBox>
      {/* <RenderMonthsBtn
        padding={mscale(5)}
        onSelect={(month: number) => {
          setMonthSelected(month);
        }}
      /> */}
    </StyledBox>
  );
};

export default RenderYearMonthPicker;
