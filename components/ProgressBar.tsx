import React, { useEffect, useState, useCallback } from "react";
import { Animated, StyleSheet, View } from "react-native";

const ProgressBar = (props: any) => {
  const {
    height,
    progress,
    animated,
    indeterminate,
    progressDuration,
    indeterminateDuration,
    onCompletion,
    backgroundColor,
    trackColor = "#000",
  } = props;

  const [timer] = useState(new Animated.Value(0));
  const [width] = useState(new Animated.Value(0));

  const indeterminateAnimation = Animated.timing(timer, {
    duration: indeterminateDuration,
    toValue: 1,
    useNativeDriver: true,
    isInteraction: false,
  });

  const startAnimation = useCallback(() => {
    if (indeterminate) {
      timer.setValue(0);
      Animated.loop(indeterminateAnimation).start();
    } else {
      Animated.timing(width, {
        useNativeDriver: false, // TODO might not work?
        duration: animated ? progressDuration : 0,
        toValue: progress,
      } as any).start(() => {
        onCompletion();
      });
    }
  }, [
    animated,
    indeterminate,
    indeterminateAnimation,
    onCompletion,
    progress,
    progressDuration,
    timer,
    width,
  ]);

  const stopAnimation = useCallback(() => {
    if (indeterminateAnimation) indeterminateAnimation.stop();

    Animated.timing(width, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }, [indeterminateAnimation, width]);

  useEffect(() => {
    if (indeterminate || typeof progress === "number") {
      setTimeout(() => {
        startAnimation();
      }, 350);
    } else {
      stopAnimation();
    }
  }, [indeterminate, progress, startAnimation, stopAnimation]);

  const styleAnimation = () => {
    return indeterminate
      ? {
          transform: [
            {
              translateX: timer.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [-0.6 * 320, -0.5 * 0.8 * 320, 0.7 * 320],
              }),
            },
            {
              scaleX: timer.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.0001, 0.8, 0.0001],
              }),
            },
          ],
        }
      : {
          width: width.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
        };
  };

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height,
      overflow: "hidden",
    },
    progressBar: {
      flex: 1,
    },
  });

  return (
    <View>
      <Animated.View
        style={[styles.container, { backgroundColor: trackColor }]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor,
              ...styleAnimation(),
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

ProgressBar.defaultProps = {
  state: "black",
  height: 2,
  progress: 0,
  animated: true,
  indeterminate: false,
  indeterminateDuration: 1100,
  progressDuration: 1100,
  onCompletion: () => {},
};

export default ProgressBar;
