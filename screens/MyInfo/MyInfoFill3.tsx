import React, { useRef, createRef, useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { View, Pressable, Platform } from "react-native";
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
  KeyboardAwareScrollView,
  StyledTextInputFieldGroup,
  DropdownPickerField,
  StyledMainButton,
} from "components";
import { StyledScrollView } from "components";
import { useExtraDelay } from "hooks/useExtraDelay";
import { useBuyerStore, useNestedNavigatorStore, useUserStore } from "stores";
import { theme } from "styles/theme";
import { EMAIL_REGEX } from "const";

import {
  MyInfoFillRoutes,
  MyInfoFillParamsList,
} from "screens/MyInfo/MyInfoFill";
import { useFormField } from "hooks";
import { CPFFormItem } from "screens/MyInfo/CPFContributions";
import type {
  FormCPFBalancesData,
  FormCPFBalancesDataItem,
} from "screens/MyInfo/CPFContributions";
import {
  getSgVerifyIdentitySavedFormLocalDb,
  setSgVerifyIdentitySavedFormLocalDb,
  SgVerifyIdentityFromLocalDB,
} from "utils/async-storage-util";
import type { SgVerifyIdentity } from "utils/async-storage-util";
import {
  textInputMask2Decimal,
  transformPostSGPersonalData,
  withInputMask2Decimal,
} from "utils/js-utils";
import globalObjectLastActionState from "utils/global-object-last-action";

type MyInfoFill3Props = NativeStackScreenProps<
  MyInfoFillParamsList,
  MyInfoFillRoutes.MyInfoFill3
>;

const useMyInfoFill3Form = (props: any) => {
  // !DEBUG start

  const {
    response: { fromMyInfoIntro },
  } = useNestedNavigatorStore();

  const { verifyIdentityLocalData = {} } = (fromMyInfoIntro ?? {}) as {
    verifyIdentityLocalData: Partial<SgVerifyIdentity>;
  };

  // !DEBUG end

  // const { verifyIdentityLocalData } = props;

  const {
    ownership_private_property = undefined,
    cpf_balances: {
      ordinary_account = "",
      medisave_account = "",
      special_account = "",
      retirement_account = "",
    } = {},
  } = verifyIdentityLocalData as SgVerifyIdentity;

  const { onSubmit } = props;
  const [validating, setValidating] = useState(false);

  const ownershipPropertyField = useFormField(
    (ownership_private_property as any) ?? undefined,
    {
      type: "select",
      label: "Ownership Of Private Property",
      labelRequiredSign: true,
      items: consts.privatePropertyOwnershipOptions,
      validator: (value?: boolean) => value === true || value === false,
    }
  );

  const cpfOAField = useFormField(ordinary_account, {
    label: "CPF (OA)",
    labelRequiredSign: true,
    validator: (value: string) => value.length as any,
    keyboardType: "numeric",
  });

  const cpfMAField = useFormField(medisave_account, {
    label: "CPF (MA)",
    labelRequiredSign: true,
    validator: (value: string) => value.length as any,
    keyboardType: "numeric",
  });

  const cpfSAField = useFormField(special_account, {
    label: "CPF (SA)",
    labelRequiredSign: true,
    validator: (value: string) => value.length as any,
    keyboardType: "numeric",
  });

  const cpfRAField = useFormField(retirement_account, {
    label: "CPF (RA)",
    labelRequiredSign: true,
    validator: (value: string) => value.length as any,
    keyboardType: "numeric",
  });

  /* Start: Common fields: isFormValid, values, watchables etc */

  const {
    value: ownershipPropertyValue,
    validated: ownershipPropertyValidated,
  } = ownershipPropertyField;
  const { value: cpfOAValue, validated: cpfOAValidated } = cpfOAField;
  const { value: cpfMAValue, validated: cpfMAValidated } = cpfMAField;
  const { value: cpfSAValue, validated: cpfSAValidated } = cpfSAField;
  const { value: cpfRAValue, validated: cpfRAValidated } = cpfRAField;

  const watchableValues = [
    ownershipPropertyValue,
    cpfOAValue,
    cpfMAValue,
    cpfSAValue,
    cpfRAValue,
  ];

  const values: Partial<SgVerifyIdentity> = {
    ownership_private_property: ownershipPropertyValue,
    cpf_balances: {
      ordinary_account: cpfOAValue,
      medisave_account: cpfMAValue,
      special_account: cpfSAValue,
      retirement_account: cpfRAValue,
    },
  };

  const isFormValid: boolean =
    ownershipPropertyValidated.isValid &&
    cpfOAValidated.isValid &&
    cpfOAValue &&
    cpfMAValue &&
    cpfSAValue &&
    cpfRAValue;

  const onFormValidate = (): void =>
    ownershipPropertyField.onValidate() &&
    cpfOAField.onValidate() &&
    cpfMAField.onValidate() &&
    cpfSAField.onValidate() &&
    cpfRAField.onValidate();

  const onValidateSubmit = () => {
    onFormValidate();
    setSgVerifyIdentitySavedFormLocalDb(values);
    setValidating(true);
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
    ownershipPropertyField,
    cpfOAField,
    cpfMAField,
    cpfSAField,
    cpfRAField,
  };
};

