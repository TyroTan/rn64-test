import React, { useEffect } from "react";

// needed for bottom tabs as the screen only renders once
export const useResetScreen = ({
  navigation,
  onReset,
}: {
  navigation: any;
  onReset: () => void;
}) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      onReset();
    });

    return unsubscribe;
  }, [navigation]);
};
