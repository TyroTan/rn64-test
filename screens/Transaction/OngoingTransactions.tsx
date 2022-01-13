import React, { useEffect, useMemo, useState } from "react";
import * as Progress from "react-native-progress";

import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable as Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { mscale } from "utils/scales-util";
import {
  CardListView,
  Card,
  StyledText,
  KeyboardAvoiding,
  StyledBox,
  StyledScrollView,
  KeyboardAwareScrollView,
  StyledSafeAreaView,
  ProgressCircleLayered,
  ButtonTextSmall,
  CardListItemDivider,
} from "components";
import { theme } from "styles/theme";
import { useAuthStore, useOrderStore } from "stores";
const imgBGTransactionBlue = require("assets/images/bg-transaction-blue.png");
const imgHomeBlue = require("assets/images/banner-home-blue.png");
const imgUploadIcon = require("assets/images/upload-icon.png");
const imgDummyBecome = require("assets/images/dummy-become.png");

const imgAppleBlack = require("assets/images/apple-black.png");

import { useDisableAndroidBackHook } from "hooks";
import Layout from "constants/Layout";
import { hexToRGB } from "utils/hex-util";
import globalObjectState from "utils/global-object-per-country-code";
import type { OrderState } from "screens/Order/OrderTypes";
import ImageColors from "react-native-image-colors";
import { TransactionPageRoutes } from "./TransactionPageRoutes";
import type { OngoingTransactionOrder } from "./useFetchPalletes";
import { useFetchPalletes } from "./useFetchPalletes";

export interface TransactonParamsList extends ParamListBase {
  [TransactionPageRoutes.TransactionInitial]: undefined;
  [TransactionPageRoutes.TransactionItem]: undefined;
}

const styles = StyleSheet.create({
  cardRowWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: mscale(21),
  },
  cardRowWrapper2nd: {
    marginTop: mscale(12),
    marginBottom: mscale(24),
  },
  cardRowDescription: {
    paddingLeft: mscale(12),
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  cardRowAmountWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});

const stylesSwitch = StyleSheet.create({
  container: {},
  activeWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: mscale(18),
    backgroundColor: "#FFFFFF",
    width: "50%",
    zIndex: 1,
  },
  text: {
    fontFamily: "PoppinsMedium",
    fontSize: mscale(13),
    lineHeight: mscale(40),
  },
  btnText: {
    color: theme.colors.background2,
  },
  btn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "50%",
    // backgroundColor: "transparent",
  },
});

const StyledActiveShadow = styled.View`
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  elevation: 7;
`;

const SwitchBtns = (allProps: any) => {
  const { onChange, ...props } = allProps;
  const [isLeftActive, setIsLeftActive] = useState(true);
  const toggleSwitch = () => setIsLeftActive((previousState) => !previousState);

  React.useEffect(() => {
    onChange(isLeftActive ? 0 : 1);
  }, [isLeftActive]);

  const Content = useMemo(() => {
    if (isLeftActive) {
      return (
        <>
          <StyledActiveShadow style={stylesSwitch.activeWrapper}>
            <Text style={stylesSwitch.text}>Ongoing</Text>
          </StyledActiveShadow>
          <Button style={stylesSwitch.btn} onPress={toggleSwitch}>
            <Text style={[stylesSwitch.text, stylesSwitch.btnText]}>
              Completed
            </Text>
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button style={stylesSwitch.btn} onPress={toggleSwitch}>
            <Text style={[stylesSwitch.text, stylesSwitch.btnText]}>
              Ongoing
            </Text>
          </Button>
          <StyledActiveShadow style={stylesSwitch.activeWrapper}>
            <Text style={stylesSwitch.text}>Completed</Text>
          </StyledActiveShadow>
        </>
      );
    }
  }, [isLeftActive]);

  return (
    <StyledBox
      variant="flexcr"
      justifyContent="space-between"
      backgroundColor={hexToRGB("#3C3C3C", 0.31)}
      borderRadius={mscale(18)}
      // marginTop={mscale(10)}
      marginBottom={3}
      {...props}
    >
      {Content}
    </StyledBox>
  );
};

type TransactonProps = NativeStackScreenProps<
  TransactonParamsList,
  TransactionPageRoutes.TransactionInitial
>;

const StyledBGHeader = ({
  onChangeTab,
}: {
  onChangeTab: (index: number) => void;
}) => {
  const [height, setHeight] = useState(0);
  const assetImgSrc = Image.resolveAssetSource(imgBGTransactionBlue);
  const { width, height: layoutHeight } = Layout?.window ?? {};
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const srcHeight = assetImgSrc?.height ?? 1,
      srcWidth = assetImgSrc?.width ?? 1;
    const maxHeight = layoutHeight ?? 1;
    const maxWidth = width ?? 1;
    const ratio = Math.min(
      maxWidth / (srcWidth ?? 1),
      maxHeight / (srcHeight ?? 1)
    );
    setHeight(srcHeight * ratio);
    setProgress(0.3);
  }, [layoutHeight, width, assetImgSrc]);

  return (
    <>
      <Image
        resizeMode="contain"
        source={imgBGTransactionBlue}
        style={{
          position: "absolute",
          top: 0,
          height: height,
          width: width,
        }}
      />
      <StyledBox
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-end"
        width={width * 0.85}
        marginLeft={width * 0.075}
        height={height}
        backgroundColor="transparent"
        paddingBottom={6}
        // padding={10}
      >
        <StyledText variant="title" color={theme.colors.background2} mb={10}>
          Transactions
        </StyledText>
        <SwitchBtns onChange={onChangeTab} />
      </StyledBox>
    </>
  );
};

