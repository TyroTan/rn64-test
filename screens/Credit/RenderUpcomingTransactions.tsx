import React, { useEffect, useState } from "react";
import ImageColors from "react-native-image-colors";

import {
  StyleSheet,
  Image,
  ImageBackgroundProps,
  TouchableOpacity,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ParamListBase } from "@react-navigation/native";
import { mscale } from "utils/scales-util";
import {
  CardListView,
  Card,
  StyledText,
  KeyboardAvoiding,
  StyledBox,
  StyledScrollView,
  ProgressCircleLayered,
  ButtonTextSmall,
  CardListItemDivider,
} from "components";
import { theme } from "styles/theme";
import {
  useAuthStore,
  useBuyerStore,
  useNestedNavigatorStore,
  useOrderStore,
  useUserStore,
} from "stores";
const imgHomeBGBlue = require("assets/images/home-bg-blue.png");
const imgLogo2White = require("assets/images/logo-2-white.png");
const imgBellWhite = require("assets/images/bell-white.png");
const imgDummyBecome = require("assets/images/dummy-become.png");
// const imgPendingPurchaseGold = require("assets/images/pending-purchase-gold.png");

// dddebug - remove dummy asset file
const imgAppleBlack = require("assets/images/apple-black.png");

import { useDisableAndroidBackHook, useResetScreen } from "hooks";
import Layout from "constants/Layout";
import CreditRoutes from "./CreditRoutes";
import PendingPurchase from "./PendingPurchase";
import { groupRepaymentsIntoMonths } from "utils/utils-common";
// import { hexToRGB } from "utils/hex-util";
import globalObjectState from "utils/global-object-per-country-code";
import type { FromOrderPaymentReceiptObject } from "stores/useNestedNavigatorStore";
import type { GroupedRepayment } from "screens/Order/OrderTypes";
import { advancedDayjs } from "utils/date-utils";

export interface CreditParamsList extends ParamListBase {
  [CreditRoutes.CreditInitial]: undefined;
  [CreditRoutes.CreditHomeInitial]: undefined;
  [CreditRoutes.CreditHome]: undefined;
  [CreditRoutes.CreditRemaining]: undefined;
  [CreditRoutes.CreditBuy]: undefined;
  [CreditRoutes.CreditQr]: undefined;
  [CreditRoutes.CreditTransaction]: undefined;
  [CreditRoutes.CreditProfile]: undefined;
}

type CreditHomeProps = NativeStackScreenProps<
  CreditParamsList,
  CreditRoutes.CreditHome
>;

const InfoPicture = () => {
  return (
    <StyledBox
      width={mscale(110)}
      height={mscale(110)}
      alignSelf="center"
      borderRadius={mscale(55)}
      marginBottom={9}
      backgroundColor={theme.colors.faintGray2}
    />
  );
};

const styles = StyleSheet.create({
  cardRowWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: mscale(21),
  },
  cardRowWrapper2nd: {
    marginTop: mscale(12),
    marginBottom: mscale(24),
  },
  cardRowDescription: {
    paddingLeft: mscale(12),
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  cardRowAmountWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});

type LoadedPalletes = null | {
  [key: string]: [string, string];
};

