import React, { useEffect, useState } from "react";
import * as Progress from "react-native-progress";

import {
  StyleSheet,
  Image,
  ImageBackgroundProps,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";
import * as Device from "expo-device";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  CardListView,
  Card,
  StyledText,
  KeyboardAvoiding,
  StyledBox,
  StyledScrollView,
} from "components";
import { theme } from "styles/theme";
import {
  useAuthStore,
  useBuyerStore,
  useNestedNavigatorStore,
  useOrderStore,
  useUserStore,
} from "stores";
const imgHomeBGBlue = require("assets/images/home-bg-blue.png");
const imgLogo2White = require("assets/images/logo-2-white.png");
const imgBellWhite = require("assets/images/bell-white.png");
// const imgPendingPurchaseGold = require("assets/images/pending-purchase-gold.png");

import { useDisableAndroidBackHook, useResetScreen } from "hooks";
import Layout from "constants/Layout";
import CreditRoutes from "./CreditRoutes";
import PendingPurchase from "./PendingPurchase";
import { groupRepaymentsIntoMonths } from "utils/utils-common";
import { hexToRGB } from "utils/hex-util";
import globalObjectState from "utils/global-object-per-country-code";
import type { FromOrderPaymentReceiptObject } from "stores/useNestedNavigatorStore";
import RenderUpcomingTransactions from "./RenderUpcomingTransactions";
import { formatProgressPercentRounded } from "utils/js-utils";
import globalObjectLastActionState from "utils/global-object-last-action";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import useUserStoreRefreshableInitialStoreStates from "./useUserStoreRefreshableInitialStoreStates";

export interface CreditParamsList extends ParamListBase {
  [CreditRoutes.CreditInitial]: undefined;
  [CreditRoutes.CreditHomeInitial]: undefined;
  [CreditRoutes.CreditHome]: undefined;
  [CreditRoutes.CreditRemaining]: undefined;
  [CreditRoutes.CreditBuy]: undefined;
  [CreditRoutes.CreditQr]: undefined;
  [CreditRoutes.CreditTransaction]: undefined;
  [CreditRoutes.CreditProfile]: undefined;
}

type CreditHomeProps = NativeStackScreenProps<
  CreditParamsList,
  CreditRoutes.CreditHome
>;

