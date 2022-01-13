import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import * as Device from "expo-device";
import type { ImageURISource } from "react-native";
import { useDisableAndroidBackHook } from "hooks";

import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { ParamListBase } from "@react-navigation/native";
import styled from "styled-components/native";
import { mscale } from "utils/scales-util";
import { FloatingButton } from "components/StyledButtons";
import type { GestureResponderEvent } from "react-native";
import { ScaledImageIcon } from "components/StyledImageIcon";
import { LoginRoutes } from "screens/Login";
import { getStatusBarHeight } from "utils/scales-util";
import { StyledText } from "components/StyledTexts";
import Layout from "constants/Layout";
import { StyledBox } from "components";
const bgBuynow = require("assets/images/bg-buy-now.png");
const bgNoHiddenCost = require("assets/images/bg-no-hidden-cost.png");
const bgSafeSecure = require("assets/images/bg-safe-and-secure.png");

const imgActive = require("assets/images/onboarding-active.png");
const imgInactive = require("assets/images/onboarding-inactive.png");
const imgForward = require("assets/images/forward.png");
const imgForwardCheck = require("assets/images/next-check.png");

export enum OnboardingRoutes {
  OnboardingInitial = "OnboardingInitial",
  Onboarding1 = "Onboarding1",
  Onboarding2 = "Onboarding2",
  Onboarding3 = "Onboarding3",
}
interface OnboardingParamsList extends ParamListBase {
  [OnboardingRoutes.Onboarding1]: undefined;
  [OnboardingRoutes.Onboarding2]: undefined;
  [OnboardingRoutes.Onboarding3]: undefined;
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    marginTop: mscale(4),
  },
  tabBarIcon: {
    height: mscale(8),
    width: mscale(8),
  },
  tabBarIconActive: {
    height: mscale(8),
    width: mscale(30),
  },
});

type OnboardingNavigationProp<
  RouteName extends keyof OnboardingParamsList = string
> = NativeStackNavigationProp<OnboardingParamsList, RouteName>;

const TabBar = () => {
  const navigation =
    useNavigation<OnboardingNavigationProp<OnboardingRoutes.Onboarding1>>();
  const currentRoute = useRoute();

  const { routes } = navigation.getState();
  return (
    <View style={styles.tabBarWrapper}>
      {routes?.map((route) => {
        const isActive = currentRoute.key === route.key;
        const img = isActive ? imgActive : imgInactive;
        const imgTabBarIconStyle = isActive
          ? styles.tabBarIconActive
          : styles.tabBarIcon;

        return (
          <View key={route.key} style={{ margin: mscale(2) }}>
            <Image
              style={imgTabBarIconStyle}
              resizeMode="contain"
              key={route.name}
              source={img}
            />
          </View>
        );
      })}
    </View>
  );
};

type OnboardingProps = NativeStackScreenProps<
  OnboardingParamsList,
  OnboardingRoutes.Onboarding1
>;

const Title: React.FC = ({ children: text }) => {
  const StyledTextTitle = styled(StyledText)`
    margin-vertical: ${mscale(17)}px;
  `;
  return <StyledTextTitle variant="title">{text}</StyledTextTitle>;
};

const MARGIN = 60, // 64,
  HORIZONTAL_M = mscale(Math.floor(MARGIN / 2));
const Content = styled(StyledBox)`
  height: ${(props: any) => mscale(304 - props?.statusBarHeight ?? 0)}px;
  width: 100%;
  padding-right: ${HORIZONTAL_M}px;
  position: absolute;
  padding-left: ${HORIZONTAL_M}px;
  padding-top: ${mscale(15)}px;
  bottom: 0;
`;

const StyledFloatingButton = styled(FloatingButton)`
  position: absolute;
  bottom: ${(props: any) => mscale(props?.marginBottom ?? 0)}px;
  right: ${HORIZONTAL_M}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackground = styled.ImageBackground`
  flex: 1;
`;

interface OnboardingComponentProps {
  imgBackground: ImageURISource;
  title: string;
  text: string;
  onNext: (_: GestureResponderEvent) => void;
  isLast: boolean;
  hasNotch: boolean;
}

const OnboardingComponent: React.FC<OnboardingComponentProps> = ({
  title,
  text,
  imgBackground,
  hasNotch,
}) => {
  const [height, setHeight] = useState(0);
  const assetImgSrc = Image.resolveAssetSource(imgBackground);

  useEffect(() => {
    const srcHeight = assetImgSrc?.height ?? 1,
      srcWidth = assetImgSrc?.width ?? 1;
    const maxHeight = Layout.window.height;
    const maxWidth = Layout.window.width;
    const ratio = Math.min(
      maxWidth / (srcWidth ?? 1),
      maxHeight / (srcHeight ?? 1)
    );
    setHeight(srcHeight * ratio);
  }, [Layout.window.height, Layout.window.width, assetImgSrc]);

  return (
    <>
      <StyledBackground
        resizeMode="contain"
        source={imgBackground}
        imageStyle={{
          height: height,
          width: Layout.window.width,
        }}
      />
      <Content statusBarHeight={hasNotch ? 23 : 0}>
        <TabBar />
        <Title>{title}</Title>
        <StyledText variant="paragraph">{text}</StyledText>
      </Content>
    </>
  );
};

const Onboarding: React.FC<OnboardingProps> = ({ route, navigation }) => {
  const excludeBackpressDisablingIfTrue =
    route.name === OnboardingRoutes.OnboardingInitial?.toString();
  useDisableAndroidBackHook(excludeBackpressDisablingIfTrue);

  let bgImg: ImageURISource = bgBuynow;
  let title = "Buy now, pay over time",
    text =
      "Buy with Rn64test and pay off your purchases in easy, fixed monthly payments";
  switch (route.name) {
    case `${OnboardingRoutes.Onboarding2}`:
      bgImg = bgNoHiddenCost;
      title = "No Hidden Cost";
      text =
        "Simple payment plans. No catch, no late fee, no compounding interest";
      break;
    case `${OnboardingRoutes.Onboarding3}`:
      bgImg = bgSafeSecure;
      title = "Safe and Secure";
      text =
        "Rn64test is carefully designed to prevent unauthorised use, and to protect your data and privacy";
      break;
    default:
      break;
  }

  const isLast = route.name === OnboardingRoutes.Onboarding3.toString();

  const onNext = (_: GestureResponderEvent) => {
    if (isLast) {
      navigation.navigate(LoginRoutes.LoginPhoneInputInitial);
      return;
    }

    const next: keyof OnboardingParamsList =
      route.name === OnboardingRoutes.Onboarding1
        ? OnboardingRoutes.Onboarding2
        : OnboardingRoutes.Onboarding3;
    navigation.navigate(next);
  };
  const statusBarHeight = getStatusBarHeight(Device);
  const hasNotch = statusBarHeight > 20;
  const imgBtn = isLast ? imgForwardCheck : imgForward;

  return (
    <StyledBox flex={1}>
      <OnboardingComponent
        title={title}
        text={text}
        imgBackground={bgImg}
        onNext={onNext}
        isLast={isLast}
        hasNotch={hasNotch}
      />
      <StyledFloatingButton
        onPress={onNext}
        marginBottom={hasNotch ? mscale(20) : mscale(20)}
      >
        <ScaledImageIcon source={imgBtn} size={24} />
      </StyledFloatingButton>
    </StyledBox>
  );
};

export default Onboarding;
