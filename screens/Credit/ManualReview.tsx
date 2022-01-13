import React, { createRef, useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledSafeAreaView,
  StyledBox,
  StyledText,
  PrivacyPolicyText,
  ButtonTopTabShadow,
  ButtonText,
  Header,
  StyledMainButton,
} from "components";
import { theme } from "styles/theme";
import {} from "@react-navigation/native-stack";
// import useAuthStore from "stores/useAuthStore";
// import { useExtraDelay } from "hooks/useExtraDelay";
import { MyInfoFillRoutes } from "screens/MyInfo/MyInfoFill";
import { SafeAreaView } from "react-native-safe-area-context";
import DocumentPicker from "react-native-document-picker";
import { useBuyerStore } from "stores";
import { OrderPageRoutes } from "screens/Order";
import globalObjectState from "utils/global-object-per-country-code";
const imgUploadIcon = require("assets/images/upload-icon.png");

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
        marginBottom={3}
        lineHeight={22}
      >
        {note}
      </StyledText>
      {/* <StyledBox
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
      </StyledBox> */}

      <StyledMainButton
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        borderRadius={mscale(12)}
        borderColor={theme.colors.lockGray}
        borderWidth={0.5}
        onPress={onUpload}
      >
        <View>
          <Image
            source={imgUploadIcon}
            resizeMode="contain"
            style={{
              width: mscale(37),
              height: mscale(37),
              margin: mscale(16),
            }}
          />
        </View>
        <StyledText
          fontFamily={"Poppins"}
          textAlign="left"
          color={theme.colors.lockGray}
          children={`Click this box to select files to upload\nAccepted formats: jpeg, pdf`}
        />
      </StyledMainButton>
    </StyledBox>
  );
};

const RenderErrors = ({ errors }: any) => {
  return (
    <StyledText
      marginTop={2}
      variant="paragraph"
      fontSize={10}
      lineHeight={11}
      textAlign="left"
      color={theme.colors.typography.red1}
    >
      {errors ?? ""}
    </StyledText>
  );
};

const ManualReview: React.FC<any> = ({ route, navigation }) => {
  const {
    resetStates,
    response: { additionalData: responseAdditionalData },
    errors: { additionalData: errorsAdditionalData },
    isLoading: { additionalData: isLoadingAdditionalData },
    submitAdditionalData,
  } = useBuyerStore();
  const { countryCode } = globalObjectState.getLibrary();
  const [activeTab, setActiveTab] = useState("full-time");
  const [errors, setErrors] = useState<any>();
  const [formData, setFormData] = useState<null | FormData>(null);
  // *Events

  // * Handlers - onpress
  const onGoBack = () => {
    navigation.goBack();
  };

  const onSubmit = () => {
    if (formData) {
      submitAdditionalData(formData);
    }
  };

  const onPressParttime = () => setActiveTab("part-time");
  const onPressFulltime = () => setActiveTab("full-time");
  const onPressUnemployed = () => setActiveTab("unemployed");

  const onPickDocuments = async (props: any) => {
    // Pick a single file
    setErrors(null);
    resetStates("additionalData");
    try {
      if (errors || !errors) {
        navigation.navigate(OrderPageRoutes.ManualReviewSuccess);
        return;
      }
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        mode: "import",
        copyTo: "documentDirectory",
      });

      // TODO loader

      const results = res.map((item) => ({
        ...item,
        fileCopyUri: `file://${decodeURIComponent(item.fileCopyUri)}`,
      }));

      const formData = new FormData();

      const employmentStatus =
        activeTab === "full-time"
          ? "full_time"
          : activeTab === "part-time"
          ? "part_time"
          : "unemployed";

      formData.append("country", countryCode);
      formData.append("employment_status", employmentStatus);

      results.forEach((file, i: number) => {
        formData.append(
          `documents[${i}]file`,
          {
            name: file.name as string,
            type: file.type,
            uri: file.fileCopyUri,
          } as any,
          file.name
        );
        formData.append(`documents[${i}]doc_type`, "BANK_STATEMENT");
      });

      // [...data.file].map((file, i) => {
      //   formData.append(`documents[${i}]file`, file, file.name);
      //   formData.append(`documents[${i}]doc_type`, "BANK_STATEMENT");
      //   return null;
      // });

      setFormData(formData);
      // submitAdditionalData

      // console.log(
      //   res.uri,
      //   res.type, // mime type
      //   res.name,
      //   res.size
      // );
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  // *Effects
  useEffect(() => {
    if (responseAdditionalData) {
      navigation.navigate(OrderPageRoutes.ManualReviewSuccess);
    }
  }, [responseAdditionalData]);

  useEffect(() => {
    if (errorsAdditionalData) {
      setErrors(errorsAdditionalData);
    }
  }, [errorsAdditionalData]);

  const isLoadingBtns = isLoadingAdditionalData;

  return (
    <StyledSafeAreaView
      flex={1}
      flexDirectdion="column"
      justifyConent="flex-end"
      alignItems="stretch"
      paddingHorizontal={25}
    >
      <Header
        onPress={onGoBack}
        title={"Manual Review"}
        style={{ paddingLeft: 0, marginLeft: mscale(-10) }}
      />
      <StyledBox
        flex={1}
        width="100%"
        // alignItems="center"
        // justifyContent="flex-start"
        paddingTop={mscale(37)}
      >
        <StyledText
          variant="titleTertiary"
          textAlign="left"
          children="Employment status"
          marginBottom={5}
        />
        <StyledBox variant="flexcr" width="100%" justifyContent="space-between">
          <ButtonTopTabShadow
            width="28%"
            variant={activeTab === "full-time" ? "primary" : "primaryInverted"}
            children={"Full-time"}
            onPress={onPressFulltime}
          />
          <ButtonTopTabShadow
            width="28%"
            variant={activeTab === "part-time" ? "primary" : "primaryInverted"}
            children={"Part-time"}
            onPress={onPressParttime}
          />
          <ButtonTopTabShadow
            width="35%"
            variant={activeTab === "unemployed" ? "primary" : "primaryInverted"}
            children={"Unemployed"}
            numberOfLines={1}
            onPress={onPressUnemployed}
          />
        </StyledBox>
        <RenderUploadFilesWidget
          title="Bank statements"
          note={
            <StyledText
              fontFamily={"Poppins"}
              textAlign="left"
              color={theme.colors.lockGray}
              marginBottom={3}
              lineHeight={22}
            >
              Please provide the bank statements of your salary/income crediting
              account for the{" "}
              <StyledText
                variant="title"
                textAlign="left"
                color={theme.colors.lockGray}
                marginBottom={3}
                fontSize={12}
                lineHeight={14}
              >
                past 3 months.
              </StyledText>
              {`The statements should clearly indicate your:
                  1. Name (per NRIC)
                  2. Address (per NRIC)
                  3. Monthly salary/income`}
            </StyledText>
          }
          onUpload={onPickDocuments}
        />
        {/* <RenderUploadFilesWidget
          title="Past three month’s payslips"
          note="Please ensure that both your name and your Employer name’s are indicated."
          onUpload={onUpload}
        /> */}

        <RenderErrors errors={errors} />
      </StyledBox>
      <StyledBox width="100%">
        <ButtonText
          children="SUBMIT"
          onPress={onSubmit}
          disabled={isLoadingBtns}
          // loading={isLoadingBtns}
          marginBottom={0}
        />
      </StyledBox>
    </StyledSafeAreaView>
  );
};

export default ManualReview;
