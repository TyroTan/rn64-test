import React, { Component, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  Image,
  Alert,
  TouchableOpacity,
  StatusBar,
  ViewStyle,
  ImageURISource,
  Linking,
} from "react-native";
import { Camera } from "expo-camera";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CreditRemaining, CreditRoutes } from "screens/Credit";

import {
  CreditRemainingMyInfoRoutes,
  RenderGeneralInformationCard,
} from "screens/Credit/CreditRemaining";
import CreditHomeTabNavigator from "navigation/Credit/CreditHomeTabNavigator";
import BuyNavigator from "navigation/Credit/BuyNavigator";
import * as Device from "expo-device";
import { format, parseISO } from "date-fns";
import {
  StyledBox,
  StyledText,
  StyledMainButton,
  StyledTextInputFieldGroup,
  ModalIOSDateBirthPicker,
} from "components";
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
import RenderMonthsBtn from "screens/MyInfo/RenderMonthsBtn";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Buy, BuyRoutes, SearchResults } from "screens/Buy";
import CameraQRCapture from "screens/Camera/CameraQRCapture";
import { ProfileRoutes } from "screens/Profile";
import ProfileStackNavigator from "./ProfileNavigator";
import KycsIncompleteNavigator from "navigation/MyInfo/KycsIncompleteNavigator";
import { PaymentMethodRoutes } from "screens/Credit/PaymentMethodIntro";
import { MyInfoSingpassWebview } from "screens/MyInfo";
import type { UserSession } from "stores/useUserStore";
import OrderDeepLinkNavigator from "navigation/Order/OrderDeepLinkNavigator";
import TransactionNavigator from "navigation/Credit/TransactionNavigator";
import { TransactionPageRoutes } from "screens/Transaction/TransactionPageRoutes";
import globalObjectLastActionState from "utils/global-object-last-action";
import { alerts } from "utils/global-texts";

const imgActive = require("assets/images/onboarding-active.png");
const imgInactive = require("assets/images/onboarding-inactive.png");

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

const Tab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

const colorActive = "#3690D4";
const styles = StyleSheet.create({
  imgTabBarIcon: {
    width: mscale(21),
  },
  imgTabBarIconQr: {
    width: mscale(70),
    height: mscale(70),
  },
  tabBar: {
    shadowColor: "rgba(0, 0, 0, 0.188893)",
    shadowOpacity: 0.19,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 1,

    borderTopRightRadius: mscale(16),
    borderTopLeftRadius: mscale(16),
    paddingHorizontal: mscale(2),
    height: mscale(95),
  },
});

const TabBarIcon = (props: any) => {
  const { isQr, ...imgProps } = props;
  return (
    <StyledBox
      flex={1}
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      bottomTopRightBorderRadius={mscale(8)}
      backgroundColor={"transparent"}
    >
      <Image
        {...imgProps}
        resizeMode={isQr ? "contain" : "contain"}
        style={[styles.imgTabBarIcon, isQr ? styles.imgTabBarIconQr : {}]}
      />
    </StyledBox>
  );
};

const getImgIcon = (title: string, isFocused: boolean) => {
  switch (title) {
    case "Home":
      return isFocused ? imgIconHomeActive : imgIconHome;
    case "Buy":
      return isFocused ? imgIconBuyActive : imgIconBuy;
    case "":
      return imgIconQRActive;
    case "Credit":
    case "Transaction":
      return isFocused ? imgIconCreditActive : imgIconCredit;

    // Profile
    default:
      return isFocused ? imgIconProfileActive : imgIconProfile;
  }
};

