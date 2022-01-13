import React, { useEffect, useState } from "react";
import PickerSelect from "react-native-picker-select";
import { StyledBox } from "./StyledBoxes";
import { StyledText } from "./StyledTexts";
import { theme } from "styles/theme";
import { Platform, StyleSheet } from "react-native";
import { mscale } from "utils/scales-util";
import Layout from "constants/Layout";
import { backgroundColor } from "styled-system";

interface DropdownPicker {
  label: string;
  items: { label: string; value: string }[];
  marginBottom: number;
  onSelect?: any;
  onPress?: any;
}

interface DropdownPickerAndroidProps extends DropdownPickerFieldProps {
  items: DropdownPicker["items"];
  required?: boolean;
  onSelect: (selected: string) => void;
  value?: string;
  backgroundColor?: string;
}

export const DropdownPickerAndroid = (props: DropdownPickerAndroidProps) => {
  const { label, items, onSelect, validated, value } = props;
  const errorMessage = !validated?.isValid && validated?.msg;

  const [focusedItem, setFocusedItem] = useState("");
  const onButtonSelect = React.useCallback(() => {
    onSelect(focusedItem as string);
  }, [focusedItem]);

  React.useEffect(() => {
    if (items?.length) {
      onButtonSelect();
    }
  }, [items, focusedItem, onButtonSelect]);

  const onValueChange = (value: any) => {
    setFocusedItem(value);
  };

  useEffect(() => {
    setTimeout(() => {
      if (value) {
        onValueChange(value);
      }
    }, 60);
  }, []);

  return (
    <StyledBox
      width="89%"
      marginBottom={5}
      backgroundColor={props.backgroundColor || "transparent"}
    >
      <StyledText variant="label" labelRequiredSign>
        {label}
      </StyledText>
      <PickerSelect
        value={value}
        style={{
          viewContainer: {
            borderWidth: 1,
            alignSelf: "center",
            width: "100%",
            borderRadius: mscale(8),
            borderColor: theme.colors.typography.gray5,
            backgroundColor: "white",
          },
          inputAndroid: {
            fontSize: mscale(12),
            lineHeight: mscale(17),
            fontFamily: "PoppinsSemiBold",
            color: theme.colors.typography.main,
            letterSpacing: 0,
            textAlign: "center",
          },
        }}
        onValueChange={onValueChange}
        items={items}
      />
      <StyledText
        marginLeft={2}
        fontSize={10}
        lineHeight={14}
        height={mscale(14)}
        variant={!errorMessage ? "" : "failure"}
        children={!errorMessage ? "" : errorMessage}
      />
    </StyledBox>
  );
};

const stylesIOS = StyleSheet.create({
  pickerViewContainer: {
    flex: 1,
    height: mscale(50),
    textAlignVertical: "center",
    borderWidth: 1,
    width: "100%",
    alignSelf: "center",
    borderRadius: mscale(8),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: theme.colors.typography.gray5,
    backgroundColor: theme.colors.background2,
  },
  pickerInputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: Layout.window.width * 0.88,
    alignSelf: "center",
    paddingLeft: mscale(15),
  },
  pickerInput: {
    fontFamily: "PoppinsBold",
    fontSize: mscale(14),
  },
  pickerPlaceholder: {
    fontFamily: "PoppinsBold",
    fontSize: mscale(12),
  },
  modalViewBottom: {
    backgroundColor: theme.colors.faintGray,
  },
});

interface DropdownPickerFieldProps {
  items: any[];
  label: string;
  labelRequiredSign?: boolean;
  marginBottom?: number;
  onPress?: (value: any) => void;
  valueDisplay?: string;
  validated?: any;
  value?: string;
  onSelect?: (value: string) => void;
  backgroundColor?: string;
}

export const DropdownPickerField = (props: DropdownPickerFieldProps) => {
  const {
    label,
    value,
    marginBottom,
    validated,
    items,
    onSelect,
    backgroundColor,
  } = props;

  const errorMessage = !validated?.isValid && validated?.msg;

  const isAndroid = Platform.OS === "ios" ? false : true;
  if (isAndroid) {
    return <DropdownPickerAndroid {...(props as any)} />;
  } else {
    const onValueChange = (value: any) => {
      onSelect?.(value);
    };
    return (
      <StyledBox
        variant="failure"
        width="88%"
        marginBottom={marginBottom}
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        backgroundColor={backgroundColor}
      >
        <StyledText variant="label" labelRequiredSign>
          {label}
        </StyledText>
        <PickerSelect
          InputAccessoryView={() => null}
          style={{
            viewContainer: stylesIOS.pickerViewContainer,
            inputIOSContainer: stylesIOS.pickerInputContainer,
            inputIOS: stylesIOS.pickerInput,
            placeholder: stylesIOS.pickerPlaceholder,
            modalViewBottom: stylesIOS.modalViewBottom,
          }}
          value={value}
          onValueChange={onValueChange}
          items={items}
        />
        <StyledText
          marginLeft={2}
          fontSize={10}
          lineHeight={14}
          height={mscale(14)}
          variant={!errorMessage ? "" : "failure"}
          children={!errorMessage ? "" : errorMessage}
        />
      </StyledBox>
    );
  }
};

export default DropdownPicker;
