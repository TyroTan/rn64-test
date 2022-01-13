import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  createRef,
} from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { View, Pressable } from "react-native";
import { format } from "date-fns";
import * as consts from "const";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { getStatusBarHeight, mscale } from "utils/scales-util";
import {
  StyledBox,
  StyledText,
  ButtonText,
  KeyboardAwareScrollView,
  StyledTextInputFieldGroup,
  DropdownPickerField,
} from "components";
import useAuthStore from "stores/useAuthStore";
import { StyledScrollView } from "components";
import { useExtraDelay } from "hooks/useExtraDelay";
import { useUserStore } from "stores";
import { theme } from "styles/theme";
import { EMAIL_REGEX } from "const";
import type { UserSession } from "stores/useUserStore";
import { MyInfoFillRoutes, MyInfoFillParamsList } from "./MyInfoFill";
import { useFormField } from "hooks";
import {
  setSgVerifyIdentitySavedFormLocalDb,
  SgVerifyIdentity,
} from "utils/async-storage-util";

type MyInfoFill2Props = NativeStackScreenProps<
  MyInfoFillParamsList,
  MyInfoFillRoutes.MyInfoFill2
>;

const useMyInfoFill2Form = (props: any) => {
  // const refElFloor = createRef();
  const { verifyIdentityLocalData = {}, POSTAL_REGEX, onSubmit } = props ?? {};
  const [validating, setValidating] = useState(false);
  const {
    email = "",
    type_of_hdb = "",
    type = "",
    registered_address_floor = "",
    registered_address_unit = "",
    registered_address_block = "",
    registered_address_building = "",
    registered_address_street = "",
    registered_address_postal = "",
  } = verifyIdentityLocalData as SgVerifyIdentity;

  // todo - saved copy...
  const emailTestFn = (value: string) => EMAIL_REGEX.test(value);
  const emailField = useFormField(email, {
    autoFocus: true,
    validator: emailTestFn,
    validatorErrorMsg: "Please provide a valid Email",
    label: "Email",
    labelRequiredSign: true,
    keyboardType: "email-address",
  });

  const hdbTypeField = useFormField(type_of_hdb, {
    type: "select",
    label: "HDB Type",
    items: consts.typeOfHDBOptions,
    labelRequiredSign: true,
    validator: (item: string) => item?.length > 0,
  });

  const homeOwnershipField = useFormField((type ?? "") as any, {
    type: "select",
    label: "Home Ownership",
    items: consts.homeOwnershipOptions,
    labelRequiredSign: true,
    validator: (item: string) => item?.length > 0,
  });

  const floorField = useFormField(registered_address_floor, {
    validator: () => true,
    label: "Floor",
  });

  const unitField = useFormField(registered_address_unit, {
    validator: (value: string) => value?.length > 0,
    labelRequiredSign: true,
    label: "Unit",
  });

  const blockField = useFormField(registered_address_block, {
    label: "Block",
  });

  const buildingField = useFormField(registered_address_building, {
    label: "Building",
  });

  const streetField = useFormField(registered_address_street, {
    validator: (value: string) => value?.length > 0,
    labelRequiredSign: true,
    label: "Street",
  });

  const postalField = useFormField(registered_address_postal, {
    validator: (value: string) => POSTAL_REGEX?.test(value),
    validatorErrorMsg: "Please provide a valid postal code",
    labelRequiredSign: true,
    label: "Postal",
  });

  /* Start: Common fields: isFormValid, values, watchables etc */

  const { value: emailValue, validated: emailValidated } = emailField;
  const { value: hdbTypeValue, validated: hdbTypeValidated } = hdbTypeField;
  const { value: homeOwnershipValue, validated: homeOwnershipValidated } =
    homeOwnershipField;
  const { value: floorValue, validated: floorValidated } = floorField;
  const { value: unitValue, validated: unitValidated } = unitField;
  const { value: blockValue, validated: blockValidated } = blockField;
  const { value: buildingValue, validated: buildingValidated } = buildingField;
  const { value: streetValue, validated: streetValidated } = streetField;
  const { value: postalValue, validated: postalValidated } = postalField;

  const watchableValues = [
    emailValue,
    hdbTypeValue,
    homeOwnershipValue,
    floorValue,
    unitValue,
    blockValue,
    buildingValue,
    streetValue,
    postalValue,
  ];

  const values: Partial<SgVerifyIdentity> = {
    email: emailValue,
    type_of_hdb: hdbTypeValue,
    type: homeOwnershipValue,
    registered_address_floor: floorValue,
    registered_address_unit: unitValue,
    registered_address_block: blockValue,
    registered_address_building: buildingValue,
    registered_address_street: streetValue,
    registered_address_postal: postalValue,
  };

  const isFormValid: boolean =
    emailValidated.isValid &&
    homeOwnershipValue &&
    unitValue &&
    streetValue &&
    postalValue &&
    postalValidated.isValid;

  const onFormValidate = (): void =>
    emailField.onValidate() &&
    homeOwnershipField.onValidate() &&
    unitField.onValidate() &&
    streetField.onValidate() &&
    postalField.onValidate();

  const onValidateSubmit = () => {
    setValidating(true);
    onFormValidate();
    setSgVerifyIdentitySavedFormLocalDb(values);
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
    validating,
    values,
    watchableValues,
    emailField,
    hdbTypeField,
    homeOwnershipField,
    floorField,
    unitField,
    blockField,
    buildingField,
    streetField,
    postalField,
  };
};