const TabBar = ({ state, descriptors, navigation }: any) => {
  const lvl1 = state.routes[state.index] ?? {};
  const lvl2 = lvl1?.state?.routes?.[lvl1?.state?.index] ?? {};
  const lvl3 = lvl2?.state?.routes?.[lvl2?.state?.index] ?? {};

  const isScreenMyInfoIntro =
    lvl3?.name ===
    CreditRemainingMyInfoRoutes.CreditRemainingMyInfoInitial.toString();
  const isScreenMerchant = lvl2?.name === BuyRoutes.Merchant.toString();
  const isScreenAddPaymentMethod =
    lvl2?.name === ProfileRoutes.AddPaymentMethod.toString() ||
    lvl2?.name === ProfileRoutes.PaymentMethodList.toString() ||
    lvl2?.name === ProfileRoutes.NoPaymentMethod.toString() ||
    lvl3?.name === PaymentMethodRoutes.AddPaymentMethod ||
    lvl3?.name === PaymentMethodRoutes.AddPaymentMethodSuccess;

  const isScreenHidingBottomTab =
    lvl2?.name === ProfileRoutes.Notifications.toString() ||
    lvl2?.name === ProfileRoutes.FAQ.toString() ||
    lvl2?.name === ProfileRoutes.ContactUs.toString() ||
    lvl2?.name === ProfileRoutes.AddPaymentMethodSuccess ||
    lvl2?.name === ProfileRoutes.Settings ||
    lvl3?.name === CreditRemainingMyInfoRoutes.PaymentMethodStart ||
    lvl3?.name === CreditRemainingMyInfoRoutes.CreditBureauReportInitial ||
    lvl3?.name === CreditRemainingMyInfoRoutes.CreditBureauReportUpload ||
    lvl3?.name ===
      CreditRemainingMyInfoRoutes.CreditBureauReportAnalyzingOutcome ||
    lvl3?.name === CreditRemainingMyInfoRoutes.PaymentMethodList ||
    lvl3?.name ===
      CreditRemainingMyInfoRoutes.CreditBureauReportAnalyzingSuccess ||
    lvl2?.name === CreditRoutes.AllUpcomingPayments ||
    lvl2?.name === TransactionPageRoutes.TransactionItem ||
    lvl2?.name === TransactionPageRoutes.AddPaymentMethod ||
    lvl2?.name === TransactionPageRoutes.AddPaymentMethodSuccess ||
    lvl2?.name === TransactionPageRoutes.TransactionReceipt ||
    lvl2?.name === TransactionPageRoutes.TransactionPayNext ||
    lvl2?.name === TransactionPageRoutes.ShowModalByType;

  // Append with your condition to hide bottom tab
  if (
    isScreenMyInfoIntro ||
    isScreenMerchant ||
    isScreenAddPaymentMethod ||
    isScreenHidingBottomTab
  ) {
    return <></>;
  }

  const shadowColor =
    Platform.OS === "ios" ? "#000" : "rgba(0, 0, 0, 0.188893)";
  return (
    <View
      // onLayout={(event) => {
      //   const { x, y, width, height } = event.nativeEvent.layout;
      // }}
      style={{
        flexDirection: "row",
        height: mscale(hasNotch(Device) ? 84 : 74),
        borderTopRightRadius: mscale(16),
        borderTopLeftRadius: mscale(16),

        shadowColor: shadowColor,
        shadowOpacity: 0.19,
        shadowRadius: 5,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        elevation: 9,
        backgroundColor: "#FFF",
        alignItems: "flex-end",
      }}
    >
      {state.routes.map((route: any, index: any) => {
        if (route.name.includes("BuyHidden")) return <View key={index}></View>;
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const color = isFocused ? colorActive : theme.colors.typography.gray3;
        const img = getImgIcon(label, isFocused);

        const onPress = async () => {
          // debug
          console.log("route.nameroute.name", route.name);
          if (route.name === "CreditProfile") {
            // return logoutAlertDEBUG(async () => {
            //   logoutUserShowSplash({
            //     authResetStates: async () => {
            //       await buyerResetStates("getOrCreate");
            //       await authResetStates("otpSend");
            //       await authResetStates("otpVerify");
            //     },
            //   });
            // });
          } else if (route.name === "CreditQr") {
            const { status } = await Camera.requestCameraPermissionsAsync();

            if (status !== "granted") {
              // alert no camera permission
              if (Platform.OS === "ios") {
                // Camera.requestCameraPermissionsAsync();
              }

              if (status === "denied") {
                return Alert.alert(
                  alerts.headerInformation,
                  alerts.permissionPleaseAllowCamera,
                  [
                    {
                      text: alerts.goToSettings,
                      onPress: () => {
                        Linking.openURL("app-settings:");
                      },
                      style: "default",
                    },
                    {
                      text: alerts.cancel,
                      onPress: () => {},
                      style: "cancel",
                    },
                  ]
                );
              }
            } else {
              navigation.navigate("CameraQRCapture");
            }
            return;
          }

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved

            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={label ?? index}
            style={{
              width: "20%",
              marginBottom: mscale(15),
              paddingBottom: hasNotch(Device) ? mscale(10) : "0%",
            }}
          >
            <StyledBox height={mscale(34)}>
              <TabBarIcon source={img} isQr={label === ""} />
            </StyledBox>
            <StyledText
              fontFamily="PoppinsMedium"
              fontSize={10}
              lineHeight={10}
              color={color}
            >
              {label}
            </StyledText>
          </Pressable>
        );
      })}
    </View>
  );
};

const TestScreen = ({ title }: any) => (
  <View>
    <StyledText variant="title">{title ?? "Test Screen"}</StyledText>
  </View>
);

