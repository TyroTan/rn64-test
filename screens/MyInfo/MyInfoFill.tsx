import React, { useRef, useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Keyboard, View, Pressable } from "react-native";
import { format } from "date-fns";
import * as consts from "const";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import type { ParamListBase } from "@react-navigation/native";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledBox,
  StyledText,
  ButtonText,
  KeyboardAvoiding,
  StyledTextInputFieldGroup,
  DropdownPickerField,
  KeyboardAwareScrollView,
} from "components";
import useAuthStore from "stores/useAuthStore";
import { StyledScrollView } from "components";
import { useExtraDelay } from "hooks/useExtraDelay";
import { useNestedNavigatorStore, useUserStore } from "stores";
import { theme } from "styles/theme";
import {
  getSgVerifyIdentitySavedFormLocalDb,
  setSgVerifyIdentitySavedFormLocalDb,
} from "utils/async-storage-util";
import type { SgVerifyIdentity } from "utils/async-storage-util";
import { awaitableDelay } from "utils/js-utils";
import { nationalityOptions } from "const";
import { useFormField } from "hooks";
import CreditRoutes from "screens/Credit/CreditRoutes";

export enum MyInfoFillRoutes {
  MyInfoFillInitial = "MyInfoFillInitial",
  MyInfoFill1 = "MyInfoFill1",
  MyInfoFill2 = "MyInfoFill2",
  MyInfoFill3 = "MyInfoFill3",
  MyInfoFill4 = "MyInfoFill4",
  VerificationSuccess = "VerificationSuccess",
}
export interface MyInfoFillParamsList extends ParamListBase {
  [MyInfoFillRoutes.MyInfoFill1]: undefined;
  [MyInfoFillRoutes.MyInfoFill2]: {
    verifyIdentityLocalData: Partial<SgVerifyIdentity>;
  };
  [MyInfoFillRoutes.MyInfoFill3]: {
    verifyIdentityLocalData: Partial<SgVerifyIdentity>;
    isIOS: boolean;
  };
  [MyInfoFillRoutes.VerificationSuccess]: { onReturn: () => void };
}

type MyInfoFillProps = NativeStackScreenProps<
  MyInfoFillParamsList,
  MyInfoFillRoutes.MyInfoFill1
>;

