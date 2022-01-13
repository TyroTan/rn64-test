import React, { ReactElement, useEffect, useState } from "react";
import * as Device from "expo-device";
import {
  Platform,
  Pressable,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import type { ViewProps, ViewStyle } from "react-native";
import { StyleSheet, View, Image } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Progress from "react-native-progress";
import { theme } from "styles/theme";
import {
  CardList,
  CardListItem,
  CardListItemDivider,
  StyledScrollView,
  StyledText,
  KeyboardAvoiding,
  StyledBox,
  StyledSafeAreaView,
} from "components";
import { CreditParamsList } from "screens/Credit/CreditHome";
import CreditRoutes from "screens/Credit/CreditRoutes";
import useUserStoreRefreshableInitialStoreStates from "screens/Credit/useUserStoreRefreshableInitialStoreStates";
// import { useDisableAndroidBackHook } from "hooks";
import { mscale, getStatusBarHeight } from "utils/scales-util";
import { hexToRGB } from "utils/hex-util";
import Layout from "constants/Layout";
import { useBuyerStore, useNestedNavigatorStore, useUserStore } from "stores";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { getKycsBtnData, getKycsObject, KycsObject } from "utils/utils-common";
import { format } from "date-fns";
import { StackActions } from "@react-navigation/native";
import { useResetScreen } from "hooks";
import globalObjectState from "utils/global-object-per-country-code";

// const imgLeftHomeOwnership = require("assets/images/home-ownership.png");
const imgCreditBureau = require("assets/images/finance-intro-image-rounded.png");
const imgLeftVerifyIdentity = require("assets/images/verify-identity.png");
const imgLeftCreditCard = require("assets/images/credit-card.png");
const imgRightHelp = require("assets/images/help-blue.png");
const imgLeftBack = require("assets/images/backward-black.png");

export enum CreditRemainingMyInfoRoutes {
  CreditRemainingInitial = "CreditRemainingInitial",
  CreditRemainingMyInfoInitial = "CreditRemainingMyInfoInitial",
  CreditRemainingWalkthroughInitial = "CreditRemainingWalkthroughInitial",
  CreditRemainingWalkthrough1 = "CreditRemainingWalkthrough1",
  CreditRemainingWalkthrough2 = "CreditRemainingWalkthrough2",
  PaymentMethodStart = "CRMyInfoPaymentMethodStart",
  AddPaymentMethod = "CRMyInfoAddPaymentMethod",
  AddPaymentMethodSuccess = "CRMyInfoAddPaymentMethodSuccess",
  CreditBureauReportInitial = "CreditBureauReportInitial",
  CreditBureauReportUpload = "CreditBureauReportUpload",
  CreditBureauReportAnalyzingOutcome = "CreditBureauReportAnalyzingOutcome",
  CreditBureauReportAnalyzingSuccess = "CreditBureauReportAnalyzingSuccess",
  SingPassLogin = "SingPassLogin",
  PaymentMethodList = "PaymentMethodList",
}

type CreditRemainingProps = NativeStackScreenProps<
  CreditParamsList,
  CreditRoutes.CreditRemaining
>;

const RenderText = ({ children, fontFamily, gray, color }: any) => (
  <StyledText
    fontFamily={fontFamily}
    fontSize={13}
    lineHeight={13}
    textAlign="left"
    color={color ?? (gray ? theme.colors.typography.gray1 : null)}
    children={children}
  />
);

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
    padding: mscale(5),
  },
});

interface RenderGeneralInformationCardProps extends ViewProps {
  kycsObject?: KycsObject;
  onMyInfoFill?: () => void;
  onPaymentMethod?: () => void;
  isWalkthrough?: boolean;
  onMeasureInWindow?: (style: ViewStyle) => void;
  walkthroughStyle?: ViewStyle;
}