export const RenderUpcomingPayments = (props: any) => {
  //   const { onMyInfoFill, isWalkthrough, onMeasureInWindow, walkthroughStyle } =
  //     props;

  const { navigation } = props;

  const { formatAsCurrency } = globalObjectState.getLibrary();

  const {
    title,
    showTopNavigation,
    boxShadow,
    data,
    isLoading,
    variant,
    secondarySmall,
    ...rest
  } = props;

  const { repayments } = data as { repayments: GroupedRepayment[] };
  const [loadedPalletes, setLoadedPalletes] = useState<LoadedPalletes>(null);

  const asyncLoadLogoPalletes = async () => {
    const palletesObj = {} as LoadedPalletes;

    for (const payment of repayments) {
      try {
        const result = await ImageColors.getColors(
          payment.order.merchant.logo,
          {
            fallback: theme.colors.rn64testBlue,
            cache: true,
            key: `${payment.order.merchant.slug}`,
          }
        );

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
            if (palletesObj !== null) {
              palletesObj[payment.order.merchant.slug] = [detail, primary];
            }
            break;
          default:
            break;
          //   throw new Error("Unexpected platform key");
        }
      } catch (e) {
        // noop
      }
    }

    setLoadedPalletes(palletesObj);
  };

  useEffect(() => {
    asyncLoadLogoPalletes();
  }, []);

  // *Events

  const onPressViewAll = () => {
    navigation.navigate(CreditRoutes.AllUpcomingPayments);
  };

  // todo, this is inside a loop, I think extract out the card title from the iteration?
  return (
    <Card
      // marginTop={-mscale(32)}
      alignSelf="center"
      paddingTop="6.0%"
      marginLeft="3%"
      marginRight="3%"
      paddingBottom="3%"
      paddingHorizontal="3.7%"
      paddingRight="3%"
      width={"100%"}
      LeftHeader={<StyledText variant="titleSecondaryGray">{title}</StyledText>}
      RightHeader={
        showTopNavigation ? (
          <TouchableOpacity
            style={{ padding: mscale(2.5) }}
            onPress={onPressViewAll}
            // TODO - to over/due
          >
            <StyledText variant="mainBlue">View All</StyledText>
          </TouchableOpacity>
        ) : (
          <></>
        )
      }
    >
      {repayments?.map((repayment: any, i) => {
        //       "detail": "#F94D1C",
        //   "secondary": "#5D4C52",
        //   "platform": "ios",
        //   "primary": "#180009",

        const palletes = loadedPalletes?.[repayment.order.merchant.slug] ?? [
          theme.colors.rn64testBlue,
          theme.colors.rn64testBlue,
        ];
        const orderCode = repayment.order.code;
        const repaymentAmount = repayment.total_amount;
        const totalAmount = repayment.order.repayments_total_mount;
        const remainingAmount = repayment.order.repayments_remaining_amount;
        const paidAmount =
          parseFloat(totalAmount) - parseFloat(remainingAmount);
        const logo = repayment.order.merchant.logo;
        const merchantName = repayment.order.merchant.name;
        const dueAt = repayment.due_at;
        const canPay = repayment.can_pay;
        const repaymentState = repayment.state;

        const showAmountAsButton = variant === "full" ? canPay : false;

        let percentageShort = paidAmount;
        let percentageLong =
          parseFloat(paidAmount as any) + parseFloat(repaymentAmount);
        let percentageTotal = totalAmount;

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
        percentageShort =
          Math.round((percentageShort / percentageTotal) * 100) / 100;
        // }

        percentageLong =
          Math.round((percentageLong / percentageTotal) * 100) / 100;
        percentageTotal = 1;

        return (
          //   <UpcomingPaymentRow
          //     key={i}
          //     orderCode={orderCode}
          //     percentageShort={paidAmount}
          //     percentageLong={
          //       parseFloat(paidAmount) + parseFloat(repaymentAmount)
          //     }
          //     percentageTotal={totalAmount}
          //     logo={logo}
          //     merchantName={merchantName}
          //     dueAt={dueAt}
          //     amount={repaymentAmount}
          //     showAmountAsButton={variant === "full" ? canPay : false}
          //     repaymentState={repaymentState}
          //   />
          <View key={i} style={styles.cardRowWrapper}>
            <ProgressCircleLayered
              loading={!Object.keys(loadedPalletes ?? ({} as any)).length}
              imgMerchantSrc={{ uri: logo }}
              percentages={[percentageShort, percentageLong, percentageTotal]}
              imgStyle={{
                width: mscale(40),
              }}
              colors={palletes}
            />
            <View style={styles.cardRowDescription}>
              <StyledText variant="titleSecondarySemi" textAlign="left">
                {merchantName}
              </StyledText>
              <StyledText variant="paragraph" fontSize={12} lineHeight={12}>
                {advancedDayjs(dueAt).format("Do MMM YYYY")}
              </StyledText>
            </View>
            <View style={styles.cardRowAmountWrapper}>
              {showAmountAsButton ? (
                <ButtonTextSmall
                  variant={secondarySmall ? "secondarySmall" : "primary"}
                  children={`Pay ${formatAsCurrency(repaymentAmount)}`}
                />
              ) : (
                <StyledText variant="titleSecondarySemi">
                  {formatAsCurrency(repaymentAmount)}
                </StyledText>
              )}
            </View>
          </View>
        );
      }) ?? <></>}
      {/* <View style={styles.cardRowWrapper}>
        <ProgressCircleLayered
          imgMerchantSrc={imgDummyBecome}
          imgStyle={{
            width: mscale(40),
          }}
          colors={["#FE6E61", "#FE6E61"]}
        />
        <View style={styles.cardRowDescription}>
          <StyledText variant="titleSecondarySemi">Become SG</StyledText>
          <StyledText variant="paragraph" fontSize={12} lineHeight={12}>
            30th July 2021
          </StyledText>
        </View>
        <View style={styles.cardRowAmountWrapper}>
          <StyledText variant="titleSecondarySemi">S$3.50</StyledText>
        </View>
      </View>
      <CardListItemDivider
        style={{ width: "88%", marginLeft: "12%", marginTop: mscale(9) }}
      />
      <View style={[styles.cardRowWrapper, styles.cardRowWrapper2nd]}>
        <ProgressCircleLayered
          imgMerchantSrc={imgAppleBlack}
          colors={["#000000", "#000000"]}
        />
        <View style={styles.cardRowDescription}>
          <StyledText variant="titleSecondarySemi">Become SG</StyledText>
          <StyledText variant="paragraph" fontSize={12} lineHeight={12}>
            30th July 2021
          </StyledText>
        </View>
        <View style={styles.cardRowAmountWrapper}>
          <StyledText variant="titleSecondarySemi">S$3.50</StyledText>
        </View>
      </View> */}
    </Card>
  );
};

