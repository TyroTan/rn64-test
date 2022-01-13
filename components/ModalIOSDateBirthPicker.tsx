import React, { useState } from "react";
import { View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StyledBox } from "components/StyledBoxes";
import { ButtonText } from "components/StyledButtons";
import { format } from "date-fns";
import { hexToRGB } from "utils/hex-util";

const ModalIOSDateBirthPicker = (props: any) => {
  const { route, navigation } = props;
  const { dateBirthField } = route?.params ?? {};
  const [selected, setSelected] = useState(
    dateBirthField?.value
      ? new Date(dateBirthField?.value)
      : new Date("1970-01-01")
  );

  // *Methods
  const onGoBack = () => navigation.goBack();
  const onSelect = () => {
    dateBirthField.onChangeText(format(selected, "yyyy-MM-dd"));
    onGoBack();
  };
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "flex-end",
        height: "100%",
        backgroundColor: hexToRGB("#4F4F4F", 0.28),
      }}
    >
      <View
        style={{
          height: 300,
          backgroundColor: "#FFF",
        }}
      >
        <DateTimePicker
          style={{ height: 216 }}
          maximumDate={new Date()}
          testID="dateTimePicker"
          value={selected}
          mode="date"
          display="spinner"
          onChange={(event: any, selectedDate?: Date) => {
            setSelected(selectedDate as Date);
          }}
        />

        <StyledBox
          width="88%"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          alignSelf="center"
        >
          <ButtonText
            children="cancel"
            variant="primaryInverted"
            width="47%"
            onPress={onGoBack}
          />
          <ButtonText children="select" width="47%" onPress={onSelect} />
        </StyledBox>
      </View>
    </View>
  );
};

export default ModalIOSDateBirthPicker;
