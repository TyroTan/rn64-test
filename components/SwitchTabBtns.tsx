import React, { useMemo, useState } from "react";
import {
  Pressable as Button,
  Text,
  View,
  Switch,
  StyleSheet,
} from "react-native";
import StyledText from "./StyledTexts";
import StyledBox from "./StyledBoxes";
import styled from "styled-components/native";
import { mscale } from "utils/scales-util";
import { theme } from "styles/theme";

const SwitchTabBtns = (allProps: any) => {
  const { onChange, ...props } = allProps;
  const [isLeftActive, setIsLeftActive] = useState(true);
  const toggleSwitch = () => setIsLeftActive((previousState) => !previousState);

  React.useEffect(() => {
    onChange?.(isLeftActive ? 0 : 1);
  }, [isLeftActive]);

  const Content = useMemo(() => {
    if (isLeftActive) {
      return (
        <>
          <StyledActiveShadow style={styles.activeWrapper}>
            <Text style={styles.text}>Payment</Text>
          </StyledActiveShadow>
          <Button style={styles.btn} onPress={toggleSwitch}>
            <Text style={styles.text}>Details</Text>
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button style={styles.btn} onPress={toggleSwitch}>
            <Text style={styles.text}>Payment</Text>
          </Button>
          <StyledActiveShadow style={styles.activeWrapper}>
            <Text style={styles.text}>Details</Text>
          </StyledActiveShadow>
        </>
      );
    }
  }, [isLeftActive]);

  return (
    <StyledBox
      variant="flexcr"
      justifyContent="space-between"
      backgroundColor={theme.colors.background}
      borderRadius={mscale(18)}
      marginTop={mscale(10)}
      marginBottom={3}
      {...props}
    >
      {Content}
    </StyledBox>
  );
};

const StyledActiveShadow = styled.View`
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.254453);
  elevation: 7;
`;

const styles = StyleSheet.create({
  container: {},
  activeWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: mscale(18),
    backgroundColor: "#FFFFFF",
    width: "50%",
    zIndex: 1,
  },
  text: {
    fontFamily: "PoppinsMedium",
    fontSize: mscale(13),
    lineHeight: mscale(40),
  },
  btn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "50%",
    backgroundColor: "transparent",
  },
});

export default SwitchTabBtns;
