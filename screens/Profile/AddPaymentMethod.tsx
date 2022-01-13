import type {
  CardFormView,
  PaymentMethodCreateParams,
} from "@stripe/stripe-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  Switch,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  CardForm,
  CardField,
  CardFieldInput,
  useConfirmPayment,
  createPaymentMethod,
  confirmSetupIntent,
} from "@stripe/stripe-react-native";
import * as Device from "expo-device";
import {
  ButtonText,
  Header,
  StyledBox,
  StyledSafeAreaView,
  StyledText,
  StyledTextInputFieldGroup,
} from "components";
import { postPaymentMethod, patchPaymentMethod } from "services";

// import { API_URL } from "../Config";
// import { colors } from "../colors";
import { STRIPE_PUBLIC_KEY } from "const";
import { initStripe } from "@stripe/stripe-react-native";
import { useBuyerStore, useUserStore } from "stores";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import { theme } from "styles/theme";
import { Modalize } from "react-native-modalize";
import { PaymentMethodRoutes } from "screens/Credit/PaymentMethodIntro";
import { ProfileRoutes } from "screens/Profile/ProfileRoutes";
import { awaitableDelay } from "utils/js-utils";
import { alerts } from "utils/global-texts";
import globalObjectLastActionState from "utils/global-object-last-action";
import { TransactionPageRoutes } from "screens/Transaction/TransactionPageRoutes";
import { OrderPageRoutes } from "screens/Order";

// ideally, fetch from backend
const fetchPublishableKey = async (_: any) => STRIPE_PUBLIC_KEY;

const colors = {
  blurple: "#635BFF",
  blurple_dark: "#5851DF",
  white: "#FFFFFF",
  light_gray: "#F6F9FC",
  dark_gray: "#425466",
  slate: "#0A2540",
};

interface Props {
  paymentMethod?: string;
  onInit?(): void;
}

const PaymentWrapper: React.FC<Props> = ({
  paymentMethod = "stripe-example",
  children,
  onInit,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      const publishableKey = await fetchPublishableKey(paymentMethod);
      if (publishableKey) {
        await initStripe({
          publishableKey,
          merchantIdentifier: "com.rn64test.app",
          urlScheme: paymentMethod === "wechat_pay" ? undefined : "rn64test",
          setUrlSchemeOnAndroid: true,
        });
        setLoading(false);
        onInit?.();
      }
    }
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
  ) : (
    <ScrollView
      accessibilityLabel="payment-screen"
      style={stylesPaymentWrapper.container}
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{ flex: 1 }}
    >
      {children}
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      {/* <Text style={{ opacity: 0 }}>appium fix</Text> */}
    </ScrollView>
  );
};

const stylesPaymentWrapper = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: colors.white,
    // paddingTop: 20,
    // paddingHorizontal: 16,
  },
});

const ModalContentError = ({ onReturn }: any) => {
  return (
    <StyledBox width="100%" alignSelf="center" paddingHorizontal={"8%"}>
      <StyledText mt={11} variant="titleModalBottom">
        Information
      </StyledText>
      <StyledText
        mt={7}
        variant="paragraphModalBottom"
        color={theme.colors.typography.main}
        textAlign="left"
        numberOfLines={3}
        lineHeight={19}
        mb={2}
      >
        {alerts.genericError}
      </StyledText>
      <ButtonText
        onPress={onReturn}
        children="Back"
        width="100%"
        mb={10}
        mt={10}
      />
    </StyledBox>
  );
};

const useNavigationLogic = ({ route, navigation }: any) => {
  const { name: routeName, params = {} } = route ?? { name: "" };

  const onGoBack = () => {
    navigation.goBack();
  };

  const onNext = () => {
    if (globalObjectLastActionState.get().action === "fromTransactionItem") {
      return navigation.navigate(TransactionPageRoutes.AddPaymentMethodSuccess);
    }

    if (globalObjectLastActionState.get().action === "fromOrderConfirm") {
      return navigation.navigate(OrderPageRoutes.AddPaymentMethodSuccess);
    }

    if (routeName === ProfileRoutes.AddPaymentMethod) {
      return navigation.navigate(ProfileRoutes.AddPaymentMethodSuccess);
    }
    navigation.navigate(PaymentMethodRoutes.AddPaymentMethodSuccess);
  };

  return {
    onNext,
    onGoBack,
  };
};

