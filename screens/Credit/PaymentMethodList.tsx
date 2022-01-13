import React from "react";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import * as Device from "expo-device";
import {
  ButtonText,
  Header,
  StyledBox,
  StyledSafeAreaView,
  StyledScrollView,
  StyledText,
} from "components";
import { theme } from "styles/theme";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import { useBuyerStore } from "stores";
import { getCardIcon } from "utils/utils-common";
import { PaymentMethodRoutes } from "screens/Credit/PaymentMethodIntro";
import { ProfileRoutes } from "screens/Profile";
import globalObjectState from "utils/global-object-per-country-code";

const imgChevronDown = require("assets/images/chevron-down-path.png");
const imgCardDefault = require("assets/images/img-default-cc.png");

const styles = StyleSheet.create({
  imgCard: {
    // height: mscale(46),
    // width: mscale(46),
    height: mscale(56),
    width: mscale(56),
    // marginTop: mscale(9),
    marginLeft: mscale(11),
    // alignSelf: "center",
  },
  imgDefaultCard: {
    marginVertical: mscale(15),
    marginLeft: mscale(18),
    marginRight: mscale(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: mscale(46),
    width: mscale(46),
    borderRadius: mscale(8),
    backgroundColor: theme.colors.buttons.marineBlue,
    // padding: mscale(5),
  },
  btnChevronDown: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: mscale(50),
    padding: mscale(5),
  },
  imgChevronDown: {
    height: mscale(16),
    width: mscale(15),
  },
  flexcr: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 8,
    marginLeft: mscale(14),
  },
});

const RenderCardIcon = ({ isCardIconKnown, imgSource }: any) => {
  if (isCardIconKnown) {
    return (
      <Image style={styles.imgCard} source={imgSource} resizeMode="contain" />
    );
  }

  return (
    <View style={styles.imgDefaultCard}>
      <Image source={imgSource} resizeMode="center" />
    </View>
  );
};

const RenderPaymentMethod = (props: any) => {
  const {
    card: { brand, funding, ending_digits: endingDigits },
  } = props;

  const fundingText = funding
    .toLowerCase()
    .split("")
    .map((char: any, index: number) =>
      index === 0 ? char?.toUpperCase() : char
    )
    .join("");

  const cardIcon = getCardIcon(brand);
  const imgSource = getCardIcon(brand) ?? imgCardDefault;

  return (
    <StyledBox
      variant="flexcr"
      marginTop={4}
      borderWidth={mscale(1)}
      borderColor={theme.colors.borderGray2}
      borderRadius={mscale(8)}
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      height={mscale(77)}
    >
      <RenderCardIcon isCardIconKnown={!!cardIcon} imgSource={imgSource} />
      <View style={styles.flexcr}>
        <StyledText variant="titleSecondary" marginTop={4} lineHeight={14}>
          {fundingText} Card
        </StyledText>
        <StyledText
          variant="paragraph"
          fontSize={14}
          lineHeight={17}
          marginBottom={mscale(6)}
        >
          **** **** **** {endingDigits}
        </StyledText>
      </View>
      <TouchableOpacity style={styles.btnChevronDown}>
        <Image
          style={styles.imgChevronDown}
          source={imgChevronDown}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </StyledBox>
  );
};

const useNavigationLogic = ({ route, navigation }: any) => {
  const { name: routeName, params = {} } = route;

  const onGoBack = () => {
    navigation.goBack();
  };

  const onNext = () => {
    // navigation.navigate(CreditRemainingMyInfoRoutes.AddPaymentMethod);
    if (routeName === ProfileRoutes.PaymentMethodList) {
      return navigation.navigate(ProfileRoutes.AddPaymentMethod, {
        fromIndex0: ProfileRoutes.PaymentMethodList,
      });
    }
    navigation.navigate(PaymentMethodRoutes.AddPaymentMethod);
  };

  return {
    onNext,
    onGoBack,
  };
};

const PaymentMethodList = ({ navigation, route }: any) => {
  const {
    response: { credits: responseCredits },
  } = useBuyerStore();
  const { countryCode } = globalObjectState.getLibrary();

  const { onGoBack, onNext } = useNavigationLogic({
    navigation,
    route,
  });

  const paymentMethods =
    responseCredits?.kycs?.find(
      (kyc: any) => kyc.kyc_type === `${countryCode}_payment_method`
    )?.data?.payment_methods ?? [];

  const statusBarHeight = getStatusBarHeight(Device);

  return (
    <StyledSafeAreaView>
      <Header title={"Payment Methods"} onPress={onGoBack} />
      <StyledScrollView
        contentContainerStyle={{
          padding: mscale(20),
          paddingBottom:
            statusBarHeight > 0 ? statusBarHeight + mscale(10) : mscale(20),
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <StyledBox vairant="flexcr">
          {paymentMethods?.map((paymentMethod: any, index: number) => (
            <RenderPaymentMethod key={index} {...paymentMethod} />
          ))}
        </StyledBox>
        <ButtonText onPress={onNext}>Add New Payment Method</ButtonText>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default PaymentMethodList;