const useMyInfoFillForm = ({
  user,
  verifyIdentityLocalData,
  onSubmit,
}: any) => {
  const refElFullname = React.createRef();
  const [validating, setValidating] = useState(false);
  const {
    nric = "",
    principal_name = "",
    sex = "",
    race = "",
    nationality = "",
    country_of_birth = "",
    date_of_birth = "",
    residential_status = "",
  } = verifyIdentityLocalData;

  const nricTestFn = (value: string) => user.NRIC_REGEX?.test(value);
  const nricField = useFormField(nric, {
    autoFocus: true,
    validator: nricTestFn,
    validatorErrorMsg: "Please provide a valid NRIC",
    label: "NRIC",
    labelRequiredSign: true,
    onSubmitEditing: () => (refElFullname as any)?.current?.focus(),
  });

  const fullnameField = useFormField(principal_name, {
    refEl: refElFullname,
    validator: (value: string) => value.length > 0,
    label: "Full Name",
    labelRequiredSign: true,
  });

  const sexField = useFormField(sex, {
    type: "select",
    label: "Sex",
    labelRequiredSign: true,
    items: consts.sexOptions,
    validator: (item: string) => item?.length > 0,
  });

  const raceField = useFormField(race, {
    type: "select",
    label: "Race",
    labelRequiredSign: true,
    items: consts.raceOptions,
    validator: (item: string) => item?.length > 0,
  });

  const nationalityField = useFormField(nationality, {
    type: "select",
    label: "Nationality",
    labelRequiredSign: true,
    items: consts.nationalityOptions,
    validator: (item: string) => item?.length > 0,
  });

  const countryOfBirthField = useFormField(country_of_birth, {
    type: "select",
    label: "Country of Birth",
    labelRequiredSign: true,
    items: consts.countryOfBirthOptions,
    validator: (item: string) => item?.length > 0,
  });

  const dateBirthField = useFormField(date_of_birth, {
    label: "Date of Birth",
    labelRequiredSign: true,
    validator: (item: string) => item?.length > 0,
  });

  const residentialStatusField = useFormField(residential_status, {
    type: "select",
    label: "Residential Status",
    labelRequiredSign: true,
    items: consts.residentialStatusOptions,
    validator: (item: string) => item?.length > 0,
  });

  /* Start: Common fields: isFormValid, values, watchables etc */

  const { value: nricValue, validated: nricValidated } = nricField;
  const { value: fullnameValue, validated: fullnameValidated } = fullnameField;
  const { value: sexValue, validated: sexValidated } = sexField;
  const { value: raceValue, validated: raceValidated } = raceField;
  const { value: nationalityValue, validated: nationalityValidated } =
    nationalityField;
  const { value: countryOfBirthValue, validated: countryOfBirthValidated } =
    countryOfBirthField;

  const { value: dateBirthValue, validated: dateBirthValidated } =
    dateBirthField;
  const {
    value: residentialStatusValue,
    validated: residentialStatusValidated,
  } = residentialStatusField;

  const watchableValues = [
    nricValue,
    fullnameValue,
    sexValue,
    raceValue,
    nationalityValue,
    countryOfBirthValue,
    dateBirthValue,
    residentialStatusValue,
  ];

  const values: Partial<SgVerifyIdentity> = {
    nric: nricValue,
    principal_name: fullnameValue,
    sex: sexValue,
    race: raceValue,
    nationality: nationalityValue,
    country_of_birth: countryOfBirthValue,
    date_of_birth: dateBirthValue,
    residential_status: residentialStatusValue,
  };

  const isFormValid: boolean =
    nricValidated.isValid &&
    fullnameValue &&
    sexValue &&
    raceValue &&
    nationalityValue &&
    countryOfBirthValue &&
    dateBirthValue &&
    residentialStatusValue;

  const onFormValidate = (): void =>
    nricField.onValidate() &&
    fullnameField.onValidate() &&
    sexField.onValidate() &&
    raceField.onValidate() &&
    nationalityField.onValidate() &&
    dateBirthField.onValidate() &&
    residentialStatusField.onValidate();

  const onValidateSubmit = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      onFormValidate();
      setSgVerifyIdentitySavedFormLocalDb(values);
      setValidating(true);
    }, 0);
  };

  // *Events - triggers form submit when form validation = valid

  useEffect(() => {
    if (validating) {
      if (isFormValid) {
        onSubmit();
      }
      setValidating(false);
    }
  }, [validating, isFormValid]);

  /* End: Common fields: isFormValid, values, watchables etc */

  return {
    onValidateSubmit,
    isFormValid,
    values,
    watchableValues,
    validating,
    nricField,
    fullnameField,
    sexField,
    raceField,
    nationalityField,
    countryOfBirthField,
    residentialStatusField,
    dateBirthField,
  };
};

