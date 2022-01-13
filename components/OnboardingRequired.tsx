import React, { useEffect } from "react";
import {
  TouchableOpacity,
  Platform,
  Image,
  View,
  Text,
  StyleSheet,
} from "react-native";
import * as Device from "expo-device";
import { ButtonText } from "./StyledButtons";
import { StyledText } from "./StyledTexts";
import CheckCircle from "./CheckCircle";
import { theme } from "styles/theme";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import { SafeAreaView } from "react-native-safe-area-context";
import { hexToRGB } from "utils/hex-util";
import { getKycsObject, getKycsObjectKey } from "utils/utils-common";
import globalObjectState from "utils/global-object-per-country-code";
const imgVerifyIdentity = require("assets/images/verify-identity.png");

const styles = StyleSheet.create({
  modalWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: "100%",
    backgroundColor: hexToRGB("#4F4F4F", 0.58),
  },
  modalContent: {
    // position: "absolute",
    // bottom: 0,
    backgroundColor: "#FFF",
    width: "100%",
    height: mscale(370),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: mscale(18),
    marginTop: mscale(15),
    borderTopRightRadius: mscale(14),
    borderTopLeftRadius: mscale(14),
    paddingBottom: mscale(getStatusBarHeight(Device) > 20 ? 5 : 20),
  },
  body: {
    width: "80%",
  },
  imgBanner: {
    width: mscale(90),
    height: mscale(90),
    alignSelf: "center",
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
});

const RowItemChecked = (props: any) => {
  const { checked, description = "", marginTop = 0, marginBottom = 0 } = props;
  const colorTextProps = checked
    ? { color: theme.colors.progressbar.barGreen1 }
    : { color: theme.colors.typography.gray1 };

  return (
    <View style={[styles.rowItem, { marginTop, marginBottom }]}>
      <CheckCircle checked={checked} />
      <StyledText
        paddingLeft={4}
        fontSize={14}
        lineHeight={16}
        {...colorTextProps}
      >
        {description}
      </StyledText>
    </View>
  );
};

const OnboardingRequired = ({ onStartOnboarding, credits }: any) => {
  const { countryCode } = globalObjectState.getLibrary();
  const kycsObject = getKycsObject(credits);
  const dataIdentity = getKycsObjectKey(
    countryCode as any,
    "identity",
    kycsObject
  );
  const dataPaymentMethod = getKycsObjectKey(
    countryCode as any,
    "payment_method",
    kycsObject
  );

  const checkedVerifyIdentity = dataIdentity === "data_available";
  const checkedPaymentMethod = dataPaymentMethod === "data_available";

  return (
    // <View style={styles.modalWrapper}>
    <View style={styles.modalContent}>
      <View style={styles.body}>
        <Image
          resizeMode="contain"
          source={imgVerifyIdentity}
          style={styles.imgBanner}
        />
        <StyledText mt={5} variant="titleModalBottom">
          Onboarding Required
        </StyledText>
        <StyledText
          mt={7}
          variant="paragraphModalBottom"
          textAlign="left"
          mb={7}
        >
          You have to complete your onboarding before proceeding with purchases
        </StyledText>
        <RowItemChecked
          checked={checkedVerifyIdentity}
          description="Verify your identity"
        />
        <RowItemChecked
          checked={checkedPaymentMethod}
          marginTop={mscale(12)}
          marginBottom={mscale(28)}
          description="Add payment method"
        />
      </View>
      <ButtonText
        children="START ONBOARDING"
        onPress={onStartOnboarding}
        alignVertical
      />
    </View>
    // </View>
  );
};
export default OnboardingRequired;
