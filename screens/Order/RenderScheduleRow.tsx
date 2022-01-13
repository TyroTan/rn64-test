import React, { useState, useEffect } from "react";
import { theme } from "styles/theme";
import { mscale } from "utils/scales-util";
import { StepsVertical, StyledBox, StyledText } from "components";
import { advancedDayjs, checkIsToday } from "utils/date-utils";
import { ordinalSuffix } from "utils/js-utils";
import globalObjectState from "utils/global-object-per-country-code";

const RenderProgressText = ({ text, success }: any) => (
  <StyledText
    color={
      success
        ? theme.colors.progressbar.barGreen1
        : theme.colors.typography.gray1
    }
    variant="titleTertiary"
  >
    {text}
  </StyledText>
);

interface RenderScheduleRowProps {
  index: number;
  payment: any;
  //   orderCode: any;
  //   isLoading: any;
  selectedPaymentMethod?: any;
  wrapperProps?: any;
}

const RenderScheduleRow = ({
  index,
  payment,
  //   orderCode,
  //   isLoading,
  // selectedPaymentMethod,
  wrapperProps = {},
}: RenderScheduleRowProps) => {
  const { formatAsCurrency } = globalObjectState.getLibrary();
  const { sequence, due_at, total_amount } = payment;

  const [isToday, setIsToday] = useState(false);
  const [isOverdue, setIsOverdue] = useState(false);
  const [canPay, setCanPay] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // *Methods

  const getPaymentDateColor = () => {
    return canPay && !isOverdue
      ? theme.colors.buttons.marineBlue
      : canPay && isOverdue
      ? theme.colors.typography.red1
      : paymentStatus === "collect_success"
      ? theme.colors.typography.gray7
      : isToday
      ? theme.colors.buttons.marineBlue
      : "#191919";
  };

  const getPaymentDate = () => {
    return isToday
      ? "Today"
      : canPay && isOverdue
      ? `${advancedDayjs(due_at).format("Do MMM YYYY")} (Overdue)`
      : advancedDayjs(due_at).format("Do MMM YYYY");
  };

  const renderPaymentAmount = () => {
    if (!canPay) {
      return (
        <StyledText
          color={
            paymentStatus === "collect_success"
              ? theme.colors.lockGray
              : "black"
          }
          variant="titleSecondary"
          textDecoration={
            paymentStatus === "collect_success" ? "line-through" : "none"
          }
        >{`${formatAsCurrency(total_amount)}`}</StyledText>
      );
    } else {
      // render button
      return <></>;
    }

    // if (canPay) {
    //   return (
    //     <Button
    //       isLoading={isLoading}
    //       spinnerSize={24}
    //       disabled={!selectedPaymentMethod}
    //       style={{
    //         padding: isLoading ? "0px 3px" : "7px 3px",
    //         fontSize: 14,
    //         borderRadius: 12,
    //         maxWidth: 120,
    //         backgroundColor: isOverdue ? theme.colors.typography.red1 : "",
    //         borderColor: isOverdue ? theme.colors.typography.red1 : "",
    //         marginRight: -15,
    //         letterSpacing: "normal",
    //       }}
    //       onClick={() => {
    //         history.push(
    //           `/transaction/paynext?order=${orderCode}&repayment=${payment.id}`
    //         );
    //       }}
    //     >
    //       {`Pay ${formatAsCurrency(total_amount)}`}
    //     </Button>
    //   );
    // }
  };

  // *Effects
  useEffect(() => {
    setIsToday(checkIsToday(due_at));
    setIsOverdue(payment.state === "overdue");
  }, []);

  useEffect(() => {
    if (payment && payment.state) {
      setPaymentStatus(payment.state);
      setCanPay(payment.can_pay);
    }
  }, [payment]);

  const placementText = `${sequence + 1}${ordinalSuffix(sequence + 1)} payment`;

  // *JSX

  return (
    <StyledBox
      variant="flexcr"
      justifyContent="space-between"
      {...wrapperProps}
    >
      <StyledBox
        flex={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
      >
        <StyledText
          //   color={theme.colors.buttons.marineBlue}
          color={getPaymentDateColor()}
          variant="titleTertiary"
        >
          {getPaymentDate()}
        </StyledText>
        <StyledText variant="paragraphSmallest">{placementText}</StyledText>
      </StyledBox>
      <StyledText variant="titleSecondarySemi">
        {renderPaymentAmount()}
      </StyledText>
    </StyledBox>
  );
};

export default RenderScheduleRow;