// route params can't be used, use (useNestedNavigatorStore) instead to receive navigation params
const MyInfoFill: React.FC<MyInfoFillProps> = ({ route, navigation }) => {
  const {
    response: { user, platform },
  } = useUserStore();
  const {
    response: { fromMyInfoIntro },
  } = useNestedNavigatorStore();

  const { verifyIdentityLocalData = {}, isInitial } = (fromMyInfoIntro ??
    {}) as {
    isInitial: boolean;
    verifyIdentityLocalData: Partial<SgVerifyIdentity>;
  };

  // *Methods

  const onSubmit = () => {
    navigation.navigate(MyInfoFillRoutes.MyInfoFill2, {
      verifyIdentityLocalData,
    });
  };

  // *Effects

  const {
    isFormValid,
    onValidateSubmit,
    watchableValues,
    validating,
    nricField,
    values,
    fullnameField,
    sexField,
    raceField,
    nationalityField,
    countryOfBirthField,
    dateBirthField,
    residentialStatusField,
  } = useMyInfoFillForm({
    user,
    verifyIdentityLocalData,
    onSubmit,
  });

  // *Events

  const refDiskWriteController = React.useRef(null);
  useEffect(() => {
    if (refDiskWriteController.current === null) {
      (refDiskWriteController as any).current = setTimeout(() => {
        setSgVerifyIdentitySavedFormLocalDb(values);
        refDiskWriteController.current = null;
      }, 120);
    }
  }, watchableValues);

  const { isIOS } = platform ?? {};

  // *Methods

  const onPrevious = () => {
    navigation.goBack();
  };

  // *Effects

  const statusBarHeight = getStatusBarHeight(Device);

  const [openDateBirth, setOpenDateBirth] = useState(false);

  // *Component

  const RenderDatePicker = () => (
    <>
      {isIOS && (
        <StyledBox variant="buttonText" width="88%">
          <StyledText variant="label" labelRequiredSign>
            {dateBirthField.label}
          </StyledText>

          <Pressable
            onPress={() =>
              navigation.navigate(
                isInitial
                  ? "ModalIOSDateBirthPickerForInitial"
                  : "ModalIOSDateBirthPicker",
                { dateBirthField }
              )
            }
          >
            <StyledBox
              variant={
                !dateBirthField.validated.isValid &&
                dateBirthField.validated?.msg
                  ? "failure"
                  : "pickerField"
              }
              height={mscale(55)}
              borderWidth={1}
              borderRadius={mscale(8)}
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
              children={
                <StyledText variant="textField">
                  {dateBirthField?.value?.toString() ?? ""}
                </StyledText>
              }
            />
          </Pressable>
          <StyledText
            marginLeft={5}
            marginBottom={2}
            fontSize={10}
            lineHeight={14}
            height={mscale(14)}
            variant={
              !dateBirthField.validated.isValid && dateBirthField.validated?.msg
                ? "failure"
                : ""
            }
            children={
              (!dateBirthField.validated.isValid &&
                dateBirthField.validated?.msg) ??
              ""
            }
          />
        </StyledBox>
      )}
      {!isIOS && (
        <StyledBox variant="buttonText" width="88%">
          <StyledText variant="label" labelRequiredSign>
            {dateBirthField.label}
          </StyledText>

          <Pressable onPress={() => setOpenDateBirth(true)}>
            <StyledBox
              variant={
                !dateBirthField.validated.isValid &&
                dateBirthField.validated?.msg
                  ? "failure"
                  : "pickerField"
              }
              height={mscale(55)}
              borderWidth={1}
              borderRadius={mscale(8)}
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
              children={
                <StyledText variant="textField">
                  {dateBirthField?.value?.toString() ?? ""}
                </StyledText>
              }
            />
            {openDateBirth && (
              <DateTimePicker
                maximumDate={new Date()}
                testID="dateTimePicker"
                value={
                  dateBirthField?.value
                    ? new Date(dateBirthField?.value)
                    : new Date("1970-01-01")
                }
                mode={"date"}
                // is24Hour={true}
                display="calendar"
                onChange={(event, selectedDate) => {
                  setOpenDateBirth(false);
                  dateBirthField.onChangeText(
                    format(selectedDate as Date, "yyyy-MM-dd")
                  );
                }}
              />
            )}
          </Pressable>
          <StyledText
            marginLeft={5}
            marginBottom={2}
            fontSize={10}
            lineHeight={14}
            height={mscale(14)}
            variant={
              !dateBirthField.validated.isValid && dateBirthField.validated?.msg
                ? "failure"
                : ""
            }
            children={
              (!dateBirthField.validated.isValid &&
                dateBirthField.validated?.msg) ??
              ""
            }
          />
        </StyledBox>
      )}
    </>
  );

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{
        // flexDirection: "column",
        // alignItems: "stretch",
        // justifyContent: "center",
        paddingTop: isIOS ? 0 : mscale(20),
        paddingBottom: isIOS ? mscale(20) : 0,
      }}
    >
      {/* <KeyboardAvoiding
      isIOS={isIOS}
      keyboardVerticalOffset={isIOS ? mscale(30) : 0}
      contentStyle={{
        marginVertical: mscale(5),
        paddingBottom: isIOS ? mscale(20) : 0,
      }}
    > 
      <StyledScrollView
        contentContainerStyle={{
          marginBottom: isIOS ? mscale(50) : mscale(10),
        }}
      >*/}
      <View
        style={{
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StyledTextInputFieldGroup
          boxProps={{ marginBottom: 5 }}
          {...nricField}
        />
        <StyledTextInputFieldGroup
          boxProps={{ marginBottom: 5 }}
          {...fullnameField}
        />
        <DropdownPickerField marginBottom={5} {...sexField} />
        <DropdownPickerField marginBottom={5} {...raceField} />
        <DropdownPickerField marginBottom={5} {...nationalityField} />
        <DropdownPickerField marginBottom={5} {...countryOfBirthField} />
        <RenderDatePicker />
        <DropdownPickerField marginBottom={5} {...residentialStatusField} />
      </View>
      {/* </StyledScrollView> */}
      <StyledBox
        width="88%"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        alignSelf="center"
        marginBottom={10}
      >
        <ButtonText
          children="previous"
          variant="primaryInverted"
          width="47%"
          disabled={validating}
          onPress={onPrevious}
        />
        <ButtonText
          children="next"
          width="47%"
          loading={validating}
          onPress={onValidateSubmit}
          disabled={!isFormValid || validating}
          variant={!isFormValid ? "opacity7" : "primary"}
        />
      </StyledBox>
    </KeyboardAwareScrollView>
  );
};

export default MyInfoFill;
