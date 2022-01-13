import React from "react";
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
import { theme } from "styles/theme";
import type { CSSProps } from "types";
import { mscale } from "utils/scales-util";

export const StyledBox = styled.View`
  background-color: ${(props: CSSProps) => props.theme.colors.background2};

  ${variant({
    variants: {
      flexcr: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },
      pickerField: {
        borderColor: theme.colors.typography.gray5,
      },
      failure: {
        borderColor: theme.colors.actions.failureRed,
      },
    },
  })};

  ${compose(border, space, layout, flexbox, color)};
`;

StyledBox.defaultProps = {
  variant: "normal",
};

export default StyledBox;