export const RenderGeneralInformationCard = (
  props: RenderGeneralInformationCardProps
) => {
  const {
    kycsObject,
    onMyInfoFill,
    onPaymentMethod,
    isWalkthrough,
    onMeasureInWindow,
    walkthroughStyle,
  } = props;
  const { countryCode } = globalObjectState.getLibrary();

  const sgIdentityBtnData = getKycsBtnData(
    `${countryCode}_identity`,
    kycsObject ?? ({} as KycsObject)
  );

  const sgPaymentMethodBtnData = getKycsBtnData(
    `${countryCode}_payment_method`,
    kycsObject ?? ({} as KycsObject)
  );

  return (
    <CardList
      title={"General Information"}
      onMeasureInWindow={onMeasureInWindow}
      style={isWalkthrough ? walkthroughStyle : null}
    >
      <CardListItem
        leftImgSource={imgLeftVerifyIdentity}
        rightElementVariant={sgIdentityBtnData.btnVariant as any}
        rightElementProps={{ onPress: onMyInfoFill } as ViewProps}
      >
        <StyledBox>
          <RenderText fontFamily="PoppinsSemiBold" children="Verify Identity" />
          <RenderText
            fontFamily="Poppins"
            gray
            {...sgIdentityBtnData.textProps}
          />
        </StyledBox>
      </CardListItem>
      <CardListItemDivider />
      <CardListItem
        leftImgSource={imgLeftCreditCard}
        rightElementVariant={sgPaymentMethodBtnData.btnVariant as any}
        rightElementProps={{ onPress: onPaymentMethod } as ViewProps}
      >
        <StyledBox>
          <RenderText fontFamily="PoppinsSemiBold" children="Payment Method" />
          <RenderText
            fontFamily="Poppins"
            gray
            {...sgPaymentMethodBtnData.textProps}
          />
        </StyledBox>
      </CardListItem>
    </CardList>
  );
};

interface RenderScrollViewContentProps {
  kycsObject?: KycsObject;
  onMyInfoFill?: () => void;
  onPaymentMethod?: () => void;
  onCBReport?: () => void;
  onMeasureInWindow?: (style: ViewStyle) => void;
}

const RenderScrollViewContent = ({
  kycsObject,
  onMeasureInWindow,
  onMyInfoFill,
  onPaymentMethod,
  onCBReport,
}: RenderScrollViewContentProps) => {
  const {
    response: { initialStoreStates },
    refreshInitialStoreStates,
    refreshingInitialStoreStates,
  } = useUserStoreRefreshableInitialStoreStates();

  const [kycsObjectRefreshable, setKycsObjectRefreshable] =
    useState(kycsObject);
  const { countryCode } = globalObjectState.getLibrary();

  const cbReportBtnData = getKycsBtnData(
    `${countryCode}_credit_bureau_report`,
    kycsObjectRefreshable ?? ({} as KycsObject)
  );

  useEffect(() => {
    console.log("setrefreshable", initialStoreStates);
    setKycsObjectRefreshable(getKycsObject(initialStoreStates?.credits ?? {}));
  }, [initialStoreStates]);

  const refreshing = refreshingInitialStoreStates;
  const onRefresh = refreshInitialStoreStates;

  return (
    <StyledScrollView
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <RenderGeneralInformationCard
        kycsObject={kycsObjectRefreshable}
        onMyInfoFill={onMyInfoFill}
        onPaymentMethod={onPaymentMethod}
        onMeasureInWindow={onMeasureInWindow}
      />
      <CardList title={"Additional Information"}>
        <CardListItem
          leftImgSource={imgCreditBureau}
          rightElementVariant={cbReportBtnData.btnVariant as any}
          rightElementProps={{ onPress: onCBReport } as ViewProps}
        >
          <View>
            <RenderText
              fontFamily="PoppinsSemiBold"
              children="Credit Bureau Report"
            />
            <RenderText
              fontFamily="Poppins"
              gray
              {...cbReportBtnData.textProps}
            />
          </View>
        </CardListItem>
      </CardList>
    </StyledScrollView>
  );
};

const useNavigationLogic = ({
  route,
  navigation,
  setFromPaymentMethod,
  refreshBuyerStates,
}: any) => {
  const onPaymentMethod = () => {
    const { countryCode } = globalObjectState.getLibrary();
    const { name: routeName } = route;
    console.log("routeName, routeName", routeName);

    const { credits } = refreshBuyerStates().response;
    const kycsConverted = getKycsObject(credits);

    if (
      (kycsConverted as any)?.[`${countryCode}_payment_method`] === "incomplete"
    ) {
      setFromPaymentMethod("CreditRemaining");
      return navigation.navigate(
        CreditRemainingMyInfoRoutes.PaymentMethodStart
      );
    } else {
      return navigation.navigate(CreditRemainingMyInfoRoutes.PaymentMethodList);
    }

    // setFromPaymentMethod("Profile");
    // navigation.navigate(CreditRemainingMyInfoRoutes.PaymentMethodList);
  };

  return {
    onPaymentMethod,
  };
};

