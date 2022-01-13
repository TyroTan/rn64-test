import React, { createRef, useEffect, useState } from "react";
import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import * as Progress from "react-native-progress";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  PrivacyPolicyText,
  ButtonTextSmall,
  ButtonText,
  Card,
  ProgressCircleLayered,
  CardListItemDivider,
  KeyboardAwareScrollView,
} from "components";
import { theme } from "styles/theme";
import {} from "@react-navigation/native-stack";
// import useAuthStore from "stores/useAuthStore";
// import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
import { SafeAreaView } from "react-native-safe-area-context";
const imgUploadIcon = require("assets/images/upload-icon.png");
const imgDummyBecome = require("assets/images/dummy-become.png");

const imgAppleBlack = require("assets/images/apple-black.png");

const RenderUploadFilesWidget = (props: any) => {
  const { title, note, onUpload } = props;
  return (
    <StyledBox width="100%" mt={11}>
      <StyledText
        variant="titleTertiary"
        textAlign="left"
        children={title}
        marginBottom={1}
      />
      <StyledText
        fontFamily={"Poppins"}
        textAlign="left"
        color={theme.colors.lockGray}
        children={note}
        marginBottom={3}
        lineHeight={22}
      />
      <StyledBox
        variant="flexcr"
        justifyContent="flex-start"
        borderRadius={mscale(12)}
        borderColor={theme.colors.lockGray}
        borderWidth={0.5}
      >
        <TouchableOpacity onPress={onUpload}>
          <Image
            source={imgUploadIcon}
            resizeMode="contain"
            style={{
              width: mscale(37),
              height: mscale(37),
              margin: mscale(16),
            }}
          />
        </TouchableOpacity>
        <StyledText
          fontFamily={"Poppins"}
          textAlign="left"
          color={theme.colors.lockGray}
          children={`Click this box to select files to upload\nAccepted formats: jpeg, pdf`}
        />
      </StyledBox>
    </StyledBox>
  );
};