interface PostSGPersonalSgVerifyIdentity extends Omit<SgVerifyIdentity, ""> {}
export interface PostSGPersonal {
  home_ownership: {
    type?: string;
    others?: string;
  } | null;
  myinfo: {
    manual_data: SgVerifyIdentity;
  };
}

const FormCPFBalances: React.FC<any> = (props) => {
  const { navigation, verifyIdentityLocalData, isIOS } = props;

  const [data, setData] = useState<FormCPFBalancesData>(
    verifyIdentityLocalData?.cpf_contribution_history ?? [{}]
  );

  // const showPicker = useCallback((value) => setShowDatePicker(value), []);

  // *Methods

  const onChangeFormData = (
    index: number,
    yearMonth: string,
    employer: string,
    amount: number
  ) => {
    const dataItem: FormCPFBalancesDataItem = {
      yearMonth,
      employer,
      amount,
    };

    if (dataItem) {
      if (refDiskWriteController.current === null) {
        (refDiskWriteController as any).current = setTimeout(() => {
          setSgVerifyIdentitySavedFormLocalDb({
            cpf_contribution_history: data,
          });
          (refDiskWriteController as any).current = null;
        }, 120);
      }
    }

    setData((prevData) => {
      prevData[index] = {
        ...dataItem,
      };
      return prevData;
    });
  };

  // *Events

  // watch
  const refDiskWriteController = createRef();
  // useEffect(() => {
  //   console.log("[data]", data, refDiskWriteController.current);
  //   if (data) {
  //     if (refDiskWriteController.current === null) {
  //       (refDiskWriteController as any).current = setTimeout(() => {
  //         setSgVerifyIdentitySavedFormLocalDb({
  //           cpf_contribution_history: data,
  //         });
  //         (refDiskWriteController as any).current = null;
  //       }, 120);
  //     }
  //   }
  // }, [data]);
  // *Methods

  const onAddNewContribution = () => {
    setData((prev) => [...prev, {}] as any);
    // setContributionsCount((prev) => prev + 1);
  };

  const onRemoveContribution = (index: number) => {
    if (data.length === 1) return;
    setData((prev) => {
      return [...prev].filter((_: any, i: number) => i !== index) as any;
    });
  };

  return (
    <>
      <StyledBox width="89%" mt={4} mb={2}>
        <StyledText variant="title" fontSize={16} textAlign="left">
          CPF Contribution History
        </StyledText>
      </StyledBox>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "89%",
        }}
      >
        {data.map((item: FormCPFBalancesDataItem, index: number) => (
          <CPFFormItem
            key={index}
            index={index}
            onChangeFormData={onChangeFormData}
            defaultValue={item}
            onRemoveContribution={onRemoveContribution}
            isIOS={isIOS}
          />
        )) ?? <></>}

        <ButtonText mb={10} mt={10} onPress={onAddNewContribution}>
          ADD NEW MONTH
        </ButtonText>
      </View>
    </>
  );
};

