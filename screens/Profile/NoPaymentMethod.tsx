import Device from "expo-device";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  Switch,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { ButtonText, StyledTextInputFieldGroup } from "components";

// import { API_URL } from "../Config";
// import { colors } from "../colors";
import { STRIPE_PUBLIC_KEY } from "const";
import { StyledBox, StyledText } from "components";
import { initStripe } from "@stripe/stripe-react-native";
import { useBuyerStore, useUserStore } from "stores";
const imgNoPaymentMethod = require("assets/images/banner-no-payment-method.png");
import { getStatusBarHeight, mscale } from "utils/scales-util";
import { theme } from "styles/theme";
import { ProfileRoutes } from "screens/Profile";
import { StripeProviderRN64TEST, useAddNewPaymentMethod } from "hooks";

const styles = StyleSheet.create({
  imgBanner: {
    width: mscale(144),
    height: mscale(144),
  },
});

const NoPaymentMethod = (props: any) => {
  const { navigation } = props;
  const {
    response: { user: userResponse },
  } = useUserStore();

  // deprecated
  const { loading, init } = useAddNewPaymentMethod();

  const { submitPaymentMethod } = useBuyerStore();
  const [saveCard, setSaveCard] = useState(false);
  const [isComplete, setComplete] = useState(false);

  // *Events
  const onNext = () => {
    navigation.navigate(ProfileRoutes.AddPaymentMethod);
    // init();
  };

  return (
    <StripeProviderRN64TEST>
      <StyledBox height="100%">
        <StyledBox
          position="absolute"
          top="23%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
        >
          <Image
            style={styles.imgBanner}
            source={imgNoPaymentMethod}
            resizeMode="contain"
          />
          <StyledText variant="titleSecondary" mt={12}>
            No payment methods
          </StyledText>
          <StyledText variant="paragraphSmall" mt={1}>
            Add a default payment method to start
          </StyledText>
          <StyledText variant="paragraphSmall" mt={1}>
            making purchases
          </StyledText>
        </StyledBox>
        <ButtonText
          position="absolute"
          alignSelf="center"
          bottom={getStatusBarHeight(Device) >= 20 ? mscale(44) : mscale(20)}
          variant="primary"
          onPress={onNext}
          // disabled={!isComplete}
          disabled={loading}
          loading={loading}
        >
          NEW PAYMENT METHOD
        </ButtonText>
      </StyledBox>
    </StripeProviderRN64TEST>
  );
};

export default NoPaymentMethod;
