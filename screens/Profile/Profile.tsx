import React, { useEffect, useMemo, useState } from "react";
import * as Updates from "expo-updates";
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
import { mscale } from "utils/scales-util";
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

type ProfileProps = NativeStackScreenProps<
  ProfileParamsList,
  ProfileRoutes.ProfileInitial
>;

const StyledBGHeader = ({
  onChangeHeaderBgImageDimension,
}: {
  onChangeHeaderBgImageDimension: ({
    finalHeight,
    finalWidth,
  }: {
    finalHeight: number;
    finalWidth: number;
  }) => void;
}) => {
  const {
    response: { user: responseUser },
  } = useUserStore();
  const [height, setHeight] = useState(0);
  const assetImgSrc = Image.resolveAssetSource(imgBGProfileBlue);
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
        source={imgBGProfileBlue}
        style={{
          position: "absolute",
          top: 0,
          height: height,
          width: width,
          zIndex: 1,
        }}
      />
      <StyledBox
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-end"
        width={width * 0.9}
        marginLeft={width * 0.05}
        height={height}
        backgroundColor="transparent"
        paddingBottom={6}
        postion="absolute"
        zIndex={2}
        // padding={10}
      >
        <StyledText variant="title" color={theme.colors.background2} mb={14}>
          John Doe {responseUser.data.full_mobile_number}
        </StyledText>
      </StyledBox>
    </>
  );
};

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

const useNavigationLogic = ({ route, navigation }: any) => {
  const { name: routeName, params = {} } = route;

  const onNavFocus = () => {
    if (routeName === ProfileRoutes.AddPaymentMethodSuccess) {
      // reset to credit remaining
    }
  };

  useResetScreen({
    navigation,
    onReset: onNavFocus,
  });

  const onEnd = () => {
    // setFromAddPaymentMethodSuccess({
    //   goToHomeCreditRemaining: true,
    // });
    // navigation.pop(5);
  };

  return {
    onEnd,
  };
};

const Profile: React.FC<ProfileProps> = (props: any) => {
  const { navigation } = props;
  useDisableAndroidBackHook();
  const {
    logoutUserShowSplash,
    response: { user },
  } = useUserStore();

  const isDevUser =
    user.data?.full_mobile_number?.includes("9999") ||
    user.data?.full_mobile_number?.includes("8888") ||
    user.data?.full_mobile_number?.includes("98765432");

  const { resetStates: authResetStates } = useAuthStore();
  const {
    resetStates: buyerResetStates,
    response: { credits: responseCredits },
  } = useBuyerStore();
  const [newBgHeight, setNewBgHeight] = useState(0);
  const [newBgWidth, setNewBgWidth] = useState(0);
  useNavigationLogic(props);

  const onSetNewDimension = (dim: {
    finalHeight: number;
    finalWidth: number;
  }) => {
    if (dim?.finalHeight) {
      setNewBgHeight(dim.finalHeight);
      setNewBgWidth(dim.finalWidth);
    }
  };

  /* *Events */
  const onLogout = () => {
    logoutAlert(async () => {
      logoutUserShowSplash({
        authResetStates: async () => {
          await buyerResetStates("getOrCreate");
          await authResetStates("otpSend");
          await authResetStates("otpVerify");
        },
      });
    });
  };

  /* *Navigators */
  const onGotoPaymentMethod = () => {
    const hasNoCard =
      getKycsObject(responseCredits)?.sg_payment_method === "incomplete";

    // for no payment method

    if (hasNoCard) {
      return navigation.navigate(ProfileRoutes.NoPaymentMethod);
    }

    return navigation.navigate(ProfileRoutes.PaymentMethodList);
  };

  const onGotoNotifications = () =>
    navigation.navigate(ProfileRoutes.Notifications);

  const onGotoContactUs = () => navigation.navigate(ProfileRoutes.ContactUs);
  const onGoToFAQ = () => navigation.navigate(ProfileRoutes.FAQ);
  const onGoToSettings = () => navigation.navigate(ProfileRoutes.Settings);

  return (
    <View style={{ height: "100%" }}>
      <StyledBGHeader onChangeHeaderBgImageDimension={onSetNewDimension} />
      <KeyboardAwareScrollView
        style={{
          position: "absolute",
          top: newBgHeight,
          width: "100%",
        }}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          width: "100%",
          // paddingHorizontal: mscale(23),
          marginTop: mscale(0),
          paddingBottom: newBgHeight,
        }}
      >
        <CardListView borderRadius={0} paddingTop={27} marginTop={-7} mb={5}>
          <MenuItem
            first
            iconSource={imgCredit}
            label="Payment Methods"
            onPress={onGotoPaymentMethod}
          />
          <MenuItem
            iconSource={imgBell}
            label="Notifications"
            onPress={onGotoNotifications}
          />
          <MenuItem
            iconSource={imgPhone}
            label="Contact us"
            onPress={onGotoContactUs}
          />
          <MenuItem iconSource={imgFaq} label="FAQ" onPress={onGoToFAQ} />
          <MenuItem
            iconSource={imgTof}
            label="Terms of Service"
            iconSize={21}
          />
          <MenuItem
            iconSource={imgSettings}
            label="Settings"
            iconSize={22.5}
            onPress={onGoToSettings}
          />
          <MenuItem
            last
            iconSize={23}
            iconSource={imgLogout}
            label="Log out"
            color={theme.colors.typography.red1}
            onPress={onLogout}
          />
          {isDevUser && (
            <MenuItem
              iconSource={imgSettings}
              label={`v${
                Constants?.nativeAppVersion ??
                Constants?.manifest?.nativeAppVersion
              }-${
                Constants?.nativeBuildVersion ??
                Constants?.manifest?.nativeBuildVersion
              } - mv0.5.13-14 ${Updates.releaseChannel}`}
              iconSize={21}
              onPress={() => {
                navigation.navigate(ProfileRoutes.ProfileDeeplinkDummy);
              }}
            />
          )}
        </CardListView>

        {/* <StyledText
          variant="titleSemi"
          textAlign="left"
          mb={2}
          marginLeft={mscale(23)}
        >
          Categories
        </StyledText>

        <StyledText
          variant="titleSemi"
          textAlign="left"
          mb={2}
          marginLeft={mscale(23)}
        >
          Featured Merchants
        </StyledText> */}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Profile;
