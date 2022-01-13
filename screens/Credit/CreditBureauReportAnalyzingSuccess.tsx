import React, { createRef, useEffect, useState } from "react";

import { SuccessConfetti } from "components";

const CreditBureauReportAnalyzingSuccess: React.FC = (allProps: any) => {
  const { navigation } = allProps;

  const onReturn = () => {
    navigation.pop(4);
  };
  // const { onReturn } = route ?? {};
  return (
    <SuccessConfetti onReturn={onReturn} successText={"Report submitted!"} />
  );
};

export default CreditBureauReportAnalyzingSuccess;
