import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { StyledBox, StyledText } from "components";
import { mscale } from "utils/scales-util";

const styles = StyleSheet.create({
  btn: {
    padding: mscale(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

const Btn = (props: any) => {
  const { monthName, onPress } = props;

  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <StyledText
        fontSize={14}
        lineHeight={14}
        textAlignVertical="center"
        alignItems="center"
        textVerticalAlign="center"
      >
        {monthName.slice(0, 3)}
      </StyledText>
    </TouchableOpacity>
  );
};

const RenderMonthsBtn = (allProps: any) => {
  const { onSelect, ...wrapperProps } = allProps;

  return (
    <StyledBox
      flex={1}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      {...wrapperProps}
    >
      <StyledBox
        border
        width="100%"
        variant="flexcr"
        justifyContent="space-between"
      >
        <Btn monthName="January" onPress={() => onSelect(0)}>
          January
        </Btn>
        <Btn monthName="February" onPress={() => onSelect(1)}>
          February
        </Btn>
        <Btn monthName="March" onPress={() => onSelect(2)}>
          March
        </Btn>
      </StyledBox>

      <StyledBox
        border
        width="100%"
        variant="flexcr"
        justifyContent="space-between"
      >
        <Btn monthName="April" onPress={() => onSelect(3)}>
          April
        </Btn>
        <Btn monthName="May" onPress={() => onSelect(4)}>
          May
        </Btn>
        <Btn monthName="June" onPress={() => onSelect(5)}>
          June
        </Btn>
      </StyledBox>

      <StyledBox
        border
        width="100%"
        variant="flexcr"
        justifyContent="space-between"
      >
        <Btn monthName="July" onPress={() => onSelect(6)}>
          July
        </Btn>
        <Btn monthName="August" onPress={() => onSelect(7)}>
          August
        </Btn>
        <Btn monthName="September" onPress={() => onSelect(8)}>
          September
        </Btn>
      </StyledBox>

      <StyledBox
        border
        width="100%"
        variant="flexcr"
        justifyContent="space-between"
      >
        <Btn monthName="October" onPress={() => onSelect(9)}>
          October
        </Btn>
        <Btn monthName="November" onPress={() => onSelect(10)}>
          November
        </Btn>
        <Btn monthName="December" onPress={() => onSelect(11)}>
          December
        </Btn>
      </StyledBox>
    </StyledBox>
  );
};

export default RenderMonthsBtn;
