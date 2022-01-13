import React, { useEffect } from "react";
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
import {
  CreditBureauReportAnalyzingOutcome,
  CreditHome,
  CreditRemaining,
  CreditRoutes,
  PaymentMethodIntro,
  PaymentMethodList,
} from "screens/Credit";
import { CreditBureauReportAnalyzingSuccess } from "screens/Credit";
import * as Device from "expo-device";
import { StyledBox, StyledText } from "components";
import { theme } from "styles/theme";
import { hasNotch, mscale } from "utils/scales-util";
import {
  removeTokenLocalDb,
  removeMyinfoOauthStateLocalDb,
} from "utils/async-storage-util";
import { useBuyerStore, useAuthStore, useUserStore } from "stores";
import MyInfoNavigator from "navigation/MyInfo/MyInfoNavigator";
import { CreditRemainingMyInfoRoutes } from "screens/Credit/CreditRemaining";
import { hexToRGB } from "utils/hex-util";
import { CreditBureauReport, FinancePaymentIntro } from "screens/Credit";
import { AddPaymentMethod, AddPaymentMethodSuccess } from "screens/Profile";
import { PaymentMethodRoutes } from "screens/Credit/PaymentMethodIntro";
import AllUpcomingPayments from "screens/Credit/AllUpcomingPayments";

const Tab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

const TestModal = ({ navigation }: any) => (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      height: "100%",
      backgroundColor: hexToRGB("#4F4F4F", 0.58),
    }}
  >
    <TouchableOpacity
      style={{ padding: 5, borderWidth: 1, top: 300 }}
      onPress={navigation.goBack}
    >
      <Text>test modal</Text>
    </TouchableOpacity>
  </View>
);

const CreditRemainingNavigator = (props: any) => {
  return (
    <RootStack.Navigator
      initialRouteName={CreditRemainingMyInfoRoutes.CreditRemainingInitial}
    >
      <RootStack.Group>
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          // initialParams={props}
          name={CreditRemainingMyInfoRoutes.CreditRemainingInitial}
          component={CreditRemaining}
        />
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          // initialParams={props}
          name={CreditRemainingMyInfoRoutes.CreditRemainingMyInfoInitial}
          component={MyInfoNavigator}
        />
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          // initialParams={props}
          name={CreditRemainingMyInfoRoutes.PaymentMethodStart}
          component={PaymentMethodIntro}
          // component={CreditBureauReport}
        />
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          // initialParams={props}
          name={CreditRemainingMyInfoRoutes.PaymentMethodList}
          component={PaymentMethodList}
          // component={CreditBureauReport}
        />
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          // initialParams={props}
          name={PaymentMethodRoutes.AddPaymentMethod}
          component={AddPaymentMethod}
          // component={CreditBureauReport}
        />
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          // initialParams={props}
          name={PaymentMethodRoutes.AddPaymentMethodSuccess}
          component={AddPaymentMethodSuccess}
          // component={CreditBureauReport}
        />
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          // initialParams={props}
          name={CreditRemainingMyInfoRoutes.CreditBureauReportInitial}
          // debug component={PaymentMethodIntro}
          component={FinancePaymentIntro}
        />
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          // initialParams={props}
          name={CreditRemainingMyInfoRoutes.CreditBureauReportUpload}
          component={CreditBureauReport}
        />
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          // initialParams={props}
          name={CreditRemainingMyInfoRoutes.CreditBureauReportAnalyzingOutcome}
          component={CreditBureauReportAnalyzingOutcome}
        />
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          // initialParams={props}
          name={CreditRemainingMyInfoRoutes.CreditBureauReportAnalyzingSuccess}
          component={CreditBureauReportAnalyzingSuccess}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};

export default function CreditHomeTabNavigator() {
  const {
    // response: { user: responseUser },
    refreshUserStore,
  } = useUserStore();

  const landingToScreen = refreshUserStore()?.response?.user?.landingToScreen;

  let initialRouteName: any = CreditRoutes.CreditHome;
  switch (landingToScreen) {
    case "AddPaymentMethodIntro":
      initialRouteName = CreditRoutes.CreditRemaining;
      break;
    case "OrderDL":
      initialRouteName = CreditRoutes.OrderDL;

    // Credit
    default:
      break;
  }

  return (
    <BottomTab.Navigator
      tabBar={() => <></>}
      initialRouteName={initialRouteName}
      // initialRouteName={LoginRoutes.LoginPhoneInputInitial}
      screenOptions={{
        header: () => <></>,
      }}
    >
      <Tab.Screen
        name={CreditRoutes.CreditHome}
        component={CreditHome}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: "CreditHome",
          // tabBarIcon: ({ focused }) => (
          //   <TabBarIcon source={focused ? imgIconBuyActive : imgIconBuy} />
          // ),
        }}
      />
      <Tab.Screen
        name={CreditRoutes.AllUpcomingPayments}
        component={AllUpcomingPayments}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: "CreditHome",
          // tabBarIcon: ({ focused }) => (
          //   <TabBarIcon source={focused ? imgIconBuyActive : imgIconBuy} />
          // ),
        }}
      />
      <Tab.Screen
        name={CreditRoutes.CreditRemaining}
        component={CreditRemainingNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: "CreditRemaining",
          // tabBarIcon: ({ focused }) => (
          //   <TabBarIcon
          //     source={focused ? imgIconQRActive : imgIconQRActive}
          //     isQr={true}
          //   />
          // ),
        }}
        listeners={{
          tabPress: (e: any) => {
            // Prevent default action
            e.preventDefault();
          },
        }}
      />
    </BottomTab.Navigator>
  );
}
