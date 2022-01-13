import React, { useCallback, useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  ButtonText,
  PrivacyPolicyText,
} from "components";
import { theme } from "styles/theme";
// import useAuthStore from "stores/useAuthStore";
// import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
// import { logoutAlertDEBUG } from "navigation/Credit/CreditNavigator";
import { useBuyerStore, useNestedNavigatorStore, useUserStore } from "stores";
import { useDisableAndroidBackHook, useResetScreen } from "hooks";
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ViewStyle,
  Alert,
} from "react-native";
import {
  getSgVerifyIdentitySavedFormLocalDb,
  removeSgVerifyIdentitySavedFormLocalDb,
} from "utils/async-storage-util";
import globalObjectLastActionState from "utils/global-object-last-action";

const imgLeftBack = require("assets/images/backward-black.png");
const imgIdentity = require("assets/images/identity-gold-card.png");

export enum MyInfoRoutes {
  MyInfoInitial = "MyInfoInitial",
  MyInfoIntro = "MyInfoIntro",
  MyInfoSingpassWebview = "MyInfoSingpassWebview",
  // MyInfoUpdate = "MyInfoUpdate",
}
interface MyInfoParamsList extends ParamListBase {
  [MyInfoRoutes.MyInfoIntro]: undefined;
  // [LoginRoutes.LoginOtp]: undefined;
}

const InfoPicture = () => {
  return (
    <StyledBox
      width={mscale(212)}
      height={mscale(212)}
      alignSelf="center"
      borderRadius={mscale(106)}
      marginBottom={15}
      backgroundColor={theme.colors.faintGray2}
    >
      <Image
        source={imgIdentity}
        resizeMode="contain"
        style={{ width: mscale(202), height: mscale(212) }}
      />
    </StyledBox>
  );
};

type MyInfoIntroProps = NativeStackScreenProps<
  MyInfoParamsList,
  MyInfoRoutes.MyInfoIntro
>;