export const RenderAvailableCredit = (props: any) => {
  const { onMyInfoFill, isWalkthrough, onMeasureInWindow, walkthroughStyle } =
    props;

  return (
    <Card
      // marginTop={-mscale(32)}
      alignSelf="center"
      paddingTop="2.5%"
      paddingHorizontal="7%"
      // paddingRight="3%"
      width={"100%"}
      LeftHeader={
        <StyledText variant="titleSecondaryGray">Available Credit</StyledText>
      }
      RightHeader={
        <TouchableOpacity
          style={{ padding: mscale(2.5) }}
          // onPress={onPressManage}
        >
          <StyledText variant="mainBlue">Manage</StyledText>
        </TouchableOpacity>
      }
    >
      <StyledText
        fontFamily="PoppinsBold"
        fontSize={15}
        lineHeight={15}
        marginTop={4}
        textAlign="left"
      >
        S$270.00
      </StyledText>
      <Progress.Bar
        style={{
          width: "100%",
          marginLeft: 0,
          marginTop: mscale(5),
          marginBottom: mscale(23),
        }}
        height={mscale(9.5)}
        borderRadius={mscale(5)}
        useNativeDriver
        borderWidth={0}
        progress={0.4}
        color={theme.colors.progressbar.barGreen1}
        unfilledColor={theme.colors.background}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  cardRowWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: mscale(21),
  },
  cardRowWrapper2nd: {
    marginTop: mscale(12),
    marginBottom: mscale(24),
  },
  cardRowDescription: {
    paddingLeft: mscale(12),
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  cardRowAmountWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export const RenderUpcomingPayments = (props: any) => {
  const { onMyInfoFill, isWalkthrough, onMeasureInWindow, walkthroughStyle } =
    props;

  return (
    <Card
      // marginTop={-mscale(32)}
      alignSelf="center"
      paddingTop="6.0%"
      paddingHorizontal="3.7%"
      paddingRight="6%"
      width={"100%"}
      LeftHeader={
        <StyledText variant="titleSecondaryGray">Upcoming payments</StyledText>
      }
      RightHeader={
        <TouchableOpacity
          style={{ padding: mscale(2.5) }}
          // onPress={onPressManage}
        >
          <StyledText variant="mainBlue">View All</StyledText>
        </TouchableOpacity>
      }
    >
      <View style={styles.cardRowWrapper}>
        <ProgressCircleLayered
          imgMerchantSrc={imgDummyBecome}
          imgStyle={{
            width: mscale(40),
          }}
          colors={["#FE6E61", "#FE6E61"]}
        />
        <View style={styles.cardRowDescription}>
          <StyledText variant="titleSecondarySemi">Become SG</StyledText>
          <StyledText variant="paragraph" fontSize={12} lineHeight={12}>
            30th July 2021
          </StyledText>
        </View>
        <View style={styles.cardRowAmountWrapper}>
          <StyledText variant="titleSecondarySemi">S$3.50</StyledText>
        </View>
      </View>
      <CardListItemDivider
        style={{ width: "88%", marginLeft: "12%", marginTop: mscale(9) }}
      />
      <View style={[styles.cardRowWrapper, styles.cardRowWrapper2nd]}>
        <ProgressCircleLayered
          imgMerchantSrc={imgAppleBlack}
          colors={["#000000", "#000000"]}
        />
        <View style={styles.cardRowDescription}>
          <StyledText variant="titleSecondarySemi">Become SG</StyledText>
          <StyledText variant="paragraph" fontSize={12} lineHeight={12}>
            30th July 2021
          </StyledText>
        </View>
        <View style={styles.cardRowAmountWrapper}>
          <StyledText variant="titleSecondarySemi">S$3.50</StyledText>
        </View>
      </View>
    </Card>
  );
};

const UpcomingPaymentsGrouped: React.FC<any> = (props) => {
  const { secondarySmall = false, title = "July 2021" } = props;
  return (
    <Card
      // marginTop={-mscale(32)}
      alignSelf="center"
      paddingTop="6.0%"
      paddingHorizontal="3.7%"
      paddingRight="6%"
      width={"100%"}
      LeftHeader={<StyledText variant="titleSecondaryGray">{title}</StyledText>}
    >
      <View style={styles.cardRowWrapper}>
        <ProgressCircleLayered
          imgMerchantSrc={imgDummyBecome}
          imgStyle={{
            width: mscale(40),
          }}
          colors={["#FE6E61", "#FE6E61"]}
        />
        <View style={styles.cardRowDescription}>
          <StyledText variant="titleSecondarySemi">Become SG</StyledText>
          <StyledText variant="paragraph" fontSize={12} lineHeight={12}>
            30th July 2021
          </StyledText>
        </View>
        <View style={styles.cardRowAmountWrapper}>
          <ButtonTextSmall
            variant={secondarySmall ? "secondarySmall" : "primary"}
            children={"Pay S$35.50"}
          />
        </View>
      </View>
      <CardListItemDivider
        style={{ width: "88%", marginLeft: "12%", marginTop: mscale(9) }}
      />
      <View style={[styles.cardRowWrapper, styles.cardRowWrapper2nd]}>
        <ProgressCircleLayered
          imgMerchantSrc={imgAppleBlack}
          colors={["#FE6E61", "#000000"]}
        />
        <View style={styles.cardRowDescription}>
          <StyledText variant="titleSecondarySemi">Become SG</StyledText>
          <StyledText variant="paragraph" fontSize={12} lineHeight={12}>
            30th July 2021
          </StyledText>
        </View>
        <View style={styles.cardRowAmountWrapper}>
          <ButtonTextSmall
            variant={secondarySmall ? "secondarySmall" : "primary"}
            children={"Pay S$3.00"}
          />
        </View>
      </View>
    </Card>
  );
};

const AllUpcomingPayments: React.FC<any> = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState("full-time");
  // *Events

  // * Handlers - onpress
  const onGoBack = () => {
    navigation.goBack();
  };

  const onNext = () => {
    navigation.navigate("NAVTEST3");
  };

  const onPressParttime = () => setActiveTab("part-time");
  const onPressFulltime = () => setActiveTab("full-time");
  const onPressUnemployed = () => setActiveTab("unemployed");

  const isLoadingBtns = false;

  return (
    <StyledSafeAreaView
      flex={1}
      flexDirectdion="column"
      justifyConent="flex-end"
      alignItems="stretch"
      paddingHorizontal={5}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{
          width: "100%",
          paddingTop: mscale(77),
          paddingHorizontal: "3%",
          // borderWidth: 1,
          backgroundColor: theme.colors.background2,
        }}
      >
        <RenderAvailableCredit />
        <RenderUpcomingPayments />
        <UpcomingPaymentsGrouped />
        <UpcomingPaymentsGrouped
          title="Overdue Payments"
          secondarySmall={true}
        />
      </KeyboardAwareScrollView>
      <StyledBox width="100%">
        <ButtonText
          children="SUBMIT"
          onPress={onNext}
          disabled={isLoadingBtns}
          // loading={isLoadingBtns}
          marginBottom={0}
        />
      </StyledBox>
    </StyledSafeAreaView>
  );
};

export default AllUpcomingPayments;
