/* eslint-disable import/prefer-default-export */

import { lineHeight } from "styled-system";
import { mscale } from "utils/scales-util";

// soon import from our private npm packages
const _theme = {
  colors: {
    background: "#F0F3F5",
    background2: "#FFF",
    backgroundInput: "#FFF",
    rn64testBlue: "#1980CE",
    rn64testDarkBlue: "#1E4093",
    charcoal: "#474747",
    borderGray: "#CDD0D1",
    borderGray2: "#CBCBCB",
    faintGreen: "#E8F6F0",
    lockGray: "#979797",
    faintGray: "#F0F0F0",
    faintGray2: "#E9E9F1",
    linkBlue: "#197CCA",
    warningRed: "#FF6363",
    tahitiGold: "#E99149",
    faintBlue: "#F0F7FC",
    progressbar: {
      background: "#D7E2E8",
      barGreen1: "#0BC175",
      barGreenLight1: "#71D1AF",
      barMarineBlue: "#2B6CD8",
      barGreen2: "#4CD964",
    },
    buttons: {
      marineBlue: "#2B6CD8",
      secondarySmall: "#D80027",
      lightGray: "#D3D3D3",
      darkTangerine: "#FFA912",
    },
    actions: {
      failureRed: "#FF5055",
      actionBlue: "#218BFF",
      successGreen1: "#FFB812",
      successGreen2: "#FFD15F",
      yellowWarning1: "#FFB812",
      yellowWarning2: "#FFD15F",
      yellowWarning3: "#FFFAD9",
      yellowWarning4: "#EBD9A3",
      lowCreditOrange: "#EFB45E",
    },
    typography: {
      gray1: "#949494",
      gray2: "#ABABAB",
      gray3: "#858585",
      gray4: "#AEAEAE",
      gray5: "#989898",
      gray6: "#D8D8D8",
      gray7: "#A5A5A5",
      gray8: "#7A7A7A",
      gray9: "#8C8C8C",
      gray10: "#919191",
      gray11: "#848484",
      grayNeutral: "#323F4B",
      red1: "#D64C4C",
      main: "#03121A",
      mainInverse: "#FFF",
      darkGray: "#343C51",
      placeholder: "#C5C5C5",
    },
  },
  typography: {
    fontFamily: "Poppins",
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
};

const rnSpacing = {
  // space: {
  //   "3XS": mscale(3),
  //   XXS: mscale(5),
  //   XS: mscale(8),
  //   S: mscale(10),
  //   M: mscale(12),
  //   L: mscale(13),
  //   XL: mscale(17),
  //   XXL: mscale(22),
  //   "3XL": mscale(30),
  // },
  space: [
    mscale(3),
    mscale(5), // 1
    mscale(8),
    mscale(10), // 3
    mscale(12),
    mscale(14),
    mscale(16), // 6
    mscale(18),
    mscale(21), // 8
    mscale(24),
    mscale(28), // 10
    mscale(31),
    mscale(34), // 12
    mscale(37),
    mscale(40), // 14
    mscale(43),
    mscale(46), // 16
    mscale(49),
    mscale(52), // 18
    mscale(55),
    mscale(58), // 20
    mscale(61),
    mscale(64), // 22
    mscale(67),
    mscale(70), // 24
    mscale(73),
    mscale(76), // 26
  ],
};

// 70 items, 9 = mscale(10), 14 = mscale(15), 19 = mscale(20)
const rnFontSizes = {
  fontSizes: Array(60)
    .fill(0)
    .map((_, index) => mscale(index + 1)),
};

/*
fontSize : lineheight
8 : 12
12 : 17
17: 23
22 : 30
27 : 36
*/
const rnLineHeights = {
  lineHeights: [
    ...rnFontSizes.fontSizes.map((size) => Math.round((size * 30) / 24) + 2),
  ],
};

const rnSizes = {
  sizes: {},
};

export const theme = {
  navTheme: {
    colors: {
      background: _theme.colors.background2,
      card: _theme.colors.background2,
      text: _theme.colors.typography.main,
      border: _theme.colors.rn64testBlue,
      notification: _theme.colors.rn64testBlue,
      primary: _theme.colors.rn64testBlue,
    },
  },
  ..._theme,
  ...rnSpacing,
  ...rnFontSizes,
  ...rnLineHeights,
  ...rnSizes,
};
