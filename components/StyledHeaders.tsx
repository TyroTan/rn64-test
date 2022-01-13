import React from "react";
import { mscale } from "utils/scales-util";
import { StyledText } from "components/StyledTexts";
import { StyledBox } from "components/StyledBoxes";
import { Image, TouchableOpacity } from "react-native";
const imgBackward = require("assets/images/backward-black.png");
const imgBackwardLight = require("assets/images/back-white.png");

interface HeaderComponent {
  // title: string;
  // name: string;
  // HeaderLeft: React.ElementType;
  // headerLeftProps?: any;
}

const Header = (allProps: any) => {
  const {
    title,
    name,
    wrapperProps = {},
    HeaderLeft: HeaderLeftCustom,
    ...headerLeftProps
  } = allProps;
  const RenderHeaderLeftComponent = () => {
    const typeofHeaderLeftComponent = typeof HeaderLeftCustom;
    let Content = <></>;

    switch (typeofHeaderLeftComponent) {
      case "object":
        Content = HeaderLeftCustom;
        break;
      case "function":
        Content = <HeaderLeftCustom {...headerLeftProps} />;
        break;

      default:
        Content = <HeaderLeft {...headerLeftProps} />;
        break;
    }
    return <>{Content}</>;
  };

  return (
    <StyledBox
      width="100%"
      // border
      height={mscale(40)}
      marginBottom={1}
      paddingLeft={2}
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      {...wrapperProps}
    >
      {/* <HeaderLeft {...headerLeftProps} /> */}
      {/* {HeaderLeft} */}
      <RenderHeaderLeftComponent />
      {title && (
        <StyledText
          paddingLeft="2"
          fontSize={18}
          lineHeight={18}
          variant="title"
        >
          {title}
        </StyledText>
      )}
    </StyledBox>
  );
};

// interface HeaderLeftProps {
//   onPress: () => void;
// }

const defaultStyles = {
  padding: mscale(5),
  paddingLeft: mscale(20),
};

export const HeaderLeft = (allProps: any) => {
  // console.log("keysss", Object.keys(allProps));
  const { onPress, imgStyle = "dark", ...props } = allProps;
  const mergedStyles = {
    ...defaultStyles,
    ...(props?.style ?? {}),
  };

  const defaultProps = { ...props };
  const mergedProps = {
    ...defaultProps,
    style: mergedStyles,
  };

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      {...mergedProps}
    >
      <Image
        source={imgStyle === "dark" ? imgBackward : imgBackwardLight}
        style={{
          margin: mscale(2),
          width: mscale(17),
          height: mscale(16),
        }}
      />
    </TouchableOpacity>
  );
};

export default Header;