interface GroupedRepaymentsItem {
  sequence: number;
  downpayment_amount: string;
  instalment_amount: string;
  instalment_processing_fee_amount: string;
  total_amount: string;
  due_at: string;
  id: string;
  state: string;
  payment_transaction: null;
  can_pay: boolean;
  order: {
    country: string;
    merchant: {
      slug: string;
      name: string;
      logo: string;
    };
    store: {
      slug: string;
      name: string;
    };
    code: string;
    state: string;
    grand_total_amount: string;
    repayments_total_mount: string;
    repayments_remaining_amount: string;
    created_at: string;
  };
}

interface GroupedRepaymentsObject {
  [key: string]: {
    [key: string]: GroupedRepaymentsItem[];
  };
  // "sequence": 2,
  // "downpayment_amount": "0.00",
  // "instalment_amount": "333.32",
  // "instalment_processing_fee_amount": "13.32",
  // "total_amount": "346.64",
  // "due_at": "2022-01-26T15:56:02.219107+08:00",
  // "id": "RPM-FM4JDG6M2KHX4TQL",
  // "state": "created",
  // "payment_transaction": null,
  // "can_pay": false,
  // "order": {
  //     "country": "sg",
  //     "merchant": {
  //         "slug": "acme",
  //         "name": "Acme",
  //         "logo": "https://res.cloudinary.com/hflj9cmhy/image/upload/v1/media/uploads/merchants/merchant/2021/12/09/249ff6b1-0690-486a-ab0b-f37322adbd0c_generic_acme_logo-778x584_cqanxe"
  //     },
  //     "store": {
  //         "slug": "acme-online",
  //         "name": "Online"
  //     },
  //     "code": "ODR-LLCYQVW28PE",
  //     "state": "approved",
  //     "grand_total_amount": "1000.00",
  //     "repayments_total_mount": "1040.00",
  //     "repayments_remaining_amount": "693.32",
  //     "created_at": "2021-11-26T15:55:55.651005+08:00"
  // }
}

const RenderUpcomingTransactions = ({
  responseUpcomingPayments,
  navigation,
}: {
  navigation: any;
  responseUpcomingPayments: any;
}) => {
  const [height, setHeight] = useState(0);
  const assetImgSrc = Image.resolveAssetSource(imgHomeBGBlue);
  const { width, height: layoutHeight } = Layout?.window ?? {};
  const [progress, setProgress] = useState(0);
  const { currencySign } = globalObjectState.getLibrary();
  const [groupedRepayments, setGroupedRepayments] =
    useState<null | GroupedRepaymentsObject>(null);

  // *Effects

  useEffect(() => {
    // TODO
    if (responseUpcomingPayments) {
      const grouped = groupRepaymentsIntoMonths(
        responseUpcomingPayments.repayments
      );
      // console.log(
      //   "got itemsss responseUpcomingPayments",
      //   Object.keys(responseUpcomingPayments)
      // );
      setGroupedRepayments(grouped);
    }
  }, [responseUpcomingPayments]);

  //   useEffect(() => {}, [
  //     layoutHeight,
  //     width,
  //     assetImgSrc,
  //     responseUpcomingPayments,
  //   ]);

  //   const upcomingPaymentsTotalDueText = `${currencySign}${responseUpcomingPayments.total_due_amount}`;

  const keys = Object.keys(groupedRepayments ?? {});

  return (
    <>
      {keys?.length && groupedRepayments ? (
        keys.map((year: any, yearIndex) => {
          return Object.keys(groupedRepayments[year]).map(
            (month, monthIndex) => {
              // only display the most recent upcoming month
              if (yearIndex > 0 || monthIndex > 0) return null;

              const groupedRepaymentMonth = groupedRepayments[year][month];

              return (
                <>
                  <RenderUpcomingPayments
                    navigation={navigation}
                    //   boxShadow="0px 2px 20px 0px #00000019"
                    data={{ repayments: groupedRepaymentMonth }}
                    key={`${monthIndex}-${yearIndex}`}
                    showTopNavigation
                    title="Upcoming payments"
                  />
                </>
              );
            }
          );
        })
      ) : (
        <CardListView paddingTop={10}>
          <InfoPicture />
          <StyledText
            variant="title"
            fontSize={15}
            lineHeight={15}
            children="You have no transactions"
            marginBottom={5}
          />
          <StyledText
            variant="paragraph"
            color={theme.colors.typography.gray1}
            fontFamily={"PoppinsLight"}
            textAlign="center"
            fontSize={14}
            lineHeight={14}
            children="Start by exploring our merchants"
            marginBottom={9}
          />
        </CardListView>
      )}
    </>
  );
};

export default RenderUpcomingTransactions;
