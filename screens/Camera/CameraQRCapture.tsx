import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable as Button,
  TouchableOpacity,
  ImageURISource,
  Platform,
  StatusBar,
} from "react-native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import styled from "styled-components/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  CardListView,
  StyledText,
  StyledBox,
  BackBlendingBtn,
} from "components";
import { theme } from "styles/theme";
import { useAuthStore } from "stores";
const imgBGCameraQRCaptureBlue = require("assets/images/bg-transaction-blue.png");
const imgCategoryHealthcare = require("assets/images/category-health-care.png");
const imgCategoryEducation = require("assets/images/category-education.png");
const imgDummyBecome = require("assets/images/dummy-become.png");

import Layout from "constants/Layout";
import { hexToRGB } from "utils/hex-util";

export enum CameraQRCaptureRoutes {
  CameraQRCaptureInitial = "CameraQRCaptureInitial",
  CameraQRCapture = "CameraQRCapture",
  Merchant = "Merchant",
}

export interface CameraQRCaptureParamsList extends ParamListBase {
  [CameraQRCaptureRoutes.CameraQRCaptureInitial]: undefined;
  [CameraQRCaptureRoutes.CameraQRCapture]: undefined;
  [CameraQRCaptureRoutes.Merchant]: undefined;
}

type CameraQRCaptureProps = NativeStackScreenProps<
  CameraQRCaptureParamsList,
  CameraQRCaptureRoutes.CameraQRCaptureInitial
>;

const CameraQRCapture: React.FC<CameraQRCaptureProps> = (props: any) => {
  const { navigation } = props;
  const refCamera = useRef();
  const [picUri, setPicUri] = useState("");
  // const [isCameraOpen, setIsCameraOpen] = useState(false);

  /* *Events */
  const onGoToMerchant = () => {
    // navigation.navigate(CameraQRCaptureRoutes.Merchant);
  };

  const onBarcodeScanned = (scanInfo: any) => {
    if (scanInfo?.data) {
      console.log("scanInfo.data", scanInfo.data);
      setPicUri(scanInfo.data);
      navigation.goBack();
    }
  };

  const { width, height } = Layout.screen;

  const cameraHeight = mscale(Math.min(width, height) + 210);
  const descriptionHeight = height - width;

  return (
    <>
      <BackBlendingBtn onPress={navigation.goBack} />
      {picUri.length === 0 && (
        <>
          <BarCodeScanner
            // barCodeScannerSettings={{
            //   barCodeTypes: [BarCodeScanner.Constants.BarCodeType],
            // }}
            onBarCodeScanned={onBarcodeScanned}
            // style={{
            // height,
            // top: -20,
            // zIndex: 1,
            // width: "100%",
            // position: "absolute",
            // }}
            style={[StyleSheet.absoluteFillObject]}
            ref={refCamera as any}
          ></BarCodeScanner>
          <View
            style={{
              backgroundColor: theme.colors.background2,
              borderTopRightRadius: mscale(20),
              borderTopLeftRadius: mscale(20),
              height: mscale(250),
              width: "100%",
              position: "absolute",
              bottom: 0,
              alignSelf: "center",

              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 0,
            }}
          >
            <StyledText variant="title">Scan QR Code</StyledText>
            <StyledText variant="paragraphSmall">
              Place your phone directly into the QR code and you will get the
              merchant's information and product
            </StyledText>
          </View>
        </>
      )}
    </>
  );
};

export default CameraQRCapture;
