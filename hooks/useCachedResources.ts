// import { FontAwesome } from "@expo/vector-icons";
import * as Device from "expo-device";
import { Platform, Image } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import React, { useState, useEffect, useCallback } from "react";
import { getTokenLocalDb } from "utils/async-storage-util";
import { useUserStore } from "stores";

const cacheImages = (images: any) => {
  return images.map((image: any) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

export default function useCachedResources() {
  const {
    response: { platform: platformResponse },
    isLoading: { platform: platformIsLoading },
    setPlatformInfo,
  } = useUserStore();
  const [assetsIsLoading, setAssetsIsLoading] = useState(false);
  const [didEverythingFinished, setDidEverythingFinished] = useState(false);

  useEffect(() => {
    if (!platformResponse) {
      setPlatformInfo(Device, Platform);
    }
  }, [platformResponse, setPlatformInfo]);

  const [fontLoaded] = useFonts({
    PoppinsThin: require("assets/fonts/Poppins/Poppins-Thin.ttf"),
    PoppinsExtraLight: require("assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
    PoppinsLight: require("assets/fonts/Poppins/Poppins-Light.ttf"),
    Poppins: require("assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsMedium: require("assets/fonts/Poppins/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    PoppinsBold: require("assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (!didEverythingFinished) {
      if (!platformIsLoading && fontLoaded && !assetsIsLoading) {
        setDidEverythingFinished(true);
      }
    }
  }, [
    didEverythingFinished,
    platformIsLoading,
    fontLoaded,
    assetsIsLoading,
    setDidEverythingFinished,
  ]);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // cache static assets here

        // Load fonts
        // await Font.loadAsync({
        // ...FontAwesome.font,
        // "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
        // });

        const imageAssets = cacheImages([
          require("assets/images/backward-black.png"),
        ]);

        // const fontAssets = cacheFonts([FontAwesome.font]);

        // await Promise.all([...imageAssets, ...fontAssets]);
        await Promise.all([...imageAssets]);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setAssetsIsLoading(false);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, [setAssetsIsLoading]);

  return {
    platform: platformResponse,
    isLoadingComplete: didEverythingFinished,
  };
}
