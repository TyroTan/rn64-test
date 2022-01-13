import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import ToggleSwitch from "toggle-switch-react-native";

import {
  StyledBox,
  StyledText,
  StyledTextInputFieldGroup,
  ButtonText,
} from "components";
import { theme } from "styles/theme";
import { mscale } from "utils/scales-util";
import { useBuyerStore } from "stores";
import { useFormField } from "hooks";
import { EMAIL_REGEX } from "const";

const Settings = () => {
  const [enableEmailReminders, setEnableEmailReminders] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  const {
    isLoading: { settingsUpdate: settingsUpdateIsLoading },
    response: {
      settings: settingsResponse,
      settingsUpdate: settingsUpdateResponse,
    },
    errors: { settings: settingsError, settingsUpdate: settingsUpdateError },
    resetStates: resetStatesBuyer,
    fetchSettings,
    updateSettings,
  } = useBuyerStore();

  // *Forms
  const emailField = useFormField("", {
    label: "Email Address",
    labelRequiredSign: true,
    validatorErrorMessage: settingsUpdateError
      ? settingsUpdateError.notification_email[0]
      : "",
  });

  // *Methods
  const handleChangeReminders = () => {
    setEnableEmailReminders(!enableEmailReminders);
    setChangesMade(true);
  };

  const handleChangeEmailAddress = (value: string) => {
    setEmailAddress(value);
    setChangesMade(true);
  };

  const handleSaveChanges = () => {
    if (settingsResponse) {
      updateSettings({
        // some default values since certain settings are disabled
        language: "eng",
        notification_in_app_enabled: true,
        notification_email_enabled: enableEmailReminders,
        notification_email: emailAddress,
      });
    }
  };

  // *Effects
  useEffect(() => {
    fetchSettings();

    return () => {
      resetStatesBuyer("settings");
      resetStatesBuyer("settingsUpdate");
    };
  }, []);

  useEffect(() => {
    if (settingsResponse) {
      setEnableEmailReminders(settingsResponse.notification_email_enabled);
      setEmailAddress(settingsResponse.notification_email);
    }
  }, [settingsResponse]);

  useEffect(() => {
    if (settingsUpdateResponse) {
      setChangesMade(false);
    }
  }, [settingsUpdateResponse]);

  useEffect(() => {
    if (emailAddress) {
      setEmailIsValid(EMAIL_REGEX.test(emailAddress));
    }
  }, [emailAddress]);

  useEffect(() => {
    setChangesMade(true);
  }, [emailAddress, enableEmailReminders]);

  console.log("enable", enableEmailReminders);
  console.log("email", emailAddress);
  console.log("settingsUpdateResponse", settingsUpdateResponse);
  console.log("settingsUpdateError", settingsUpdateError);
  console.log("emailField", emailField);

  // *JSX
  if (!settingsResponse) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <StyledBox
      padding={mscale(15)}
      style={{ flex: 1, justifyContent: "space-between" }}
    >
      <View>
        <View style={styles.setReminders}>
          <StyledText variant="title" fontSize={13}>
            Enable email reminders
          </StyledText>
          <ToggleSwitch
            onColor={theme.colors.progressbar.barGreen2}
            offColor="#3e3e3e"
            onToggle={handleChangeReminders}
            isOn={enableEmailReminders}
          />
        </View>

        <View style={styles.spacer} />

        <StyledTextInputFieldGroup
          boxProps={{ marginBottom: -3, width: "100%" }}
          style={{
            backgroundColor: "white",
          }}
          {...emailField}
          value={emailAddress}
          onChangeText={handleChangeEmailAddress}
        />
        {settingsUpdateError?.notification_email && (
          <StyledText
            textAlign="left"
            color={theme.colors.actions.failureRed}
            style={{ marginTop: 0 }}
          >
            {settingsUpdateError.notification_email[0]}
          </StyledText>
        )}
      </View>

      <ButtonText
        children={
          settingsUpdateResponse && !changesMade ? "Saved" : "Save Changes"
        }
        style={{ width: "100%" }}
        disabled={!emailIsValid || !changesMade}
        variant={emailIsValid && changesMade ? "primary" : "opacity7"}
        onPress={handleSaveChanges}
        loading={settingsUpdateIsLoading}
      />
    </StyledBox>
  );
};

// *Styles
const styles = StyleSheet.create({
  setReminders: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
  },
  spacer: {
    height: 10,
  },
});

export default Settings;
