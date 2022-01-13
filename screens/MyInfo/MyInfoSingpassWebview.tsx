import React, { useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { ParamListBase } from "@react-navigation/native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import { StyledBox, StyledText, ButtonText, Header } from "components";
import { theme } from "styles/theme";
import { WebView } from "react-native-webview";
import useAuthStore from "stores/useAuthStore";
import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoRoutes } from "screens/MyInfo/MyInfoIntro";
import { useBuyerStore, useNestedNavigatorStore, useUserStore } from "stores";
import { getMyinfoUrl } from "services";
import Layout from "constants/Layout";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { hexToRGB } from "utils/hex-util";
import globalObjectLastActionState from "utils/global-object-last-action";
// import { useDisableAndroidBackHook } from "hooks";

interface MyInfoSingpassWebviewParamsList extends ParamListBase {
  [MyInfoRoutes.MyInfoSingpassWebview]: undefined;
  // [LoginRoutes.LoginOtp]: undefined;
}

type MyInfoSingpassWebviewProps = NativeStackScreenProps<
  MyInfoSingpassWebviewParamsList,
  MyInfoRoutes.MyInfoSingpassWebview
>;

// MyInfoSingpassWebviewProps
const MyInfoSingpassWebview: React.FC<any> = ({ route, navigation }) => {
  const {
    params: { uri: paramUri, authToken: paramAuthToken } = {
      uri: null,
      authToken: null,
    },
  } = route ?? { params: {} };
  const {
    getState: getNestedNavState,
    setFromSingPassLogin,
    resetAll: resetAllNestedNavStore,
    response: { fromCreditBureau },
  } = useNestedNavigatorStore();

  let uri = paramUri ?? fromCreditBureau.uri,
    authToken = paramAuthToken ?? fromCreditBureau.authToken;

  const {
    resetStates: resetStatesMyinfoUrl,
    response: { myInfoDetails: responseMyInfoDetails },
    // fetchMyinfoDetails,
  } = useBuyerStore();

  // useDisableAndroidBackHook();
  const [isLoading, setIsloading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(0);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const { setLoginShowSplash } = useUserStore();

  const onWebviewLoad = () => {
    setIsloading(false);
  };

  // *Events
  const onGoBack = () => navigation.goBack();

  // *didmount
  useEffect(() => {
    // fetchMyinfoDetails();

    return () => {
      resetStatesMyinfoUrl("myInfoUrl");
      // resetAllNestedNavStore();
    };
  }, []);

  // useEffect(() => {
  //   if (responseMyInfoDetails) {
  //     console.log("ue[responseMyInfoDetails]", responseMyInfoDetails);
  //   }
  // }, [responseMyInfoDetails]);

  const executeRoutingLogic = (prev: string | null, next: string) => {
    const isNext1stPage = next?.includes("verify?type=identity");
    const isPrev2ndPage = prev?.includes("verify/identity?page=1");
    const shouldGoBack = isNext1stPage && isPrev2ndPage;

    if (fromCreditBureau) {
      const changedTo1st = prev?.includes("verify?type=identity");

      if (changedTo1st) {
        // singpass login done
        setFromSingPassLogin(true);
        return onGoBack();
      }
    }

    if (shouldGoBack) {
      return onGoBack();
    }
  };

  const onUrlChange = (url: string) => {
    setCurrentUrl((prevUrl) => {
      executeRoutingLogic(prevUrl, url);
      return url;
    });
    // TODO how about for MY?
    // when .rn64test.com/sg/verify/success is hit
    const formSubmitSuccess =
      url?.includes(".rn64test.com") && url.includes("/verify/success");

    const hasReturned =
      url?.includes(".rn64test.com") &&
      (url.includes("/home") || url.includes("/credit"));

    if (formSubmitSuccess) {
      setFormSubmitted((prevNum) => prevNum + 1);
    }

    console.log(
      "on url change it's no longer the same?",
      formSubmitted,
      hasReturned
    );
    console.log("before we get", globalObjectLastActionState.get());

    // todo sometimes? this doesn't wait for the user to return
    if ((formSubmitted && hasReturned) || formSubmitted > 1) {
      if (globalObjectLastActionState.get().action === "orderDLToVerify") {
        // dddebug
        setLoginShowSplash({
          landingToScreenParam: "OrderDL",
          // isOrderDeepLinkParam: true, //url.includes("ab;),
          deepLinkUrlSearchParams: {
            type: "store_id",
            data: { storeId: "SG-S-JXJAJWW87CEX" },
          },
        } as any);
        return;
      }

      setLoginShowSplash();
    }
  };

  const onMessage = (event: any) => {
    onUrlChange(event.nativeEvent.data);
  };

  // const injectLocalStorage = `;(function() {
  //   // corresponds to localStorage keys and logic of the buyer web frontend
  //   localStorage.setItem("token", "${authToken}");
  //   localStorage.setItem("sg_verify_identity_saved_form", JSON.stringify({"nric":"s1234432s", "mobile_number":"81888888"}));
  //   true; // note: this is required, or you'll sometimes get silent failures
  // })();`;

  // const currentSavedFormData = JSON.stringify({
  //   mobile_number: "81888888",
  // });

  const injectLocalStorage = `;(function() {
    localStorage.setItem("token", "${authToken}");
    true; // note: this is required, or you'll sometimes get silent failures
  })();`;

  return (
    <StyledBox
      flex={1}
      flexDirection="column"
      justifyContent="flex-end"
      alignItems="center"
    >
      {!currentUrl && (
        <View
          style={{
            position: "absolute",
            top: mscale(44),
            left: mscale(8),
            zIndex: 1,
          }}
        >
          <Header
            imgStyle="light"
            wrapperProps={{
              backgroundColor: hexToRGB("#000000", 0.2),
              margin: 0,
              padding: 0,
              width: mscale(35),
              height: mscale(35),
              borderRadius: mscale(18),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            style={{
              height: "auto",
              width: "auto",
              margin: 0,
              paddingLeft: 0,
              padding: 0,
            }}
            onPress={onGoBack}
          />
        </View>
      )}
      <WebView
        onLoad={onWebviewLoad}
        style={{ height: "100%", borderWidth: 1, width: Layout.window.width }}
        injectedJavaScriptBeforeContentLoaded={injectLocalStorage}
        injectedJavaScript={`
          ;(function() {
            function wrap(fn) {
              return function wrapper() {
                var res = fn.apply(this, arguments);
                window.ReactNativeWebView.postMessage(window.location.href);
                return res;
              }
            }
            history.pushState = wrap(history.pushState);
            history.replaceState = wrap(history.replaceState);
            window.addEventListener('popstate', function() {
              const infoData = localStorage.getItem("myinfo_data");
              window.ReactNativeWebView.postMessage(window.location.href + "_-_-_" + infoData);
            });
            true;
          })();
        `}
        onMessage={onMessage}
        source={{
          // uri: `https://test.api.myinfo.gov.sg/co...t_id=S...1...lr/callback`,
          uri,
        }}
      />
      {isLoading && (
        <ActivityIndicator
          color={theme.colors.rn64testBlue}
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0 }}
          size="large"
        />
      )}
      <StatusBar style="light" />
    </StyledBox>
  );
};

export default MyInfoSingpassWebview;
