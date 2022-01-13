import React, { Component, useEffect, useRef, useState } from "react";
import * as Device from "expo-device";
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
import { OrderPayment } from "screens/Order";
import { theme } from "styles/theme";
import PaymentPlans from "screens/Order/PaymentPlans";
import MyInfoIntro from "screens/MyInfo";
import KycsIncompleteNavigator from "navigation/MyInfo/KycsIncompleteNavigator";
import { OrderPageRoutes } from "screens/Order";
import MyInfoNavigator from "navigation/MyInfo/MyInfoNavigator";
import {
  StyledSafeAreaView,
  Header,
  HeaderLeft,
  StyledBox,
  StyledMerchantBanner,
  SDollarTextComponent,
  OrderStackHeader,
} from "components";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import { useOrderStore, useUserStore } from "stores";
import OrderConfirm from "screens/Order/OrderConfirm";
import PaymentReceipt from "screens/Order/PaymentReceipt";
import ManualReview from "screens/Credit/ManualReview";
import ManualReviewSuccess from "screens/Credit/ManualReviewSuccess";
import { useResetScreen } from "hooks";
import type { OrderState } from "screens/Order/OrderTypes";
import globalObjectState from "utils/global-object-per-country-code";
import { AddPaymentMethod, AddPaymentMethodSuccess } from "screens/Profile";

const RootStack = createNativeStackNavigator();

const styles = StyleSheet.create({
  imgLogo: {
    // width: mscale(80),
    // height: mscale(80),
  },
});

// <NavigationContainer theme={navTheme}>
export default function OrderDeepLinkNavigator(allProps: any) {
  const { initialParams } = allProps;
  // const shouldResetTo = allProps.route.params.shouldResetTo;

  return (
    // <NavigationContainer theme={theme.navTheme as any}>
    // dddebug <RootStack.Navigator initialRouteName={OrderPageRoutes.OrderPayment}>
    // <RootStack.Navigator initialRouteName={OrderPageRoutes.OrderPaymentReceipt}>
    <RootStack.Navigator initialRouteName={OrderPageRoutes.OrderPayment}>
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        initialParams={initialParams}
        name={OrderPageRoutes.OrderPayment}
        component={OrderPayment}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        initialParams={initialParams}
        name={OrderPageRoutes.ManualReview}
        component={ManualReview}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        initialParams={initialParams}
        name={OrderPageRoutes.ManualReviewSuccess}
        component={ManualReviewSuccess}
      />
      <RootStack.Screen
        options={{
          header: OrderStackHeader,
          // headerShown: false,
        }}
        initialParams={initialParams}
        name={OrderPageRoutes.PaymentPlans}
        component={PaymentPlans}
      />
      <RootStack.Screen
        options={{
          header: OrderStackHeader,
          // headerShown: false,
        }}
        initialParams={initialParams}
        name={OrderPageRoutes.OrderConfirm}
        component={OrderConfirm}
      />
      <RootStack.Screen
        options={{
          // header: OrderStackHeader,
          headerShown: false,
        }}
        initialParams={initialParams}
        name={OrderPageRoutes.OrderPaymentReceipt}
        component={PaymentReceipt}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        initialParams={initialParams}
        name={OrderPageRoutes.MyInfoIntro}
        component={MyInfoNavigator}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name={OrderPageRoutes.AddPaymentMethod}
        component={AddPaymentMethod}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name={OrderPageRoutes.AddPaymentMethodSuccess}
        component={AddPaymentMethodSuccess}
      />

      {/* <RootStack.Group
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
      </RootStack.Group> */}
    </RootStack.Navigator>
    // </NavigationContainer>
  );
}
