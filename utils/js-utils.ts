import type {
  SgVerifyIdentity,
  setSgVerifyIdentitySavedFormLocalDb,
  SgVerifyIdentityFromLocalDB,
} from "./async-storage-util";
import type { PostSGPersonal } from "screens/MyInfo/MyInfoFill3";
import type { UserSession } from "stores/useUserStore";
import { format } from "date-fns";

export const awaitableDelay = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms ?? 1000);
  });
};

export const isNumeric = (n: any) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const textInputMask2Decimal = (text: string | number): string => {
  const [whole, decimal] = text?.toString().split(".");

  if (!decimal) return text?.toString();

  const force2DecimalPlaces = [whole, decimal.slice(0, 2)].join(".");
  return ((Number(force2DecimalPlaces) * 100) / 100).toFixed(
    decimal.length > 2 ? 2 : decimal.length
  );
};

export const formatProgressPercentRounded = (progress: number) => {
  return `${textInputMask2Decimal(Math.round(progress * 100).toString())}%`;
};

export const withInputMask2Decimal = (numericField: any) => ({
  ...numericField,
  onChangeText: (text: string) =>
    numericField.onChangeText(textInputMask2Decimal(text)),
});

export const cleanMobileNumber = (num: string): string | null =>
  num?.replace?.(/[^\d\w]+/g, "");

export const isObjectEmpty = (obj: Object): boolean =>
  obj &&
  Object.keys(obj).length === 0 &&
  Object.getPrototypeOf(obj) === Object.prototype;

export const transformPostSGPersonalData = (
  data: SgVerifyIdentityFromLocalDB,
  userData: UserSession["data"]
): PostSGPersonal => {
  const { type, type_of_housing, ...sgVerifyIdentityPostData } = data;
  let home_ownership: any = {};

  // ! TODO type_of_housing when hdb type === ''
  // ! TODO type === 'OTHERS'
  if (type) {
    home_ownership["type"] = type;
  }
  if (data?.others) {
    home_ownership["others"] = type;
  }
  if (isObjectEmpty(home_ownership)) {
    home_ownership = null;
  }

  try {
    return {
      home_ownership,
      myinfo: {
        manual_data: {
          ...sgVerifyIdentityPostData,
          cpf_contribution_history:
            sgVerifyIdentityPostData?.cpf_contribution_history?.map(
              (contribution) => ({
                month: format(new Date(contribution.yearMonth), "yyyy-MM"),
                date: format(new Date(contribution.yearMonth), "yyyy-MM-dd"),
                employer: contribution.employer,
                amount: contribution.amount,
              })
            ) ?? [],
          noa_history: [
            {
              year_of_assessment: "2017",
              amount: "1",
              employment: "10",
              interest: "0.8",
            },
          ],
          mobile_number: cleanMobileNumber(
            userData?.full_mobile_number ?? ""
          )?.slice(2) as string,
          type,
          employment_sector: "es",
          highest_education_level: "0",
          marital_status: "1",
        },
      },
    };
  } catch (e) {
    console.log(data);
    throw e;
  }
};

export const sortObject = (obj: any) => {
  return Object.keys(obj)
    .sort()
    .reduce(function (result: any, key) {
      result[key] = obj[key];
      return result;
    }, {});
};

export const ordinalSuffix = (n: any) => {
  if (isNaN(parseInt(n))) return n;
  if (typeof n === "string") n = parseInt(n);
  return ["", "st", "nd", "rd"][(n / 10) % 10 ^ 1 && n % 10] || "th";
};
