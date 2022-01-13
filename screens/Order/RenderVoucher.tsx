import React, { useEffect, useRef, useState } from "react";
import { OnboardingRequired, StyledBox, StyledText } from "components";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNestedNavigatorStore, useUserStore } from "stores";
import { mscale } from "utils/scales-util";
import { theme } from "styles/theme";

const imgVoucher = require("assets/images/icon-voucher.png");

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: mscale(10),
    paddingVertical: mscale(6),
    borderWidth: mscale(1),
    borderColor: theme.colors.progressbar.barGreen1,
    borderRadius: mscale(20),
    minWidth: mscale(128),
  },
  iconLeft: {
    // margin: mscale(3),
    marginRight: mscale(10),
    width: mscale(26),
    height: mscale(26),
  },
});

const RenderVoucher = ({
  navigation,
  order,
}: {
  navigation: any;
  order: any;
}) => {
  const { vouchers = [] } = order ?? {};

  return (
    <TouchableOpacity style={styles.btn}>
      <Image source={imgVoucher} resizeMode="contain" style={styles.iconLeft} />
      <StyledText variant="titleTertiary">
        {vouchers?.[vouchers.length - 1]?.code}
      </StyledText>
    </TouchableOpacity>
  );
};

export default RenderVoucher;
