import React, { useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";
import { Profile, ProfileRoutes } from "screens/Profile";
import { AddPaymentMethod, AddPaymentMethodSuccess } from "screens/Profile";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { mscale } from "utils/scales-util";
import {
  OrderStackHeader,
  OrderStackHeaderTypeCard,
  StyledText,
} from "components";
import Layout from "constants/Layout";
import NoPaymentMethod from "screens/Profile/NoPaymentMethod";
import Notifications from "screens/Profile/Notifications";
import { theme } from "styles/theme";
import ContactUs from "screens/Profile/ContactUs";
import FAQ from "screens/Profile/FAQ";
import { PaymentMethodList } from "screens/Credit";
import { OngoingTransactions } from "screens/Transaction";
import { useNestedNavigatorStore } from "stores";
import globalObjectLastActionState from "utils/global-object-last-action";
import { TransactionPageRoutes } from "screens/Transaction/TransactionPageRoutes";
import Transaction from "screens/Transaction/Transaction";
import PaymentReceipt from "screens/Order/PaymentReceipt";
import TransactionReceipt from "screens/Transaction/TransactionReceipt";
import TransactionPayNext from "screens/Transaction/TransactionPayNext";
import TransactionModal from "screens/Transaction/TransactionModal";
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
  return (
    <TouchableOpacity style={{ padding: mscale(3) }}>
      <StyledText
        fontFamily={"PoppinsBold"}
        color={theme.colors.buttons.marineBlue}
      >
        Mark all as read
      </StyledText>
    </TouchableOpacity>
  );
};

const TransactionNavigator = ({ navigation }: any) => {
  const lastAction = globalObjectLastActionState.get()?.action;

  const initialRouteName =
    lastAction === "fromPaymentReceipt"
      ? TransactionPageRoutes.TransactionItem
      : TransactionPageRoutes.TransactionInitial;

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

  const HeaderLeftComponent = useMemo(
    () => headerLeftComponentHoc(onGoBack),
    [onGoBack]
  );

  return (
    <RootStack.Navigator initialRouteName={initialRouteName}>
      <RootStack.Group>
        <RootStack.Screen
          name={TransactionPageRoutes.TransactionInitial}
          options={{
            // animation: "none",
            headerShown: false,
            // headerTitle: (props) => <></>
          }}
          component={OngoingTransactions}
        />
        <RootStack.Screen
          name={TransactionPageRoutes.TransactionItem}
          options={{
            // animation: "none",
            headerShown: false,
            //   headerTitle: HeaderTitleCmp2,
            //   headerLeft: HeaderLeftComponent,
          }}
          component={Transaction}
        />
        <RootStack.Screen
          name={TransactionPageRoutes.AddPaymentMethod}
          options={{
            // animation: "none",
            headerShown: false,
            //   headerTitle: HeaderTitleCmp2,
            //   headerLeft: HeaderLeftComponent,
          }}
          component={AddPaymentMethod}
        />
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          // initialParams={props}
          name={TransactionPageRoutes.AddPaymentMethodSuccess}
          component={AddPaymentMethodSuccess}
          // component={CreditBureauReport}
        />
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          // initialParams={props}
          name={TransactionPageRoutes.TransactionReceipt}
          component={TransactionReceipt}
          // component={CreditBureauReport}
        />
        <RootStack.Screen
          options={{
            // headerShown: false,
            header: OrderStackHeaderTypeCard,
          }}
          // initialParams={props}
          name={TransactionPageRoutes.TransactionPayNext}
          component={TransactionPayNext}
          // component={CreditBureauReport}
        />
      </RootStack.Group>

      <RootStack.Group
        screenOptions={({ route }: any) => {
          return {
            title: route?.params?.title,
            presentation: "transparentModal",
          };
        }}
      >
        <RootStack.Screen
          name={TransactionPageRoutes.ShowModalByType}
          options={{
            headerShown: false,
            animation: "none",
            headerTitle: (props) => {
              return (
                <StyledText variant="title" fontSize={15} lineHeight={15}>
                  {props.children}
                </StyledText>
              );
            },
          }}
          component={TransactionModal}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};

export default TransactionNavigator;
