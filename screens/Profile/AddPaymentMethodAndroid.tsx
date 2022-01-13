import type {
  CardFormView,
  PaymentMethodCreateParams,
} from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
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
import { CardForm, useConfirmPayment } from "@stripe/stripe-react-native";
import { ButtonText, StyledBox, StyledTextInputFieldGroup } from "components";

// import { API_URL } from "../Config";
// import { colors } from "../colors";
import { STRIPE_PUBLIC_KEY } from "const";
import { initStripe } from "@stripe/stripe-react-native";
import { useBuyerStore, useUserStore } from "stores";
import { mscale } from "utils/scales-util";
import { theme } from "styles/theme";
import { useFormField } from "hooks";

const imgTitleCCIcon = require("assets/images/icon-cc-title.png");

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
          merchantIdentifier: "merchant.com.stripe.react.native",
          urlScheme:
            paymentMethod === "wechat_pay" ? undefined : "stripe-example",
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
    >
      {children}
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <Text style={{ opacity: 0 }}>appium fix</Text>
    </ScrollView>
  );
};

const stylesPaymentWrapper = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
});

const useAddPaymentMethodForm = (props: any) => {
  const refElFullname = React.createRef();
  const refCardNum = React.createRef();
  const refExpiry = React.createRef();
  const refCvc = React.createRef();
  const [validating, setValidating] = useState(false);

  const fullNameField = useFormField("", {
    autoFocus: true,
    validator: () => true,
    // validatorErrorMsg: "Please provide a valid NRIC",
    label: "Name on Card",
    // labelRequiredSign: true,
    onSubmitEditing: () => (refCardNum as any)?.current?.focus(),
  });

  const cardNumField = useFormField("", {
    refEl: refCardNum,
    autoFocus: true,
    validator: (value: any) => value.length > 0,
    // validatorErrorMsg: "Please provide a valid NRIC",
    label: "Name on Card",
    // labelRequiredSign: true,
    onSubmitEditing: () => (refExpiry as any)?.current?.focus(),
  });

  const expiryField = useFormField("", {
    refEl: refExpiry,
    autoFocus: true,
    validator: (value: any) => value.length > 0,
    // validatorErrorMsg: "Please provide a valid NRIC",
    label: "Name on Card",
    // labelRequiredSign: true,
    onSubmitEditing: () => (refCvc as any)?.current?.focus(),
  });

  const cvcField = useFormField("", {
    refEl: refCvc,
    autoFocus: true,
    validator: () => true,
    // validatorErrorMsg: "Please provide a valid NRIC",
    label: "Name on Card",
    // labelRequiredSign: true,
    onSubmitEditing: () => (refCardNum as any)?.current?.focus(),
  });

  /* Start: Common fields: isFormValid, values, watchables etc */

  const { value: nricValue, validated: nricValidated } = fullNameField;

  const watchableValues = [nricValue];

  const values = {
    nric: nricValue,
  };

  const isFormValid: boolean = nricValidated.isValid;

  const onFormValidate = (): void =>
    nricField.onValidate() &&
    fullnameField.onValidate() &&
    sexField.onValidate() &&
    raceField.onValidate() &&
    nationalityField.onValidate() &&
    dateBirthField.onValidate() &&
    residentialStatusField.onValidate();

  const onValidateSubmit = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      onFormValidate();
      setSgVerifyIdentitySavedFormLocalDb(values);
      setValidating(true);
    }, 0);
  };

  // *Events - triggers form submit when form validation = valid

  useEffect(() => {
    if (validating) {
      if (isFormValid) {
        onSubmit();
      }
      setValidating(false);
    }
  }, [validating, isFormValid]);

  /* End: Common fields: isFormValid, values, watchables etc */

  return {
    onValidateSubmit,
    isFormValid,
    values,
    watchableValues,
    validating,
    nricField,
    fullnameField,
    sexField,
    raceField,
    nationalityField,
    countryOfBirthField,
    residentialStatusField,
    dateBirthField,
  };
};

export default function AddPaymentMethodAndroid() {
  const {
    response: { user: userResponse },
  } = useUserStore();
  const { submitPaymentMethod } = useBuyerStore();
  const [saveCard, setSaveCard] = useState(false);
  const [isComplete, setComplete] = useState(false);

  const { confirmPayment, loading } = useConfirmPayment();

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

  const onCreatePaymentMethod = () => {
    // console.log("data here", )
    const data = {
      third_party_name: "stripe",
      stripe: {
        billing_details: {
          address: {
            city: null,
            country: null,
            line1: null,
            line2: null,
            postal_code: null,
            state: null,
          },
          email: null,
          name: "Tyro Hunter Tan",
          phone: null,
        },
        card: {},
      },
    };
    submitPaymentMethod;
  };

  return (
    <StyledBox
      variant="flexcr"
      flexDirection="row"
      justifyContent="space-between"
    >
      <StyledBox>
        <StyledTextInputFieldGroup
          label="email"
          boxProps={{ width: "100%", marginTop: mscale(15) }}
          autoCapitalize="none"
          placeholder="E-mail"
          keyboardType="email-address"
          defaultValue={userResponse?.data?.email}
          color={theme.colors.lockGray}
          editable={false}
          // onChange={(value) => setEmail(value.nativeEvent.text)}
          // style={styles.input}
        />
      </StyledBox>
      <ButtonText
        variant="primary"
        onPress={onCreatePaymentMethod}
        disabled={!isComplete}
        loading={loading}
      >
        CREATE
      </ButtonText>
    </StyledBox>
  );
}
