import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const screen = Dimensions.get("screen");

export default {
  window: {
    width,
    height,
  },
  screen: {
    width: screen.width,
    height: screen.height,
  },
  isSmallDevice: width < 375,
};
