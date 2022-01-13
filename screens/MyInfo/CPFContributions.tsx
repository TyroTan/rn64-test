import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  createRef,
} from "react";
import Collapsible from "react-native-collapsible";
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  TextProps,
  Pressable,
} from "react-native";
import MonthPicker from "react-native-month-year-picker";
import { mscale } from "utils/scales-util";
import {
  StyledBox,
  ButtonText,
  StyledText,
  StyledTextInputFieldGroup,
} from "components";
import Layout from "constants/Layout";
import { format } from "date-fns";
import { setDate } from "date-fns/esm";
import { useFormField } from "hooks";
import { withInputMask2Decimal } from "utils/js-utils";

const chevronRight = require("assets/images/chevron-right-black.png");
const chevronDown = require("assets/images/chevron-down-black.png");

const styles = StyleSheet.create({
  wrapper: {},
  headerWrapperBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: mscale(5),
    marginBottom: mscale(25),
  },
  imgRight: {
    padding: mscale(3),
    width: mscale(10),
    height: mscale(10),
  },
  imgDown: {
    padding: mscale(3),
    width: mscale(10),
    height: mscale(10),
  },
});

export interface FormCPFBalancesDataItem {
  yearMonth?: string;
  employer?: string;
  amount?: number;
}

export type FormCPFBalancesData = FormCPFBalancesDataItem[];

const getDisplayDate = (yearMonth: any) =>
  yearMonth ? format(yearMonth as any, "yyyy-MM") : "";

export const CPFFormItem = (props: any) => {
  const { index, defaultValue, onRemoveContribution, onChangeFormData, isIOS } =
    props;
  const refEmployer = createRef();
  const refAmount = createRef();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [yearMonth, setYearMonth] = useState<Date | undefined>(
    defaultValue?.yearMonth ? new Date(defaultValue.yearMonth) : undefined
  );

  const employerField = useFormField(defaultValue?.employer ?? "", {
    refEl: refEmployer,
    label: "Employer",
    labelRequiredSign: true,
    // blurOnSubmit={false}
    onSubmitEditing: () => (refAmount?.current as any)?.focus(),

    // TODO don't use value
    // noValueAndUseDefaultValue: true,
    // onChangeText":"onChangeEmployer}
  });

  const amountField = useFormField(defaultValue.amount, {
    refEl: refAmount,
    label: "Amount",
    labelRequiredSign: true,
    keyboardType: "numeric",

    // TODO don't use value
    // noValueAndUseDefaultValue: true,
  });
  const amountFieldWithInputMask = withInputMask2Decimal(amountField);

  const employer = employerField.value;
  const amount = amountField.value;

  const onChangeDate = (event: any, newDate: Date) => {
    setShowDatePicker(false);
    setYearMonth(newDate);
  };

  // *Effects
  useEffect(() => {
    onChangeFormData(index, yearMonth, employer, amount);
  }, [index, yearMonth, employer, amount]);

  // *Events - didmount
  useEffect(() => {
    if (!isIOS) {
      // setTimeout(() => {
      //   setYearMonth(
      //     defaultValue?.yearMonth
      //       ? new Date(defaultValue?.yearMonth)
      //       : undefined
      //   );
      //   employerField.onChangeText(defaultValue?.employer);
      //   amountField.onChangeText(defaultValue?.amount);
      // }, 120);
      // return;
    }

    setYearMonth(
      defaultValue?.yearMonth ? new Date(defaultValue?.yearMonth) : undefined
    );
    employerField.onChangeText(defaultValue?.employer);
    amountField.onChangeText(defaultValue?.amount);
  }, [defaultValue]);

  return (
    <View key={index} style={[styles.wrapper, isCollapsed ? {} : {}]}>
      {showDatePicker && (
        <MonthPicker
          onChange={onChangeDate}
          value={yearMonth ?? new Date()}
          maximumDate={new Date()}
        />
      )}

      <TouchableOpacity
        style={styles.headerWrapperBtn}
        onPress={() => setIsCollapsed((prev) => !prev)}
      >
        <Image
          source={isCollapsed ? chevronRight : chevronDown}
          resizeMode="contain"
          style={isCollapsed ? styles.imgRight : styles.imgDown}
        />
        <StyledText fontSize={13} lineHeight={13} ml={2}>
          {getDisplayDate(yearMonth)}
        </StyledText>
      </TouchableOpacity>
      <Collapsible
        style={{
          width: Layout.window.width * 0.9,
          height: mscale(320),
          borderLeftWidth: 5,
          padding: mscale(2),
          paddingLeft: mscale(10),
          borderLeftColor: "gray",
        }}
        collapsed={isCollapsed}
      >
        <StyledText variant="label" labelRequiredSign>
          Contribution Month
        </StyledText>
        <Pressable
          onPress={() => {
            setShowDatePicker(true);
          }}
        >
          <StyledBox
            variant={"pickerField"}
            height={mscale(55)}
            borderWidth={1}
            borderRadius={mscale(8)}
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
            children={
              <StyledText variant="textField">
                {getDisplayDate(yearMonth)}
              </StyledText>
            }
          />
        </Pressable>
        <StyledTextInputFieldGroup
          boxProps={{ width: "100%", marginTop: mscale(15) }}
          {...employerField}
        />
        <StyledTextInputFieldGroup
          boxProps={{ width: "100%", marginTop: mscale(15) }}
          {...amountFieldWithInputMask}
        />
        {/* <StyledTextInputFieldGroup
          refEl={refAmount as any}
          label="Amount"
          labelRequiredSign
          // blurOnSubmit={false}
          defaultValue={amount?.toString() ?? ""}
          onChangeText={(text: string) => {
            onChangeAmount(Number(text));
          }}
          keyboardType="number-pad"
          boxProps={{ width: "100%" }}
        /> */}
        <ButtonText
          children={"REMOVE"}
          onPress={() => onRemoveContribution(index)}
        />
      </Collapsible>
    </View>
  );
};
