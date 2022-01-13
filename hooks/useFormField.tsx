import { useState } from "react";

export const useFormField = (defaultValue = "", options: any) => {
  const {
    type = "input",
    items = [],
    validator = () => true,
    validatorErrorMsg = null,
    label = "",
    labelRequiredSign = false,

    // no listener
    noValueAndUseDefaultValue = false,
  } = options;

  const [isValid, setIsValid] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [value, setValue_] = useState(defaultValue);
  const setValue = (value: string) => {
    if (firstLoad && !value) {
      setFirstLoad(false);
    } else {
      setIsValid(validator(value));
    }
    setValue_(value);
  };

  const validated = {
    isValid,
    msg: validatorErrorMsg ?? "This field is required",
  };

  // *Methods
  const onValidate = (): void => {
    isValid && setIsValid(validator(value));
  };
  const onBlur = onValidate;
  const fieldTypeProps =
    type === "select" ? { onSelect: setValue, items } : { onBlur };

  const valueCondition = noValueAndUseDefaultValue
    ? { defaultValue }
    : { value };

  return {
    ...options,
    label,
    labelRequiredSign,
    ...valueCondition,
    validated,
    onValidate,
    onChangeText: setValue,
    ...fieldTypeProps,
  };
};

export default useFormField;