const CreditRemaining: React.FC<CreditRemainingProps> = ({
  route,
  navigation,
}) => {
  const tabBarHeight = useBottomTabBarHeight();
  // console.log("useBottom - tabBarHeight", tabBarHeight);
  const {
    setFromCreditRemaining,
    // getNestedNavigatorStates,
    setFromPaymentMethod,
    resetStates: resetNestedNavigatorStates,
  } = useNestedNavigatorStore();

  const { currencySign } = globalObjectState.getLibrary();

  // responseCredit?.balance ?? 0

  // const [showWalkthrough, setShowWalkthrough] = useState(false);
  const { refreshBuyerStates } = useBuyerStore();
  const [kycsObject, setKycsObject] = useState<KycsObject>(
    getKycsObject(refreshBuyerStates().response?.credits ?? {}) as KycsObject
  );
  const [walkthroughStyle, setWalkthroughStyle] = useState<ViewStyle>({});
  const [progress, setProgress] = useState(0);

  const { onPaymentMethod } = useNavigationLogic({
    route,
    navigation,
    setFromPaymentMethod,
    refreshBuyerStates,
  });

  // *Nav Events

  const onNavFocus = () => {
    didMount();
  };

  useResetScreen({
    navigation,
    onReset: onNavFocus,
  });

  // *Effects

  const didMount = () => {
    const { credits } = refreshBuyerStates().response;
    if (credits) {
      const kycsConverted = getKycsObject(credits);

      setKycsObject(kycsConverted);
    }
  };

  // *Events
  const onMeasureInWindow = (style: ViewStyle) => {
    if (walkthroughStyle?.position) return;
    setWalkthroughStyle({
      ...style,
      top: (style as any)?.top - getStatusBarHeight(Device),
    });
  };

  useEffect(() => {
    didMount();
  }, []);

  // * Handlers - onpress
  const onGoBack = () => {
    navigation.goBack();
  };

  const onHelpMenu = () => {
    navigation.navigate("RenderWalkthrouhgh", {
      walkthroughStyle: {
        ...walkthroughStyle,
        top:
          Platform.OS === "ios"
            ? (walkthroughStyle?.top as number) + getStatusBarHeight(Device)
            : walkthroughStyle?.top,
      },
      // {
      //   height: 208.5,
      //   left: 20.5,
      //   position: "absolute",
      //   top: 237.5 + 28,
      //   width: 319,
      // },
    });
  };

  const onMyInfoFill = async () => {
    setFromCreditRemaining({ isInitial: false });
    navigation.navigate(
      CreditRemainingMyInfoRoutes.CreditRemainingMyInfoInitial
    );
  };

  const onCBReport = () => {
    // setFromCreditRemaining({ isInitial: false });
    navigation.navigate(CreditRemainingMyInfoRoutes.CreditBureauReportInitial);
  };

  const balanceText = `${currencySign}${
    refreshBuyerStates()?.response?.credits?.balance
  }`;
  const totalText = `out of ${currencySign}${
    refreshBuyerStates()?.response?.credits?.amount
  }`;

  return (
    <StyledSafeAreaView flex={1}>
      <StyledBox
        backgroundColor="transparent"
        paddingLeft={6}
        paddingRight={7}
        paddingTop={1}
      >
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
          <TouchableOpacity onPress={onHelpMenu} style={styles.btnHeader}>
            <Image
              source={imgRightHelp}
              resizeMode="contain"
              style={{ width: mscale(22), height: mscale(24) }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.remainingCreditWrapper}>
          <StyledText
            fontFamily={"PoppinsSemiBold"}
            children={"Remaining Credit"}
            fontSize={12}
            lineHeight={13}
          />
          <StyledText
            variant="title"
            children={balanceText}
            fontSize={44}
            lineHeight={44}
          />
          <StyledBox
            height="auto"
            alignItems="flex-end"
            justifyContent="center"
            width={mscale(230)}
            marginTop={mscale(1)}
            marginBottom={mscale(23)}
          >
            <Progress.Bar
              style={{ marginTop: mscale(5) }}
              height={mscale(9.5)}
              width={mscale(230)}
              borderRadius={mscale(5)}
              useNativeDriver
              borderWidth={0}
              progress={progress}
              // width={"100%"}
              color={theme.colors.progressbar.barGreen1}
              unfilledColor={theme.colors.background}
            />
            <StyledText
              marginTop={3}
              fontFamily={"PoppinsSemiBold"}
              children={totalText}
              fontSize={12}
              lineHeight={12}
              color={theme.colors.typography.gray6}
            />
          </StyledBox>
        </View>
      </StyledBox>
      <RenderScrollViewContent
        kycsObject={kycsObject}
        onMyInfoFill={onMyInfoFill}
        onPaymentMethod={onPaymentMethod}
        onCBReport={onCBReport}
        onMeasureInWindow={onMeasureInWindow}
      />
      {/* {showWalkthrough && (
          <RenderWalkthrough walkthroughStyle={walkthroughStyle} />
        )} */}
      {/* </View> */}
      <StatusBar barStyle="dark-content" />
    </StyledSafeAreaView>
  );
};

export default CreditRemaining;
