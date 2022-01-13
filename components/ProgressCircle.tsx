import React, { Component } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import { height } from "styled-system";
import { hexToRGB } from "utils/hex-util";
import { mscale } from "utils/scales-util";
import Arc from "./Arc";
import { theme } from "styles/theme";
import StyledBox from "./StyledBoxes";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  circles: {
    flexDirection: "row",
    alignItems: "center",
  },
  progress: {
    margin: 10,
  },
});

export default class Example extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      progress: 0,
      progress2: 200,
      indeterminate: true,
    };
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    let progress = 0;
    this.setState({ progress });
    setTimeout(() => {
      this.setState({ indeterminate: false });
      setInterval(() => {
        progress += Math.random() / 5;
        if (progress > 1) {
          progress = 1;
        }
        this.setState({ progress });
      }, 500);
    }, 1500);

    setTimeout(() => {
      this.setState({
        progress2: this.state.progress2 - 10,
      });
      setTimeout(() => {
        this.setState({
          progress2: this.state.progress2 - 25,
        });
        setTimeout(() => {
          this.setState({
            progress2: this.state.progress2 - 75,
          });
        }, 60);
      }, 180);
    }, 180);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Progress Example</Text>
        <Progress.Bar
          style={styles.progress}
          progress={this.state.progress}
          indeterminate={this.state.indeterminate}
        />
        <View style={styles.circles}>
          <Progress.Circle
            size={55}
            thickness={5}
            borderColor="transparent"
            style={[
              {
                marginLeft: 0,
                marginTop: 0,
                position: "absolute",
              },
            ]}
            progress={100 / this.state.progress2}
            color={hexToRGB("#F0F3F5", 1)}
            indeterminate={false}
          />
          <Progress.Circle
            size={55}
            thickness={5}
            borderColor="transparent"
            style={[{ marginLeft: 0, marginTop: 0, position: "absolute" }]}
            progress={85 / this.state.progress2}
            color={hexToRGB("#ffcbc6", 1)}
            indeterminate={false}
          />
          <Progress.Circle
            size={55}
            thickness={5}
            borderColor="transparent"
            progress={65 / this.state.progress2}
            color={"#FE6E61"}
            indeterminate={false}
          />
          <Progress.Pie
            style={styles.progress}
            progress={this.state.progress}
            indeterminate={this.state.indeterminate}
          />
          <Progress.Circle
            style={styles.progress}
            progress={this.state.progress}
            indeterminate={this.state.indeterminate}
            direction="counter-clockwise"
          />
        </View>
        <View style={styles.circles}>
          <Progress.CircleSnail style={styles.progress} />
          <Progress.CircleSnail
            size={150}
            style={[styles.progress]}
            color={["#F44336", "#2196F3", "#009688"]}
          />
        </View>
      </View>
    );
  }
}

const stylesLayered = StyleSheet.create({
  circle: {
    position: "absolute",
  },
  merchantWrapper: {
    width: mscale(57),
    height: mscale(57),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  imgMerchant: {
    position: "absolute",
    width: mscale(24),
    height: mscale(24),
    padding: mscale(2),
  },
});

const Silhouette = ({ width, height }: { width: number; height: number }) => (
  <StyledBox
    // width={mscale(110)}
    width={width ?? "100%"}
    height={height ?? "100%"}
    // height={mscale(110)}
    alignSelf="center"
    borderRadius={mscale(55)}
    marginBottom={9}
    backgroundColor={theme.colors.faintGray2}
  />
);

export const ProgressCircleLayered = (allProps: any) => {
  // dddebug
  // if (allProps || !allProps) {
  //   return <></>;
  // }
  const {
    strokeWidth = mscale(5),
    size = 58,
    loading = true,
    imgMerchantSrc,
    colors = [],
    imgStyle,
    percentages = [0.18, 0.4, 1],
  } = allProps;
  let [colorDetail = "#FFFFFF", colorPrimary = "#FFFFFF"] = colors;

  if (loading) {
    (colorDetail = "#FFFFFF"), (colorPrimary = "#FFFFFF");
  }

  const [percentageShort, percentageLong, percentageTotal] = percentages;

  const progress2 = 100;
  const sizeParam = mscale(size);
  return (
    <View>
      <View
        style={[
          stylesLayered.merchantWrapper,
          { width: sizeParam, height: sizeParam },
        ]}
      >
        {imgMerchantSrc ? (
          <Image
            source={imgMerchantSrc}
            resizeMode="contain"
            style={[stylesLayered.imgMerchant, imgStyle]}
          />
        ) : (
          <Silhouette
            width={stylesLayered.imgMerchant.width}
            height={stylesLayered.imgMerchant.width}
          />
        )}
      </View>
      {/* <Progress.Circle
        size={size}
        thickness={mscale(4)}
        borderColor="transparent"
        style={stylesLayered.circle}
        progress={100 / progress2}
        color={hexToRGB("#F0F3F5", 1)}
        indeterminate={false}
      /> */}
      <View
        style={{
          position: "absolute",
        }}
      >
        <Arc
          // color={hexToRGB(secondary, 0.25)}
          radius={sizeParam / 2}
          // offset: offset,
          startAngle={0}
          endAngle={percentageTotal * 2 * Math.PI}
          direction={"clockwise"}
          stroke={hexToRGB(colorPrimary, 0.1)}
          strokeCap={"round"}
          strokeWidth={strokeWidth}
          size={sizeParam + 1}
        />
      </View>
      {/* <Progress.Circle
        size={size}
        thickness={mscale(4)}
        borderColor="transparent"
        style={stylesLayered.circle}
        progress={85 / progress2}
        // color={hexToRGB("#ffcbc6", 1)}
        color={hexToRGB(secondary, 0.25)}
        indeterminate={false}
      /> */}
      <View
        style={{
          position: "absolute",
        }}
      >
        <Arc
          // color={hexToRGB(secondary, 0.25)}
          radius={sizeParam / 2}
          // offset: offset,
          startAngle={0}
          endAngle={percentageLong * 2 * Math.PI}
          direction={"clockwise"}
          stroke={hexToRGB(colorDetail, 0.45)}
          strokeCap={"round"}
          strokeWidth={strokeWidth}
          size={sizeParam + 1}
        />
      </View>
      {/* <Arc
        size={size}
        thickness={5}
        borderColor="transparent"
        style={stylesLayered.circle}
        progress={65 / progress2}
        color={primary}
        indeterminate={false}
      /> */}
      <View
        style={{
          position: "absolute",
        }}
      >
        <Arc
          // color={theme.colors.rn64testBlue}
          radius={sizeParam / 2}
          // offset: offset,
          startAngle={0}
          endAngle={percentageShort * 2 * Math.PI}
          direction={"clockwise"}
          stroke={colorDetail}
          strokeCap={"round"}
          strokeWidth={strokeWidth}
          size={sizeParam + 1}
        />
      </View>
    </View>
  );
};
