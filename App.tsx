import React, { useEffect } from "react";
import { View, Text, Platform } from "react-native";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider as SafeAreaProviderCmp } from "react-native-safe-area-context";
import styled, { ThemeProvider } from "styled-components/native";

// __DEV__
import "./dev-utility";

import { useLogin, useCachedResource, useFirebaseCloudMessaging } from "hooks";

import EntryOnboardingNavigator from "navigation/OnboardingNavigator";
import CreditNavigator from "navigation/Credit/CreditNavigator";
import { theme } from "styles/theme";
import type { CSSProps } from "types";
import { getTokenLocalDb } from "utils/async-storage-util";
import { loadInterceptors } from "utils/axios-utils";
import axios from "axios";
import { mscale } from "utils/scales-util";
// import firebaseapp from "@react-native-firebase/app";
import KycsIncompleteNavigator from "navigation/MyInfo/KycsIncompleteNavigator";
import { FIREBASE_CONFIG } from "const";
import { MyInfoFill } from "screens/MyInfo";
import { AddPaymentMethod } from "screens/Profile";
import OrderDeepLinkNavigator from "./navigation/Order/OrderDeepLinkNavigator";
import { UserSession } from "./stores/useUserStore";
import PaymentReceipt from "./screens/Order/PaymentReceipt";
import Transaction from "./screens/Transaction/Transaction";

// firebaseapp.initializeApp(FIREBASE_CONFIG as any);

loadInterceptors(axios, getTokenLocalDb);

const SplashScreenDummy = ({ title, isLoadingComplete }: any) => (
  <View
    style={{
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text
      style={{
        // fontFamily: isLoadingComplete ? "PoppinsBold" : "Arial",
        fontSize: mscale(25),
        lineHeight: mscale(25),
        letterSpacing: 1.5,
      }}
    >
      {title}
    </Text>
  </View>
);

export default function App() {
  const { isLoadingComplete } = useCachedResource();
  const { showSplash, setLoginShowSplash, user, isAuthed } = useLogin();
  useFirebaseCloudMessaging(showSplash, user, isAuthed);

  const prefix = Linking.createURL("/");

  const asyncDeepLinkHandler = async (
    showSplash: boolean,
    isLoadingComplete: boolean
  ) => {
    if (!showSplash && isLoadingComplete) {
      const url = await Linking.getInitialURL();
      if (url != null) {
        return url;
      }
    }
  };

  React.useEffect(() => {
    asyncDeepLinkHandler(showSplash, isLoadingComplete);

    const onReceiveURL = ({ url }: { url: string }) => {
      console.log("urlll", url);

      // todo handle stripe auth
      // rn64test://safepay?setup_intent=seti_1K1232U&setup_intent_client_secret=seti_1K1236N2U_secret_KpH123Pb&source_redirect_slug=test_YWNj123eP

      setLoginShowSplash({
        landingToScreenParam: "OrderDL",
        // isOrderDeepLinkParam: true, //url.includes("ab;),
        deepLinkUrlSearchParams: {
          type: "store_id",
          data: { storeId: "SG-S-JXJAJWW87CEX" },
        },
      } as any);
    };

    // Listen to incoming links from deep linking
    Linking.addEventListener("url", onReceiveURL);

    return () => {
      Linking.removeEventListener("url", onReceiveURL);
    };
  }, [asyncDeepLinkHandler, showSplash, isLoadingComplete]);

  // console.log(
  //   "!isLoadingComplete || showSplash",
  //   !isLoadingComplete || showSplash
  // );

  // dddebug
  /*const dlink = user?.isOrderDeepLink;
  useEffect(() => {
    if (!dlink) {
      setLoginShowSplash?.({
        isOrderDeepLinkParam: true,
        storeId: "SG-S-JXJAJWW87CEX",
      } as any);
    }
  }, [dlink]);*/

  if (!isLoadingComplete || showSplash) {
    return (
      <SplashScreenDummy
        isLoadingComplete={isLoadingComplete}
        title={"RN64TEST"}
      />
    );
  } else if (!showSplash) {
    if (showSplash || !showSplash) {
      // return (
      //   <ThemeProvider theme={theme}>
      //     <SafeAreaProvider>
      //       {/* <Payment /> */}
      //       <Transaction />
      //       {/* <OrderDeepLink></OrderDeepLink> */}
      //       {/* <CreditNavigator landingToScreen={"Credit"} /> */}
      //     </SafeAreaProvider>
      //   </ThemeProvider>
      // );
    }
    /*
    return (
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <MyInfoNavigator />
          <StatusBar />
        </SafeAreaProvider>
      </ThemeProvider>
    );
     */
  }

  if (isAuthed) {
    if (
      ["Credit", "AddPaymentMethodIntro", "OrderDL"].includes(
        user.landingToScreen
      )
    ) {
      return (
        <ThemeProvider theme={theme}>
          <SafeAreaProvider>
            <CreditNavigator landingToScreen={user.landingToScreen} />
            <StatusBar />
          </SafeAreaProvider>
        </ThemeProvider>
      );
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <EntryOnboardingNavigator
          authToken={user?.authToken}
          data={user?.data}
        />
        <StatusBar />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const SafeAreaProvider = styled(SafeAreaProviderCmp)`
  background-color: ${(props: CSSProps) => props.theme.colors.background2};
`;
