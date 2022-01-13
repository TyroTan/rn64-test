import { useStripe, StripeProvider } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import Constants from "expo-constants";

export const useAddNewPaymentMethod = () => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  // const { confirmPayment, loading: loadingConfirm } = useConfirmPayment();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  // const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(
        `${`http://192.168.1.6:4242`}/payment-sheet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { setupIntent, ephemeralKey, customer } = await response.json();

      return {
        setupIntent,
        ephemeralKey,
        customer,
      };
    } catch (e) {
      console.log(e);
    }
  };

  const initializePaymentSheet = async () => {
    setLoading(true);
    const { setupIntent, ephemeralKey, customer } =
      (await fetchPaymentSheetParams()) as any;

    const { error } = await initPaymentSheet({
      merchantDisplayName:
        Constants?.manifest?.name ?? "Rn64test: Buy now, pay later",
      style: "automatic",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: setupIntent,
    });
    if (!error) {
      setLoading(false);
      onCreatePaymentMethod();
    } else {
      // handle error + loading state
      // allow retry
    }
  };

  const onCreatePaymentMethod = () => {
    openPaymentSheet();
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert(
        "Success",
        "Your payment method is successfully set up for future payments!"
      );
    }
  };

  // *Effects
  // useEffect(() => {
  //   console.log("ue[]");

  //   console.log("test here", typeof stripe.createPaymentMethod);
  //   initializePaymentSheet();
  // }, []);

  return {
    loading,
    init: initializePaymentSheet,
  };
};

export const StripeProviderRN64TEST = ({ children }: any) => {
  return (
    <StripeProvider
      publishableKey="pk_test_51Jus9OGCHpQq8XFA8wuGFDouqbOBnXHfccSxSE2yPIt4FfErc3oRQbThqicTtnRFKvHvWMCu3MvSdtFotaldREYB00G8DzwDhD"
      urlScheme="rn64test" // required for 3D Secure and bank redirects
      merchantIdentifier="com.rn64test.app" // required for Apple Pay
    >
      {children}
    </StripeProvider>
  );
};

export default StripeProviderRN64TEST;
