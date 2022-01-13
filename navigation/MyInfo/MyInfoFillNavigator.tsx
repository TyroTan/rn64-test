import * as React from "react";
import { View, Text, Pressable } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { OnboardingRoutes } from "screens/Onboarding/Onboarding";
import {
  MyInfoFill3,
  MyInfoFill2,
  MyInfoFill,
  MyInfoFillRoutes,
  VerificationSuccess,
} from "screens/MyInfo";
import { theme } from "styles/theme";
import {
  StyledSafeAreaView,
  Header,
  HeaderLeft,
  StyledText,
  ProgressBar,
} from "components";
import { mscale } from "utils/scales-util";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RenderYearMonthPicker from "screens/MyInfo/RenderYearMonthPicker";
import { hexToRGB } from "utils/hex-util";

const Tab = createMaterialTopTabNavigator();
const RootStack = createNativeStackNavigator();

const MyInfoFill3StackNavigator = () => (
  <RootStack.Navigator>
    <RootStack.Screen
      options={{
        headerShown: false,
      }}
      // initialParams={props}
      name={`${MyInfoFillRoutes.MyInfoFill3}`}
      component={MyInfoFill3}
    />
    <RootStack.Screen
      options={{
        headerShown: false,
      }}
      // initialParams={props}
      name="RenderYearMonthPicker"
      component={RenderYearMonthPicker}
    />
  </RootStack.Navigator>
);

const StackHeader = (props: any) => {
  let progress = 40;
  switch (props?.back?.title) {
    case MyInfoFillRoutes.MyInfoFill1:
      progress = 60;
      break;
    case MyInfoFillRoutes.MyInfoFill2:
      progress = 80;
      break;
    default:
      progress = 40;
  }

  const onGoBack =
    props?.navigation?.goBack ?? props?.onGoBack ?? ((() => true) as any);
  const properties = {
    ...props,
    title: "Confirm your details",
    HeaderLeft: <HeaderLeft onPress={onGoBack} />,

    // name: MyInfoRoutes.MyInfoIntro,
  };

  return (
    <StyledSafeAreaView
      style={
        {
          // maxHeight: mscale(112),
        }
      }
    >
      <Header {...properties} />
      <ProgressBar
        progress={progress}
        height={mscale(4)}
        trackColor={theme.colors.typography.gray6}
        backgroundColor={theme.colors.buttons.marineBlue}
      />
    </StyledSafeAreaView>
  );
};

const MyInfoFillNavigator = () => {
  return (
    <RootStack.Navigator
      // initialRouteName={MyInfoFillRoutes.MyInfoFill1}
      initialRouteName={`${MyInfoFillRoutes.MyInfoFill3}Initial`}
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background2,
        },
      }}
      // screenOptions={
      //   {
      // tabBarStyle: {
      //   opacity: 0,
      //   height: 0,
      // },
      //   }
      // }
      /* tabBar={(props: any) => {
        const navigation = useNavigation();
        const route = useRoute();
        let progress = 40;
        let onGoBack = () => {
          navigation.navigate({
            name: OnboardingRoutes.Onboarding2,
          } as any);
        };
        let title = "Confirm your details";

        // ! this is the ugly way to get the route.name if coming from creditHome->Myinfo route
        const st = navigation.getState();
        const lvl1 = st?.routes?.[st?.index ?? 0]?.state ?? ({} as any);
        const lvl2 = lvl1?.routes?.[lvl1?.index ?? 0];

        switch (lvl2?.name ?? route.name) {
          case `${MyInfoFillRoutes.MyInfoFill2}`:
            title = "Enter your details";
            onGoBack = () => navigation.goBack();
            progress += 15;
            break;
          default:
            progress -= 15;
            break;
        }

        const properties = {
          ...props,
          title,
          HeaderLeft: <HeaderLeft onPress={onGoBack} />,

          // name: MyInfoRoutes.MyInfoIntro,
        };

        return (
          <StyledSafeAreaView
            style={{
              maxHeight: mscale(112),
            }}
          >
            <Header {...properties} />
            <ProgressBar
              progress={progress}
              height={mscale(4)}
              trackColor={theme.colors.typography.gray6}
              backgroundColor={theme.colors.buttons.marineBlue}
            />
          </StyledSafeAreaView>
        );
      }} */
    >
      <RootStack.Screen
        name={MyInfoFillRoutes.MyInfoFill1}
        // component={MyInfoFill}
        component={MyInfoFill}
        options={{
          header: StackHeader,
        }}
      />
      <RootStack.Screen
        name={MyInfoFillRoutes.MyInfoFill2}
        component={MyInfoFill2}
        options={{
          header: StackHeader,
        }}
      />
      <RootStack.Screen
        name={MyInfoFillRoutes.MyInfoFill3}
        component={MyInfoFill3}
        options={{
          header: StackHeader,
        }}
      />
      <RootStack.Screen
        name={MyInfoFillRoutes.VerificationSuccess}
        component={VerificationSuccess}
        options={{
          headerShown: false,
        }}
      />
      {/* <Tab.Screen
        name={`${MyInfoFillRoutes.MyInfoFill3}Initial`}
        component={MyInfoFill3StackNavigator}
      /> */}
      {/* <Tab.Screen
        name={`${MyInfoFillRoutes.MyInfoFill3}`}
        component={MyInfoFill3}
      /> */}
      {/* <Tab.Screen name={MyInfoFillRoutes.MyInfoFill4} component={MyInfoFill3} /> */}
    </RootStack.Navigator>
  );
};

export default MyInfoFillNavigator;
