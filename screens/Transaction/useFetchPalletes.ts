import { useCallback, useEffect, useState } from "react";
import ImageColors from "react-native-image-colors";
import type { OrderState, ResponseFetchOrder } from "screens/Order/OrderTypes";
import { theme } from "styles/theme";

export interface OngoingTransactionOrder
  extends Pick<
    OrderState,
    | "merchant"
    | "country"
    // | "store"
    | "code"
    | "state"
    | "grand_total_amount"
    | "repayments_total_mount"
    | "repayments_remaining_amount"
    | "created_at"
    | "selected_payment_plan"
    | "repayments_fully_paid_at"
    | "vouchers"
  > {
  store: {
    slug: string;
    name: string;
  };
}

export const useFetchPalletes = ({
  order,
}: {
  order: OngoingTransactionOrder | ResponseFetchOrder;
}) => {
  const [loadedPalletes, setLoadedPalletes] = useState<null | [string, string]>(
    null
  );

  const {
    merchant,
    code,
    repayments_remaining_amount,
    repayments_total_mount,
    repayments_fully_paid_at,
  } = (order ?? {}) as OngoingTransactionOrder;

  const repaymentAmount = repayments_total_mount;
  const totalAmount = repayments_total_mount;
  const remainingAmount = repayments_remaining_amount;
  const paidAmount = parseFloat(totalAmount) - parseFloat(remainingAmount);

  // const showAmountAsButton = variant === "full" ? canPay : false;

  let percentageShort = paidAmount;
  let percentageLong =
    parseFloat(paidAmount as any) + parseFloat(repaymentAmount);

  let percentageTotal: any = totalAmount;

  if (typeof percentageLong === "string") {
    percentageLong = parseInt(percentageLong);
  }
  if (typeof percentageShort === "string") {
    percentageShort = parseInt(percentageShort);
  }
  if (typeof percentageTotal === "string") {
    percentageTotal = parseInt(percentageTotal) as any;
  }

  // convert both percentages to relative of 1.0
  // if (invert) {
  //     percentageShort =
  //     ((percentageLong - percentageShort) / percentageTotal) * 1;
  // } else {

  percentageShort = !percentageTotal
    ? 0
    : Math.round((percentageShort / percentageTotal) * 100) / 100;
  percentageShort = percentageShort >= 1 ? 1 : percentageShort;
  // }

  percentageLong = !percentageTotal
    ? 0
    : Math.round((percentageLong / percentageTotal) * 100) / 100;
  percentageLong = percentageLong >= 1 ? 1 : percentageLong;
  percentageTotal = 1;

  const asyncLoadLogoPalletes = useCallback(async () => {
    try {
      const result = await ImageColors.getColors(merchant.logo, {
        fallback: theme.colors.rn64testBlue,
        cache: true,
        key: `${merchant.slug}`,
      });

      switch (result.platform) {
        case "android":
          // TODO - android result properties
          const vibrantColor = result.vibrant;
          break;
        case "web":
          // web result properties
          const lightVibrantColor = result.lightVibrant;
          break;
        case "ios":
          // iOS result properties

          // "detail": "#F94D1C",
          // "secondary": "#5D4C52",
          // "platform": "ios",
          // "primary": "#180009",

          const { detail, primary } = result;

          // if statement is just to satisfy typescript
          if (detail && primary) {
            setLoadedPalletes([detail, primary]);
          } else {
            setLoadedPalletes([theme.colors.rn64testBlue, theme.colors.rn64testBlue]);
          }
          break;
        default:
          break;
        //   throw new Error("Unexpected platform key");
      }
    } catch (e) {
      // noop
    }
  }, [merchant]);

  useEffect(() => {
    if (merchant?.logo) {
      asyncLoadLogoPalletes();
    }
  }, [merchant]);

  if (!merchant) {
    return {
      loading: true,
      palletes: [theme.colors.rn64testBlue, theme.colors.rn64testBlue],
      percentages: [1, 1, 1],
    };
  }

  return {
    loading: !loadedPalletes,
    palletes: loadedPalletes ?? [theme.colors.rn64testBlue, theme.colors.rn64testBlue],
    percentages: [percentageShort, percentageLong, percentageTotal],
  };
};
