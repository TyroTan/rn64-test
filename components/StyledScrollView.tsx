import styled from "styled-components/native";
import { border, compose, layout, flexbox, space } from "styled-system";
import type { CSSProps } from "types";

export const StyledScrollView = styled.ScrollView`
  background-color: ${(props: any) =>
    props?.backgroundColor ?? props.theme.colors.background2};
  ${compose(border, space, layout, flexbox)};
`;

StyledScrollView.defaultProps = {
  variant: "normal",
};

export default StyledScrollView;
