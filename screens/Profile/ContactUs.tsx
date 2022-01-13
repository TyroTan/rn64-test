import React, { useRef, useCallback, useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Keyboard, View, Pressable } from "react-native";
import { format } from "date-fns";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as consts from "const";
import * as Device from "expo-device";
import type { ParamListBase } from "@react-navigation/native";
import { getStatusBarHeight, mscale } from "utils/scales-util";

import {
  StyledBox,
  StyledText,
  ButtonText,
  KeyboardAvoiding,
  StyledTextInputFieldGroup,
  DropdownPickerField,
  KeyboardAwareScrollView,
} from "components";
import useAuthStore from "stores/useAuthStore";
import { StyledScrollView } from "components";
import { useExtraDelay } from "hooks/useExtraDelay";
import { useNestedNavigatorStore, useUserStore } from "stores";
import { theme } from "styles/theme";
import {
  getSgVerifyIdentitySavedFormLocalDb,
  setSgVerifyIdentitySavedFormLocalDb,
} from "utils/async-storage-util";
import type { SgVerifyIdentity } from "utils/async-storage-util";

import { useFormField } from "hooks";
import { useBuyerStore } from "stores";

export enum MyInfoFillRoutes {
  MyInfoFillInitial = "MyInfoFillInitial",
  MyInfoFill1 = "MyInfoFill1",
  MyInfoFill2 = "MyInfoFill2",
  MyInfoFill3 = "MyInfoFill3",
  MyInfoFill4 = "MyInfoFill4",
  VerificationSuccess = "VerificationSuccess",
}
export interface MyInfoFillParamsList extends ParamListBase {
  [MyInfoFillRoutes.MyInfoFill1]: undefined;
  [MyInfoFillRoutes.MyInfoFill2]: {
    verifyIdentityLocalData: Partial<SgVerifyIdentity>;
  };
  [MyInfoFillRoutes.MyInfoFill3]: {
    verifyIdentityLocalData: Partial<SgVerifyIdentity>;
    isIOS: boolean;
  };
  [MyInfoFillRoutes.VerificationSuccess]: { onReturn: () => void };
}

type MyInfoFillProps = NativeStackScreenProps<
  MyInfoFillParamsList,
  MyInfoFillRoutes.MyInfoFill1
>;

const useContactUsForm = ({ onSubmit }: any) => {
  const [validating, setValidating] = useState(false);
  const [topicOptions, setTopicOptions] = useState([]);
  const [topic, setTopic] = useState(null);

  const {
    response: { contactUsTopics: contactUsTopicsResponse },
    errors: { contactUsTopics: contactUsTopicsError },
    resetStates: resetStatesBuyer,
    fetchContactUsTopics,
  } = useBuyerStore();

  // *Methods
  const messageFn = (value: string) => value?.length > 0;

  const onValidateSubmit = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      // onFormValidate();
      setValidating(true);
    }, 0);
  };

  const messageField = useFormField("", {
    label: "Message",
    labelRequiredSign: true,
    // autoFocus: true,
    // validator: messageFn,
  });

  const topicField = useFormField("", {
    type: "select",
    label: "Topic",
    items: topicOptions,
    // validator: (item: string) => item?.length > 0,
  });

  /* Start: Common fields: isFormValid, values, watchables etc */

  const { value: messageValue, validated: messageValidated } = messageField;
  const { value: topicValue, validated: topicValidated } = topicField;

  const watchableValues = [messageValue, topicValue];

  const values = {
    message: messageValue,
    topic: topicValue,
  };

  const isFormValid: boolean =
    watchableValues[0].length > 0 && watchableValues[1];

  const onFormValidate = (): void =>
    messageField.onValidate() && topicField.onValidate();

  // *Effects
  useEffect(() => {
    if (validating) {
      if (isFormValid) {
        onSubmit();
      }
      setValidating(false);
    }
  }, [validating, isFormValid]);

  useEffect(() => {
    fetchContactUsTopics();

    return () => {
      resetStatesBuyer("contactUsTopic");
    };
  }, []);

  useEffect(() => {
    if (contactUsTopicsResponse) {
      const options = contactUsTopicsResponse.topics.map((topic: any) => {
        topic["label"] = topic["name"];
        return topic;
      });
      setTopicOptions(options);
    }
  }, [contactUsTopicsResponse]);

  // *JSX
  return {
    onValidateSubmit,
    isFormValid,
    values,
    watchableValues,
    validating,
    topicField,
    messageField,
  };
};