const MyInfoIntro: React.FC<MyInfoIntroProps> = ({ route, navigation }) => {
  const {
    getState: getNestedNavState,
    setFromMyInfoIntro,
    response: nestedNavResponse,
    resetStates,
  } = useNestedNavigatorStore();
  const [isInitial, setIsInitial] = useState(true);
  const [isLoadingSgVerify, setIsLoadingSgVerify] = useState(true);
  const [verifyIdentityLocalData, setverifyIdentityLocalData] = useState({});
  const canBackPress = isInitial ? false : true;
  useDisableAndroidBackHook(canBackPress);
  const {
    response: { myInfoUrl: myInfoUrlResponse },
    isLoading: { myInfoUrl: isloadingMyInfoUrl },
    resetStates: resetStatesMyinfoUrl,
    fetchMyinfoUrl,
  } = useBuyerStore();
  const {
    response: { user: userResponse },
    isLoading: { user: isLoadingUser },
  } = useUserStore();

  // *Effects
  useEffect(() => {
    if (nestedNavResponse?.fromCreditRemaining) {
      if (nestedNavResponse?.fromCreditRemaining?.isInitial === false) {
        setIsInitial(false);
      }
    }
  }, [nestedNavResponse]);

  // *Events - componentDidMount - triggers screen onFocus

  const onReset = () => {
    // workaround since for some reson this gets triggered many times with arbitrary value
    if (nestedNavResponse?.isInitial === true) {
      resetStatesMyinfoUrl("myInfoUrl");
    } else {
      resetStates("fromCreditRemaining");
    }
    asnycLoadSgVerifyLocalDb();
  };
  useResetScreen({
    navigation,
    onReset,
  });

  // *Methods

  const onFillWithMyInfo = async () => {
    console.log("onFillWithMyInfo", globalObjectLastActionState.get());
    fetchMyinfoUrl();
  };

  // *Effects

  useEffect(() => {
    if (
      myInfoUrlResponse &&
      !isLoadingUser &&
      userResponse?.authToken &&
      myInfoUrlResponse?.url
    ) {
      navigation.navigate(MyInfoRoutes.MyInfoSingpassWebview, {
        uri: myInfoUrlResponse?.url,
        authToken: userResponse.authToken,
      });
    }
  }, [myInfoUrlResponse, userResponse, isLoadingUser]);

  const asnycLoadSgVerifyLocalDb = useCallback(async () => {
    setIsLoadingSgVerify(true);
    const data = await getSgVerifyIdentitySavedFormLocalDb();
    setverifyIdentityLocalData(data);
    setIsLoadingSgVerify(false);
  }, [setIsLoadingSgVerify]);

  useEffect(() => {
    asnycLoadSgVerifyLocalDb();
  }, []);

  // *Events

  const onNext = () => {
    const isFormClean = Object.keys(verifyIdentityLocalData ?? {}).reduce(
      (acc, cur) => {
        return acc && (verifyIdentityLocalData as any)?.[cur]?.length === 0;
      },
      true
    );

    if (isFormClean) {
      setFromMyInfoIntro({ isInitial });

      return navigation.navigate(MyInfoFillRoutes.MyInfoFillInitial);
    }

    Alert.alert(
      "Information",
      "We found a saved copy of your previously filled form. Do you want to continue from where you left off?",
      [
        {
          text: "Discard",
          onPress: () => {
            removeSgVerifyIdentitySavedFormLocalDb();
            navigation.navigate(MyInfoFillRoutes.MyInfoFillInitial);
          },
          style: "cancel",
        },
        {
          text: "Continue",
          onPress: () => {
            setFromMyInfoIntro({ verifyIdentityLocalData, isInitial });
            navigation.navigate(MyInfoFillRoutes.MyInfoFillInitial);
          },
        },
      ]
    );
  };

  const onGoBack = () => {
    // submitMobile(countryDialingCode, value?.replace(/[^0-9]/g, ""));
    navigation.goBack();
  };

  const isLoadingBtns =
    isloadingMyInfoUrl || isloadingMyInfoUrl || isLoadingSgVerify;

  // const statusBarHeight = getStatusBarHeight(Device);
  // const hasNotch = statusBarHeight > 20;

  return (
    <StyledSafeAreaView flex={1} paddingTop={10}>
      {!isInitial && (
        <View style={styles.headerBtnWrapper}>
          <TouchableOpacity onPress={onGoBack} style={styles.btnHeader}>
            <Image
              source={imgLeftBack}
              resizeMode="contain"
              style={{
                width: mscale(18),
                height: mscale(16),
              }}
            />
          </TouchableOpacity>
        </View>
      )}
      <StyledBox
        flex={1}
        flexDirection="column"
        justifyContent="flex-end"
        alignItems="center"
      >
        <StyledBox
          flex={1}
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <InfoPicture />
          <StyledText
            variant="title"
            children="Verify identity"
            marginBottom={5}
          />
          <StyledText
            variant="paragraph"
            children="We need to perform this step in accordance with regulations, and in order to keep our platform safe and secure"
            marginBottom={10}
            width="92%"
          />
        </StyledBox>
        <StyledBox width="100%">
          <ButtonText
            children="fill instantly with my info"
            onPress={
              onFillWithMyInfo
              // () =>
              // logoutAlertDEBUG(async () => {
              //   logoutUserShowSplash({
              //     authResetStates: async () => {
              //       await buyerResetStates("getOrCreate");
              //       await authResetStates("otpSend");
              //       await authResetStates("otpVerify");
              //     },
              //   });
              // })
            }
            disabled={isLoadingBtns}
            // loading={isLoadingBtns}
            marginBottom={3}
          />
          <ButtonText
            children="fill manually"
            variant="primaryInverted"
            // statusBarHeight={statusBarHeight}
            onPress={onNext}
            // isLoading={false}
            disabled={isLoadingBtns}
            marginBottom={2}
            // loading={isLoadingBtns}
            // hasNotch={hasNotch}
            // buttonPropsOptions={{
            //   marginBottom: mbKeyboardShown,
            // }}
          />
        </StyledBox>
        <PrivacyPolicyText marginBottom={3} />
      </StyledBox>
    </StyledSafeAreaView>
  );
};

export default MyInfoIntro;

const styles = StyleSheet.create<{
  headerBtnWrapper: ViewStyle;
  btnHeader: ViewStyle;
}>({
  headerBtnWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginLeft: mscale(20),
  },
  btnHeader: {
    padding: mscale(3),
  },
});
