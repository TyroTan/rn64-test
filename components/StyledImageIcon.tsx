import type { StyledProps } from "styled-components";
import styled from "styled-components/native";
import { mscale } from "utils/scales-util";

type ScaledImageIconProps = StyledProps<{
  size: number;
}>;

export const ScaledImageIcon = styled.Image`
  width: ${(props: ScaledImageIconProps) => mscale(props.size)}px;
  height: ${(props: ScaledImageIconProps) => mscale(props.size)}px;
`;

export default ScaledImageIcon;
