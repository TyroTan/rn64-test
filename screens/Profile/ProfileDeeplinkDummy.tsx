import React, { useEffect, useMemo, useState } from "react";
import * as Device from "expo-device";
import Constants from "expo-constants";

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
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  CardListView,
  Card,
  StyledText,
  KeyboardAvoiding,
  StyledBox,
  StyledScrollView,
  KeyboardAwareScrollView,
  StyledMainButton as CardListViewBtn,
  CardListItem,
  StyledTextInputFieldGroup,
} from "components";
import { theme } from "styles/theme";
import { useAuthStore, useBuyerStore, useUserStore } from "stores";
const imgBGProfileBlue = require("assets/images/bg-transaction-blue.png");
const imgCredit = require("assets/images/menu-icon-credit.png");
const imgBell = require("assets/images/menu-icon-bell.png");
const imgPhone = require("assets/images/menu-icon-phone.png");
const imgFaq = require("assets/images/menu-icon-faq.png");
const imgTof = require("assets/images/menu-icon-tof.png");
const imgSettings = require("assets/images/menu-icon-settings.png");
const imgLogout = require("assets/images/menu-icon-logout.png");

import { useDisableAndroidBackHook, useResetScreen } from "hooks";
import Layout from "constants/Layout";
import { hexToRGB } from "utils/hex-util";
import { getKycsObject, logoutAlert } from "utils/utils-common";
import {
  ProfileParamsList,
  ProfileRoutes,
} from "screens/Profile/ProfileRoutes";
import type { UserSession } from "stores/useUserStore";

type ProfileProps = NativeStackScreenProps<
  ProfileParamsList,
  ProfileRoutes.ProfileInitial
>;

const MenuItem = (props: any) => {
  const { iconSize = 19, iconSource, label, color, last, ...btnProps } = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: mscale(14.5),
        paddingLeft: mscale(28),
        borderBottomWidth: mscale(last ? 0 : 0.5),
        borderColor: "#DCDCDC",
        ...{ ...(last ? { paddingVertical: mscale(16) } : {}) },
      }}
      {...btnProps}
    >
      <Image
        source={iconSource}
        resizeMode="contain"
        style={{ width: mscale(iconSize), height: mscale(iconSize) }}
      />
      <StyledText
        variant="titleSecondary"
        fontFamily={"PoppinsSemiBold"}
        color={color}
        ml={5}
      >
        {label}
      </StyledText>
    </TouchableOpacity>
  );
};

const ProfileDeeplinkDummy = () => {
  const {
    setLoginShowSplash,
    response: { user },
  } = useUserStore();

  // https://buyer-dev.rn64test.com/sg/b/oc/aHNs72LSNPFgKRMflB
  // SG-S-YXJ9NEPZJ4GL
  // const defaultValue = "aHNs72LSNPFgKRMflB";
  const defaultValue = "SG-S-JXJAJWW87CEX";

  const [value, setValue] = useState(defaultValue);
  const responseUser = user as UserSession;
  const isDevUser =
    responseUser.data?.full_mobile_number?.includes("9999") ||
    responseUser.data?.full_mobile_number?.includes("8888") ||
    responseUser.data?.full_mobile_number?.includes("98765432");

  const onSendStoreId = () => {
    if (!value) return;

    setLoginShowSplash({
      landingToScreenParam: "OrderDL",
      //   isOrderDeepLinkParam: true, //url.includes("ab;),
      deeplinkUrlSearchParams: {
        type: "store_id",
        data: { storeId: value },
        // data: { storeId: "aHNs72LSNPFgKRMflB" },
      },
    } as any);
  };

  const onSendOrderCampaignId = () => {
    if (!value) return;

    setLoginShowSplash({
      landingToScreenParam: "OrderDL",
      //   isOrderDeepLinkParam: true, //url.includes("ab;),
      deeplinkUrlSearchParams: {
        type: "order_campaign_referred_code",
        data: { orderCampaignReferredCode: value },
        // data: { storeId: "aHNs72LSNPFgKRMflB" },
      },
    } as any);
  };

  const onSendCheckoutId = () => {
    if (!value) return;

    setLoginShowSplash({
      landingToScreenParam: "OrderDL",
      //   isOrderDeepLinkParam: true, //url.includes("ab;),
      deeplinkUrlSearchParams: {
        type: "checkout_id",
        data: { checkoutId: value },
      },
    } as any);
  };

  if (!isDevUser) return <></>;

  //   "store_id"
  //   | "order_campaign_referred_code"
  //   | "checkout_id???";

  const valueField = {
    label: "ID",
    // boxProps,
    validated: { isValid: true },
    // refEl,
    // labelRequiredSign,
    // backgroundColor,
    defaultValue,

    onChangeText: setValue,
  };

  return (
    <StyledBox
      flex={1}
      width={"90%"}
      marginLeft={"5%"}
      marginTop={getStatusBarHeight(Device)}
    >
      <StyledTextInputFieldGroup
        boxProps={{ width: "100%", marginTop: mscale(15) }}
        {...valueField}
      />
      <MenuItem
        iconSource={imgSettings}
        label={`Send as Store ID`}
        iconSize={21}
        onPress={onSendStoreId}
      />
      <MenuItem
        iconSource={imgSettings}
        label={`Send as Order Campaign ID`}
        iconSize={21}
        onPress={onSendOrderCampaignId}
      />
      <MenuItem
        iconSource={imgSettings}
        label={`Send as Checkout ID`}
        iconSize={21}
        onPress={onSendCheckoutId}
      />
    </StyledBox>
  );
};

export default ProfileDeeplinkDummy;
