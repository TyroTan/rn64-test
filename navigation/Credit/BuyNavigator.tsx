import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Buy, BuyRoutes } from "screens/Buy";
import { Merchant } from "screens/Merchant";
const RootStack = createNativeStackNavigator();

export default function BuyStackNavigator() {
  return (
    <RootStack.Navigator initialRouteName={BuyRoutes.Buy}>
      <RootStack.Screen
        name={BuyRoutes.Buy}
        options={{
          animation: "none",
          headerShown: false,
          // headerTitle: (props) => <></>,
        }}
        component={Buy}
      />
      <RootStack.Screen
        name={BuyRoutes.Merchant}
        options={{
          animation: "none",
          headerShown: false,
          // headerTitle: (props) => <></>,
        }}
        component={Merchant}
      />
    </RootStack.Navigator>
  );
}
