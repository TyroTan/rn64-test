import React, { useEffect } from "react";
import { Platform, ToastAndroid } from "react-native";
import { alerts } from "utils/global-texts";

const useToastAndroidHook = (errors: any) => {
  const isAndroid = Platform.OS === "ios" ? false : true;
  useEffect(() => {
    if (!isAndroid) return;
    const msg = errors ?? alerts.genericError;
    if (errors) {
      ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        50,
        0
      );
    }
  }, [errors]);
};

const useToastMessage = useToastAndroidHook;

export default useToastMessage;
