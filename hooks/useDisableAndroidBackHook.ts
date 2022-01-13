import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";

export default function useDisableAndroidBackHook(excluded = false) {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // android back press always works if excluded = true, omit param to compeletely disable backpress
        if (excluded) {
          return false;
        }

        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );
}

export const useAndroidBackHook = ({ onBackPress }: any) => {
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );
};
