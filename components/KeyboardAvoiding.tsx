import React from "react";
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView as RNCKeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { theme } from "styles/theme";

const KeyboardAvoidingIOS = (allProps: any) => {
  const { children, isIOS, contentStyle, ...props } = allProps;
  return (
    <KeyboardAvoidingView
      {...(isIOS ? { behavior: "padding" } : { behavior: "height" })}
      style={{ flex: 1, backgroundColor: theme.colors.background2 }}
      {...props}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            { flex: 1, justifyContent: "space-between" },
            contentStyle ?? {},
          ]}
        >
          {children}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// TouchableWithoutFeedback causes issues in android
const KeyboardAvoidingAndroid = (allProps: any) => {
  const { children, isIOS, contentStyle, ...props } = allProps;
  return (
    <KeyboardAvoidingView
      {...(isIOS ? { behavior: "padding" } : { behavior: "height" })}
      style={{ flex: 1, backgroundColor: theme.colors.background2 }}
      {...props}
    >
      <View
        style={[
          { flex: 1, justifyContent: "space-between" },
          contentStyle ?? {},
        ]}
      >
        {children}
      </View>
    </KeyboardAvoidingView>
  );
};

export const KeyboardAvoiding =
  Platform.OS === "ios" ? KeyboardAvoidingIOS : KeyboardAvoidingAndroid;

export const KeyboardAwareScrollView = RNCKeyboardAwareScrollView;
