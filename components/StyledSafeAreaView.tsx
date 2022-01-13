import styled from "styled-components/native";

import type { CSSProps } from "types";
import { SafeAreaView } from "react-native-safe-area-context";
import { compose, layout, space, border, color } from "styled-system";

export const StyledSafeAreaView = styled(SafeAreaView)`
  background-color: ${(props: CSSProps) => props.theme.colors.background2};

  ${compose(layout, space, border, color)};
`;

export default StyledSafeAreaView;
