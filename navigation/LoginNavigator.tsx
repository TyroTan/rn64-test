import * as React from "react";
import { Pressable, Image, Platform } from "react-native";
import Login, { LoginRoutes } from "screens/Login";
import { LoginOtp } from "screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderLeft, StyledBox, StyledText } from "components";
import { mscale } from "utils/scales-util";
import { useNavigation, useRoute } from "@react-navigation/native";
const imgBackward = require("assets/images/backward-black.png");

const Stack = createNativeStackNavigator();

interface HeaderComponent {
  title: string;
  name: string;
}
const HeaderComponent = ({ title, name }: HeaderComponent) => {
  // console.log("Hedercomonentprops", props);

  return (
    <StyledBox
      width="100%"
      height={mscale(40)}
      margin={0}
      padding={0}
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
    >
      <StyledText paddingLeft="2" fontSize={18} lineHeight={18} variant="title">
        {title}
      </StyledText>
      {/* <StyledText variant="title">{title}</StyledText> */}
    </StyledBox>
  );
};

export default function LoginNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={LoginRoutes.LoginPhoneInput}
      // initialRouteName={LoginRoutes.LoginOtp}
      screenOptions={
        {
          // tabBarStyle: {
          //   opacity: 0,
          //   height: 0,
          // },
        }
      }
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={LoginRoutes.LoginPhoneInput}
        component={Login}
      />
      <Stack.Screen
        options={{
          headerLeft:
            Platform.OS === "ios"
              ? () => {
                  const navigation = useNavigation();

                  return (
                    <Pressable
                      style={{ padding: mscale(5) }}
                      onPress={() => {
                        navigation.navigate({
                          name: LoginRoutes.LoginPhoneInput,
                        } as any);
                      }}
                    >
                      <Image
                        source={imgBackward}
                        style={{
                          width: mscale(17),
                          height: mscale(16),
                          // marginRight: mscale(2),
                        }}
                      />
                    </Pressable>
                  );
                }
              : () => <></>,
          headerShadowVisible: false,
          // headerLeft: (props: any) => <HeaderLeft {...props} />,
          headerTitle: (props) => {
            const title = "OTP Verification";
            const properties = {
              ...props,
              title,
              name: LoginRoutes.LoginOtp,
            };

            return <HeaderComponent {...properties} />;
          },
        }}
        name={LoginRoutes.LoginOtp}
        component={LoginOtp}
      />
    </Stack.Navigator>
  );
}
