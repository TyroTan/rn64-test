import React, { useState } from "react";
import LottieView from "lottie-react-native";
import { mscale } from "utils/scales-util";
import { StyledSafeAreaView } from "components/StyledSafeAreaView";
import { StyledText } from "components/StyledTexts";
import { ButtonText } from "components/StyledButtons";
import { theme } from "styles/theme";
import { StyleSheet, View } from "react-native";
import type { ViewStyle } from "react-native";

type SuccessConfettiProps = {
  loading?: boolean;
  onReturn: () => void;
  successText: string;
  note?: string;
};

class SuccessAnimated extends React.Component<any, any> {
  animatedConfetti: any = null;
  animatedCheck: any = null;

  componentDidMount() {
    this.animatedCheck.play(0, 55);
    setTimeout(() => {
      this.animatedConfetti.play(0, 55);
    }, 500);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <LottieView
          ref={(ref) => (this.animatedConfetti = ref)}
          source={require("assets/lottie/confetti-lottie.json")}
          autoPlay={false}
          loop={false}
        />
        <LottieView
          ref={(ref) => (this.animatedCheck = ref)}
          source={require("assets/lottie/registration-complete-lottie.json")}
          autoPlay={false}
          loop={false}
        />
      </View>
    );
  }
}

const SuccessConfetti: React.FC<SuccessConfettiProps> = ({
  onReturn,
  successText,
  loading: loadingDefault,
  note,
}) => {
  const [loading, setLoading] = useState(loadingDefault ?? false);
  const onReturnWithLoading = () => {
    setLoading(true);
    setTimeout(() => {
      onReturn();
    }, 120);
  };
  // const { onReturn } = route ?? {};
  return (
    <StyledSafeAreaView
      height="100%"
      flex={1}
      style={{
        backgroundColor: theme.colors.buttons.marineBlue,
        paddingBottom: mscale(20),
      }}
    >
      <View style={{ flex: 1 }}>
        <SuccessAnimated />
        <View
          style={{
            position: "absolute",
            top: "68%",
            height: "100%",
            width: "100%",
          }}
        >
          <StyledText
            variant="title"
            width="100%"
            children={successText}
            color={theme.colors.typography.mainInverse}
          />
          {note && (
            <StyledText
              mt={2}
              variant="paragraphSmall"
              color={theme.colors.typography.mainInverse}
            >
              {note}
            </StyledText>
          )}
        </View>
        <ButtonText
          variant="primaryInverted"
          children="RETURN"
          disabled={loading}
          loading={loading}
          onPress={onReturnWithLoading}
        />
      </View>
    </StyledSafeAreaView>
  );
};

export default SuccessConfetti;
