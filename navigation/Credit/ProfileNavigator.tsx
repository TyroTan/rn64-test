import React, { useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";

import { useBuyerStore } from "stores";
import { Profile, ProfileRoutes } from "screens/Profile";
import AddPaymentMethod from "screens/Profile/AddPaymentMethod";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { mscale } from "utils/scales-util";
import { StyledText } from "components";
import Layout from "constants/Layout";
import NoPaymentMethod from "screens/Profile/NoPaymentMethod";
import Notifications from "screens/Profile/Notifications";
import Settings from "screens/Profile/Settings";
import { theme } from "styles/theme";
import ContactUs from "screens/Profile/ContactUs";
import FAQ from "screens/Profile/FAQ";
import { PaymentMethodList } from "screens/Credit";
import AddPaymentMethodSuccess from "screens/Profile/AddPaymentMethodSuccess";
import ProfileDeeplinkDummy from "screens/Profile/ProfileDeeplinkDummy";
const imgBackward = require("assets/images/backward-black.png");

const RootStack = createNativeStackNavigator();

const headerLeftComponentHoc = (onGoBack: any) =>
  Platform.OS === "ios"
    ? () => {
        // const navigation = useNavigation();

        return (
          <TouchableOpacity style={{ padding: mscale(5) }} onPress={onGoBack}>
            <Image
              source={imgBackward}
              style={{
                width: mscale(17),
                height: mscale(16),
                // marginRight: mscale(2),
              }}
            />
          </TouchableOpacity>
        );
      }
    : () => <></>;

const HeaderTitleCmpHoc = (title: string) => (props: any) =>
  (
    <StyledText
      variant="title"
      fontSize={17}
      lineHeight={17}
      textAlign="left"
      width={Layout.screen.width * 0.8}
    >
      {title}
    </StyledText>
  );

const HeaderRight = () => {
  const { submitNotificationReadAll } = useBuyerStore();

  return (
    <TouchableOpacity
      style={{ padding: mscale(3) }}
      onPress={submitNotificationReadAll}
    >
      <StyledText
        fontFamily={"PoppinsBold"}
        color={theme.colors.buttons.marineBlue}
      >
        Mark all as read
      </StyledText>
    </TouchableOpacity>
  );
};

const ProfileStackNavigator = ({ navigation }: any) => {
  const onGoBack = () => navigation.navigate(ProfileRoutes.ProfileInitial);

  const HeaderTitleCmp1 = useMemo(
    () => HeaderTitleCmpHoc("New Payment method"),
    [""]
  );

  const HeaderTitleCmp2 = useMemo(
    () => HeaderTitleCmpHoc("Payment methods"),
    [""]
  );

  const HeaderTitleCmp3 = useMemo(
    () => HeaderTitleCmpHoc("Notifications"),
    [""]
  );

  const HeaderTitleCmp4 = useMemo(() => HeaderTitleCmpHoc("Contact Us"), [""]);

  const HeaderTitleCmp5 = useMemo(() => HeaderTitleCmpHoc("FAQs"), [""]);

  const HeaderTitleCmp6 = useMemo(() => HeaderTitleCmpHoc("Settings"), [""]);

  const HeaderLeftComponent = useMemo(
    () => headerLeftComponentHoc(onGoBack),
    [onGoBack]
  );

  return (
    <RootStack.Navigator initialRouteName={ProfileRoutes.ProfileInitial}>
      <RootStack.Screen
        name={ProfileRoutes.ProfileInitial}
        options={{
          // animation: "none",
          headerShown: false,
          // headerTitle: (props) => <></>
        }}
        component={Profile}
      />
      <RootStack.Screen
        name={ProfileRoutes.ProfileDeeplinkDummy}
        options={{
          headerShown: false,
        }}
        component={ProfileDeeplinkDummy}
      />
      <RootStack.Screen
        name={ProfileRoutes.NoPaymentMethod}
        options={{
          // animation: "none",
          // headerShown: false,
          headerTitle: HeaderTitleCmp2,
          headerLeft: HeaderLeftComponent,
        }}
        component={NoPaymentMethod}
      />
      <RootStack.Screen
        name={ProfileRoutes.AddPaymentMethod}
        options={{
          // animation: "none",
          // headerShown: false,
          headerTitle: HeaderTitleCmp1,
          headerLeft: HeaderLeftComponent,
        }}
        component={AddPaymentMethod}
      />
      <RootStack.Screen
        name={ProfileRoutes.AddPaymentMethodSuccess}
        options={{
          // animation: "none",
          headerShown: false,
        }}
        component={AddPaymentMethodSuccess}
      />
      <RootStack.Screen
        name={ProfileRoutes.PaymentMethodList}
        options={{
          // animation: "none",
          headerShown: false,
          // headerTitle: (props) => <></>
        }}
        component={PaymentMethodList}
      />
      <RootStack.Screen
        name={ProfileRoutes.Notifications}
        options={{
          headerTitle: HeaderTitleCmp3,
          headerLeft: HeaderLeftComponent,
          // headerRight: HeaderRight,
        }}
        component={Notifications}
      />
      <RootStack.Screen
        name={ProfileRoutes.ContactUs}
        options={{
          headerTitle: HeaderTitleCmp4,
          headerLeft: HeaderLeftComponent,
        }}
        component={ContactUs}
      />
      <RootStack.Screen
        name={ProfileRoutes.FAQ}
        options={{
          headerTitle: HeaderTitleCmp5,
          headerLeft: HeaderLeftComponent,
        }}
        component={FAQ}
      />
      <RootStack.Screen
        name={ProfileRoutes.Settings}
        options={{
          headerTitle: HeaderTitleCmp6,
          headerLeft: HeaderLeftComponent,
        }}
        component={Settings}
      />
    </RootStack.Navigator>
  );
};

export default ProfileStackNavigator;
