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
} from "react-native";
import { Camera } from "expo-camera";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  CreditRemaining,
  CreditRoutes,
  PaymentMethodIntro,
} from "screens/Credit";

import {
  CreditRemainingMyInfoRoutes,
  RenderGeneralInformationCard,
} from "screens/Credit/CreditRemaining";
import CreditHomeTabNavigator from "navigation/Credit/CreditHomeTabNavigator";
import BuyNavigator from "navigation/Credit/BuyNavigator";
import { MyInfoSingpassWebview } from "screens/MyInfo";
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
import {
  AddPaymentMethodSuccess,
  AddPaymentMethod,
  Profile,
  ProfileRoutes,
} from "screens/Profile";
import { PaymentMethodRoutes } from "screens/Credit/PaymentMethodIntro";

const Tab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

// <NavigationContainer theme={navTheme}>
export default function KycsIncompleteNavigator(allProps: any) {
  // const shouldResetTo = allProps.route.params.shouldResetTo;
  const shouldResetTo = "CreditInitial";

  return (
    <RootStack.Navigator
      initialRouteName={PaymentMethodRoutes.PaymentMethodInitial}
    >
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        initialParams={{ shouldResetTo }}
        name={PaymentMethodRoutes.PaymentMethodInitial}
        component={PaymentMethodIntro}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name={PaymentMethodRoutes.AddPaymentMethod}
        component={AddPaymentMethod}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name={PaymentMethodRoutes.AddPaymentMethodSuccess}
        component={AddPaymentMethodSuccess}
      />
    </RootStack.Navigator>
  );
}