const FormResidentialAddress: React.FC<any> = (props) => {
  const {
    floorField,
    unitField,
    blockField,
    buildingField,
    streetField,
    postalField,
  } = props;

  return (
    <>
      <StyledBox width="89%" mt={4} mb={2}>
        <StyledText variant="title" fontSize={16} textAlign="left">
          Residential Address
        </StyledText>
      </StyledBox>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "89%",
        }}
      >
        <StyledTextInputFieldGroup
          boxProps={{ marginBottom: 5, width: "47%" }}
          {...floorField}
        />
        <StyledTextInputFieldGroup
          boxProps={{ marginBottom: 5, width: "47%" }}
          {...unitField}
        />
      </View>
      <StyledTextInputFieldGroup
        boxProps={{ marginBottom: 5 }}
        {...blockField}
      />
      <StyledTextInputFieldGroup
        boxProps={{ marginBottom: 5 }}
        {...buildingField}
      />
      <StyledTextInputFieldGroup
        boxProps={{ marginBottom: 5 }}
        {...streetField}
      />
      <StyledTextInputFieldGroup
        boxProps={{ marginBottom: 5 }}
        {...postalField}
      />
    </>
  );
};

const MyInfoFill2: React.FC<MyInfoFill2Props> = ({ route, navigation }) => {
  const { params } = route;
  const { response } = useUserStore();
  const { user, platform } = response as { user: UserSession; platform: any };
  const { isIOS } = platform ?? {};

  // *Methods

  const onSubmit = () => {
    // fullnameField.validate();
    // setSendingDummy((prev) => ++prev);
    // submitMobile(countryDialingCode, value?.replace(/[^0-9]/g, ""));

    navigation.navigate(MyInfoFillRoutes.MyInfoFill3, {
      verifyIdentityLocalData: params.verifyIdentityLocalData,
      isIOS,
    });
  };

  const {
    isFormValid,
    validating,
    onValidateSubmit,
    watchableValues,
    values,
    emailField,
    hdbTypeField,
    homeOwnershipField,
    floorField,
    unitField,
    blockField,
    buildingField,
    streetField,
    postalField,
  } = useMyInfoFill2Form({
    onSubmit,
    verifyIdentityLocalData: params.verifyIdentityLocalData,
    POSTAL_REGEX: user?.POSTAL_REGEX,
  });
  const {
    isLoading: { otpSend: otpSendIsLoading },
  } = useAuthStore();
  const [sendingDummy, setSendingDummy] = useState(0);

  const refScroll = useRef(null);

  // *Methods

  const onPrevious = () => {
    // submitMobile(countryDialingCode, value?.replace(/[^0-9]/g, ""));
    navigation.goBack();
  };

  // useEffect(() => {
  //   (refScroll as any)?.current?.scrollTo({ x: 0, y: 0, animated: true });
  // }, [sendingDummy]);

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

  const statusBarHeight = getStatusBarHeight(Device);
  const hasNotch = statusBarHeight > 20;

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
          {...emailField}
        />
        <StyledTextInputFieldGroup
          label="Mobile Number"
          boxProps={{ marginBottom: 5 }}
          editable={false}
          color={theme.colors.lockGray}
          value={user.data?.full_mobile_number ?? ""}
        />
        <DropdownPickerField marginBottom={5} {...hdbTypeField} />
        <DropdownPickerField marginBottom={5} {...homeOwnershipField} />

        <FormResidentialAddress
          isFormValid={isFormValid}
          floorField={floorField}
          unitField={unitField}
          blockField={blockField}
          buildingField={buildingField}
          streetField={streetField}
          postalField={postalField}
          scrollToTop={sendingDummy}
        />
      </View>
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
          onPress={onPrevious}
          disabled={validating}
        />
        <ButtonText
          children="next"
          width="47%"
          // statusBarHeight={statusBarHeight}
          onPress={onValidateSubmit}
          loading={validating}
          disabled={!isFormValid || validating}
          variant={!isFormValid ? "opacity7" : "primary"}
          // hasNotch={hasNotch}
          // buttonPropsOptions={{
          //   marginBottom: mbKeyboardShown,
          // }}
        />
      </StyledBox>
    </KeyboardAwareScrollView>
  );
};

export default MyInfoFill2;
