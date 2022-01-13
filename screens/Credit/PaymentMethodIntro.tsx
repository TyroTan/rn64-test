import React, { createRef, useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import {
  ParamListBase,
  useNavigation,
  StackActions,
} from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  PrivacyPolicyText,
  ButtonText,
  HeaderLeft,
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
  Animated,
  Easing,
} from "react-native";
import {
  getSgVerifyIdentitySavedFormLocalDb,
  removeSgVerifyIdentitySavedFormLocalDb,
} from "utils/async-storage-util";
import { awaitableDelay } from "utils/js-utils";
import CreditRoutes from "./CreditRoutes";
import { CreditRemainingMyInfoRoutes } from "./CreditRemaining";
import { useAndroidBackHook } from "hooks";
const imgBannerCC = require("assets/images/banner-cc.png");

const InfoPicture = () => {
  return (
    <StyledBox
      width={mscale(196)}
      height={mscale(196)}
      flexDirection="row"
      alignSelf="center"
      alignItems="center"
      borderRadius={mscale(106)}
      marginBottom={19}
      backgroundColor={theme.colors.faintGray2}
    >
      <Image
        source={imgBannerCC}
        resizeMode="contain"
        style={{
          width: mscale(182),
          height: mscale(182),
          marginLeft: mscale(-6),
        }}
      />
    </StyledBox>
  );
};

export enum PaymentMethodRoutes {
  PaymentMethodInitial = "PaymentMethodRoutesPaymentMethodInitial",
  AddPaymentMethod = "PaymentMethodRoutesAddPaymentMethod",
  AddPaymentMethodSuccess = "PaymentMethodRoutesAddPaymentMethodSuccess",
}

export interface PaymentMethodList extends ParamListBase {
  [PaymentMethodRoutes.PaymentMethodInitial]: undefined;
  [PaymentMethodRoutes.AddPaymentMethod]: undefined;
  [PaymentMethodRoutes.AddPaymentMethodSuccess]: undefined;
}

type PaymentMethodProps = NativeStackScreenProps<
  PaymentMethodList,
  PaymentMethodRoutes.PaymentMethodInitial
>;

const styles = StyleSheet.create<{
  content: ViewStyle;
  headerBtnWrapper: ViewStyle;
  remainingCreditWrapper: ViewStyle;
  btnHeader: ViewStyle;
}>({
  content: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    padding: mscale(20),
    paddingTop: mscale(15),
    margin: 0,
    alignSelf: "center",
  },
  headerBtnWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  remainingCreditWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: mscale(31),
  },
  btnHeader: {
    padding: mscale(3),
  },
});

class Success extends React.Component<any, any> {
  animated: any = null;

  componentDidMount() {
    setTimeout(() => {
      this.animated.play();
    }, 500);
  }

  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: theme.colors.buttons.marineBlue }}
      >
        <LottieView
          ref={(ref) => (this.animated = ref)}
          source={require("assets/lottie/confetti-lottie.json")}
          // progress={animatedLottieProgress}
          // autoPlay
          // loop
        />
        <LottieView
          source={require("assets/lottie/registration-complete-lottie.json")}
          autoPlay
        />
      </View>
    );
  }
}

const useNavigationLogic = ({
  route,
  navigation,
  setterBuyerInitialStoreState,
  initialStoreStates,
}: any) => {
  const { name: routeName, params = {} } = route;
  const shouldResetTo = (params as any)?.shouldResetTo;

  const onNext = () => {
    if (shouldResetTo === CreditRoutes.CreditInitial.toString()) {
      return navigation.navigate(PaymentMethodRoutes.AddPaymentMethod);
    }

    // navigation.navigate(CreditRemainingMyInfoRoutes.AddPaymentMethod);
    navigation.navigate(PaymentMethodRoutes.AddPaymentMethod);
  };

  const onGoBack = () => {
    if (shouldResetTo === CreditRoutes.CreditInitial) {
      if (initialStoreStates) {
        setterBuyerInitialStoreState(initialStoreStates);
      }

      navigation.dispatch(StackActions.replace(CreditRoutes.CreditInitial));

      return true; // prevent default android backpress
    }
    navigation.goBack();

    return true; // prevent default android backpress
  };

  return {
    onNext,
    onGoBack,
    shouldResetTo,
  };
};

const PaymentMethodIntro: React.FC<PaymentMethodProps> = ({
  route,
  navigation,
}) => {
  const {
    response: { fromPaymentMethod },
    getNestedNavigatorStates,
    resetStates: resetNestedNavigatorStates,
  } = useNestedNavigatorStore();
  const {
    response: { initialStoreStates },
  } = useUserStore();
  const { setterBuyerInitialStoreState } = useBuyerStore();
  const { onNext, onGoBack, shouldResetTo } = useNavigationLogic({
    route,
    navigation,
    setterBuyerInitialStoreState,
    initialStoreStates,
  });

  // *Events

  // * Handlers - onpress

  useAndroidBackHook({ onBackPress: onGoBack });

  const onFocusFromSuccess = () => {
    const { fromAddPaymentMethodSuccess } =
      getNestedNavigatorStates()?.response ?? {};

    if (fromAddPaymentMethodSuccess?.goToHomeCreditRemaining === true) {
      return navigation.dispatch(
        StackActions.replace(CreditRoutes.CreditInitial)
      );
    }
  };

  useResetScreen({
    navigation,
    onReset: onFocusFromSuccess,
  });

  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughStyle, setWalkthroughStyle] = useState<ViewStyle>({});
  const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   setProgress(0.9);

  // setTimeout(() => {
  // setShowWalkthrough(true);
  // }, 2000);
  // }, [walkthroughStyle]);

  // *Events

  // * Handlers - onpress

  const isLoadingBtns = false;

  const ElementHeaderLeft =
    fromPaymentMethod === "CreditRemaining" || shouldResetTo ? (
      <HeaderLeft onPress={onGoBack} />
    ) : (
      <></>
    );

  return (
    <StyledSafeAreaView flex={1} paddingTop={10}>
      {ElementHeaderLeft}
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
            fontSize={19}
            lineHeight={19}
            children="Payment Method"
            marginBottom={5}
          />
          <StyledText
            paddingX={5}
            variant="paragraph"
            fontSize={14}
            lineHeight={18}
            children="You need to have at least one payment method configured in order to proceed with a purchase"
            marginBottom={10}
            width="92%"
          />
        </StyledBox>
        <StyledBox width="100%">
          <ButtonText
            children="START"
            onPress={onNext}
            disabled={isLoadingBtns}
            // loading={isLoadingBtns}
            marginBottom={1}
          />
          <PrivacyPolicyText />
        </StyledBox>
      </StyledBox>
    </StyledSafeAreaView>
  );
};

export default PaymentMethodIntro;