const MyInfoFill3: React.FC<MyInfoFill3Props> = (props: any) => {
  const { route, navigation } = props;
  const {
    response: { user: userResponse },
    setLoginShowSplash,
  } = useUserStore();
  const {
    response: { sgPersonal: responseSgPersonal },
    errors: { sgPersonal: errorsSgPresonal },
    resetStates,
    submitGetOrCreate,
    submitSgIdentity,
  } = useBuyerStore();
  const { getState: getNestedNavState } = useNestedNavigatorStore();

  const { verifyIdentityLocalData = {}, isIOS } = route?.params ?? {};

  // *Methods

  const onSubmit = async () => {
    await setSgVerifyIdentitySavedFormLocalDb({
      ...values,
      ownership_private_property: values?.ownership_private_property === true,
    });
    // fullnameField.validate();
    // setSendingDummy((prev) => ++prev);
    // submitMobile(countryDialingCode, value?.replace(/[^0-9]/g, ""));
    // navigation.navigate(MyInfoRoutes);

    const submitData: PostSGPersonal = transformPostSGPersonalData(
      (await getSgVerifyIdentitySavedFormLocalDb()) as SgVerifyIdentityFromLocalDB,
      userResponse?.data
    );
    const finalMock = {
      ...submitData,
      cpf_balances: JSON.stringify(submitData.myinfo.manual_data.cpf_balances),
      cpf_contribution_history: JSON.stringify(
        submitData.myinfo.manual_data.cpf_contribution_history
      ),
    };

    // !TODO myinfostate
    submitSgIdentity(finalMock.home_ownership, finalMock.myinfo.manual_data);
  };

  const {
    isFormValid,
    onValidateSubmit,
    validating,
    watchableValues,
    values,
    ownershipPropertyField,
    cpfOAField,
    cpfMAField,
    cpfSAField,
    cpfRAField,
  } = useMyInfoFill3Form({
    verifyIdentityLocalData,
    onSubmit,
  });

  const [sendingDummy, setSendingDummy] = useState(0);

  const refScroll = useRef(null);

  // *Methods

  const onPrevious = () => {
    // submitMobile(countryDialingCode, value?.replace(/[^0-9]/g, ""));
    navigation.goBack();
  };

  // *Effects
  useEffect(() => {
    // (refScroll as any)?.current?.scrollTo({ x: 0, y: 0, animated: true });
  }, [sendingDummy]);

  useEffect(() => {
    if (responseSgPersonal) {
      // clear saved copy?
      resetStates("sgPersonal");
      resetStates("credits");

      if (globalObjectLastActionState.get().action === "orderDLToVerify") {
        // dddebug
        setLoginShowSplash({
          landingToScreenParam: "OrderDL",
          // isOrderDeepLinkParam: true, //url.includes("ab;),
          deepLinkUrlSearchParams: {
            type: "store_id",
            data: { storeId: "SG-S-JXJAJWW87CEX" },
          },
        } as any);
        return;
      }

      navigation.navigate(MyInfoFillRoutes.VerificationSuccess);
    }
  }, [responseSgPersonal]);

  // useEffect(() => {
  //   if (errorsSgPresonal) {
  //     // !DEBUG
  //     console.log("[errorsSgPresonal]", errorsSgPresonal);
  //   }
  // }, [errorsSgPresonal]);

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
      contentContainerStyle={{
        paddingBottom: isIOS ? mscale(20) : 0,
      }}
      extraHeight={isIOS ? mscale(144) : 20}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StyledBox width="89%" mt={4} mb={2}>
          <StyledText variant="title" fontSize={20} textAlign="left">
            Income Information
          </StyledText>
        </StyledBox>
        <DropdownPickerField marginBottom={5} {...ownershipPropertyField} />
        <StyledBox width="89%" mt={4} mb={2}>
          <StyledText variant="title" fontSize={16} textAlign="left">
            CPF Balances
          </StyledText>
        </StyledBox>
        <StyledTextInputFieldGroup
          boxProps={{ marginBottom: 5 }}
          {...withInputMask2Decimal(cpfOAField)}
        />
        <StyledTextInputFieldGroup
          boxProps={{ marginBottom: 5 }}
          {...withInputMask2Decimal(cpfMAField)}
        />
        <StyledTextInputFieldGroup
          boxProps={{ marginBottom: 5 }}
          {...withInputMask2Decimal(cpfSAField)}
        />
        <StyledTextInputFieldGroup
          boxProps={{ marginBottom: 5 }}
          {...withInputMask2Decimal(cpfRAField)}
        />
        <FormCPFBalances
          verifyIdentityLocalData={verifyIdentityLocalData}
          navigation={navigation}
          isFormValid={isFormValid}
          isIOS={isIOS}
          // scrollToTop={sendingDummy}
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

export default MyInfoFill3;
