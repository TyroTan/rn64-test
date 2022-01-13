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
import * as Device from "expo-device";
import LottieView from "lottie-react-native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  PrivacyPolicyText,
  ButtonText,
  PaymentPlanCard,
  KeyboardAwareScrollView,
  CardListView,
  RowItem,
  StepsVertical,
} from "components";
import { theme } from "styles/theme";

import {
  calculateTodaysPayment,
  getCardIcon,
  getKycsObjectKey,
  secureCardNumber,
} from "utils/utils-common";
import { alerts } from "utils/global-texts";
import globalObjectState from "utils/global-object-per-country-code";
import { navigationRef } from "navigation/RootNavigation";
import type { ResponseFetchOrder } from "screens/Order/OrderTypes";

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

export interface CardItem {
  is_default: boolean;
  status: string;
  id: string;
  expired_at: string;
  card: {
    brand: string;
    funding: string;
    ending_digits: string;
  };
}

const useChevronAnimation = ({
  collapsedPaymentMethod,
}: {
  collapsedPaymentMethod: boolean;
}) => {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 240,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [collapsedPaymentMethod]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const spinReverse = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "0deg"],
  });

  const styleAnimatedChevron = {
    transform: [
      {
        rotate: collapsedPaymentMethod ? spin : spinReverse,
      },
    ],
  };

  return { styleAnimatedChevron };
};

const RenderCardItem = (props: any) => {
  const {
    setCollapsed,
    setSelectedPaymentMethod,
    setActivePaymentMethod,
    cardItem,
    collapsed,
    index,
    styleAnimatedChevron,
    isSelectPaymentCard = false,
  } = props;

  // const isLast = index === cardsLength - 1;

  const { card } =
    cardItem ?? ({} as ResponseFetchOrder["data"]["collection_payment_method"]);
  const fundingText = card?.funding === "credit" ? "Credit Card" : "Debit Card";
  const cardNoText = secureCardNumber(card?.ending_digits ?? "");

  const cardIcon = getCardIcon((card?.brand ?? "") as any);
  // const keyCollapsed = "1";
  // const key = `${keyCollapsed}${cardItem.card.brand}${cardItem.card.funding}${cardItem.card.ending_digits}`;

  return (
    <TouchableOpacity
      key={
        isSelectPaymentCard
          ? `nocard-${index}`
          : `${card.ending_digits}-${index}`
      }
      onPress={() => {
        setCollapsed((prev: boolean) => !prev);
        setSelectedPaymentMethod(cardItem);
        setActivePaymentMethod(cardItem);
      }}
      // style={styles.btnChevronDown}
      style={{ marginTop: mscale(3), width: "100%" }}
    >
      <StyledBox
        variant="flexcr"
        // marginTop={4}
        borderBottomWidth={!collapsed ? 0 : mscale(1)}
        borderColor={theme.colors.borderGray2}
        borderRadius={mscale(8)}
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        {isSelectPaymentCard ? (
          <>
            <View style={[styles.cardIcon, { width: 0 }]}></View>
            <View style={styles.flexcr}>
              <StyledText
                variant="titleTertiary"
                // marginTop={4}
                color={theme.colors.typography.gray1}
                lineHeight={14}
              >
                {cardItem}
              </StyledText>
            </View>
          </>
        ) : (
          <>
            <Image
              style={styles.cardIcon}
              source={cardIcon}
              resizeMode="contain"
            />
            <View style={styles.flexcr}>
              <StyledText
                variant="titleSecondary"
                marginTop={4}
                lineHeight={14}
              >
                {fundingText}
              </StyledText>
              <StyledText
                variant="paragraph"
                fontSize={14}
                lineHeight={17}
                marginBottom={mscale(6)}
              >
                {cardNoText}
              </StyledText>
            </View>
          </>
        )}
        {index > 0 ? (
          <></>
        ) : (
          <Animated.Image
            style={[styles.imgChevronDown, styleAnimatedChevron]}
            source={imgChevronDown}
            resizeMode="contain"
          />
        )}
      </StyledBox>
    </TouchableOpacity>
  );
};

// saveCurrentUrl,
// useNewPaymentMethod,
type ActiveCardItem = Omit<CardItem, "is_default">;
export const RenderPaymentMethodSelect = ({
  collapsedPaymentMethod,
  setCollapsedPaymentMethod,
  cards,
  setSelectedPaymentMethod,
  onAddNewPaymentMethod,
  presetActivePaymentMethod,
}: {
  collapsedPaymentMethod: boolean;
  setCollapsedPaymentMethod: (props: any) => void;
  cards: any[];
  setSelectedPaymentMethod: any;
  onAddNewPaymentMethod: (props: any) => void;
  presetActivePaymentMethod: ActiveCardItem;
}) => {
  // const { card } = cards?.[0] ?? {};
  const { styleAnimatedChevron } = useChevronAnimation({
    collapsedPaymentMethod,
  });
  const [activePaymentMethod, setActivePaymentMethod] =
    useState<null | ActiveCardItem>(presetActivePaymentMethod || null);
  const [showNewMethodPopup, setShowNewMethodPopup] = useState(false);

  // const { card } = cards[0];
  // const fundingText = card.funding === "credit" ? "Credit Card" : "Debit Card";
  // const cardNoText = secureCardNumber(card.ending_digits);

  // *Methods
  const handleAddNewPaymentMethod = () => {
    // if (saveCurrentUrl) {
    //   const currentUrl = window.location.href;
    //   setPaymentMethodRedirectLocalDb(currentUrl);
    // }
  };
  // if (showNewMethodPopup) {
  //   return (
  //     <TriggerPopup
  //       showPopup={showNewMethodPopup}
  //       message="You will be redirected back to this page right after adding your new payment method."
  //       callback={handleAddNewPaymentMethod}
  //       // nextDestination="/paymentmethods/new"
  //       nextDestination="/paymentmethods/new/credit"
  //       buttonText="OKAY"
  //     />
  //   );
  // }

  const cardsLength = cards?.length;
  const ContentOptions = useMemo(() => {
    const items = [
      ...(collapsedPaymentMethod
        ? [...(activePaymentMethod ? [activePaymentMethod] : []), ...cards]
        : activePaymentMethod
        ? [activePaymentMethod]
        : ["Select payment method"]),
    ];

    return (
      <>
        {items.map(
          (cardItem: "select payment method" | CardItem, index: number) => {
            // if (typeof cardItem === "string") {
            //   return <StyledText>{cardItem}</StyledText>;
            // }
            return (
              <RenderCardItem
                isSelectPaymentCard={typeof cardItem === "string"}
                setCollapsed={setCollapsedPaymentMethod}
                setActivePaymentMethod={setActivePaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                cardItem={cardItem}
                collapsed={collapsedPaymentMethod}
                index={index}
                styleAnimatedChevron={styleAnimatedChevron}
              />
            );
          }
        )}
        {collapsedPaymentMethod && (
          <TouchableOpacity onPress={onAddNewPaymentMethod}>
            <StyledBox
              variant="flexcr"
              // marginTop={4}
              borderColor={theme.colors.borderGray2}
              borderRadius={mscale(8)}
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <StyledText
                variant="titleSecondary"
                paddingY={mscale(15)}
                color={theme.colors.buttons.marineBlue}
              >
                Create new payment method
              </StyledText>
            </StyledBox>
          </TouchableOpacity>
        )}
      </>
    );
  }, [collapsedPaymentMethod, activePaymentMethod, cards]);

  return <>{ContentOptions}</>;
};