const AddPaymentMethod = (props: any) => {
  const { route, navigation } = props ?? {};
  const { name: routeName } = route ?? { name: "" };
  const {
    response: { user: responseUser },
  } = useUserStore();
  const {
    response: { credits: responseCredits },
    setterBuyerInitialStoreState,
  } = useBuyerStore();
  const { submitPaymentMethod } = useBuyerStore();
  const [saveCard, setSaveCard] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const refModalize = useRef<Modalize>(null);
  const { onNext, onGoBack } = useNavigationLogic(props);

  // const { confirmPayment, loading } = useConfirmPayment();

  const fetchPaymentIntentClientSecret = async () => {
    return "test";
    // ! TODO
    /* 
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        currency: "usd",
        items: [{ id: "id" }],
        // request_three_d_secure: 'any',
      }),
    });
    const { clientSecret } = await response.json();

    return clientSecret; */
  };

  // *Events

  const onCloseModal = () => {
    refModalize?.current?.close();
  };

  const onOpenModal = () => {
    refModalize?.current?.open();
  };

  const handlePayPress = async () => {
    // debug
    // if (loading || !loading) {
    //   return onNext();
    // }
    setLoading(true);

    // 1. fetch Intent Client Secret from backend
    const { paymentMethod, error: createPaymentMethodError } =
      await createPaymentMethod({
        type: "Card",
      });

    console.log("log1paymentMethod authflow paymentMethod", paymentMethod);

    if (!createPaymentMethodError) {
      try {
        const response = await postPaymentMethod({
          third_party_name: "stripe",
          stripe: { ...paymentMethod, country: "sg" },
        });

        console.log("log2paymentMethod authflow response", paymentMethod);

        if (response.success) {
          const clientSecret = response.data.stripe.client_secret;

          const { setupIntent, error: confirmPaymentError } =
            await confirmSetupIntent(clientSecret, {
              type: "Card",
            });

          console.log("log3paymentMethod authflow setupIntent", setupIntent);

          if (!confirmPaymentError) {
            const response3 = await patchPaymentMethod({
              third_party_name: "stripe",
              stripe: {
                country: "sg",
                setup_intent_id: setupIntent?.id,
              },
            });

            console.log(
              "log4paymentMethod authflow patchPaymentMethod",
              response3
            );

            if (response3.success) {
              if (
                response3.id &&
                response3.status === "success" &&
                response3.card
              ) {
              }

              // TODO force the delay since for some reason getCredits don't get the latest data immediately
              await awaitableDelay(3000);
              return onNext();
            }
            setLoading(false);
            // onNext();
            return;
          }
        }
      } catch (err) {
        console.log("err", err);
      }
    }

    setLoading(false);
    return onOpenModal();
  };

  return (
    <StyledSafeAreaView>
      <PaymentWrapper>
        {/* <CardField
        cardStyle={inputStyles}
        postalCodeEnabled={false}
        onCardChange={(cardDetails: CardFieldInput.Details) => {
          setComplete(cardDetails.complete);
        }}
      /> */}
        {routeName === PaymentMethodRoutes.AddPaymentMethod && (
          <Header title={"New Payment Method"} onPress={onGoBack} />
        )}
        <CardForm
          autofocus
          cardStyle={inputStyles}
          style={styles.cardField}
          onFormComplete={(cardDetails) => {
            setComplete(cardDetails.complete);
          }}
        />
        {/* <View style={styles.row}>
        <Switch
          onValueChange={(value) => setSaveCard(value)}
          value={saveCard}
        />
        <Text style={styles.text}>Save card during payment</Text>
      </View> */}
        <ButtonText
          position="absolute"
          bottom={0}
          variant={!isComplete || loading ? "opacity7" : "primary"}
          onPress={handlePayPress}
          disabled={!isComplete || loading}
          loading={loading}
        >
          CREATE
        </ButtonText>
        <Modalize
          // onBackButtonPress={() => false}
          // panGestureEnabled={false}
          // closeOnOverlayTap={false}
          ref={refModalize}
          adjustToContentHeight
        >
          {/* <ModalBottom /> */}
          {/* <ModalMoreCredit /> */}

          <ModalContentError onReturn={onCloseModal} />
        </Modalize>
      </PaymentWrapper>
    </StyledSafeAreaView>
  );
};

export default AddPaymentMethod;

const styles = StyleSheet.create({
  cardField: {
    width: "88%",
    margin: "6%",
    ...Platform.select({
      ios: {
        height: 250,
      },
      android: {
        height: 320,
      },
    }),
    marginTop: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    // marginLeft: 12,
  },
  input: {
    height: 44,
    borderBottomColor: colors.slate,
    borderBottomWidth: 1.5,
    fontSize: mscale(25),
  },
});

const inputStyles: CardFormView.Styles = {
  backgroundColor: "#FFFFFF",
};
