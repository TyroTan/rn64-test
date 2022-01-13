import React, { useEffect } from "react";

import styled from "styled-components/native";
import {
  variant,
  border,
  compose,
  layout,
  flexbox,
  color,
  space,
} from "styled-system";
import {
  Platform,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import type { ImageURISource, ViewProps } from "react-native";
import StyledBox from "./StyledBoxes";
import { theme } from "styles/theme";
import type { CSSProps } from "types";
import { mscale } from "utils/scales-util";
import StyledText from "./StyledTexts";

const imgGreenCheck = require("assets/images/green-check.png");

const isIOS = Platform.OS === "ios";

export const CardListView = styled.View`
  background-color: ${(props: CSSProps) => {
    return props.theme.colors.background2;
  }};

  ${variant({
    variants: {
      card: {
        width: "100%",
        marginBottom: mscale(17),
        alignSelf: "center",
        borderRadius: mscale(12),

        shadowColor: isIOS ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, .6)",
        shadowOffset: "0px -1px",
        shadowOpacity: 0.25,
        shadowRadius: mscale(7),
        elevation: 5,
      },
      card2: {
        width: "100%",
        marginBottom: mscale(17),
        alignSelf: "center",
        borderRadius: mscale(12),

        shadowColor: isIOS ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, .6)",
        // shadowOffset: "0px -20px",
        shadowOpacity: 0.09,
        shadowRadius: mscale(6),
        elevation: 5,
      },
      cardReceipt: {
        // elevation: 9,
        borderRadius: mscale(11),
      },
      cardMerchants: {
        width: "100%",
        marginBottom: mscale(17),
        alignSelf: "center",
        borderRadius: mscale(12),

        shadowColor: isIOS ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, .4)",
        shadowOffset: "0px 1px",
        shadowOpacity: 0.09,
        shadowRadius: mscale(7),
        elevation: 9,
      },
    },
  })}

  ${compose(border, space, layout, flexbox, color)};
`;

CardListView.defaultProps = {
  variant: "card",
};

const styles = StyleSheet.create({
  cardListTitle: {
    fontFamily: "PoppinsBold",
    color: theme.colors.typography.darkGray,
    paddingLeft: 20,
    paddingTop: 21,
    paddingBottom: 1,
    fontSize: mscale(18.5),
    lineHeight: mscale(18.5),
    textAlign: "left",
  },
  txtStart: {
    fontFamily: "PoppinsBold",
    color: theme.colors.background2,
    fontSize: mscale(10),
    paddingVertical: mscale(4),
    textAlign: "center",
    textAlignVertical: "center",
  },
  flexcr20: {
    width: "20%",
    borderRadius: mscale(12),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  flexcr80: {
    height: "100%",
    width: "80%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  greenCheck: {
    backgroundColor: theme.colors.progressbar.barGreen1,
  },
  orangeStart: {
    backgroundColor: theme.colors.buttons.darkTangerine,
  },
  redPay: {
    backgroundColor: theme.colors.typography.red1,
  },
  bluePay: {
    backgroundColor: theme.colors.buttons.marineBlue,
  },
  divider: {
    borderWidth: 0.5,
    borderColor: "#DCDCDC",
    height: 1,
    width: "97%",
    alignSelf: "center",
  },
});

export const CardListItemDivider = ({ style }: any) => (
  <View style={[styles.divider, style]} />
);

const CardList = (allProps: any) => {
  const { title = "", children, onMeasureInWindow, ...props } = allProps;
  const r = React.useRef(null);
  useWalkthroughOverlay(onMeasureInWindow, r);

  return (
    <CardListView {...props} ref={r}>
      <Text style={styles.cardListTitle}>{title}</Text>
      {children ?? <></>}
    </CardListView>
  );
};

const useWalkthroughOverlay = (onMeasureInWindow: any, refObj: any) => {
  useEffect(() => {
    setTimeout(() => {
      if (!onMeasureInWindow) return;
      (refObj?.current as any)?.measureInWindow((...props: any) => {
        const [left, top, width, height] = props;

        onMeasureInWindow?.({
          position: "absolute",
          top,
          left,
          height,
          width,
        });
      });
    }, 100);
  }, [refObj]);
};

interface CardListItemProps extends ViewProps {
  leftImgSource: ImageURISource;
  children: any;
  rightElementVariant?: RightElementVariant;
  rightElementProps?: ViewProps;
}

type RightElementVariant = "greenCheck" | "orangeStart" | "redPay" | "bluePay";
interface RightElementProps {
  variant: RightElementVariant;
  loading?: boolean;
  // rightElementProps?: ViewProps;
}

const RightElement = (allprops: RightElementProps) => {
  const { variant, ...props } = allprops;

  if (props?.loading === true) {
    return (
      <View style={styles.flexcr20} {...props}>
        <ActivityIndicator color={theme.colors.rn64testBlue} />
      </View>
    );
  }

  switch (variant) {
    case "orangeStart":
      return (
        <TouchableOpacity style={[styles.flexcr20, styles[variant]]} {...props}>
          <Text style={[styles.txtStart]}>Start</Text>
        </TouchableOpacity>
      );
    case "greenCheck":
      return (
        <TouchableOpacity style={[styles.flexcr20, styles[variant]]} {...props}>
          <Image
            source={imgGreenCheck}
            resizeMode="contain"
            style={{ width: mscale(10), height: mscale(22) }}
          />
        </TouchableOpacity>
      );
    case "redPay":
    case "bluePay":
      return (
        <View style={[styles.flexcr20, styles[variant]]}>
          <Text style={[styles.txtStart]}>Start</Text>
        </View>
      );
    default:
      return <></>;
  }
};

export const CardListItem = (allProps: CardListItemProps) => {
  const {
    leftImgSource,
    children,
    rightElementProps,
    rightElementVariant,
    ...props
  } = allProps;
  const RightEl: any = rightElementVariant ? (
    <RightElement variant={rightElementVariant} {...rightElementProps} />
  ) : (
    <></>
  );
  return (
    <StyledBox
      variant="flexcr"
      {...props}
      width={"92%"}
      height={mscale(82)}
      alignSelf="center"
    >
      <Image
        source={leftImgSource}
        resizeMode="contain"
        style={{ width: "20%", height: mscale(45) }}
      />
      <View style={styles.flexcr80}>{children ?? <></>}</View>
      {RightEl}
    </StyledBox>
  );
};

export default CardList;

const stylesRow = StyleSheet.create({
  rowWrapper: {
    paddingLeft: mscale(20),
    paddingRight: mscale(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});

export const RowItem = (props: any) => {
  const {
    label,
    value,
    marginTop = null,
    paddingTop = null,
    marginBottom = null,
    paddingBottom = 0,
  } = props;
  return (
    <View
      style={[
        stylesRow.rowWrapper,
        {
          paddingTop: paddingTop ?? mscale(14),
          paddingBottom,
          marginBottom,
          marginTop,
        },
      ]}
    >
      <StyledText
        color={theme.colors.typography.gray10}
        fontFamily={"PoppinsMedium"}
        fontSize={13}
        lineHeight={13}
      >
        {label}
      </StyledText>
      <StyledText fontFamily={"PoppinsBold"} fontSize={13} lineHeight={13}>
        {value}
      </StyledText>
    </View>
  );
};

export const Card = (allProps: any) => {
  const { LeftHeader, RightHeader, children, ...props } = allProps;
  const RightHeaderCmp = RightHeader ?? <></>;
  return (
    <CardListView {...props}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {LeftHeader}
        {RightHeaderCmp}
      </View>
      {children ?? <></>}
    </CardListView>
  );
};
