import React, { useRef, useEffect, useMemo, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  Animated,
  Image,
  Easing,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Progress from "react-native-progress";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import LottieView from "lottie-react-native";
import { getStatusBarHeight, mscale } from "utils/scales-util";

import StyledBox from "../StyledBoxes";
import { StyledText, SDollarTextComponent } from "../StyledTexts";
import { CardListView } from "../CardLists";
import StyledMerchantBanner from "../StyledMerchantBanner";
import Header, { HeaderLeft } from "../StyledHeaders";
import ProgressBar from "../ProgressBar";

import { theme } from "styles/theme";
// import useAuthStore from "stores/useAuthStore";
// import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Layout from "constants/Layout";
import { useResetScreen } from "hooks";
import { useBuyerStore, useOrderStore, useUserStore } from "stores";
import {
  calculateTodaysPayment,
  getCardIcon,
  getGenericSkeletonConfig,
  getKycsObjectKey,
  secureCardNumber,
} from "utils/utils-common";
import { Modalize } from "react-native-modalize";
import RenderScheduleRow from "./RenderScheduleRow";
import { alerts } from "utils/global-texts";
import globalObjectState from "utils/global-object-per-country-code";
import PaymentSchedule from "./PaymentSchedule";
import { OrderState } from "screens/Order/OrderTypes";
import OrderPageRoutes from "screens/Order/OrderPageRoutes";

// const imgVisa = require("assets/images/visa-cc.png");
const imgChevronDown = require("assets/images/chevron-down-path.png");

const styles = StyleSheet.create({
  line: {
    borderWidth: mscale(0.5),
    height: mscale(1),
    width: "100%",
    borderColor: "#E9E9E9",
  },
  cardIcon: {
    height: mscale(46),
    width: mscale(46),
    // marginTop: mscale(9),
    marginLeft: mscale(11),
    // alignSelf: "center",
    // borderWidth: 1,
  },
  btnChevronDown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: mscale(50),
  },
  imgChevronDown: {
    height: mscale(16),
    width: mscale(15),
    marginRight: mscale(18),
  },
  flexcr: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,
    marginLeft: mscale(14),
  },
});

const Line = ({ borderStyle = "solid", marginTop = null }: any) => (
  <View
    style={[
      styles.line,
      {
        marginTop: marginTop ?? mscale(12),
        borderStyle,
      },
    ]}
  />
);

const RenderPaymentAgreement = (allProps: any) => {
  return (
    <StyledText variant="paragraph" fontSize={9} {...allProps}>
      I agree to the terms in Rn64test's
      <StyledText
        variant="paragraph"
        fontSize={10}
        color={theme.colors.buttons.marineBlue}
      >
        {" "}
        Instalment Payment Agreement
      </StyledText>
    </StyledText>
  );
};

interface OrderStackHeaderProps {
  type: "progress" | "card";
}

const OrderStackHeader = (props: any) => {
  const type: OrderStackHeaderProps["type"] = props.type;

  const {
    refreshOrderStates,
    response: {
      orderForStore: responseOrderForStore,
      // order: responseOrder,
      draft: responseOrderDraft,
      cancelOrder: responseCancelOrder,
    },
    errors: { orderForStore: errorsOrderForStore },
  } = useOrderStore();
  const { currencySign, formatAsCurrency } = globalObjectState.getLibrary();

  const [currentOrder, setCurrentOrder] = useState<OrderState | null>(null);

  const {
    response: { initialStoreStates },
  } = useUserStore();

  useResetScreen({
    navigation: props.navigation,
    onReset: () => {
      const { response: responseOnFocus } = refreshOrderStates();

      const responseOrder = responseOnFocus?.order;

      const draftOrder =
        responseOnFocus?.orderDraft?.orders?.[
          (responseOnFocus?.orderDraft?.orders?.length ?? 0) - 1
        ];
      const pendingPurchaseDraftOrder = draftOrder;

      const draftOrderOnFocus = responseOnFocus.orderForStore?.merchant?.logo
        ? responseOnFocus.orderForStore
        : initialStoreStates?.order ?? pendingPurchaseDraftOrder;

      const order = responseOrder ? responseOrder : draftOrderOnFocus;

      setCurrentOrder(order);
    },
  });

  let progress = 40;

  switch (props?.back?.title) {
    case OrderPageRoutes.PaymentPlans:
      progress = 100;
      break;

    default:
      progress = 40;
  }

  const onGoBack = () => {
    const paramsOnGoBack = props?.navigation?.route?.params?.onGoBack;
    const goBack =
      props?.navigation?.goBack ??
      props?.onGoBack ??
      paramsOnGoBack ??
      ((() => true) as any);
    goBack();
  };

  const properties = {
    ...props,
    wrapperProps: {
      height: mscale(20),
      marginLeft: mscale(-5),
    },
    // title: "Confirm your details",
    HeaderLeft: <HeaderLeft onPress={onGoBack} />,

    // name: MyInfoRoutes.MyInfoIntro,
  };

  // const draftOrderData = responseOrderForStore?.merchant?.logo
  //   ? responseOrderForStore
  //   : initialStoreStates?.order ?? pendingPurchaseDraftOrder;

  const imgLogoSource = {
    uri: currentOrder?.merchant?.logo,
  };

  // *Effects
  useEffect(() => {
    if (responseOrderDraft || responseOrderForStore) {
      const current =
        responseOrderDraft?.orders?.[
          (responseOrderDraft?.orders?.length ?? 0) - 1
        ];
      const pendingPurchaseDraftOrder = current;

      const currentData = responseOrderForStore?.merchant?.logo
        ? responseOrderForStore
        : initialStoreStates?.order ?? pendingPurchaseDraftOrder;

      setCurrentOrder(currentData);
    }
  }, [responseOrderDraft, responseOrderForStore]);

  const WrapperViewEl = type === "card" ? CardListView : StyledBox;
  const wrapperViewProps =
    type === "card"
      ? {
          marginBottom: 0,
        }
      : {};

  const renderProgressBar = () => {
    if (type === "card") {
      return <></>;
    }

    return (
      <ProgressBar
        progress={progress}
        height={mscale(4)}
        trackColor={theme.colors.typography.gray6}
        backgroundColor={theme.colors.buttons.marineBlue}
      />
    );
  };

  return (
    <WrapperViewEl
      style={{
        // maxHeight: mscale(112),
        paddingTop: getStatusBarHeight(Device),
      }}
      {...wrapperViewProps}
    >
      <Header {...properties} />

      <StyledBox
        variant="flexcr"
        justifyContent="flex-start"
        alignItems="center"
        // border
        width="80%"
        alignSelf="center"
        marginTop={3}
        marginBottom={5}
      >
        <StyledMerchantBanner
          alignSelf="flex-start"
          source={imgLogoSource}
          imgProps={
            {
              // style: styles.imgLogo,
            }
          }
        />
        <SDollarTextComponent
          label={currentOrder?.merchant?.name}
          value={currentOrder?.grand_total_amount}
          currencySign={currencySign}
          wrapperProps={{
            width: null,
            marginLeft: mscale(15),
            justifyContent: "flex-start",
          }}
        />
      </StyledBox>
      {renderProgressBar()}
    </WrapperViewEl>
  );
};

const OrderStackMain = (allProps: any) => {
  return <OrderStackHeader {...allProps} />;
};

export const OrderStackHeaderTypeCard = (allProps: any) => {
  const type: OrderStackHeaderProps["type"] = "card";
  return <OrderStackHeader {...allProps} type={type} />;
};

export default OrderStackMain;
