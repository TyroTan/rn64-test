import React, { useEffect } from "react";
import { Platform, View, Text, Pressable } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Onboarding, { OnboardingRoutes } from "screens/Onboarding/Onboarding";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginNavigator from "navigation/LoginNavigator";
import { LoginOtp, LoginRoutes } from "screens/Login";
import { MyInfoRoutes } from "screens/MyInfo";
import MyInfoNavigator from "navigation/MyInfo/MyInfoNavigator";
import MyInfoFillNavigator from "./MyInfo/MyInfoFillNavigator";
import {
  StyledBox,
  ButtonText,
  StyledText,
  ModalIOSDateBirthPicker,
} from "components";
import { theme } from "styles/theme";
import { mscale } from "utils/scales-util";
import { useUserStore } from "stores";
import type { UserSession } from "stores/useUserStore";

import { PaymentMethodIntro } from "screens/Credit";
// import ProgressBar from "./RenderProgressBar";
// import { StyledSafeAreaView, Header, HeaderLeft } from "components";

const Tab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={OnboardingRoutes.Onboarding1}
      screenOptions={{
        tabBarStyle: {
          opacity: 0,
          height: 0,
        },
      }}
    >
      <Tab.Screen name={OnboardingRoutes.Onboarding1} component={Onboarding} />
      <Tab.Screen name={OnboardingRoutes.Onboarding2} component={Onboarding} />
      <Tab.Screen name={OnboardingRoutes.Onboarding3} component={Onboarding} />
    </Tab.Navigator>
  );
};

// no authToken
const BottomTabUnprotected = (props: any) => {
  return (
    <BottomTab.Navigator
      // tabBar={() => <View style={{ backgroundColor: "#000" }} />}
      // initialRouteName={OnboardingRoutes.OnboardingInitial}
      // initialRouteName={LoginRoutes.LoginPhoneInputInitial}
      screenOptions={{
        tabBarStyle: {
          ...(Platform.OS === "ios"
            ? {}
            : {
                opacity: 0,
              }),
          height: 0,
          borderTopColor: theme.colors.background2,
          backgroundColor: theme.colors.background2,
        },
        header: () => <></>,
      }}
    >
      <Tab.Screen
        name={OnboardingRoutes.OnboardingInitial}
        component={OnboardingNavigator}
        // component={MyInfoFillNavigator}
      />
      <Tab.Screen
        name={LoginRoutes.LoginPhoneInputInitial}
        component={LoginNavigator}
      />
    </BottomTab.Navigator>
  );
};

interface InitialParams {
  authToken: null | string;
  data: UserSession["data"];
}
// const NavigatorLevel2 = ({ authToken, data }: NavigatorLevel2) => {
//   console.log("level2", authToken, data);
//   return;
// };

export default function EntryOnboardingNavigator(props: InitialParams) {
  if (!props?.authToken) {
    return (
      <NavigationContainer>
        <BottomTabUnprotected />
        {/* <LoginOtp /> */}
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={"Main"}>
        <RootStack.Group>
          <RootStack.Screen
            options={{
              headerShown: false,
            }}
            initialParams={props}
            name="Main"
            component={MyInfoNavigator}
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
            name="ModalIOSDateBirthPickerForInitial"
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
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
