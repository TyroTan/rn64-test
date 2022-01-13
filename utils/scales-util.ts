import { getStatusBarHeight as getStatusBarHeightFn } from "react-native-status-bar-height";
import { moderateScale, scale } from "react-native-size-matters";

export const mscale = (size: number, factor?: number) => {
  return moderateScale(size, factor);
};

export const getStatusBarHeight = (deviceInfo: any): number => {
  const isIos = deviceInfo?.osName === "iOS";
  return getStatusBarHeightFn(!isIos) ?? 0;
};

export const hasNotch = (deviceInfo: any): boolean => {
  return getStatusBarHeight(deviceInfo) > 20;
};

export const size3XS = mscale(3);
export const sizeXXS = mscale(4);
export const sizeXS = mscale(5);
export const sizeS = mscale(7);
export const sizeM = mscale(10);
export const sizeL = mscale(13);
export const sizeXL = mscale(18);
export const sizeXXL = mscale(25);
export const size3XL = mscale(34);