// route params can't be used, use (useNestedNavigatorStore) instead to receive navigation params
const ContactUs: React.FC<MyInfoFillProps> = ({ route, navigation }) => {
  const [feedBackSuccess, setFeedBackSuccess] = useState(false);

  const {
    response: { user, platform },
  } = useUserStore();
  const {
    response: { fromMyInfoIntro, fromCreditRemaining },
  } = useNestedNavigatorStore();

  const {
    isLoading: { contactUsSubmit: contactUsSubmitIsLoading },
    response: { contactUsSubmit: contactUsSubmitResponse },
    errors: { contactUsSubmit: contactUsSubmitError },
    resetStates: resetStatesBuyer,
    submitContactUs,
  } = useBuyerStore();

  // *Methods
  const onSubmit = () => {
    const data = {
      topic: watchableValues[1],
      message: watchableValues[0],
    };

    submitContactUs(data);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // *Effects
  const {
    isFormValid,
    onValidateSubmit,
    watchableValues,
    validating,
    values,
    messageField,
    topicField,
  } = useContactUsForm({ onSubmit });

  useEffect(() => {
    if (contactUsSubmitResponse) {
      if (contactUsSubmitResponse.success) {
        resetStatesBuyer("contactUsSubmit");
        setFeedBackSuccess(true);
      }
    }
  }, [contactUsSubmitResponse]);

  // *Events
  const { isIOS } = platform ?? {};

  // *JSX
  if (feedBackSuccess) {
    return (
      <>
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            flex: 1,
          }}
        >
          <StyledText variant="title" fontSize={15}>
            Feedback Success!
          </StyledText>
          <StyledText variant="paragraph" fontSize={13} pl={3} pr={3}>
            Our customer service representative will contact you within a
            working day
          </StyledText>
        </View>
        <StyledBox
          width="100%"
          display="flex"
          flex={1}
          alignItems="center"
          justifyContent="flex-end"
          marginBottom={10}
        >
          <ButtonText
            children="Go Back"
            width="88%"
            onPress={handleGoBack}
            variant="primary"
          />
        </StyledBox>
      </>
    );
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{
        backgroundColor: theme.colors.background,
        paddingTop: isIOS ? 0 : mscale(20),
        paddingBottom: isIOS ? mscale(20) : 0,
        flex: 1,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
        }}
      >
        <DropdownPickerField
          marginBottom={5}
          {...topicField}
          backgroundColor={theme.colors.background}
        />

        <View style={{ marginTop: mscale(5) }} />
        <StyledTextInputFieldGroup
          boxProps={{
            marginBottom: 5,
            backgroundColor: "transparent",
          }}
          minHeight={mscale(150)}
          multiline={true}
          placeholderText="How can we help you?"
          style={{
            backgroundColor: theme.colors.background2,
          }}
          textAlignVertical="top"
          {...messageField}
        />
      </View>

      <StyledBox
        width="88%"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        alignSelf="center"
        marginBottom={10}
        backgroundColor={theme.colors.background}
      >
        <ButtonText
          children="Send Feedback"
          width="100%"
          loading={contactUsSubmitIsLoading}
          onPress={onValidateSubmit}
          disabled={!isFormValid}
          variant={!isFormValid ? "opacity7" : "primary"}
        />
      </StyledBox>
    </KeyboardAwareScrollView>
  );
};

export default ContactUs;