const StyledBGHeader = ({
  onPressManage,
  userCredits,
  responseUpcomingPayments,
  setBGHeaderHeight,
}: {
  onPressManage: () => void;
  userCredits: any;
  responseUpcomingPayments: any;
  setBGHeaderHeight: (height: number) => void;
}) => {
  const [height, setHeight] = useState(mscale(250));
  const assetImgSrc = Image.resolveAssetSource(imgHomeBGBlue);
  const { width, height: layoutHeight } = Layout?.window ?? {};
  const [progress, setProgress] = useState(0);
  const { currencySign } = globalObjectState.getLibrary();

  // *Effects

  useEffect(() => {
    // TODO
    if (responseUpcomingPayments) {
      // console.log(
      //   "got itemsss responseUpcomingPayments",
      //   Object.keys(responseUpcomingPayments)
      // );
      const grouped = groupRepaymentsIntoMonths(
        responseUpcomingPayments.repayments
      );
      // setGroupedRepayments(grouped);
    }
  }, [responseUpcomingPayments]);

  useEffect(() => {
    const srcHeight = assetImgSrc?.height ?? 1,
      srcWidth = assetImgSrc?.width ?? 1;
    const maxHeight = layoutHeight ?? 1;
    const maxWidth = width ?? 1;
    const ratio = Math.min(
      maxWidth / (srcWidth ?? 1),
      maxHeight / (srcHeight ?? 1)
    );

    const bgHeight = srcHeight * ratio;
    setHeight(bgHeight);
    setBGHeaderHeight(bgHeight);

    const max =
      parseFloat(userCredits?.balance ?? "0") +
      parseFloat(responseUpcomingPayments?.total_due_amount ?? "0");

    const progress =
      max <= 0
        ? 0
        : Math.round((parseFloat(userCredits?.balance ?? "0") / max) * 100) /
          100;

    setProgress(progress);
  }, [layoutHeight, width, assetImgSrc, responseUpcomingPayments]);

  const upcomingPaymentsTotalDueText = `${currencySign}${responseUpcomingPayments.total_due_amount}`;

  return (
    <View style={{ width: "96%" }}>
      <Image
        resizeMode="stretch"
        source={imgHomeBGBlue}
        style={{
          position: "absolute",
          top: 0,
          height: height,
          width: Layout.screen.width,
        }}
      />
      <StyledBox
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="stretch"
        width={width}
        height={height}
        backgroundColor="transparent"
        padding={10}
        // paddingLeft={2}
      >
        <StyledBox
          variant="flexcr"
          justifyContent="space-between"
          height={mscale(50)}
          paddingRight={4}
          width={"100%"}
          backgroundColor="transparent"
        >
          <Image
            source={imgLogo2White}
            resizeMode="contain"
            style={{ width: mscale(43) }}
          />
          <Image
            source={imgBellWhite}
            resizeMode="contain"
            style={{ width: mscale(23) }}
          />
        </StyledBox>
        <StyledBox
          flexDirection="column"
          height={mscale(50)}
          width={"100%"}
          marginTop={height - mscale(238)}
          backgroundColor="transparent"
        >
          <StyledText
            fontFamily="PoppinsBold"
            fontSize={15}
            lineHeight={15}
            color={theme.colors.typography.mainInverse}
          >
            Remaining Due
          </StyledText>
          {responseUpcomingPayments?.total_due_amount ? (
            <StyledText
              fontFamily="PoppinsBold"
              fontSize={41}
              lineHeight={41}
              color={theme.colors.typography.mainInverse}
            >
              {upcomingPaymentsTotalDueText}
            </StyledText>
          ) : (
            <StyledBox
              variant="flexcr"
              backgroundColor="transparent"
              justifyContent="center"
            >
              <StyledText
                fontFamily="PoppinsBold"
                fontSize={41}
                lineHeight={41}
                color={"transparent"}
                width="60%"
                backgroundColor={hexToRGB("#FFFFFF", 0.6)}
              >
                noop
              </StyledText>
            </StyledBox>
          )}

          {/* <StyledText
            fontFamily="PoppinsBold"
            fontSize={41}
            lineHeight={41}
            color={theme.colors.typography.mainInverse}
            backgroundColor={theme.colors.typography.mainInverse}
          >
            {responseUpcomingPayments.total_due_amount}
          </StyledText> */}
        </StyledBox>
      </StyledBox>
      <Card
        marginTop={-mscale(32)}
        alignSelf="center"
        paddingTop="2.5%"
        paddingHorizontal="7%"
        paddingRight="6%"
        marginLeft={"4%"}
        width={"96%"}
        LeftHeader={
          <StyledText variant="titleSecondaryGray">Available Credit</StyledText>
        }
        RightHeader={
          <TouchableOpacity
            style={{ padding: mscale(2.5) }}
            onPress={onPressManage}
          >
            <StyledText variant="mainBlue">Manage</StyledText>
          </TouchableOpacity>
        }
      >
        <StyledText
          fontFamily="PoppinsBold"
          fontSize={15}
          lineHeight={15}
          marginTop={4}
          textAlign="left"
        >
          {userCredits.balanceText}
        </StyledText>
        <StyledBox
          variant="flexcr"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginTop={mscale(5)}
          marginBottom={mscale(23)}
        >
          <Progress.Bar
            style={{
              flex: 1,
              width: "100%",
            }}
            height={mscale(9.5)}
            borderRadius={mscale(5)}
            useNativeDriver={false}
            borderWidth={0}
            progress={progress}
            width={null}
            color={theme.colors.progressbar.barGreen1}
            unfilledColor={theme.colors.progressbar.background}
          />
          <StyledText
            flex={1}
            fontFamily={"PoppinsSemiBold"}
            fontSize={10}
            lineHeight={10}
            color={theme.colors.typography.gray6}
            ml={1}
          >
            {formatProgressPercentRounded(progress)}
          </StyledText>
        </StyledBox>
      </Card>
    </View>
  );
};

