import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyledBox, StyledText } from "components";
import { mscale } from "utils/scales-util";
import MyInfoIntro, {
  MyInfoRoutes,
  MyInfoFillRoutes,
  MyInfoSingpassWebview,
} from "screens/MyInfo";
import MyInfoFillNavigator from "navigation/MyInfo/MyInfoFillNavigator";
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
      {/* <Pressable
        style={{ padding: mscale(5) }}
        onPress={() => {
          if (name === LoginRoutes.LoginOtp) {
            navigation.goBack();
          }
        }}
      >
        <Image
          source={imgBackward}
          style={{
            width: mscale(17),
            height: mscale(16),
            marginRight: mscale(2),
          }}
        />
      </Pressable> */}
      <StyledText paddingLeft="2" fontSize={18} lineHeight={18} variant="title">
        {title}
      </StyledText>
      {/* <StyledText variant="title">{title}</StyledText> */}
    </StyledBox>
  );
};

// Routes.CreditRemainingMyInfoInitial
export default function MyInfoNavigator(props: any) {
  return (
    <Stack.Navigator
      // initialRouteName={OnboardingRoutes.OnboardingInitial}
      initialRouteName={MyInfoRoutes.MyInfoIntro}
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
        name={MyInfoRoutes.MyInfoIntro}
        component={MyInfoIntro}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={MyInfoRoutes.MyInfoSingpassWebview}
        component={MyInfoSingpassWebview}
        // component={() => <></>}
      />
      <Stack.Screen
        // options={{
        //   headerLeft: () => {
        //     const navigation = useNavigation();

        //     return (
        //       <Pressable
        //         style={{ padding: mscale(5) }}
        //         onPress={() => {
        //           navigation.navigate({
        //             name: MyInfoRoutes.MyInfoIntro,
        //           } as any);
        //         }}
        //       >
        //         <Image
        //           source={imgBackward}
        //           style={{
        //             width: mscale(17),
        //             height: mscale(16),
        //             // marginRight: mscale(2),
        //           }}
        //         />
        //       </Pressable>
        //     );
        //   },
        //   headerShadowVisible: false,
        //   headerTitle: (props) => {
        //     const title = "OTP Verification";
        //     const properties = {
        //       ...props,
        //       title,
        //       name: MyInfoRoutes.MyInfoIntro,
        //     };

        //     return <HeaderComponent {...properties} />;
        //   },
        // }}
        options={{
          headerShown: false,
        }}
        name={MyInfoFillRoutes.MyInfoFillInitial}
        component={MyInfoFillNavigator}
      />
    </Stack.Navigator>
  );
}