const BannerHome = () => {
  const width = mscale(105);
  return (
    <StyledBox
      variant="flexcr"
      backgroundColor={theme.colors.faintGray2}
      width={width}
      height={width}
      borderRadius={width / 2}
    >
      <Image
        source={imgHomeBlue}
        style={{ width: mscale(92), marginTop: mscale(-17) }}
        resizeMode="contain"
      />
    </StyledBox>
  );
};

const RenderRowItem = ({
  index,
  order,
  navigation,
}: {
  index: any;
  order: OngoingTransactionOrder;
  navigation: any;
}) => {
  const { formatAsCurrency } = globalObjectState.getLibrary();
  const {
    loading: loadingPalletes,
    palletes,
    percentages,
  } = useFetchPalletes({ order });

  const {
    merchant,
    code,
    repayments_remaining_amount,
    repayments_total_mount,
    repayments_fully_paid_at,
  } = order;

  const onPress = () => {
    navigation.navigate(TransactionPageRoutes.TransactionItem as any, {
      orderCode: code,
    });
  };

  return (
    <TouchableOpacity key={index} onPress={onPress}>
      <CardListView
        alignSelf="center"
        paddingHorizontal="3.7%"
        paddingRight="6%"
        paddingVertical={mscale(12)}
        width={"100%"}
      >
        <View style={styles.cardRowWrapper}>
          <ProgressCircleLayered
            loading={loadingPalletes}
            imgMerchantSrc={{ uri: order.merchant.logo }}
            percentages={percentages}
            imgStyle={{
              width: mscale(40),
            }}
            colors={palletes}
          />
          <View style={styles.cardRowDescription}>
            <StyledText variant="titleSecondarySemi" textAlign="left">
              {order.merchant.name}
            </StyledText>
            <StyledText
              variant="paragraphSmallest"
              fontSize={12}
              lineHeight={12}
              textAlign="left"
            >
              <StyledText variant="titleSecondarySemi">
                {formatAsCurrency(repayments_remaining_amount)}
              </StyledText>{" "}
              of {formatAsCurrency(repayments_total_mount)} remaining
            </StyledText>
          </View>
        </View>
      </CardListView>
    </TouchableOpacity>
  );
};

const OngoingTransactions: React.FC<TransactonProps> = (props: any) => {
  const { navigation } = props;
  useDisableAndroidBackHook();
  const { countryCode } = globalObjectState.getLibrary();
  const [activeTab, setActiveTab] = useState(0);

  const {
    response: { ongoing: responseOngoing },
    errors: { ongoing: errorsOngoing },
    fetchOrderOngoing,
    resetStates: resetStatesOrder,
  } = useOrderStore();

  // *Effects
  useEffect(() => {
    resetStatesOrder("ongoing");
    fetchOrderOngoing(countryCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeTab = (index: number) => {
    setActiveTab(index);
  };

  const TabContent = useMemo(() => {
    if (!responseOngoing) {
      return (
        <>
          {!responseOngoing && (
            <ActivityIndicator
              color={theme.colors.rn64testBlue}
              style={{}}
              size="large"
            />
          )}
        </>
      );
    }

    if (activeTab === 0) {
      return (
        <StyledBox
        // marginTop={-mscale(32)}
        >
          {!responseOngoing?.orders?.length ? (
            <CardListView padding={3} margin={3}>
              <StyledBox
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <BannerHome />
                <StyledText variant="titleSecondary">
                  No ongoing transaction
                </StyledText>
                <StyledText variant="paragraph">
                  Make your first purchase by exploring
                </StyledText>
                <StyledText variant="paragraph">
                  our partnership merchants!
                </StyledText>
              </StyledBox>
            </CardListView>
          ) : (
            responseOngoing?.orders.map(
              (order: OngoingTransactionOrder, i: number) => {
                return (
                  <RenderRowItem
                    navigation={navigation}
                    index={i}
                    order={order}
                  />
                );
              }
            )
          )}
        </StyledBox>
      );
    }

    return (
      <>
        {/* <RenderRowItem />
        <CardListView
          // marginTop={-mscale(32)}
          alignSelf="center"
          paddingHorizontal="3.7%"
          paddingRight="6%"
          width={"100%"}
        >
          <View style={styles.cardRowWrapper}>
            <ProgressCircleLayered
              imgMerchantSrc={imgAppleBlack}
              imgStyle={{
                width: mscale(40),
              }}
              colors={["#000000", "#000000"]}
            />
            <View style={styles.cardRowDescription}>
              <StyledText variant="titleSecondarySemi">Become SG</StyledText>
              <StyledText
                variant="paragraphSmallest"
                fontSize={12}
                lineHeight={12}
              >
                <StyledText variant="titleSecondarySemi">S$40.00</StyledText> of
                S$87.50 remaining
              </StyledText>
            </View>
          </View>
        </CardListView> */}
      </>
    );
  }, [responseOngoing, activeTab]);

  return (
    <View>
      <StyledBGHeader onChangeTab={onChangeTab} />
      <StyledSafeAreaView
        // mt={-20}
        paddingTop={0}
        paddingBottom={0}
        margin={0}
        marginTop={mscale(-1)}
        height="100%"
      >
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingHorizontal: mscale(18) }}
        >
          {TabContent}
        </KeyboardAwareScrollView>
      </StyledSafeAreaView>
    </View>
  );
};

export default OngoingTransactions;
