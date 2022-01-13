import React, { useEffect, useRef } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  Animated,
  StyleSheet,
  Easing,
  ActivityIndicator,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { mscale } from "utils/scales-util";
import { StyledBox, StyledText } from "components";
import Layout from "constants/Layout";
import { theme } from "styles/theme";
import type { OrderDraft } from "screens/Order/OrderTypes";
import CreditRoutes from "./CreditRoutes";
import { useResetScreen } from "hooks";
import { useNestedNavigatorStore, useOrderStore } from "stores";
import globalObjectState from "utils/global-object-per-country-code";
const imgPendingPurchase = require("assets/images/pending-purchase.png");

const layoutWidth = Layout.screen.width;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#20232a",
  },
  title: {
    marginTop: 10,
    textAlign: "center",
    color: "#61dafb",
  },
  boxContainer: {
    // flex: 1,
    // height: mscale(450),
    width: Layout.screen.width * 0.92,
    position: "absolute",
    zIndex: 1,
    bottom: mscale(10),
    // backgroundColor: theme.colors.actions.yellowWarning3,
    backgroundColor: theme.colors.actions.yellowWarning3,
    borderRadius: mscale(12),
    // right: 0,
    left: Layout.screen.width * 0.04,
    // minHeight: mscale(50),
    alignItems: "center",
  },
  box: {
    // marginTop: 32,
    // marginBottom: mscale(20),
    width: layoutWidth * 0.8,
  },
  list: {
    backgroundColor: "#fff",
  },
  listHeader: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#f4f4f4",
    color: "#999",
    fontSize: 12,
    textTransform: "uppercase",
  },
  listRow: {
    padding: 8,
  },
  img: {
    width: mscale(48),
    height: mscale(48),
  },
});

const PendingPurchase = ({
  navigation,
  draftOrders,
}: {
  navigation: any;
  draftOrders: OrderDraft[];
}) => {
  const tabBarHeight = useBottomTabBarHeight();
  const {
    resetStates: resetStatesOrder,
    response: { order: responseOrder },
    isLoading: { order: isLoadingOrder },
  } = useOrderStore();

  const { currencySign } = globalObjectState.getLibrary();
  const { setFromPendingPurchase } = useNestedNavigatorStore();
  useResetScreen({
    navigation,
    onReset: () => {
      setTimeout(() => {
        animate(Easing.in(Easing.bounce));
      }, 120);
    },
  });

  const draftOrder = draftOrders[draftOrders.length - 1];

  const refTimeout = useRef<any>();
  let opacity = new Animated.Value(0);

  const animate = (easing: any) => {
    opacity.setValue(0.6);
    Animated.timing(opacity, {
      useNativeDriver: false,
      toValue: 1,
      duration: 1200,
      easing,
    } as any).start();
  };

  const mheight = Math.round(mscale(110));

  const size = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [mheight * 0.6, mheight * 0.8],
  });

  const animatedStyles = [
    styles.box,
    {
      opacity,
      // width: size,
      height: size,
    },
  ];

  const onGoToMerchant = () => {
    // if (isLoadingBtns) {
    //   return;
    // }

    // setFromPendingPurchase({ draftOrder: responseOrder });
    setFromPendingPurchase({ draftOrder });
    navigation.navigate(CreditRoutes.OrderDL);

    // had to do this as draftOrder lacks the details like available_payment_plans
    // fetchOrder(draftOrder.code);
  };

  // useEffect(() => {
  //   refTimeout.current = setTimeout(() => {
  //     animate(Easing.in(Easing.bounce));
  //   }, 120);

  //   return () => {
  //     clearTimeout(refTimeout.current);
  //   };
  // }, []);

  const isLoadingBtns = isLoadingOrder;

  const totalFromMerchantText = (
    <StyledText variant="paragraph" fontSize={12} lineHeight={12} mt={2}>
      With{" "}
      <StyledText
        variant="paragraph"
        fontFamily={"PoppinsBold"}
        fontSize={12}
        lineHeight={12}
      >
        {draftOrder.merchant.name}
      </StyledText>{" "}
      for{" "}
      <StyledText
        variant="paragraph"
        fontFamily={"PoppinsBold"}
        fontSize={12}
        lineHeight={12}
      >
        {currencySign}
        {draftOrder.grand_total_amount}
      </StyledText>
    </StyledText>
  );

  return (
    <TouchableOpacity
      onPress={onGoToMerchant}
      // style={[styles.boxContainer, { bottom: tabBarHeight + mscale(100) }]}
      style={[styles.boxContainer, {}]}
    >
      {/* dddebug <Animated.View style={animatedStyles}> */}
      <View style={styles.box}>
        <StyledBox
          variant="flexcr"
          justifyContent="space-between"
          backgroundColor="transparent"
          paddingVertical={12}
        >
          <StyledBox backgroundColor="transparent" flex={4}>
            <StyledText variant="titleSecondary" fontSize={12} lineHeight={12}>
              You have a pending purchase
            </StyledText>
            {totalFromMerchantText}
          </StyledBox>
          {/* <StyledBox>
            <Image
              source={imgPendingPurchase}
              resizeMode="contain"
              style={styles.img}
            />
          </StyledBox> */}
          {isLoadingBtns ? (
            <ActivityIndicator />
          ) : (
            <Image
              source={imgPendingPurchase}
              resizeMode="contain"
              style={styles.img}
            />
          )}
        </StyledBox>
      </View>
      {/* </Animated.View> */}
    </TouchableOpacity>
  );
};

export default PendingPurchase;