const MainBottomTab = (props_: any) => {
  let initialRouteName = CreditRoutes.CreditHomeInitial;
  const { action } = globalObjectLastActionState.get();
  console.log("Firstloadmainbottomtab", initialRouteName);
  if (action === "fromPaymentReceipt") {
    initialRouteName = CreditRoutes.CreditTransaction;
  }

  return (
    <BottomTab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      initialRouteName={initialRouteName}
      // initialRouteName={LoginRoutes.LoginPhoneInputInitial}
      screenOptions={{
        // headerShown: false,
        header: () => <></>,
      }}
    >
      <Tab.Screen
        name={CreditRoutes.CreditHomeInitial}
        component={CreditHomeTabNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: (props: any) => {
            const { focused } = props;
            return (
              <TabBarIcon source={focused ? imgIconHomeActive : imgIconHome} />
            );
          },
        }}
        // component={MyInfoFillNavigator}
      />
      <Tab.Screen
        name={CreditRoutes.CreditBuy}
        component={BuyNavigator}
        options={{
          tabBarLabel: "Buy",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={focused ? imgIconBuyActive : imgIconBuy} />
          ),
        }}
      />

      <Tab.Screen
        name={BuyRoutes.BuyHiddenSearchResults}
        component={SearchResults}
      />

      {/* camera bottom tab */}
      <Tab.Screen
        name={CreditRoutes.CreditQr}
        component={CreditRemaining}
        options={{
          // tabBarShowLabel: false,
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={focused ? imgIconQRActive : imgIconQRActive}
              isQr={true}
            />
          ),
        }}
        listeners={{
          tabPress: async (e: any) => {
            // Prevent default action
            e.preventDefault();
          },
        }}
      />
      <Tab.Screen
        name={CreditRoutes.CreditTransaction}
        component={TransactionNavigator}
        options={{
          tabBarLabel: "Transaction",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={focused ? imgIconCreditActive : imgIconCredit}
            />
          ),
        }}
      />
      <Tab.Screen
        name={CreditRoutes.CreditProfile}
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={focused ? imgIconProfileActive : imgIconProfile}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const stylesWalkthrough = StyleSheet.create({
  bgModal: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: "100%",
    backgroundColor: hexToRGB("#4F4F4F", 0.58),
  },
  tabBarWrapper: {
    // display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    // marginTop: mscale(4),
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

const WalkthroughTabBar = ({ current = 0 }: any) => {
  const routes = [...new Array(3)].fill(0);

  return (
    <View style={stylesWalkthrough.tabBarWrapper}>
      {[...routes].map((route, i) => {
        const isActive = i === current;
        const img = isActive ? imgActive : imgInactive;
        const imgTabBarIconStyle = isActive
          ? stylesWalkthrough.tabBarIconActive
          : stylesWalkthrough.tabBarIcon;

        return (
          <View
            key={i}
            style={{
              margin: mscale(2),
            }}
          >
            <Image
              style={imgTabBarIconStyle}
              resizeMode="contain"
              source={img}
            />
          </View>
        );
      })}
    </View>
  );
};

interface WalkthroughStyle {
  height: number;
  width: number;
  top: number;
  left: number;
}

const arrowUpHeight = 8;
const arrowUpStyle = {
  width: 0,
  height: 0,
  borderLeftWidth: mscale(arrowUpHeight),
  borderLeftColor: "transparent",
  borderRightWidth: mscale(arrowUpHeight),
  borderRightColor: "transparent",
  borderBottomWidth: mscale(arrowUpHeight),
  borderBottomColor: theme.colors.typography.grayNeutral,
  backgroundColor: "transparent",
};

const RenderWalkthrouhgh = ({ navigation, route }: any) => {
  const { params } = route;
  if (!params?.walkthroughStyle?.height) return <></>;

  const { walkthroughStyle } = params as {
    walkthroughStyle: WalkthroughStyle;
  };
  const { height = 0, width = 0, top = 0, left = 0 } = walkthroughStyle;
  // arrowUpStyle

  const boxHintTop = top + height;
  const hintContainerStyle = {
    ...walkthroughStyle,
    top: boxHintTop + arrowUpHeight,
    height: height * 0.6,
    width: width * 0.8,
    left: left + width * 0.1,
    backgroundColor: theme.colors.typography.grayNeutral,
    borderRadius: mscale(8),
  };

  const onNext = () => navigation.goBack();

  return (
    <SafeAreaProvider>
      <View style={stylesWalkthrough.bgModal}>
        <RenderGeneralInformationCard
          isWalkthrough={true}
          walkthroughStyle={walkthroughStyle}
        />
        <View
          style={{ ...arrowUpStyle, top: boxHintTop, left: width * 0.75 }}
        />
        <View style={hintContainerStyle}>
          <View
            style={{
              height: "75%",
              width: "86%",
              marginLeft: "7%",
              marginTop: "7%",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <StyledText variant="walkthrough">
              For each section you complete, our system will be better able to
              evaluate you and improve your credit score.
            </StyledText>
            <View
              style={{
                height: mscale(32),
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <WalkthroughTabBar current={1} />
              <StyledMainButton
                children={
                  <StyledText
                    children={"Next"}
                    borderWidt={1}
                    flex={1}
                    textAlignVertical="center"
                    fontFamily="PoppinsSemiBold"
                    letterSpacing={0}
                    padding={0}
                    fontSize={11}
                    lineHeight={10}
                    color={theme.colors.charcoal}
                  />
                }
                onPress={onNext}
                height={"90%"}
                width={"35%"}
                backgroundColor={theme.colors.typography.mainInverse}
                borderRadius={mscale(25)}
                borderColor={theme.colors.buttons.lightGray}
                padding={0}
                alignItems="center"
                flexDirection="row"
                justifyContent="center"
              />
            </View>
          </View>
        </View>
      </View>
      <StatusBar />
    </SafeAreaProvider>
  );
};

const CreditNavigator = (allProps: {
  landingToScreen: UserSession["landingToScreen"];
}) => {
  const { landingToScreen } = allProps;
  let initialRouteName: any = CreditRoutes.CreditInitial;

  switch (landingToScreen) {
    case "AddPaymentMethodIntro":
      initialRouteName = CreditRoutes.KycsIncompleteInitial;
      break;
    case "OrderDL":
      initialRouteName = CreditRoutes.OrderDL;

    // Credit
    default:
      break;
  }

  // const initialRouteName =
  //   allProps?.landingToScreen === "AddPaymentMethodIntro"
  //     ? CreditRoutes.KycsIncompleteInitial
  //     : CreditRoutes.CreditInitial;

  // dddebug
  // initialRouteName = CreditRoutes.OrderDL;

  return (
    <NavigationContainer theme={theme.navTheme as any}>
      <RootStack.Navigator initialRouteName={initialRouteName}>
        <RootStack.Group>
          <RootStack.Screen
            options={{
              headerShown: false,
            }}
            name={CreditRoutes.CreditInitial}
            component={MainBottomTab}
          />
        </RootStack.Group>
        <RootStack.Group>
          <RootStack.Screen
            options={{
              headerShown: false,
            }}
            initialParams={{ shouldResetTo: CreditRoutes.CreditInitial }}
            name={CreditRoutes.KycsIncompleteInitial}
            component={KycsIncompleteNavigator}
          />
        </RootStack.Group>
        <RootStack.Group>
          <RootStack.Screen
            options={{
              headerShown: false,
            }}
            // initialParams={{ shouldResetTo: CreditRoutes.CreditInitial }}
            name={CreditRoutes.OrderDL}
            component={OrderDeepLinkNavigator}
          />
        </RootStack.Group>
        <RootStack.Group
          screenOptions={({ route }: any) => {
            return {
              // title: route?.params?.title,
              // presentation: "transparentModal",
            };
          }}
        >
          <RootStack.Screen
            name="CameraQRCapture"
            options={{
              animation: "none",
              headerShown: false,
              // headerTitle: (props) => <></>,
            }}
            component={CameraQRCapture}
          />
        </RootStack.Group>
        <RootStack.Group
          screenOptions={({ route }: any) => {
            return {
              title: route?.params?.title,
              presentation: "transparentModal",
            };
          }}
        >
          <RootStack.Screen
            name="ModalIOSDateBirthPicker"
            options={{
              headerShown: false,
              animation: "none",
              headerTitle: (props) => {
                return (
                  <StyledText variant="title" fontSize={15} lineHeight={15}>
                    {props.children}
                  </StyledText>
                );
              },
            }}
            component={ModalIOSDateBirthPicker}
          />
        </RootStack.Group>
        <RootStack.Group
          screenOptions={({ route }: any) => {
            return {
              title: route?.params?.title,
              presentation: "transparentModal",
            };
          }}
        >
          <RootStack.Screen
            name={CreditRemainingMyInfoRoutes.SingPassLogin}
            options={{
              headerShown: false,
              animation: "none",
              headerTitle: (props) => {
                return (
                  <StyledText variant="title" fontSize={15} lineHeight={15}>
                    {props.children}
                  </StyledText>
                );
              },
            }}
            component={MyInfoSingpassWebview}
          />
        </RootStack.Group>
        <RootStack.Group
          screenOptions={({ route }: any) => {
            return {
              title: route?.params?.title,
              presentation: "transparentModal",
            };
          }}
        >
          <RootStack.Screen
            name="RenderWalkthrouhgh"
            options={{
              animation: "none",
              headerShown: false,
              // headerTitle: (props) => <></>,
            }}
            component={RenderWalkthrouhgh}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default CreditNavigator;