const CreditHome: React.FC<CreditHomeProps> = ({ route, navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();
  const { formatAsCurrency } = globalObjectState.getLibrary();
  const { submitExtendToken } = useAuthStore();
  useDisableAndroidBackHook();

  // const { getNestedNavigatorStates, setFromOrderPaymentReceipt } =
  //   useNestedNavigatorStore();
  const {
    response: { initialStoreStates },
    refreshInitialStoreStates,
    refreshingInitialStoreStates,
    setterBuyerInitialStoreState,
  } = useUserStoreRefreshableInitialStoreStates();

  useEffect(() => {
    if (initialStoreStates) {
      setterBuyerInitialStoreState(initialStoreStates);
    }
  }, [initialStoreStates]);

  const [bGHeaderHeight, setBGHeaderHeight] = useState(mscale(250));

  const {
    fetchOrderDraft,
    resetStates: resetStatesOrder,
    response: { draft: responseDraftOrders },
    isLoading: { draft: isLoadingOrderDraft },
  } = useOrderStore();

  const { countryCode } = globalObjectState.getLibrary();

  // *Effects

  useEffect(() => {
    // console.log("responseDraftOrdersresponseDraftOrders", responseDraftOrders);
  }, [responseDraftOrders]);

  // didmount, also triggers during navigaiton.goBack()
  const onFocus = () => {
    const { action } = globalObjectLastActionState.get();

    // globalObjectLastActionState
    if (action === "fromPaymentReceipt") {
      navigation.navigate(CreditRoutes.CreditTransaction);
      // todo
      // navigation.navigate("CreditInitial", {
      //   screen: "CreditHomeInitial",
      //   params: {
      //     screen: "CreditTransaction",
      //   },
      // });
    }

    // const { fromAddPaymentMethodSuccess } =
    //   refreshNestedNavigatorStates()?.response ?? {};

    // if (fromAddPaymentMethodSuccess?.goToHomeCreditRemaining === true) {
    //   return navigation.dispatch(
    //     StackActions.replace(CreditRoutes.CreditInitial)
    //   );
    // }

    // todo maybe only reset when from onDiscardPurchase?
    resetStatesOrder("draft");
    fetchOrderDraft(countryCode);
  };

  useResetScreen({
    navigation,
    onReset: onFocus,
  });

  // *did mount
  // useEffect(() => {
  //   submitExtendToken();
  //   fetchOrderDraft(countryCode);
  // }, []);

  const onPressManage = () => navigation.navigate(CreditRoutes.CreditRemaining);

  // might deprecate currencySign, maybe use formatAsCurrency instead
  const userCredits = {
    total: initialStoreStates?.credits.amount,
    totalText: `${formatAsCurrency(initialStoreStates?.credits.amount)}`,
    balance: initialStoreStates?.credits.balance,
    balanceText: `${formatAsCurrency(initialStoreStates?.credits.balance)}`,
  };

  const hasPendingPurchase = responseDraftOrders?.orders?.length;
  const scrollWrapperHeight = hasPendingPurchase
    ? Layout.screen.height -
      getStatusBarHeight(Device) -
      bGHeaderHeight -
      tabBarHeight -
      mscale(165)
    : Layout.screen.height -
      getStatusBarHeight(Device) -
      bGHeaderHeight -
      tabBarHeight -
      mscale(75);

  const refreshing = isLoadingOrderDraft || refreshingInitialStoreStates;
  const onRefresh = () => {
    refreshInitialStoreStates();
    fetchOrderDraft(countryCode);
  };

  return (
    <View style={{ height: "100%" }}>
      <StyledBGHeader
        setBGHeaderHeight={setBGHeaderHeight}
        onPressManage={onPressManage}
        userCredits={userCredits}
        responseUpcomingPayments={initialStoreStates.upcomingPayments}
      />
      <StyledBox
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height={scrollWrapperHeight}
      >
        <StyledScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{
            // flex: 1,
            paddingHorizontal: mscale(16),
            paddingTop: mscale(8),
            // paddingBottom: mscale(16),
            // paddingBottom: bGHeaderHeight
            //   ? bGHeaderHeight + mscale(50) + tabBarHeight
            //   : 0,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* <Image
          resizeMode="contain"
          source={imgPendingPurchaseGold}
          style={{
            height: mscale(100),
            marginTop: -mscale(10),
            width: "105%",
            alignSelf: "center",
            marginBottom: 3,
          }}
        /> */}
          <RenderUpcomingTransactions
            navigation={navigation}
            responseUpcomingPayments={initialStoreStates.upcomingPayments}
          />
        </StyledScrollView>
      </StyledBox>
      {hasPendingPurchase ? (
        <PendingPurchase
          navigation={navigation}
          draftOrders={responseDraftOrders.orders}
        />
      ) : (
        <></>
      )}
    </View>
  );
};

export default CreditHome;
